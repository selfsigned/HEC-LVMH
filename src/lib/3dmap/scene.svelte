<script>
	import { GLTF, Text } from '@threlte/extras';
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
	import { base } from '$app/paths';

	let objects = $objectsData;
	let categories = $categoryData;
	let items = $itemData;

	let cameraControls;

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

	onMount(() => {
		resetCameraPosition(false);
	});
</script>

<!-- Camera -->
<T.PerspectiveCamera makeDefault position={[0, 5, 50]}>
	<CameraControls
		on:create={({ ref }) => {
			cameraControls = ref;
		}}
		on:update={() => {
			const curPos = cameraControls.getPosition();
			console.log(curPos);
			const offset = [
				curPos.x - 1.0568285123060394e-14,
				curPos.y - 157.9648611402671,
				curPos.z + 136.29659694875653
			];
			const dist = offset[0] * offset[0] + offset[1] * offset[1] + offset[2] * offset[2];
			cameraMoved = dist >= 0.1;
		}}
		maxPolarAngle={Math.PI / 2 - 0.1}
		draggingSmoothTime={0.2}
		minDistance={10}
		maxDistance={200}
	/>
</T.PerspectiveCamera>

<!-- Lighting -->
<T.DirectionalLight intensity={4} position={[5, 20, -10]} castShadow />
<T.AmbientLight intensity={3} />

<!-- Display the objects that have been loaded for this scene. -->
{#each Object.keys(objects) as objectKey (objectKey)}
	{@const includesCategory = doesObjectContrainsCategory(objectKey, $currentCategory)}
	<ObjectModel
		blendColor={categories[$currentCategory].hide_top || !includesCategory ? null : 0x444444}
		id={objectKey}
	/>
{/each}

<!-- Floor -->
<GLTF url={base + '/models/base.glb'} rotation={[0, 1.57, 0]} />
