<script>
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';

	export let text;
	export let errorCorrectionLevel = 'H';

	let canvas;

	onMount(() => {
		QRCode.toCanvas(canvas, text, { errorCorrectionLevel: { errorCorrectionLevel } });
	});
</script>

<canvas bind:this={canvas}></canvas>
