<script>
<<<<<<< HEAD
	import { GLTF, interactivity, Text } from '@threlte/extras';
=======
	import { GLTF, interactivity } from '@threlte/extras';
>>>>>>> b73777035a9199b8a683365c7c6ea9853f429e6f
	import { T } from '@threlte/core';
	import CameraControls from './cameracontrols.svelte';
	import {
		itemData,
		objectsData,
		currentItem,
		categoryData,
		currentCategory,
		currentObject
	} from '$lib/appstore.js';
	import ObjectModel from './objectmodel.svelte';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
<<<<<<< HEAD
	import labelsList from './labels.json';
=======
>>>>>>> b73777035a9199b8a683365c7c6ea9853f429e6f

	let objects = $objectsData;
	let categories = $categoryData;
	let items = $itemData;

	let cameraControls;

	interactivity();
	export let cameraMoved = false;

	function resetCameraPosition(transition) {
		cameraControls.moveTo(0, 0, -50, transition);
		cameraControls.rotateAzimuthTo(Math.PI, transition);
		cameraControls.rotatePolarTo(0.5, transition);
		cameraControls.dollyTo(180, transition);
	}

	export function resetCamera() {
		resetCameraPosition(true);
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

		const newPos = [
			object.pos[0] + object.cardOffset[0],
			object.pos[1] + object.cardOffset[1],
			object.pos[2] + object.cardOffset[2]
		];

		cameraControls.rotateAzimuthTo(Math.PI, true);
		cameraControls.rotatePolarTo(1.2, true);
		cameraControls.moveTo(newPos[0], newPos[1], newPos[2], true);
		cameraControls.dollyTo(34, true);
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

	function shouldObjectBeSelected(objectId, currentObject, categoryId) {
		if (currentObject) {
			// If an object is selected, then only that object should be selected.
			return objectId == currentObject;
		}

		// Otherwise, the object should be selected if it contains the category, but
		// only if the category is not hidden.
		if (categories[categoryId] && categories[categoryId].hide_top) return false;
		return doesObjectContrainsCategory(objectId, categoryId);
	}

	onMount(() => {
		resetCameraPosition(false);
	});

	import { writable } from 'svelte/store';
</script>

<!-- Camera -->
<T.PerspectiveCamera makeDefault position={[0, 5, 50]}>
	<CameraControls
		on:create={({ ref }) => {
			cameraControls = ref;
		}}
		on:update={() => {
			const curPos = cameraControls.getPosition();
			const offset = [
				curPos.x - 1.0568285123060394e-14,
				curPos.y - 157.9648611402671,
				curPos.z + 136.29659694875653
			];
			const dist = offset[0] * offset[0] + offset[1] * offset[1] + offset[2] * offset[2];
			cameraMoved = dist >= 0.1;
		}}
		maxPolarAngle={Math.PI / 2 - 0.1}
		draggingSmoothTime={0.26}
		minDistance={10}
		maxDistance={200}
	/>
</T.PerspectiveCamera>

<!-- Lighting -->
<T.DirectionalLight intensity={4} position={[5, 20, -10]} castShadow />
<T.AmbientLight intensity={3} />

<!-- Display the objects that have been loaded for this scene. -->
{#each Object.keys(objects) as objectKey (objectKey)}
	<ObjectModel
		blendColor={shouldObjectBeSelected(objectKey, $currentObject, $currentCategory)
			? [50, 50, 100]
			: [255, 255, 255]}
		id={objectKey}
	/>
{/each}

<!-- Floor -->
<GLTF url={base + '/models/base.glb'} rotation={[0, 1.57, 0]} />

<!-- Labels -->
{#each labelsList as label}
	{@const text = label.text || ''}
	{@const fontSize = label.fontSize || 3}
	{@const position = label.position || [0, 20, 0]}
	{@const scale = label.scale || [1, 1, 1]}
	{@const color = label.color || 'black'}
	{@const rotation = label.rotation || [-1.57, 0, Math.PI]}
	<Text {text} {fontSize} {position} {scale} {color} {rotation} />
{/each}
