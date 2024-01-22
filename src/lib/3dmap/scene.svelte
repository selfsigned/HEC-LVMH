<script>
	import { Gizmo, Text, HTML } from '@threlte/extras';
	import { T } from '@threlte/core';
	import CameraControls from './cameracontrols.svelte';
	import { itemData, shelfData, currentItem } from '$lib/appstore.js';

	// App logic
	import ProductCard from '$lib/productcard.svelte';
	let shelves = $shelfData;

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
		let shelf = shelves[item.shelf];
		if (!shelf) return;
		let rot = shelf.rot || [0, 0, 0];

		cameraControls.rotateAzimuthTo(rot[1], true);
		cameraControls.moveTo(shelf.pos[0], shelf.pos[1], shelf.pos[2], true);
		cameraControls.rotatePolarTo(1.0, true);
	}

	$: rotateToItem($currentItem);
	$: currentItemData = $currentItem in $itemData ? $itemData[$currentItem] : null;
</script>

<T.PerspectiveCamera makeDefault position={[0, 10, 5]} lookAt.y={0.5}>
	<CameraControls
		on:create={({ ref }) => {
			cameraControls = ref;
		}}
		maxPolarAngle={Math.PI / 2 - 0.1}
	/>
</T.PerspectiveCamera>

<T.DirectionalLight position={[0, 0, 10]} castShadow />
<T.AmbientLight intensity={10} />

<!-- App shelf logic -->
{#each Object.keys(shelves) as shelfKey (shelfKey)}
	{@const shelf = shelves[shelfKey]}
	<T.Mesh position={shelf.pos} rotation={shelf.rot ? shelf.rot : [0, 0, 0]} castShadow>
		{#if currentItemData && currentItemData.shelf == shelfKey}
			<HTML zIndexRange={[0, 100]} position.y={2.5} scale={0.5} transform>
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
