<script context="module">
	function randomSalt() {
		return Math.random().toString(36).substring(2, 15);
	}
</script>

<script>
	import { objectsData, itemData, currentItem } from '$lib/appstore.js';
	import ProductCard from '$lib/productcard.svelte';
	import { useThrelte } from '@threlte/core';
	import { GLTF, HTML, Text } from '@threlte/extras';
	import { base } from '$app/paths';
	import { currentObject, currentCategory } from '$lib/appstore.js';

	const { invalidate } = useThrelte();

	export let id;
	export let cardRotation = 0;
	export let blendColor = null;

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

	let materials;

	$: {
		// Apply the requested color to the materials.
		if (materials) {
			for (const materialKey of Object.keys(materials)) {
				materials[materialKey].color = {
					r: blendColor[0] / 255,
					g: blendColor[1] / 255,
					b: blendColor[2] / 255,
					isColor: true
				};
			}

			invalidate();
		}
	}

	// App logic
	function objectSelectionEvent(e, targetID) {
		console.log('Target item is: ', targetID);
		$currentItem = null;
		if ($currentObject != null) {
			$currentObject = null;
			$currentCategory = 'trend'; // hack
		} else {
			$currentObject = targetID;
			$currentCategory = 'product';
		}
	}
</script>

<!-- Display each part of the model. -->
{#if object.model}
	<!-- The randomSalt is used to prevent the GLTF renderer from caching models. This causes
	     them to not render (or rather, to be moved wherever the model is loaded last.
		 It's pretty weird). -->
	<GLTF
		position={object.pos}
		rotation={[0, rotation, 0]}
		scale={[scale, scale, scale]}
		castShadow
		receiveShadow
		url={base + '/models/' + object.model + '?salt=' + randomSalt()}
		bind:materials
		on:click={() => objectSelectionEvent(Event, id)}
	>
		{#if currentItemData && currentItemData.object == id}
			<HTML
				occlude
				zIndexRange={[0, 100]}
				position={cardOffset}
				rotation={[0, -rotation + cardRotation + Math.PI, 0]}
				scale={[1.5 / scale, 1.5 / scale, 1.5 / scale]}
				transform
			>
				<ProductCard enableInfoBtn={true} id={$currentItem} />
			</HTML>
		{/if}
	</GLTF>
{/if}
