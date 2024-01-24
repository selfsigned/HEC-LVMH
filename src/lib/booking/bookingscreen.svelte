<script>
	import Icon from '@iconify/svelte';

	const hideClass = 'opacity-60';

	export let serviceData;
	export let date;
	export let dayMode = false;
	export let hourMode = false;
	export let confirmMode = false;
</script>

<div class="flex w-full flex-col items-center align-middle">
	<h1 class="mb-6 text-xl sm:text-2xl">
		Your {serviceData.name} apointment
	</h1>
	<div class="text-md breadcrumbs mb-8 rounded-full px-6 shadow-xl outline outline-2">
		<ul>
			<li class={dayMode ? 'underline' : hideClass}>
				<Icon icon="mdi:calendar"></Icon>{date.toLocaleString('en-us', {
					weekday: 'short'
				})}.{date.getDate()}
			</li>
			<li class={hourMode ? 'underline' : hideClass}><Icon icon="mdi:clock"></Icon>Hour</li>
			<li class={confirmMode ? 'underline' : hideClass}>
				<Icon icon="mdi:check-bold"></Icon>Finish
			</li>
		</ul>
	</div>
	<slot />
</div>
