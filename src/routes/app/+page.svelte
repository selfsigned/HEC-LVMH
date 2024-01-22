<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import Icon from '@iconify/svelte';
	import ThreeMap from '$lib/3dmap/map.svelte';
	import ProductCard from '$lib/productcard.svelte';
	import ProductInfo from '$lib/productinfo.svelte';
	import Modal from '$lib/modal.svelte';
	import { itemData, productInfoModal } from '$lib/appstore.js';

	// Mock data
	let productItems = $itemData; // No need to bother with a separate list for now

	// Search
	let searchProducts = productItems;
	let searchInput = '';
	$: if (searchInput.length > 0) {
		let textTarget = searchInput.toLocaleUpperCase();
		// TODO filter on brand || category?
		searchProducts = Object.keys(searchProducts).reduce((result, key) => {
			if (searchProducts[key].name.toUpperCase().includes(textTarget)) {
				result[key] = searchProducts[key];
			}
			return result;
		}, {});
		searchProducts = searchProducts;
	} else {
		searchProducts = productItems;
	}
	function searchSubmit(e) {
		if (e.key === 'Enter') {
			selectedItem = !selectedItem ? Object.keys(searchProducts)[0] : null;
		}
	}

	// Selection
	let selectedItem = null;
	function selectItemEvent(e, itemId) {
		selectedItem = selectedItem !== itemId ? itemId : null;
	}

	// Viewmode
	let viewMode;
	$: viewMode = searchInput.length === 0 ? 'Trending' : 'Results';

	onMount(() => {
		// Search params
		if ($page.url.searchParams.has('productinfo')) {
			let productinfo = $page.url.searchParams.get('productinfo');
			productInfoModal.set(productinfo);
		}
	});
</script>

<div class="flex h-full flex-col-reverse overflow-hidden sm:flex-row">
	<!-- Product sidebar -->
	<div
		class="z-20 flex h-1/3 min-w-[19rem] flex-col items-center overflow-y-auto rounded-r-xl shadow-sm sm:h-full sm:bg-base-200"
	>
		<!-- Sidebar label -->
		<div class="mb-4 mt-6 hidden flex-row sm:flex">
			<h2 class="text-md text-xl">
				{viewMode}
			</h2>
			{#if viewMode == 'Trending'}
				<Icon class="" height="28px" icon="mdi:fire"></Icon>
			{/if}
		</div>

		<!-- Product list -->
		<div class="m-2 space-y-2">
			{#each Object.keys(searchProducts) as productId (productId)}
				{@const selected = selectedItem == productId}
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
	<div class="divider h-1 w-72 self-center sm:hidden">{viewMode}</div>

	<!-- Search and canvas -->
	<div class="flex h-full w-full flex-col items-center">
		<div class="absolute z-20 m-4 flex flex-row flex-wrap gap-x-4 gap-y-1">
			<div class="flex items-center justify-end">
				<!-- svelte-ignore a11y-autofocus -->
				<input
					type="text"
					placeholder="Find your product"
					class="input input-ghost w-80 rounded-full shadow-sm backdrop-blur-[6px] hover:shadow-xl focus:outline-none sm:w-auto"
					bind:value={searchInput}
					on:keydown={searchSubmit}
				/>
				<Icon class="absolute mr-5" height="22px" icon="line-md:search" />
			</div>
			<btn class="btn btn-ghost rounded-full shadow-sm backdrop-blur-[6px] hover:shadow-xl"
				><Icon icon="mdi:human-greeting-variant" height="22px" />Experiences</btn
			>
			<btn class="btn btn-ghost rounded-full shadow-sm backdrop-blur-[6px] hover:shadow-xl"
				><Icon icon="ic:baseline-discount" height="22px" />Promos</btn
			>
		</div>
		<div class="relative w-full grow">
			<ThreeMap {selectedItem}></ThreeMap>
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
