<script>
	import { itemData, shelfData, productInfoModal } from '$lib/appstore.js';
	export let id;
	export let selected = false;
	export let enableInfoBtn = false;

	$: itemInfo = $itemData[id];

	function setInfoModal(e, id) {
		productInfoModal.set(id);
	}
</script>

<div class="card card-side w-72 {selected ? 'bg-base-200 shadow-xl' : 'bg-base-100 shadow-md'}">
	<figure class="outline-4 outline-red-800">
		<img src={itemInfo.picURL} class="mask mask-squircle ml-2 h-20 w-20" alt="Product" />
	</figure>
	<div class="card-body">
		<h2 class="font text-md title font-bold">{itemInfo.name}</h2>
		<h3 class="-mt-1 text-sm font-light italic">{itemInfo.category}</h3>
		<div class="flex flex-row">
			{#if itemInfo.shelf != null && itemInfo.shelf in $shelfData}
				<div class="h-4 w-4 rounded-full bg-success"></div>
				<div class="-mt-[0.125rem] ml-1 text-sm">{$shelfData[itemInfo.shelf].name}</div>
			{:else}
				<div class="h-4 w-4 rounded-full bg-warning font-light"></div>
				<div class="-mt-[0.125rem] ml-1 text-sm">Click & Collect</div>
			{/if}
		</div>
		<!-- {#if itemInfo.promo > 0}
			<div class="text-error">
				-{itemInfo.promo}%
			</div>
		{/if} -->
		{#if enableInfoBtn}
			<btn
				class="btn"
				on:click={setInfoModal(Event, id)}
				on:keypress={setInfoModal(Event, id)}
				tabindex="0"
				role="button"
			>
				{#if itemInfo.categories.includes('service')}Book now
				{:else}More info
				{/if}
			</btn>
		{/if}
	</div>
</div>
