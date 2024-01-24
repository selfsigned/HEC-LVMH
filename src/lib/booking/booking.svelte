<script>
	import { itemData } from '$lib/appstore.js';
	import Bookingscreen from '$lib/booking/bookingscreen.svelte';
	import QRcode from '$lib/qrcode.svelte';

	export function* range(start, end, step = 1) {
		for (let i = start; i <= end; i += step) {
			yield i;
		}
	}

	const openHour = 10;
	const closeHour = 21;
	const confirmQRtext = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

	export let id;

	let selectedHour = null;
	function selectHour(e, hour) {
		selectedHour = hour;
		console.log(hour);
	}

	let date = new Date();
	$: serviceData = $itemData[id];
</script>

{#if id in $itemData}
	{#if selectedHour === null}
		<!-- Hour select screen -->
		<Bookingscreen hourMode={true} {serviceData} {date}>
			<div class="flex flex-wrap gap-2 align-middle">
				<!-- Fake available hours -->
				{#each range(openHour, closeHour, 1) as currHour}
					<div
						class="btn min-w-20 shadow-sm"
						on:click={() => selectHour(Event, currHour)}
						on:keypress={() => selectHour(Event, currHour)}
						role="button"
						tabindex="0"
					>
						{currHour}h
					</div>
				{/each}
			</div>
		</Bookingscreen>
	{:else}
		<!-- Finish booking on app screen -->
		<Bookingscreen confirmMode={true} {serviceData} {date}>
			<h2 class="font-light">Scan to confirm your appointment</h2>
			<QRcode text={confirmQRtext}></QRcode>
		</Bookingscreen>
	{/if}
{:else}
	<p>Error: {id} does not exist</p>
{/if}
