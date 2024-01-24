<script>
	import { base } from '$app/paths';
	import Logo from '$lib/logo.svelte';
</script>

<div class="flex h-[calc(100dvh)] flex-col bg-base-100 bg-gradient-to-r to-base-300">
	<h2 class="text-bold m-5 flex text-xl">
		<Logo class="-mt-1" />store<span class="font-thin">companion</span>
	</h2>
	<div class="hero flex-1">
		<div class="hero-content text-center">
			<div class="max-w-md">
				<h1
					class="text-bold bg-gradient-to-r from-primary via-secondary to-primary-content bg-clip-text text-6xl text-transparent"
				>
					Your Store,<br />Your World
				</h1>
				<p class="py-6">
					Unlock a new era of personalized shopping with storecompanion - Create your store's
					digital twin to make finding items yesterday's problem and get customer hooked.
				</p>
				<div>
					<a class="btn mr-2" href="mailto:sales@storecompanion.xyz">Contact Us</a>
					<a class="btn btn-primary" href="{base}/app">Try it now</a>
				</div>
			</div>
		</div>
	</div>
</div>
