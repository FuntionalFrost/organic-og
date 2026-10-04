// src/lib/utils/snippets.ts
import type { StudioState } from '../types/dashboard';

export function getActiveParams(state: StudioState): Record<string, string> {
	const params: Record<string, string> = {
		template: state.template,
		theme: state.theme,
		title: state.title
	};

	if (state.format && state.format === 'svg') {
		params.format = 'svg';
	}

	if (state.pattern && state.pattern !== 'none') {
		params.pattern = state.pattern;
	}

	if (state.font && state.font !== 'inter') {
		params.font = state.font;
	}

	if (state.bg) params.bg = state.bg;
	if (state.accent) params.accent = state.accent;
	if (state.textColor) params.textColor = state.textColor;

	if (state.template === 'minimal') {
		if (state.description) params.description = state.description;
		return params;
	}

	if (state.template === 'saas' || state.template === 'blog') {
		if (state.description) params.description = state.description;
		if (state.siteName) params.siteName = state.siteName;
		if (state.badge) params.badge = state.badge;
		if (state.logoUrl) params.logoUrl = state.logoUrl;
		return params;
	}

	if (state.template === 'ecommerce') {
		if (state.siteName) params.siteName = state.siteName;
		if (state.badge) params.badge = state.badge;
		if (state.price) params.price = state.price;
		if (state.rating) params.rating = state.rating;
		return params;
	}

	if (state.template === 'github') {
		if (state.siteName) params.siteName = state.siteName;
		if (state.stars) params.stars = state.stars;
		if (state.forks) params.forks = state.forks;
		if (state.language) params.language = state.language;
		return params;
	}

	if (state.template === 'podcast') {
		if (state.siteName) params.siteName = state.siteName;
		if (state.episode) params.episode = state.episode;
		if (state.host) params.host = state.host;
		if (state.guest) params.guest = state.guest;
		if (state.duration) params.duration = state.duration;
		if (state.logoUrl) params.logoUrl = state.logoUrl;
		return params;
	}

	if (state.template === 'event') {
		if (state.siteName) params.siteName = state.siteName;
		if (state.eventDate) params.eventDate = state.eventDate;
		if (state.location) params.location = state.location;
		if (state.speaker) params.speaker = state.speaker;
		if (state.logoUrl) params.logoUrl = state.logoUrl;
		return params;
	}

	if (state.template === 'quote') {
		if (state.author) params.author = state.author;
		if (state.handle) params.handle = state.handle;
		if (state.role) params.role = state.role;
		if (state.logoUrl) params.logoUrl = state.logoUrl;
		return params;
	}

	if (state.template === 'changelog') {
		if (state.siteName) params.siteName = state.siteName;
		if (state.version) params.version = state.version;
		if (state.items) params.items = state.items;
		if (state.logoUrl) params.logoUrl = state.logoUrl;
		return params;
	}

	return params;
}

export function generateCurlSnippet(state: StudioState, apiKey: string, baseUrl: string): string {
	const params = getActiveParams(state);
	const queryString = new URLSearchParams(params).toString();
	const outputFile = state.format === 'svg' ? 'og-image.svg' : 'og-image.png';
	return `curl -X GET "${baseUrl}/api/og?${queryString}" \\
  -H "Authorization: Bearer ${apiKey}" \\
  --output ${outputFile}`;
}

export function generateTypeScriptSnippet(
	state: StudioState,
	apiKey: string,
	baseUrl: string
): string {
	const params = getActiveParams(state);
	const outputFile = state.format === 'svg' ? 'og-card.svg' : 'og-card.png';
	return `import fs from 'node:fs';

const response = await fetch("${baseUrl}/api/og?${new URLSearchParams(params).toString()}", {
  headers: {
    Authorization: 'Bearer ${apiKey}'
  }
});

const buffer = await response.arrayBuffer();
fs.writeFileSync('${outputFile}', Buffer.from(buffer));`;
}

export function generateNextJsSnippet(signedPreviewUrl: string, baseUrl: string): string {
	return `// Next.js 14/15 App Router - app/layout.tsx or app/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Awesome Page',
  openGraph: {
    title: 'My Awesome Page',
    images: ['${baseUrl}${signedPreviewUrl}'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['${baseUrl}${signedPreviewUrl}'],
  },
};`;
}

export function generatePythonSnippet(state: StudioState, apiKey: string, baseUrl: string): string {
	const params = getActiveParams(state);
	const formattedParams = JSON.stringify(params, null, 4).replace(/^/gm, '    ').trimStart();
	const outputFile = state.format === 'svg' ? 'og_image.svg' : 'og_image.png';

	return `import requests

url = "${baseUrl}/api/og"
params = ${formattedParams}
headers = {"Authorization": "Bearer ${apiKey}"}

res = requests.get(url, params=params, headers=headers)
with open("${outputFile}", "wb") as f:
    f.write(res.content)`;
}

export function generateSvelteKitSnippet(signedPreviewUrl: string, baseUrl: string): string {
	return `<!-- Place in your SvelteKit +page.svelte or +layout.svelte -->
<svelte:head>
  <title>My Page Title</title>
  <meta property="og:title" content="My Page Title" />
  <meta property="og:image" content="${baseUrl}${signedPreviewUrl}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="${baseUrl}${signedPreviewUrl}" />
</svelte:head>`;
}

export function generateMarkdownSnippet(
	signedPreviewUrl: string,
	baseUrl: string,
	title = 'OpenGraph Card'
): string {
	return `![${title}](${baseUrl}${signedPreviewUrl})`;
}
