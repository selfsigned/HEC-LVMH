<script>
	export let productInfo;
	export let selected = false;
</script>

<div class="card card-side {selected ? 'bg-base-200 shadow-xl' : 'bg-base-100 shadow-md'}">
	<figure>
		<!-- TODO better pic display / aspect ratio control -->
		<img src={productInfo.picURL} class="ml-2 h-20 w-20" alt="Product" />
	</figure>
	<div class="card-body">
		<h2 class="card-title">{productInfo.name}</h2>
		<h3 class="-mt-3 text-sm italic">{productInfo.category}</h3>
		<!-- TODO lookup shelf name -->
		<div class="flex">
			{#if productInfo.shelf !== false}
				<div class="h-4 w-4 rounded-full bg-success font-mono">
					<div class="ml-5 text-sm">ID:{productInfo.shelf}</div>
				</div>
			{:else}
				<div class="h-4 w-4 rounded-full bg-error font-light">
					<div class="ml-5 text-sm">Unavailable</div>
				</div>
			{/if}
		</div>
	</div>
</div>
