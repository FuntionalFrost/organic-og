import { createSitemapXslHandler } from 'yaxa-svelte/seo';
import { siteConfig } from '#lib/site.config.js';

export const GET = createSitemapXslHandler({
	config: siteConfig
});
