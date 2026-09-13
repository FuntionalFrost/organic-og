import { createSitemapHandler } from 'yaxa-svelte';
import { siteConfig } from '$lib/site.config';

export const GET = createSitemapHandler({
	config: siteConfig,
	dynamicRoutes: () => {
		const today = new Date().toISOString().split('T')[0];
		const legalEntries = Object.values(siteConfig.legal?.links || {}).map((path) => ({
			loc: path,
			priority: 0.4,
			changefreq: 'monthly' as const,
			lastmod: today
		}));

		return [
			{
				loc: '/',
				priority: 1.0,
				changefreq: 'daily' as const,
				lastmod: today
			},
			...legalEntries
		];
	}
});
