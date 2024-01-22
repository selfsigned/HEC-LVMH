<script>
	import { itemData } from '$lib/appstore.js';

	export let id; // ID of the product to display infos of

	const sephoraProductUrl = 'https://www.sephora.fr/p/';
</script>

{#if id in $itemData}
	<iframe class="h-full w-full" title="Sephora website" src={sephoraProductUrl + id + '.html'} />
{:else}
	<p>Error: {id} does not exist</p>
{/if}
