import type { PageServerLoad } from './$types';
import { desc, eq, sql } from 'drizzle-orm';
import { ORIGIN, PUBLIC_APP_URL, PUBLIC_BASE_URL, OG_SIGNING_SECRET } from '$app/env/private';

import { definePageSeo, generateOrganizationSchema, generateWebSiteSchema } from 'yaxa-svelte';

import { db } from '#lib/server/db/index.js';
import { apiKeys, renderLogs } from '#lib/server/db/schema.js';
import { createCanonicalQueryString, generateHmacSignature } from '#lib/server/og/security.js';
import { siteConfig } from '#lib/site.config.js';

export const load: PageServerLoad = async ({ url }) => {
	const baseUrl = (ORIGIN || PUBLIC_APP_URL || PUBLIC_BASE_URL || url.origin).replace(/\/+$/, '');

	// 1. Compute default root signed OG URL
	const defaultOgParams = {
		badge: 'v1.0 Live',
		description:
			'High-performance OpenGraph image generator built with SvelteKit, Native SVG, and Edge Functions.',
		siteName: 'organic-og.vercel.app',
		template: 'saas',
		theme: 'brand',
		title: 'Organic-OG — Automated Social Cards at the Edge'
	};

	const secret =
		OG_SIGNING_SECRET ||
		process.env.OG_SIGNING_SECRET ||
		(process.env.NODE_ENV !== 'production' ? 'fallback-secret-key-32-chars-min' : '');
	let defaultOgUrl: string;
	if (secret) {
		const canonical = createCanonicalQueryString(defaultOgParams);
		const signature = await generateHmacSignature(canonical, secret);
		defaultOgUrl = `/api/og?${canonical}&s=${signature}`;
	} else {
		defaultOgUrl = `/api/og?${new URLSearchParams(defaultOgParams).toString()}`;
	}

	// 2. Structured SEO metadata for page & JSON-LD
	const seo = definePageSeo({
		title: 'Organic-OG — Instant OpenGraph & Social Banner Generator',
		description:
			'Generate dynamic, branded OpenGraph images on edge runtimes in under 10ms with SvelteKit, Native SVG, and Resvg (Zero-WASM).',
		ogImage: defaultOgUrl,
		twitterCard: 'summary_large_image',
		schema: [generateOrganizationSchema(siteConfig), generateWebSiteSchema(siteConfig)]
	});

	// 3. Fetch API keys
	const keysList = await db
		.select({
			id: apiKeys.id,
			name: apiKeys.name,
			prefix: apiKeys.prefix,
			creditsRemaining: apiKeys.creditsRemaining,
			totalRenders: apiKeys.totalRenders,
			isActive: apiKeys.isActive,
			createdAt: apiKeys.createdAt
		})
		.from(apiKeys)
		.orderBy(desc(apiKeys.createdAt));

	// 4. Fetch analytics telemetry
	const [activeKeysCount] = await db.select({ count: sql<number>`count(*)` }).from(apiKeys);

	const [totalLogsCount] = await db.select({ count: sql<number>`count(*)` }).from(renderLogs);
	const [cacheHitsCount] = await db
		.select({ count: sql<number>`count(*)` })
		.from(renderLogs)
		.where(eq(renderLogs.isCacheHit, true));
	const templateBreakdown = await db
		.select({ template: renderLogs.template, count: sql<number>`count(*)` })
		.from(renderLogs)
		.groupBy(renderLogs.template);

	const recentLogs = await db
		.select({
			id: renderLogs.id,
			template: renderLogs.template,
			isCacheHit: renderLogs.isCacheHit,
			createdAt: renderLogs.createdAt,
			keyName: apiKeys.name,
			keyPrefix: apiKeys.prefix
		})
		.from(renderLogs)
		.leftJoin(apiKeys, eq(renderLogs.apiKeyId, apiKeys.id))
		.orderBy(desc(renderLogs.createdAt))
		.limit(15);

	const totalRenders = totalLogsCount?.count || 0;
	const cacheHits = cacheHitsCount?.count || 0;
	const cacheHitRate = totalRenders > 0 ? Math.round((cacheHits / totalRenders) * 100) : 0;

	const analyticsData = {
		metrics: {
			totalRenders,
			cacheHits,
			cacheHitRate,
			activeKeys: activeKeysCount?.count || 0
		},
		templateBreakdown,
		recentLogs
	};

	return {
		keys: keysList,
		analytics: analyticsData,
		defaultOgUrl,
		baseUrl,
		seo
	};
};
