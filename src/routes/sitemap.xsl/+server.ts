import { createSitemapXslHandler } from 'yaxa-svelte';
import { siteConfig } from '#lib/site.config.js';

export const GET = createSitemapXslHandler({
	config: siteConfig
});
