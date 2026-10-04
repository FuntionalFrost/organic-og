import { defineSiteConfig } from 'yaxa-svelte';

export const siteConfig = defineSiteConfig({
	name: 'Organic-OG',
	title: 'Organic-OG — Instant Dynamic Social Cards & OpenGraph Images',
	description:
		'High-performance dynamic OpenGraph image generator built with SvelteKit, Native SVG, and Rust-powered Resvg. 9 responsive templates, HMAC URL signing, API key management, and real-time analytics with Zero WASM. 100% Free & Open Source.',
	url: 'https://organic-og.vercel.app',
	version: '2.0.0',
	defaultLocale: 'en',
	logo: '/favicon.svg',
	project: {
		license: 'MIT',
		licenseUrl: 'https://github.com/FuntionalFrost/organic-og/blob/main/LICENSE',
		type: 'open-source',
		pricingModel: 'free',
		repositoryUrl: 'https://github.com/FuntionalFrost/organic-og',
		isAccessibleForFree: true,
		badge: 'MIT Open Source'
	},
	author: {
		name: 'Organic-OG Contributors',
		url: 'https://organic-og.vercel.app',
		github: 'https://github.com/FuntionalFrost'
	},
	company: {
		legalName: 'Organic-OG FOSS Project',
		contactEmail: 'devfrost@protonmail.com'
	},
	legal: {
		dpoEmail: 'devfrost@protonmail.com',
		links: {
			privacy: '/privacy',
			terms: '/terms',
			impressum: '/impressum'
		}
	},
	theme: {
		primaryColor: '#f97316',
		neutralColor: '#0a0a0a',
		defaultMode: 'dark'
	},
	seo: {
		titleTemplate: '%s · Organic-OG',
		defaultOgImage:
			'/api/og?template=saas&theme=brand&title=Organic-OG&description=Instant+Dynamic+Social+Cards+%26+OpenGraph+Images&badge=v1.3+Live',
		twitterCard: 'summary_large_image',
		keywords: [
			'OpenGraph generator',
			'dynamic OG images',
			'SvelteKit OG',
			'Zero-WASM',
			'Resvg',
			'social cards',
			'Twitter cards',
			'meta tags generator',
			'social preview generator',
			'developer tools',
			'SVG to PNG',
			'edge rendering',
			'yaxa-svelte',
			'automated OG image API'
		],
		robots: {
			index: true,
			follow: true
		}
	},
	sitemap: {
		changefreq: 'daily',
		priority: 1.0,
		exclude: ['/api/keys/*', '/api/sign', '/api/analytics']
	},
	robots: {
		rules: [
			{
				userAgent: '*',
				allow: [
					'/',
					'/privacy',
					'/terms',
					'/impressum',
					'/api/og',
					'/sitemap.xml',
					'/sitemap.xsl',
					'/site.webmanifest'
				],
				disallow: ['/api/keys', '/api/sign', '/api/analytics']
			}
		]
	},
	nav: [
		{ label: 'Studio', href: '/#studio' },
		{ label: 'API Keys', href: '/#keys' },
		{ label: 'Analytics', href: '/#analytics' },
		{ label: 'Docs', href: '/#docs' }
	],
	socials: {
		github: 'https://github.com/FuntionalFrost'
	}
});
