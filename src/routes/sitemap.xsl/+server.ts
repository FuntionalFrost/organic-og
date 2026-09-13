import { createSitemapXslHandler } from 'yaxa-svelte';
import { siteConfig } from '$lib/site.config';

export const GET = createSitemapXslHandler({
	config: siteConfig
});
