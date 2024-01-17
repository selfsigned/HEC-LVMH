<script>
	import Icon from '@iconify/svelte';
	import ThreeMap from '$lib/3dmap/map.svelte';

	let viewMode = 'Trending';
</script>

<div class="flex h-full overflow-hidden">
	<!-- Product sidebar -->
	<div class="z-20 flex h-full min-w-72 flex-col items-center rounded-r-xl bg-base-200 shadow-sm">
		<!-- Sidebar label -->
		<div class="mb-4 mt-6 flex flex-row">
			<h2 class="text-md text-xl">
				{viewMode}
			</h2>
			{#if viewMode == 'Trending'}
				<Icon class="" height="28px" icon="mdi:fire"></Icon>
			{/if}
		</div>

		<!-- Product list -->
		<div></div>
	</div>

	<!-- Search and canvas -->
	<div class="z-20 flex h-full w-full flex-col items-center">
		<div class="min-w absolute m-4 flex items-center justify-end">
			<Icon class="absolute mr-5" height="22px" icon="line-md:search"></Icon>
			<input
				type="text"
				placeholder=" Search your product"
				class="input min-w-80 rounded-full shadow-sm hover:shadow-xl focus:outline-none"
			/>
		</div>
		<div class="w-full grow">
			<ThreeMap></ThreeMap>
		</div>
	</div>
</div>
