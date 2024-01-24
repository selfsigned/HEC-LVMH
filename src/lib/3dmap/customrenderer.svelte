<script>
	import { useTask, useThrelte } from '@threlte/core';
	import {
		BlendFunction,
		EffectComposer,
		EffectPass,
		OutlineEffect,
		RenderPass
	} from 'postprocessing';
	import { onMount, getContext } from 'svelte';

	const { scene, renderer, camera, size, autoRender, renderStage } = useThrelte();

	const composer = new EffectComposer(renderer);

	let selectedMeshes = getContext('selectedMeshes');

	function setupEffectComposer(camera, selectedMeshes) {
		composer.removeAllPasses();
		composer.addPass(new RenderPass(scene, camera));

		if (selectedMeshes.length != 0) {
			const outlineEffect = new OutlineEffect(scene, camera, {
				blendFunction: BlendFunction.ALPHA,
				edgeStrength: 100,
				pulseSpeed: 0.0,
				visibleEdgeColor: 0xff0000,
				hiddenEdgeColor: 0xff0000,
				xRay: true,
				blur: true
			});
			for (const mesh of selectedMeshes) {
				outlineEffect.selection.add(mesh);
			}
			composer.addPass(new EffectPass(camera, outlineEffect));
		}
	}

	$: setupEffectComposer($camera, $selectedMeshes);
	$: composer.setSize($size.width, $size.height);

	onMount(() => {
		let before = autoRender.current;
		autoRender.set(false);
		return () => {
			autoRender.set(before);
		};
	});

	useTask(
		(delta) => {
			composer.render(delta);
		},
		{ stage: renderStage, autoInvalidate: false }
	);
</script>
