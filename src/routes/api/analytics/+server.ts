import { json, type RequestHandler } from '@sveltejs/kit';
import { desc, eq, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { apiKeys, renderLogs } from '$lib/server/db/schema';

export const GET: RequestHandler = async () => {
	const [activeKeysCount] = await db.select({ count: sql<number>`count(*)` }).from(apiKeys);

	const [totalLogsCount] = await db.select({ count: sql<number>`count(*)` }).from(renderLogs);

	const [cacheHitsCount] = await db
		.select({ count: sql<number>`count(*)` })
		.from(renderLogs)
		.where(eq(renderLogs.isCacheHit, true));

	const templateBreakdown = await db
		.select({
			template: renderLogs.template,
			count: sql<number>`count(*)`
		})
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

	return json({
		metrics: {
			totalRenders,
			cacheHits,
			cacheHitRate,
			activeKeys: activeKeysCount?.count || 0
		},
		templateBreakdown,
		recentLogs
	});
};
