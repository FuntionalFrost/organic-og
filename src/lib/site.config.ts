import { defineSiteConfig } from 'yaxa-svelte';

export const siteConfig = defineSiteConfig({
	name: 'OG Engine',
	title: 'OG Engine — Instant Dynamic Social Cards & OpenGraph Images',
	description:
		'High-performance dynamic OpenGraph image generator built with SvelteKit, Satori, and Edge Functions. 5 responsive templates, HMAC URL signing, API key management, and real-time analytics.',
	url: 'https://ogengine.dev',
	version: '1.2.0',
	defaultLocale: 'en',
	logo: '/favicon.svg',
	author: {
		name: 'OG Engine',
		url: 'https://ogengine.dev',
		twitter: '@ogengine',
		github: 'https://github.com'
	},
	company: {
		legalName: 'OG Engine',
		country: 'US',
		contactEmail: 'devfrost@protonmail.com'
	},
	legal: {
		paymentProcessor: 'polar',
		governingLaw: 'Delaware, USA',
		refundDays: 14,
		dpoEmail: 'devfrost@protonmail.com',
		links: {
			privacy: '/privacy',
			terms: '/terms',
			refunds: '/refunds',
			impressum: '/impressum'
		}
	},
	theme: {
		primaryColor: '#f97316',
		neutralColor: '#0a0a0a',
		defaultMode: 'dark'
	},
	seo: {
		titleTemplate: '%s · OG Engine',
		defaultOgImage:
			'/api/og?template=saas&title=OG+Engine&description=Automated+Social+Cards+at+the+Edge&badge=v1.2+Live',
		twitterCard: 'summary_large_image',
		keywords: [
			'OpenGraph generator',
			'dynamic OG images',
			'SvelteKit OG',
			'Satori',
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
		exclude: [
			'/api/keys/*',
			'/api/checkout/*',
			'/api/sign',
			'/api/analytics',
			'/api/webhooks/*',
			'/api/auth/*'
		]
	},
	robots: {
		rules: [
			{
				userAgent: '*',
				allow: [
					'/',
					'/#studio',
					'/#keys',
					'/#docs',
					'/#analytics',
					'/privacy',
					'/terms',
					'/refunds',
					'/impressum',
					'/api/og',
					'/sitemap.xml',
					'/sitemap.xsl',
					'/site.webmanifest'
				],
				disallow: [
					'/api/keys',
					'/api/checkout',
					'/api/sign',
					'/api/analytics',
					'/api/webhooks',
					'/api/auth'
				]
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
		github: 'https://github.com',
		twitter: 'https://x.com/ogengine'
	}
});
