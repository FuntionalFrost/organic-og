<script lang="ts">
	import './layout.css';
	import {
		YaxaApp,
		Seo,
		Favicons,
		generateSoftwareApplicationSchema,
		generateOrganizationSchema,
		generateWebSiteSchema
	} from 'yaxa-svelte';
	import { siteConfig } from '$lib/site.config';
	import AppFooter from '$lib/components/AppFooter.svelte';

	let { children } = $props();

	const richSchemas = [
		generateSoftwareApplicationSchema(siteConfig),
		generateOrganizationSchema(siteConfig),
		generateWebSiteSchema(siteConfig)
	];
</script>

<svelte:head>
	<link rel="apple-touch-icon" sizes="180x180" href="/favicon.png" />
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="manifest" href="/site.webmanifest" />
	<meta name="application-name" content={siteConfig.name} />
	<meta name="apple-mobile-web-app-title" content={siteConfig.name} />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="mobile-web-app-capable" content="yes" />
</svelte:head>

<Seo config={siteConfig} schema={richSchemas} />
<Favicons config={siteConfig} />

<YaxaApp config={siteConfig}>
	<div class="flex min-h-screen flex-col">
		<div class="flex-1">
			{@render children()}
		</div>
		<AppFooter />
	</div>
</YaxaApp>
