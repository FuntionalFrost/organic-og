<script lang="ts">
	import './layout.css';
	import { YaxaApp, Seo, Favicons } from 'yaxa-svelte';
	import { siteConfig } from '$lib/site.config';
	import AppFooter from '$lib/components/AppFooter.svelte';

	let { children } = $props();

	const richSchemas = [
		{
			'@context': 'https://schema.org',
			'@type': 'WebApplication',
			name: siteConfig.name,
			url: siteConfig.url,
			description: siteConfig.description,
			applicationCategory: 'DeveloperApplication',
			operatingSystem: 'All',
			offers: {
				'@type': 'Offer',
				price: '0',
				priceCurrency: 'USD'
			},
			featureList: [
				'5 Responsive Templates (SaaS, Minimal, Blog, E-commerce, GitHub)',
				'HMAC-SHA256 URL Signing & Verification',
				'Sub-50ms Satori SVG to PNG Edge Rendering',
				'API Key Management and Usage Analytics',
				'Real-time Multi-Platform Preview (Twitter/X, Discord, Slack, WhatsApp, LinkedIn, iMessage)'
			]
		},
		{
			'@context': 'https://schema.org',
			'@type': 'Organization',
			name: siteConfig.name,
			url: siteConfig.url,
			logo: `${siteConfig.url}/favicon.svg`,
			sameAs: [siteConfig.socials?.twitter, siteConfig.socials?.github].filter(Boolean),
			contactPoint: {
				'@type': 'ContactPoint',
				email: siteConfig.company?.contactEmail || 'devfrost@protonmail.com',
				contactType: 'customer support'
			}
		}
	];
</script>

<Seo config={siteConfig} schema={richSchemas} />
<Favicons config={siteConfig} />

<YaxaApp config={siteConfig}>
	<div class="flex min-h-screen flex-col">
		<div class="flex-1">
			{@render children()}
		</div>
		<AppFooter />
	</div>
</YaxaApp>
