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
	<T.Mesh position.x={i * 4 - 4} castShadow>
		{#if selectedProduct && selectedProduct.shelf === shelf.id}
			<HTML position.y={-2} transform>
				<ProductCard productInfo={selectedProduct}></ProductCard>
			</HTML>
		{/if}
		<Text position.y={2} text={shelf.name} fontSize={0.5}></Text>
		<T.BoxGeometry args={[1, 2, 2]}></T.BoxGeometry>
	</T.Mesh>
{/each}
