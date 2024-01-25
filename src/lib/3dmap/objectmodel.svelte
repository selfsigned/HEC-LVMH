<script context="module">
	function randomSalt() {
		return Math.random().toString(36).substring(2, 15);
	}
</script>

<script>
	import { objectsData, itemData, currentItem } from '$lib/appstore.js';
	import ProductCard from '$lib/productcard.svelte';
	import { T } from '@threlte/core';
	import { GLTF, HTML, Text } from '@threlte/extras';
	import { base } from '$app/paths';
	import { currentObject, currentCategory } from '$lib/appstore.js';

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
	$: textOffset = object.textOffset || [0, 0, 0];
	$: cardOffset = object.cardOffset || [0, 0, 0];

	// App logic
	function objectSelectionEvent(e, targetID) {
		if ($currentObject != null) {
			$currentObject = null;
			$currentCategory = 'trend'; // hack
		} else {
			$currentObject = targetID;
			$currentCategory = 'product';
		}
	}
</script>

<T.Mesh
	position={object.pos}
	rotation={[0, rotation, 0]}
	scale={[scale, scale, scale]}
	castShadow
	receiveShadow
	on:click={() => objectSelectionEvent(Event, id)}
>
	{#if currentItemData && currentItemData.object == id}
		<HTML
			occlude
			zIndexRange={[0, 100]}
			position={cardOffset}
			rotation={[0, -rotation + cardRotation, 0]}
			scale={[0.5 / scale, 0.5 / scale, 0.5 / scale]}
			transform
		>
			<ProductCard enableInfoBtn={true} id={$currentItem} />
		</HTML>
	{/if}
	{#if object.name}
		<Text
			position={textOffset}
			rotation={[-1.57, 0, 0]}
			text={object.name}
			color="black"
			fontSize={0.25 / scale}
		></Text>
	{/if}

	<!-- Display each part of the model. -->
	{#if object.model}
		<!-- The randomSalt is used to prevent the GLTF renderer from caching models. This causes
	     them to not render (or rather, to be moved wherever the model is loaded last.
		 It's pretty weird). -->
		<GLTF
			castShadow
			receiveShadow
			url={base + '/models/' + object.model + '?salt=' + randomSalt()}
		/>
	{:else}
		<T.BoxGeometry args={[1, 2, 2]}></T.BoxGeometry>
		<T.MeshStandardMaterial color="white" />
	{/if}
</T.Mesh>
