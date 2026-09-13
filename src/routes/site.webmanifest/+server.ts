import { createManifestHandler } from 'yaxa-svelte';
import { siteConfig } from '$lib/site.config';

export const GET = createManifestHandler({
	config: siteConfig
});
