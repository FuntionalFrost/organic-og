import { createRobotsHandler } from 'yaxa-svelte/seo';
import { siteConfig } from '#lib/site.config.js';

export const GET = createRobotsHandler({
	config: siteConfig,
	isProduction: true
});
