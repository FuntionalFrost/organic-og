import { createRobotsHandler } from 'yaxa-svelte';
import { siteConfig } from '$lib/site.config';

export const GET = createRobotsHandler({
	config: siteConfig,
	isProduction: true
});
