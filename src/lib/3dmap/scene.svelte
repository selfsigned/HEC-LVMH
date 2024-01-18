<script>
	import { OrbitControls, Gizmo, Text, HTML } from '@threlte/extras';
	import { T } from '@threlte/core';

	// App logic
	import ProductCard from '$lib/productcard.svelte';

	export let shelfData;
	export let selectedProduct;
</script>

<T.PerspectiveCamera makeDefault position={[10, 5, 10]} lookAt.y={0.5}>
	<OrbitControls enableDamping maxPolarAngle={1.5} />
</T.PerspectiveCamera>
<Gizmo horizontalPlacement="left" paddingX={20} paddingY={20} />

<T.DirectionalLight position.y={10} position.z={10} castShadow />
<T.AmbientLight intensity={0.3} />
<T.GridHelper args={[10, 10]} />

<!-- App shelf logic -->

{#each shelfData as shelf, i}
	<T.Mesh position={shelf.pos} rotation={shelf.rot ? shelf.rot : [0, 0, 0]} castShadow>
		{#if selectedProduct && selectedProduct.shelf === shelf.id}
			<HTML position.y={2.5} scale={0.5} transform>
				<ProductCard productInfo={selectedProduct}></ProductCard>
			</HTML>
		{/if}
		{#if shelf.name}
			<Text position.y={1.5} text={shelf.name} fontSize={0.5}></Text>
		{/if}
		<T.BoxGeometry args={[1, 2, 2]}></T.BoxGeometry>
	</T.Mesh>
{/each}

<T.Mesh position.z={-5} position.y={2}>
	<Text text={'Sephora'} fontSize={1}></Text>
</T.Mesh>

<T.Mesh position={[0, 0, 5]} rotation={[-1.57, 0, 0]}>
	<Text text={'Entrance'} fontSize={0.5}></Text>
</T.Mesh>
