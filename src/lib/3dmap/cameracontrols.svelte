<script context="module">
	// We need to manually import some dependencies into the CameraControls
	// module context.
	// We're going to do this only once.
	let installed = false;
</script>

<script>
	import { T, forwardEventHandlers, useTask, useParent, useThrelte } from '@threlte/core';
	import CameraControls from 'camera-controls';
	import * as THREE from 'three';

	if (!installed) {
		CameraControls.install({ THREE });
		installed = true;
	}

	const parent = useParent();

	if (!$parent) {
		throw new Error('CameraControls must be a child of a ThreeJS camera');
	}

	const { renderer, invalidate } = useThrelte();

	export const ref = new CameraControls($parent, renderer?.domElement);

	const getControls = () => ref;

	useTask(
		(delta) => {
			if (getControls().update(delta)) invalidate();
		},
		{
			autoInvalidate: false
		}
	);

	const forwardingComponent = forwardEventHandlers();
</script>

<T is={ref} {...$$restProps} bind:this={$forwardingComponent}>
	<slot {ref} />
</T>
