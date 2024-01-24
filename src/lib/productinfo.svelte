<script>
	import { itemData } from '$lib/appstore.js';
	import Booking from '$lib/booking/booking.svelte';

	export let id; // ID of the product to display infos of

	const sephoraProductUrl = 'https://www.sephora.fr/p/';
</script>

{#if id in $itemData}
	{#if $itemData[id].categories.includes('product')}
		<iframe class="h-full w-full" title="Sephora website" src={sephoraProductUrl + id + '.html'} />
	{:else}
		<Booking {id} />
	{/if}
{:else}
	<p>Error: {id} does not exist</p>
{/if}
