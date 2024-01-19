<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import Icon from '@iconify/svelte';
	import ThreeMap from '$lib/3dmap/map.svelte';
	import ProductCard from '$lib/productcard.svelte';
	import ProductInfo from '$lib/productinfo.svelte';
	import Modal from '$lib/modal.svelte';
	import { productList, shelfList, productInfoModal } from '$lib/appstore.js';

	// Mock data
	let trendingProducts = $productList; // No need to bother with a separate list for now

	// Search
	let searchProducts;
	let searchInput = '';
	$: if (searchInput.length > 0) {
		// TODO filter on brand || category?
		searchProducts = trendingProducts.filter((product) =>
			product.name.toUpperCase().includes(searchInput.toUpperCase())
		);
	}
	function searchSubmit(e) {
		if (e.key === 'Enter') {
			selectedProduct =
				searchProducts.length > 0 &&
				(!selectedProduct || searchProducts[0].id != selectedProduct.id)
					? (selectedProduct = searchProducts[0])
					: null;
		}
	}

	// Selection
	let selectedProduct = null;
	function selectProductEvent(e, product) {
		selectedProduct =
			product && (!selectedProduct || product.id != selectedProduct.id) ? product : null;
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

<div class="flex h-full overflow-hidden">
	<!-- Product sidebar -->
	<div
		class="z-20 flex h-full min-w-72 flex-col items-center overflow-y-auto rounded-r-xl bg-base-200 shadow-sm"
	>
		<!-- Sidebar label -->
		<div class="mb-4 mt-6 flex flex-row">
			<h2 class="text-md text-xl">
				{viewMode}
			</h2>
			{#if viewMode == 'Trending'}
				<Icon class="" height="28px" icon="mdi:fire"></Icon>
			{/if}
		</div>

		<!-- Product list -->
		<div class="m-2 space-y-2">
			{#each viewMode == 'Results' ? searchProducts : trendingProducts as productInfo}
				{@const selected = selectedProduct && selectedProduct.id == productInfo.id}
				<div
					on:click={selectProductEvent(Event, productInfo)}
					on:keypress={selectProductEvent(Event, productInfo)}
					role="button"
					tabindex="0"
				>
					<ProductCard {selected} {productInfo}></ProductCard>
				</div>
			{/each}
		</div>
	</div>

	<!-- Search and canvas -->
	<div class="flex h-full w-full flex-col items-center">
		<div class="min-w absolute z-20 m-4 flex items-center justify-end">
			<Icon class="absolute mr-5" height="22px" icon="line-md:search"></Icon>
			<!-- svelte-ignore a11y-autofocus -->
			<input
				type="text"
				placeholder="Find your product"
				class="input min-w-80 rounded-full shadow-sm hover:shadow-xl focus:outline-none"
				bind:value={searchInput}
				on:keydown={searchSubmit}
				autofocus
			/>
		</div>
		<div class="relative w-full grow">
			<ThreeMap {selectedProduct}></ThreeMap>
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
