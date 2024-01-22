<script>
	import { Canvas } from '@threlte/core';
	import Scene from '$lib/3dmap/scene.svelte';

	export let selectedItem;
</script>

<Canvas useLegacyLights={false}>
	<Scene {selectedItem} />
</Canvas>
