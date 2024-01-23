<script context="module">
	import { useGltf } from '@threlte/extras';
	import { base } from '$app/paths';

	// This is a simple cache that prevents the same model from being loaded multiple times.
	let model_cache = {};
	function getModel(filename) {
		if (filename in model_cache) {
			return model_cache[filename];
		}

		let model = useGltf(base + '/models/' + filename);
		model_cache[filename] = model;
		return model;
	}
</script>

<script>
	import { objectsData, itemData, currentItem } from '$lib/appstore.js';
	import ProductCard from '$lib/productcard.svelte';
	import { T } from '@threlte/core';
	import { HTML, Text } from '@threlte/extras';

	export let id;
	export let cardRotation = 0;

	$: {
		if (!$objectsData[id]) {
			throw new Error('Object ' + id + ' does not exist');
		}
	}

	$: object = $objectsData[id];
	$: currentItemData = $itemData[$currentItem];

	$: rotation = object.rot ? (object.rot / 180) * Math.PI : 0;
	$: scale = object.scale || 1;
</script>

<T.Mesh
	position={object.pos}
	rotation={[0, rotation, 0]}
	scale={[scale, scale, scale]}
	castShadow
	receiveShadow
>
	{#if currentItemData && currentItemData.object == id}
		<HTML
			occlude
			position={object.card_offset}
			rotation={[0, -rotation + cardRotation, 0]}
			scale={[0.5 / scale, 0.5 / scale, 0.5 / scale]}
			transform
		>
			<ProductCard enableInfoBtn={true} id={$currentItem} />
		</HTML>
	{/if}
	{#if object.name}
		<Text
			position={[0, 1.1, 0.8]}
			rotation={[-1.57, 0, 1.57]}
			text={object.name}
			color="black"
			fontSize={0.25}
		></Text>
	{/if}

	<!-- Display each part of the model. -->
	{#if object.model}
		{@const model = getModel(object.model)}
		{#await model then model}
			{#each Object.keys(model.nodes) as node (node)}
				<T is={model.nodes[node]} castShadow />
			{/each}
		{/await}
	{:else}
		<T.BoxGeometry args={[1, 2, 2]}></T.BoxGeometry>
		<T.MeshStandardMaterial color="white" />
	{/if}
</T.Mesh>
