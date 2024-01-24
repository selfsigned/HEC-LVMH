<script>
	import { Text } from '@threlte/extras';
	import { T } from '@threlte/core';
	import CameraControls from './cameracontrols.svelte';
	import { itemData, objectsData, currentItem } from '$lib/appstore.js';
	import ObjectModel from './objectmodel.svelte';
	import { onMount } from 'svelte';

	let objects = $objectsData;
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

<T.DirectionalLight position={[10, 10, 10]} castShadow />
<T.AmbientLight intensity={2} />

<!-- Display the objects that have been loaded for this scene. -->
{#each Object.keys(objects) as objectKey (objectKey)}
	<ObjectModel blendColor={Math.random() * 0xffffff} id={objectKey} />
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
