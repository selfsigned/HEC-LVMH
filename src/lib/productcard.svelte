<script>
	import { shelfData, productInfoModal } from '$lib/appstore.js';
	export let productInfo;
	export let selected = false;
	export let enableInfoBtn = false;

	function setInfoModal(e, id) {
		productInfoModal.set(id);
		console.log($productInfoModal);
	}
</script>

<div class="card card-side w-72 {selected ? 'bg-base-200 shadow-xl' : 'bg-base-100 shadow-md'}">
	<figure class="outline-4 outline-red-800">
		<!-- TODO better pic display / aspect ratio control -->
		<img src={productInfo.picURL} class="mask mask-squircle ml-2 h-20 w-20" alt="Product" />
	</figure>
	<div class="card-body">
		<h2 class="font card-title font-bold">{productInfo.name}</h2>
		<h3 class="-mt-1 text-sm font-light italic">{productInfo.category}</h3>
		<div class="flex flex-row">
			{#if productInfo.shelf != null && productInfo.shelf in $shelfData}
				<div class="h-4 w-4 rounded-full bg-success"></div>
				<div class="ml-1 text-sm">{$shelfData[productInfo.shelf].name}</div>
			{:else}
				<div class="h-4 w-4 rounded-full bg-warning font-light"></div>
				<div class="ml-1 text-sm">Online</div>
			{/if}
		</div>
		{#if enableInfoBtn}
			<btn
				class="btn"
				on:click={setInfoModal(Event, productInfo.id)}
				on:keypress={setInfoModal(Event, productInfo.id)}
				tabindex="0"
				role="button">More info</btn
			>
		{/if}
	</div>
</div>
