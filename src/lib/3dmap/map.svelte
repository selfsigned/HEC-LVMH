<script>
	import { Canvas } from '@threlte/core';
	import Scene from '$lib/3dmap/scene.svelte';

	export let shelfData;
	export let selectedProduct;
</script>

<Canvas>
	<Scene {shelfData} {selectedProduct} />
</Canvas>
