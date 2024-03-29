<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import { blur } from 'svelte/transition';

	import Icon from '@iconify/svelte';
	import ThreeMap from '$lib/3dmap/map.svelte';
	import ProductCard from '$lib/productcard.svelte';
	import ProductInfo from '$lib/productinfo.svelte';
	import Modal from '$lib/modal.svelte';
	import {
		itemData,
		categoryData,
		objectsData,
		productInfoModal,
		currentCategory,
		currentItem,
		currentObject
	} from '$lib/appstore.js';

	// Default variables
	const defaultCategory = 'trend';

	// Mock data
	let allItems = $itemData; // No need to bother with a separate list for now
	let categories = $categoryData;

	// Search and Filter Items
	function filterItemsByCategory(category) {
		return Object.keys(allItems).filter((key) => {
			return allItems[key].categories.includes(category);
		});
	}

	function filterItemsByObject(object) {
		return Object.keys(allItems).filter((key) => {
			return allItems[key].object == object;
		});
	}

	function filterItemsByCategoryOrObject(object, category) {
		if (object) {
			return filterItemsByObject(object);
		} else {
			return filterItemsByCategory(category);
		}
	}

	// The list of products in the current category.
	let activeProducts;
	$: {
		if ($currentCategory !== 'search') {
			activeProducts = filterItemsByCategoryOrObject($currentObject, $currentCategory);
		}
	}

	let searchInput = '';
	$: {
		if (searchInput.length > 0) {
			// Set category to product
			let textTarget = searchInput.toLocaleUpperCase();
			// TODO filter on brand || category?
			activeProducts = Object.keys(allItems).filter((key) => {
				return (
					allItems[key].categories.includes('product') &&
					allItems[key].name.toLocaleUpperCase().includes(textTarget)
				);
			});
			$currentCategory = 'search';
		} else if ($currentCategory === 'search') {
			// Only reset the category if it was set to search.
			$currentCategory = defaultCategory;
		}
	}

	$: {
		if ($currentObject) {
			searchInput = '';
		}
	}

	function searchSubmit(e) {
		if (e.key === 'Enter') {
			$currentItem = !$currentItem ? activeProducts[0] : null;
		}
	}

	// Category select
	$currentCategory = defaultCategory;
	function selectCategory(e, category) {
		$currentItem = null; // Reset the selected item on category change
		$currentObject = null; // Reset the object selection
		searchInput = ''; // Reset the search input as well
		$currentCategory = category === $currentCategory ? defaultCategory : category;
	}

	// Selection
	function selectItemEvent(e, itemId) {
		if (allItems[itemId].object !== null) {
			// if item is avail show it on map
			$currentItem = $currentItem !== itemId ? itemId : null;
		} else {
			// otherwise open the modal to order it
			$productInfoModal = itemId;
		}
	}

	let threeMap;
	let cameraMoved = false;

	onMount(() => {
		// Search params
		if ($page.url.searchParams.has('productinfo')) {
			let productinfo = $page.url.searchParams.get('productinfo');
			$productInfoModal = productinfo;
		}
	});
</script>

<div class="flex h-full flex-col-reverse overflow-hidden sm:flex-row">
	<!-- Product sidebar -->
	<div
		class="z-20 flex h-1/3 min-w-[20rem] flex-col items-center overflow-y-auto overflow-x-hidden rounded-r-xl shadow-sm sm:h-full sm:bg-base-200"
	>
		<!-- Sidebar label -->
		{#if $currentCategory in categories}
			{@const catData = categories[$currentCategory]}
			<div class="h-16 p-1">
				<!-- Selected shelf label -->
				{#if $currentObject in $objectsData}
					{@const objData = $objectsData[$currentObject]}
					<div class="mb-2 mt-5 hidden text-sm sm:flex">
						<Icon height="28px" icon="mdi:shop" />
						<h2 class="text-md text-xl">
							{objData.name}
						</h2>
					</div>
				{:else}
					<!-- category label -->
					{#key catData.name}
						<div transition:blur class="relative mb-2 mt-5 hidden flex-row sm:flex">
							<Icon height="28px" icon={catData.icon} />
							<h2 class="text-md text-xl">
								{catData.name}
							</h2>
						</div>
					{/key}
				{/if}
			</div>
		{/if}

		<!-- Product list -->
		<div class="m-2 space-y-2">
			{#each activeProducts as productId (productId)}
				{@const selected = $currentItem == productId}
				<div
					on:click={() => selectItemEvent(Event, productId)}
					on:keypress={() => selectItemEvent(Event, productId)}
					role="button"
					tabindex="0"
				>
					<ProductCard {selected} id={productId}></ProductCard>
				</div>
			{/each}
		</div>
	</div>

	<!-- Divider on mobile -->
	{#if $currentCategory in categories}
		{@const catData = categories[$currentCategory]}
		<div transition:blur class="divider h-1 w-72 self-center sm:hidden">
			{#if $currentObject in $objectsData}
				{@const objData = $objectsData[$currentObject]}
				<Icon height="100px" icon="mdi:shop" />{objData.name}
			{:else}
				<Icon height="100px" icon={catData.icon} />{catData.name}
			{/if}
		</div>
	{/if}

	<!-- Search and canvas -->
	<div class="flex h-full w-full flex-col items-center">
		<div class="absolute z-[200] m-4 flex flex-row flex-wrap gap-x-4 gap-y-1">
			<div class="flex items-center justify-end">
				<input
					type="text"
					placeholder="Find your product"
					class="input input-ghost w-80 rounded-full shadow-sm backdrop-blur-[6px] hover:shadow-xl focus:outline-none sm:w-auto"
					bind:value={searchInput}
					on:keydown={searchSubmit}
				/>
				<Icon class="absolute mr-5" height="22px" icon="line-md:search" />
			</div>
			{#each Object.keys(categories) as categoryKey (categoryKey)}
				{@const currCategory = categories[categoryKey]}
				{@const isPressed = $currentCategory == categoryKey}
				{#if currentCategory && !currCategory.hide_top}
					<btn
						class="btn btn-ghost rounded-full shadow-sm backdrop-blur-[6px] {isPressed
							? 'btn-primary bg-base-300 bg-opacity-70 shadow-xl'
							: 'hover:shadow-xl'}"
						on:click={() => selectCategory(Event, categoryKey)}
						on:keypress={() => selectCategory(Event, categoryKey)}
						role="button"
						tabindex="0"><Icon icon={currCategory.icon} height="22px" />{currCategory.name}</btn
					>
				{/if}
			{/each}
		</div>
		<div class="relative w-full grow">
			<div class="absolute bottom-5 right-5 z-20">
				{#if cameraMoved}
					<btn
						class="btn btn-ghost rounded-full shadow-sm
						backdrop-blur-[6px] hover:shadow-xl"
						role="button"
						on:click={() => threeMap.resetCamera()}
						on:keypress={() => threeMap.resetCamera()}
						tabindex="0"><Icon icon={'mdi:view-refresh'} height="22px" /></btn
					>
				{/if}
			</div>
			<ThreeMap bind:cameraMoved bind:this={threeMap} />
		</div>
	</div>
</div>

<!-- Product info modal -->
{#if $productInfoModal}
	<div class="z-[1000]">
		<Modal
			id={'productModal'}
			openModal={true}
			closeCallBack={() => {
				productInfoModal.set(null);
			}}
		>
			<ProductInfo id={$productInfoModal}></ProductInfo>
		</Modal>
	</div>
{/if}
