import type { RequestHandler } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';
import { db } from '#lib/server/db/index.js';

export const GET: RequestHandler = async () => {
	const start = Date.now();
	let dbStatus = 'connected';

	try {
		await db.run(sql`SELECT 1`);
	} catch (err: unknown) {
		dbStatus = `degraded: ${(err instanceof Error ? err.message : 'Database check failed') || 'error'}`;
	}

	const latencyMs = Date.now() - start;

	return Response.json({
		status: dbStatus === 'connected' ? 'healthy' : 'degraded',
		database: dbStatus,
		latencyMs,
		timestamp: new Date().toISOString()
	});
};
