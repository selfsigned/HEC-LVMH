<script>
	import { productList, shelfList } from '$lib/appstore.js';

	export let id; // ID of the product to display infos of

	let productInfo = $productList.filter((product) => product.id == id)[0];
	const sephoraProductUrl = 'https://www.sephora.fr/p/';
</script>

{#if productInfo}
	<iframe class="h-full w-full" title="Sephora website" src={sephoraProductUrl + id + '.html'} />
{:else}
	<p>Error: {id} does not exist</p>
{/if}
