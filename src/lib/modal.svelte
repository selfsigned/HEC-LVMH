<script>
	export let id;
	export let title = null;
	export let openModal = false;
	export let closeCallBack = null;

	function closeModalEvent(e) {
		if (typeof closeCallBack === 'function') {
			closeCallBack();
		}
		openModal = false;
	}
</script>

<dialog {id} class="modal" class:modal-open={openModal}>
	<div class="modal-box modal-open h-5/6 w-11/12 max-w-screen-xl">
		<form method="dialog">
			<button
				on:click={closeModalEvent}
				class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button
			>
		</form>
		{#if title != null}
			<h3 class="text-lg font-bold">{title}</h3>
		{/if}
		<slot />
	</div>
	<form method="dialog" class="modal-backdrop">
		<button on:click={closeModalEvent}>close</button>
	</form>
</dialog>
