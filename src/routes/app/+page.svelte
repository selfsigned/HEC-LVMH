<script>
	import Icon from '@iconify/svelte';
	import ThreeMap from '$lib/3dmap/map.svelte';
	import Productcard from '$lib/productcard.svelte';
	export let data;

	// Mock data
	let trendingProducts = data.products; // No need to bother with a separate list for now

	// Search
	let searchProducts;
	let searchInput = '';
	$: if (searchInput.length > 0) {
		// TODO filter on brand || category?
		searchProducts = trendingProducts.filter((product) =>
			product.name.toUpperCase().includes(searchInput.toUpperCase())
		);
	}

	// Selection
	let selectedProduct = null;
	function selectProductEvent(e, product) {
		selectedProduct = product;
	}

	// Viewmode
	let viewMode;
	$: viewMode = searchInput.length === 0 ? 'Trending' : 'Results';
</script>

<div class="flex h-full overflow-hidden">
	<!-- Product sidebar -->
	<div class="z-20 flex h-full min-w-72 flex-col items-center rounded-r-xl bg-base-200 shadow-sm">
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
					<Productcard {selected} {productInfo}></Productcard>
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
				placeholder=" Search your product"
				class="input min-w-80 rounded-full shadow-sm hover:shadow-xl focus:outline-none"
				bind:value={searchInput}
				autofocus
			/>
		</div>
		<div class="relative w-full grow">
			<ThreeMap {selectedProduct} shelfData={data.shelves}></ThreeMap>
		</div>
	</div>
</div>