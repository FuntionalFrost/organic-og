import { createSitemapHandler } from 'yaxa-svelte';
import { siteConfig } from '$lib/site.config';

export const GET = createSitemapHandler({
	config: siteConfig,
	staticRoutes: ['/', '/privacy', '/terms', '/refunds', '/impressum']
});
