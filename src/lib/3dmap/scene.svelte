<script>
	import { Text } from '@threlte/extras';
	import { T } from '@threlte/core';
	import CameraControls from './cameracontrols.svelte';
	import {
		itemData,
		objectsData,
		currentItem,
		categoryData,
		currentCategory
	} from '$lib/appstore.js';
	import ObjectModel from './objectmodel.svelte';
	import { onMount } from 'svelte';

	let objects = $objectsData;
	let categories = $categoryData;
	let items = $itemData;

	let cameraControls;

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
		cameraControls.rotatePolarTo(1.0, true);
		cameraControls.moveTo(object.pos[0], object.pos[1], object.pos[2], true);
		cameraControls.dollyTo(15, true);
	}

	$: rotateToItem($currentItem);

	function doesObjectContrainsCategory(objectId, categoryId) {
		if (!categoryId) return false;

		// If the object does not exist, it cannot contain a category.
		if (!objects[objectId]) return false;

		// Otherwise, iterate all items until one is found that matches the category.
		for (const itemId of Object.keys(items)) {
			let item = items[itemId];

			// If the item is not on the object, skip it.
			if (item.object != objectId) continue;

			// If the item has the category, return true.
			if (item.categories.includes(categoryId)) return true;
		}

		// Not found.
		return false;
	}

	onMount(() => {
		resetCameraPosition(false);
	});
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

<T.DirectionalLight intensity={3} position={[10, 10, 10]} castShadow />
<T.AmbientLight intensity={2} />

<!-- Display the objects that have been loaded for this scene. -->
{#each Object.keys(objects) as objectKey (objectKey)}
	{@const includesCategory = doesObjectContrainsCategory(objectKey, $currentCategory)}
	<ObjectModel
		blendColor={categories[$currentCategory].hide_top || !includesCategory ? 0xffffff : 0x444444}
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
<T.Mesh position.y={-0.2} receiveShadow>
	<T.BoxGeometry args={[10, 0.3, 10]}></T.BoxGeometry>
	<T.MeshStandardMaterial color="white" />
</T.Mesh>
