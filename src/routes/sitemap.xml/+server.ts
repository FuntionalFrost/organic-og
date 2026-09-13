import { createSitemapHandler } from 'yaxa-svelte';
import { siteConfig } from '$lib/site.config';

export const GET = createSitemapHandler({
	config: siteConfig,
	dynamicRoutes: () => [
		{
			loc: '/',
			priority: 1.0,
			changefreq: 'daily',
			lastmod: new Date().toISOString().split('T')[0]
		},
		{
			loc: '/privacy',
			priority: 0.3,
			changefreq: 'monthly',
			lastmod: new Date().toISOString().split('T')[0]
		},
		{
			loc: '/terms',
			priority: 0.3,
			changefreq: 'monthly',
			lastmod: new Date().toISOString().split('T')[0]
		},
		{
			loc: '/refunds',
			priority: 0.3,
			changefreq: 'monthly',
			lastmod: new Date().toISOString().split('T')[0]
		},
		{
			loc: '/impressum',
			priority: 0.3,
			changefreq: 'monthly',
			lastmod: new Date().toISOString().split('T')[0]
		}
	]
});
