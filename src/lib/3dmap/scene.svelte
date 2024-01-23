<script>
	import { Text, HTML } from '@threlte/extras';
	import { T } from '@threlte/core';
	import CameraControls from './cameracontrols.svelte';
	import { itemData, objectsData, currentItem } from '$lib/appstore.js';

	// App logic
	import ProductCard from '$lib/productcard.svelte';

	let objects = $objectsData;
	let cameraControls;

	function resetCameraPosition() {
		cameraControls.moveTo(0, 0, 0, true);
	}

	function rotateToItem(itemId) {
		if (!cameraControls) return;

		let item = $itemData[itemId];
		if (!item) {
			resetCameraPosition();
			return;
		}
		let object = objects[item.object];
		if (!object) return;
		let rot = object.rot || [0, 0, 0];

		cameraControls.rotateAzimuthTo(rot[1], true);
		cameraControls.moveTo(object.pos[0], object.pos[1], object.pos[2], true);
		cameraControls.rotatePolarTo(1.0, true);
	}

	$: rotateToItem($currentItem);
	$: currentItemData = $currentItem in $itemData ? $itemData[$currentItem] : null;
</script>

<T.PerspectiveCamera makeDefault position={[0, 12, 12]} lookAt.y={0.5}>
	<CameraControls
		on:create={({ ref }) => {
			cameraControls = ref;
		}}
		maxPolarAngle={Math.PI / 2 - 0.1}
	/>
</T.PerspectiveCamera>

<T.DirectionalLight position={[0, 0, 10]} castShadow />
<T.AmbientLight intensity={10} />

<!-- Display the objects that have been loaded for this scene. -->
{#each Object.keys(objects) as objectKey (objectKey)}
	{@const object = objects[objectKey]}
	<T.Mesh position={object.pos} rotation={object.rot ? object.rot : [0, 0, 0]} castShadow>
		{#if currentItemData && currentItemData.object == objectKey}
			<HTML zIndexRange={[0, 100]} position.y={2.5} scale={0.5} transform>
				<ProductCard enableInfoBtn={true} id={$currentItem}></ProductCard>
			</HTML>
		{/if}
		{#if object.name}
			<Text
				position={[0, 1.1, 0.8]}
				rotation={[-1.57, 0, 1.57]}
				text={object.name}
				color="black"
				fontSize={0.25}
			></Text>
		{/if}
		<T.BoxGeometry args={[1, 2, 2]}></T.BoxGeometry>
		<T.MeshStandardMaterial color="grey" />
	</T.Mesh>
{/each}

<T.Mesh position.z={-5} position.y={3}>
	<Text text={'Sephora'} fontSize={1}></Text>
</T.Mesh>

<T.Mesh position={[-1, 0, 5]} rotation={[-1.57, 0, 0]}>
	<Text text={'Entrance'} fontSize={0.5}></Text>
</T.Mesh>

<!-- Floor -->
<T.Mesh position.y={0} receiveShadow>
	<T.BoxGeometry args={[10, 0, 10]}></T.BoxGeometry>
	<T.MeshStandardMaterial color="white" />
</T.Mesh>
