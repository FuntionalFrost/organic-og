import { json, type RequestHandler } from '@sveltejs/kit';
import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { apiKeys, renderLogs, purchases } from '$lib/server/db/schema';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return json({
			metrics: {
				totalRenders: 0,
				cacheHits: 0,
				cacheHitRate: 0,
				activeKeys: 0,
				creditsPurchased: 0
			},
			templateBreakdown: [],
			recentLogs: []
		});
	}

	// Get user's key IDs
	const userKeys = await db
		.select({ id: apiKeys.id, name: apiKeys.name, prefix: apiKeys.prefix })
		.from(apiKeys)
		.where(eq(apiKeys.userId, locals.user.id));

	const keyIds = userKeys.map((k) => k.id);

	const [activeKeysCount] = await db
		.select({ count: sql<number>`count(*)` })
		.from(apiKeys)
		.where(eq(apiKeys.userId, locals.user.id));

	const [creditsPurchased] = await db
		.select({ total: sql<number>`coalesce(sum(${purchases.creditsAdded}), 0)` })
		.from(purchases)
		.where(eq(purchases.userId, locals.user.id));

	if (keyIds.length === 0) {
		return json({
			metrics: {
				totalRenders: 0,
				cacheHits: 0,
				cacheHitRate: 0,
				activeKeys: activeKeysCount?.count || 0,
				creditsPurchased: creditsPurchased?.total || 0
			},
			templateBreakdown: [],
			recentLogs: []
		});
	}

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
		.where(eq(apiKeys.userId, locals.user.id))
		.orderBy(desc(renderLogs.createdAt))
		.limit(15);

	const totalRenders = totalLogsCount?.count || 0;
	const cacheHits = cacheHitsCount?.count || 0;
	const cacheHitRate = totalRenders > 0 ? Math.round((cacheHits / totalRenders) * 100) : 0;

	return json({
		metrics: {
			totalRenders,
			cacheHits,
			cacheHitRate,
			activeKeys: activeKeysCount?.count || 0,
			creditsPurchased: creditsPurchased?.total || 0
		},
		templateBreakdown,
		recentLogs
	});
};
