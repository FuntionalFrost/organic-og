<script lang="ts">
	import './layout.css';
	import { YaxaApp, Footer } from 'yaxa-svelte';
	import { siteConfig } from '$lib/site.config';

	let { children } = $props();
</script>

<YaxaApp config={siteConfig}>
	<div class="flex min-h-screen flex-col">
		<div class="flex-1">
			{@render children()}
		</div>
		<Footer />
	</div>
</YaxaApp>
