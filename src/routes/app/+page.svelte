<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import { fade, blur } from 'svelte/transition';

	import Icon from '@iconify/svelte';
	import ThreeMap from '$lib/3dmap/map.svelte';
	import ProductCard from '$lib/productcard.svelte';
	import ProductInfo from '$lib/productinfo.svelte';
	import Modal from '$lib/modal.svelte';
	import {
		itemData,
		categoryData,
		productInfoModal,
		currentCategory,
		currentItem
	} from '$lib/appstore.js';

	// Default variables
	const defaultCategory = 'trend';

	// Mock data
	let allItems = $itemData; // No need to bother with a separate list for now
	let categories = $categoryData;

	// Search and Filter Items
	function filterItemsByCategory(items, category) {
		return Object.keys(items).reduce((result, key) => {
			if (items[key].categories.includes(category)) {
				result[key] = items[key];
			}
			return result;
		}, {});
	}

	$: activeProducts = filterItemsByCategory(allItems, $currentCategory);
	let searchInput = '';
	$: setTimeout(() => {
		if (searchInput.length > 0) {
			// Set category to product
			$currentCategory = 'product';
			let textTarget = searchInput.toLocaleUpperCase();
			// TODO filter on brand || category?
			activeProducts = Object.keys(activeProducts).reduce((result, key) => {
				if (activeProducts[key].name.toLocaleUpperCase().includes(textTarget)) {
					result[key] = activeProducts[key];
				}
				return result;
			}, {});
			activeProducts = activeProducts;
		} else {
			$currentCategory = defaultCategory;
		}
	});

	function searchSubmit(e) {
		if (e.key === 'Enter') {
			$currentItem = !$currentItem ? Object.keys(activeProducts)[0] : null;
		}
	}

	// Category select
	$currentCategory = defaultCategory;
	function selectCategory(e, category) {
		$currentItem = null; // Reset the selected item on category change
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
		class="z-20 flex h-1/3 min-w-[19rem] flex-col items-center overflow-y-auto rounded-r-xl shadow-sm sm:h-full sm:bg-base-200"
	>
		<!-- Sidebar label -->
		{#if $currentCategory in categories}
			{@const catData = categories[$currentCategory]}
			<div class="h-16 w-28 p-1">
				{#key catData.name}
					<div transition:blur class="relative mb-2 mt-5 hidden flex-row sm:flex">
						<Icon height="28px" icon={catData.icon}></Icon>
						<h2 class="text-md text-xl">
							{catData.name}
						</h2>
					</div>
				{/key}
			</div>
		{/if}

		<!-- Product list -->
		<div class="m-2 space-y-2">
			{#each Object.keys(activeProducts) as productId (productId)}
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
			<Icon height="100px" icon={catData.icon} />{catData.name}
		</div>
	{/if}

	<!-- Search and canvas -->
	<div class="flex h-full w-full flex-col items-center">
		<div class="absolute z-20 m-4 flex flex-row flex-wrap gap-x-4 gap-y-1">
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
				{#if !currCategory.hide_top}
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
		<div class="absolute bottom-5 right-5 z-20">
			{#if cameraMoved}
				<btn
					class="btn btn-ghost rounded-full shadow-sm
					backdrop-blur-[6px] hover:shadow-xl"
					role="button"
					on:click={() => threeMap.resetCamera()}
					on:keypress={() => threeMap.resetCamera()}
					tabindex="0"><Icon icon={'system-uicons:reset'} height="22px" />Reset Camera</btn
				>
			{/if}
		</div>
		<div class="relative w-full grow">
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
