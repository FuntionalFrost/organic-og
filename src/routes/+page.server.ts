import type { PageServerLoad } from './$types';
import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { definePageSeo, generateOrganizationSchema, generateWebSiteSchema } from 'yaxa-svelte';
import { db } from '$lib/server/db';
import { apiKeys, purchases, renderLogs, user } from '$lib/server/db/schema';
import { createCanonicalQueryString, generateHmacSignature } from '$lib/server/og/security';
import { siteConfig } from '$lib/site.config';

export const load: PageServerLoad = async ({ locals, url }) => {
	const currentUser = locals.user;
	const baseUrl = (env.PUBLIC_BASE_URL || env.ORIGIN || url.origin).replace(/\/+$/, '');

	// 1. Compute default root signed OG URL
	const defaultOgParams = {
		badge: 'v1.0 Live',
		description:
			'High-performance OpenGraph image generator built with SvelteKit, Satori, and Edge Functions.',
		siteName: 'organic-og.netlify.app',
		template: 'saas',
		theme: 'brand',
		title: 'Organic-OG — Automated Social Cards at the Edge'
	};

	const secret =
		env.OG_SIGNING_SECRET ||
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
			'Generate dynamic, branded OpenGraph images on edge runtimes in under 10ms with SvelteKit, Satori, and Resvg.',
		ogImage: defaultOgUrl,
		twitterCard: 'summary_large_image',
		schema: [generateOrganizationSchema(siteConfig), generateWebSiteSchema(siteConfig)]
	});

	if (!currentUser) {
		return {
			user: null,
			keys: [],
			analytics: null,
			defaultOgUrl,
			baseUrl,
			seo
		};
	}

	// 3. Fetch user's credits and keys
	const [userRow] = await db
		.select({ creditsRemaining: user.creditsRemaining })
		.from(user)
		.where(eq(user.id, currentUser.id));

	const userCredits = userRow?.creditsRemaining ?? 10;

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
		.where(eq(apiKeys.userId, currentUser.id))
		.orderBy(desc(apiKeys.createdAt));

	const formattedKeys = keysList.map((k) => ({
		...k,
		creditsRemaining: userCredits
	}));

	// 4. Fetch analytics telemetry
	const keyIds = keysList.map((k) => k.id);

	const [activeKeysCount] = await db
		.select({ count: sql<number>`count(*)` })
		.from(apiKeys)
		.where(eq(apiKeys.userId, currentUser.id));

	const [creditsPurchased] = await db
		.select({ total: sql<number>`coalesce(sum(${purchases.creditsAdded}), 0)` })
		.from(purchases)
		.where(eq(purchases.userId, currentUser.id));

	let analyticsData = {
		metrics: {
			totalRenders: 0,
			cacheHits: 0,
			cacheHitRate: 0,
			activeKeys: activeKeysCount?.count || 0,
			creditsPurchased: creditsPurchased?.total || 0
		},
		templateBreakdown: [] as Array<{ template: string; count: number }>,
		recentLogs: [] as Array<{
			id: string;
			template: string;
			isCacheHit: boolean;
			createdAt: string | null;
			keyName: string | null;
			keyPrefix: string | null;
		}>
	};

	if (keyIds.length > 0) {
		const [totalLogsCount] = await db
			.select({ count: sql<number>`count(*)` })
			.from(renderLogs)
			.where(inArray(renderLogs.apiKeyId, keyIds));

		const [cacheHitsCount] = await db
			.select({ count: sql<number>`count(*)` })
			.from(renderLogs)
			.where(and(eq(renderLogs.isCacheHit, true), inArray(renderLogs.apiKeyId, keyIds)));

		const templateBreakdown = await db
			.select({
				template: renderLogs.template,
				count: sql<number>`count(*)`
			})
			.from(renderLogs)
			.where(inArray(renderLogs.apiKeyId, keyIds))
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
			.innerJoin(apiKeys, eq(renderLogs.apiKeyId, apiKeys.id))
			.where(eq(apiKeys.userId, currentUser.id))
			.orderBy(desc(renderLogs.createdAt))
			.limit(15);

		const totalRenders = totalLogsCount?.count || 0;
		const cacheHits = cacheHitsCount?.count || 0;
		const cacheHitRate = totalRenders > 0 ? Math.round((cacheHits / totalRenders) * 100) : 0;

		analyticsData = {
			metrics: {
				totalRenders,
				cacheHits,
				cacheHitRate,
				activeKeys: activeKeysCount?.count || 0,
				creditsPurchased: creditsPurchased?.total || 0
			},
			templateBreakdown,
			recentLogs
		};
	}

	return {
		user: {
			...currentUser,
			creditsRemaining: userCredits
		},
		keys: formattedKeys,
		analytics: analyticsData,
		defaultOgUrl,
		baseUrl,
		seo
	};
};
