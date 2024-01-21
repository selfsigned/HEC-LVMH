<script>
	import { OrbitControls, Gizmo, Text, HTML } from '@threlte/extras';
	import { T } from '@threlte/core';
	import { shelfData } from '$lib/appstore.js';

	// App logic
	import ProductCard from '$lib/productcard.svelte';
	let shelves = $shelfData;

	export let selectedProduct;
</script>

<T.PerspectiveCamera makeDefault position={[0, 12, 10]} lookAt.y={0.5}>
	<OrbitControls enableDamping maxPolarAngle={1.5} />
</T.PerspectiveCamera>
<Gizmo horizontalPlacement="left" paddingX={20} paddingY={20} />

<T.DirectionalLight position={[0, 0, 10]} castShadow />
<T.AmbientLight intensity={10} />

<!-- App shelf logic -->
{#each Object.keys(shelves) as shelfKey, _}
	{@const shelf = shelves[shelfKey]}
	<T.Mesh position={shelf.pos} rotation={shelf.rot ? shelf.rot : [0, 0, 0]} castShadow>
		{#if selectedProduct && selectedProduct.shelf == shelfKey}
			<HTML zIndexRange={[0, 100]} position.y={2.5} scale={0.5} transform>
				<ProductCard enableInfoBtn={true} productInfo={selectedProduct}></ProductCard>
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
