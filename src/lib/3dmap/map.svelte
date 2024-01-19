<script>
	import { Canvas } from '@threlte/core';
	import Scene from '$lib/3dmap/scene.svelte';

	export let selectedProduct;
</script>

<Canvas>
	<Scene {selectedProduct} />
</Canvas>
