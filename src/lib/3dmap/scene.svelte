<script>
	import { Text } from '@threlte/extras';
	import { T } from '@threlte/core';
	import CameraControls from './cameracontrols.svelte';
	import {
		itemData,
		objectsData,
		currentItem,
		currentCategory,
		categoryData
	} from '$lib/appstore.js';
	import ObjectModel from './objectmodel.svelte';
	import { onMount, setContext } from 'svelte';
	import CustomRenderer from './customrenderer.svelte';
	import { writable } from 'svelte/store';

	setContext('selectedMeshes', writable([]));

	let objects = $objectsData;
	let items = $itemData;
	let categories = $categoryData;
	let cameraControls;

	$: currentCategoryData = $currentCategory ? $categoryData[$currentCategory] : null;

	function resetCameraPosition(transition) {
		cameraControls.moveTo(0, 0, 0, transition);
		cameraControls.rotateAzimuthTo(0, transition);
		cameraControls.rotatePolarTo(0.5, transition);
		cameraControls.dollyTo(20, transition);
	}

	function rotateToItem(itemId) {
		if (!cameraControls) return;

		let item = $itemData[itemId];
		if (!item) {
			resetCameraPosition(true);
			return;
		}

		let object = objects[item.object];
		if (!object) return;

		cameraControls.rotateAzimuthTo(0.0, true);
		cameraControls.moveTo(object.pos[0], object.pos[1], object.pos[2], true);
		cameraControls.rotatePolarTo(1.0, true);
		cameraControls.dollyTo(15, true);
	}

	$: rotateToItem($currentItem);

	onMount(() => {
		resetCameraPosition(false);
	});

	// Returns whether a specific object contains an item with the provided category.
	function containsCurrentCategory(objectKey, categoryKey) {
		if (!$currentCategory) return false;
		for (const itemKey of Object.keys(items)) {
			if (items[itemKey].object != objectKey) continue;
			if (items[itemKey].categories.includes(categoryKey)) return true;
		}
		return false;
	}
</script>

<T.PerspectiveCamera makeDefault position={[0, 5, 12]} lookAt.y={0.5}>
	<CameraControls
		on:create={({ ref }) => {
			cameraControls = ref;
		}}
		maxPolarAngle={Math.PI / 2 - 0.1}
		draggingSmoothTime={0.2}
		minDistance={5}
		maxDistance={50}
	/>
</T.PerspectiveCamera>

<T.DirectionalLight intensity={0.2} position={[10, 10, 10]} castShadow />
<T.AmbientLight intensity={0.8} />
<CustomRenderer />

<!-- Display the objects that have been loaded for this scene. -->
{#each Object.keys(objects) as objectKey (objectKey)}
	<ObjectModel
		selected={currentCategoryData &&
			!currentCategoryData.hide_top &&
			containsCurrentCategory(objectKey, $currentCategory)}
		id={objectKey}
	/>
{/each}

<T.Mesh position.z={-5} position.y={3}>
	<Text text={'Sephora'} fontSize={1}></Text>
</T.Mesh>

<T.Mesh position={[-1, 0, 5]} rotation={[-1.57, 0, 0]}>
	<Text text={'Entrance'} fontSize={0.5}></Text>
</T.Mesh>

<!-- Floor -->
<T.Mesh position.y={-0.1} receiveShadow>
	<T.BoxGeometry args={[10, 0.1, 10]}></T.BoxGeometry>
	<T.MeshStandardMaterial color="white" />
</T.Mesh>
