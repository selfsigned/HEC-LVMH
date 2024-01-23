<script>
	import { Text, HTML, useGltf } from '@threlte/extras';
	import { T } from '@threlte/core';
	import CameraControls from './cameracontrols.svelte';
	import { itemData, objectsData, currentItem } from '$lib/appstore.js';
	import { base } from '$app/paths';

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
		let shelf = objects[item.shelf];
		if (!shelf) return;
		let rot = shelf.rot || [0, 0, 0];

		cameraControls.rotateAzimuthTo(rot[1], true);
		cameraControls.moveTo(shelf.pos[0], shelf.pos[1], shelf.pos[2], true);
		cameraControls.rotatePolarTo(1.0, true);
	}

	$: rotateToItem($currentItem);
	$: currentItemData = $currentItem in $itemData ? $itemData[$currentItem] : null;

	// This is a simple cache that prevents the same model from being loaded multiple times.
	let model_cache = {};
	function getModel(filename) {
		if (filename in model_cache) {
			return model_cache[filename];
		}

		let model = useGltf(base + '/models/' + filename);
		model_cache[filename] = model;
		return model;
	}
</script>

<T.PerspectiveCamera makeDefault position={[0, 12, 12]} lookAt.y={0.5}>
	<CameraControls
		on:create={({ ref }) => {
			cameraControls = ref;
		}}
		maxPolarAngle={Math.PI / 2 - 0.1}
	/>
</T.PerspectiveCamera>

<T.DirectionalLight position={[10, 10, 10]} castShadow />
<T.AmbientLight intensity={2} />

<<<<<<< Updated upstream
<!-- App shelf logic -->
{#each Object.keys(objects) as shelfKey (shelfKey)}
	{@const shelf = objects[shelfKey]}
	<T.Mesh position={shelf.pos} rotation={shelf.rot ? shelf.rot : [0, 0, 0]} castShadow>
		{#if currentItemData && currentItemData.shelf == shelfKey}
			<HTML zIndexRange={[0, 100]} position.y={2.5} scale={0.5} transform>
=======
<!-- Display the objects that have been loaded for this scene. -->
{#each Object.keys(objects) as objectKey (objectKey)}
	{@const object = objects[objectKey]}
	<T.Mesh
		position={object.pos}
		rotation={object.rot || [0, 0, 0]}
		scale={object.scale || [1, 1, 1]}
		castShadow
		receiveShadow
	>
		{#if currentItemData && currentItemData.object == objectKey}
			<HTML occlude position.y={2.5} scale={0.5} transform>
>>>>>>> Stashed changes
				<ProductCard enableInfoBtn={true} id={$currentItem}></ProductCard>
			</HTML>
		{/if}
		{#if shelf.name}
			<Text
				position={[0, 1.1, 0.8]}
				rotation={[-1.57, 0, 1.57]}
				text={shelf.name}
				color="black"
				fontSize={0.25}
			></Text>
		{/if}

		<!-- Display each part of the model. -->
		{#if object.model}
			{@const model = getModel(object.model)}
			{#await model then model}
				{#each Object.keys(model.nodes) as node (node)}
					<T is={model.nodes[node]} />
				{/each}
			{/await}
		{:else}
			<T.BoxGeometry args={[1, 2, 2]}></T.BoxGeometry>
			<T.MeshStandardMaterial color="white" />
		{/if}
	</T.Mesh>
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
