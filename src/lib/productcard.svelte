<script>
	import { itemData, shelfData, productInfoModal } from '$lib/appstore.js';
	export let id;
	export let selected = false;
	export let enableInfoBtn = false;

	let itemInfo = $itemData[id];

	function setInfoModal(e, id) {
		productInfoModal.set(id);
	}
</script>

<div class="card card-side w-72 {selected ? 'bg-base-200 shadow-xl' : 'bg-base-100 shadow-md'}">
	<figure class="outline-4 outline-red-800">
		<!-- TODO better pic display / aspect ratio control -->
		<img src={itemInfo.picURL} class="mask mask-squircle ml-2 h-20 w-20" alt="Product" />
	</figure>
	<div class="card-body">
		<h2 class="font card-title font-bold">{itemInfo.name}</h2>
		<h3 class="-mt-1 text-sm font-light italic">{itemInfo.category}</h3>
		<div class="flex flex-row">
			{#if itemInfo.shelf != null && itemInfo.shelf in $shelfData}
				<div class="h-4 w-4 rounded-full bg-success"></div>
				<div class="ml-1 text-sm">{$shelfData[itemInfo.shelf].name}</div>
			{:else}
				<div class="h-4 w-4 rounded-full bg-warning font-light"></div>
				<div class="ml-1 text-sm">Online</div>
			{/if}
		</div>
		{#if enableInfoBtn}
			<btn
				class="btn"
				on:click={setInfoModal(Event, id)}
				on:keypress={setInfoModal(Event, id)}
				tabindex="0"
				role="button">More info</btn
			>
		{/if}
	</div>
</div>
