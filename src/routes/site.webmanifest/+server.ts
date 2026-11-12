import { createManifestHandler } from 'yaxa-svelte/seo';
import { siteConfig } from '#lib/site.config.js';

export const GET = createManifestHandler({
	config: siteConfig
});
