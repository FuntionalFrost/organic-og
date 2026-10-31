import { describe, it, expect } from 'vitest';
import {
	getActiveParams,
	generateCurlSnippet,
	generateTypeScriptSnippet,
	generateNextJsSnippet,
	generatePythonSnippet,
	generateSvelteKitSnippet,
	generateMarkdownSnippet
} from '#lib/utils/snippets.js';
import type { StudioState } from '#lib/types/dashboard.js';

describe('Developer Integration Snippets Generator', () => {
	const mockStudioState: StudioState = {
		title: 'Automate OpenGraph Images',
		description: 'Generate dynamic social assets in milliseconds',
		siteName: 'organic-og.vercel.app',
		badge: 'Production Ready',
		logoUrl: 'https://avatars.githubusercontent.com/u/28706372?v=4',
		theme: 'brand',
		template: 'saas',
		format: 'png',
		pattern: 'dots',
		font: 'inter',
		price: '$199',
		rating: '5.0 ★★★★★',
		stars: '14.2k',
		forks: '1.2k',
		language: 'TypeScript',
		episode: 'EPISODE #42',
		host: 'Rich Harris',
		guest: 'Evan You',
		duration: '52 MIN',
		eventDate: 'OCTOBER 15, 2026',
		location: 'San Francisco, CA',
		speaker: 'Keynote Speaker',
		author: 'Guillermo Rauch',
		handle: '@rauchg',
		role: 'CEO at Vercel',
		version: 'v2.4.0',
		items: 'Zero-WASM SVG | Resvg Engine | Redis Cache'
	};

	const apiKey = 'og_live_abcdef123456';
	const baseUrl = 'https://organic-og.vercel.app';
	const signedPreviewUrl = '/api/og?template=saas&title=Test&s=4f8b92a1c0d3e5f7';

	it('extracts active query parameters based on template layout', () => {
		const params = getActiveParams(mockStudioState);
		expect(params.template).toBe('saas');
		expect(params.title).toBe('Automate OpenGraph Images');
		expect(params.pattern).toBe('dots');
		expect(params.badge).toBe('Production Ready');
	});

	it('generates valid cURL integration snippet', () => {
		const curl = generateCurlSnippet(mockStudioState, apiKey, baseUrl);
		expect(curl).toContain('curl -X GET');
		expect(curl).toContain(`Authorization: Bearer ${apiKey}`);
		expect(curl).toContain('--output og-image.png');
	});

	it('generates valid TypeScript/Node fetch integration snippet', () => {
		const ts = generateTypeScriptSnippet(mockStudioState, apiKey, baseUrl);
		expect(ts).toContain("import fs from 'node:fs';");
		expect(ts).toContain('fetch(');
		expect(ts).toContain(`Authorization: 'Bearer ${apiKey}'`);
		expect(ts).toContain('og-card.png');
	});

	it('generates Next.js App Router metadata snippet', () => {
		const nextjs = generateNextJsSnippet(signedPreviewUrl, baseUrl);
		expect(nextjs).toContain("import type { Metadata } from 'next';");
		expect(nextjs).toContain(`images: ['${baseUrl}${signedPreviewUrl}']`);
		expect(nextjs).toContain('summary_large_image');
	});

	it('generates Python requests snippet', () => {
		const py = generatePythonSnippet(mockStudioState, apiKey, baseUrl);
		expect(py).toContain('import requests');
		expect(py).toContain(`url = "${baseUrl}/api/og"`);
		expect(py).toContain(`"Authorization": "Bearer ${apiKey}"`);
		expect(py).toContain('og_image.png');
	});

	it('generates SvelteKit <svelte:head> meta tags', () => {
		const svelte = generateSvelteKitSnippet(signedPreviewUrl, baseUrl);
		expect(svelte).toContain('<svelte:head>');
		expect(svelte).toContain(
			`<meta property="og:image" content="${baseUrl}${signedPreviewUrl}" />`
		);
		expect(svelte).toContain('<meta name="twitter:card" content="summary_large_image" />');
	});

	it('generates Markdown image embed tag', () => {
		const md = generateMarkdownSnippet(signedPreviewUrl, baseUrl, 'My Card');
		expect(md).toBe(`![My Card](${baseUrl}${signedPreviewUrl})`);
	});
});
