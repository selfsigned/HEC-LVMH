<script>
	export let productInfo;
	export let selected = false;
</script>

<div class="card card-side {selected ? 'bg-base-200 shadow-xl' : 'bg-base-100 shadow-md'}">
	<figure class="outline-4 outline-red-800">
		<!-- TODO better pic display / aspect ratio control -->
		<img src={productInfo.picURL} class="mask mask-squircle ml-2 h-20 w-20" alt="Product" />
	</figure>
	<div class="card-body">
		<h2 class="card-title">{productInfo.name}</h2>
		<h3 class="-mt-3 text-sm italic">{productInfo.category}</h3>
		<div class="flex">
			{#if productInfo.shelf != null}
				<div class="h-4 w-4 rounded-full bg-success font-mono">
					<!-- TODO lookup shelf name -->
					<div class="ml-5 text-sm">Shelf:{productInfo.shelf}</div>
				</div>
			{:else}
				<div class="h-4 w-4 rounded-full bg-warning font-light">
					<div class="ml-5 text-sm">Online</div>
				</div>
			{/if}
		</div>
	</div>
</div>
