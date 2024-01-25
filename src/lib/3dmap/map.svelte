<script>
	import { Canvas } from '@threlte/core';
	import Scene from '$lib/3dmap/scene.svelte';

	let scene;

	export let cameraMoved = false;

	export function resetCamera() {
		scene.resetCamera();
	}
</script>

<Canvas useLegacyLights={false}>
	<Scene bind:cameraMoved bind:this={scene} />
</Canvas>
