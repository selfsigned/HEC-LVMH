<script>
	import { itemData } from '$lib/appstore.js';

	export let id; // ID of the product to display infos of

	const sephoraProductUrl = 'https://www.sephora.fr/p/';
</script>

{#if id in $itemData}
	{#if $itemData[id].categories.includes('product')}
		<iframe class="h-full w-full" title="Sephora website" src={sephoraProductUrl + id + '.html'} />
	{:else}
		Imagine a super cool appointment booking page here please
	{/if}
{:else}
	<p>Error: {id} does not exist</p>
{/if}
