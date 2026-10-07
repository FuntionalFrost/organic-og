import { error, type RequestHandler } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { db } from '#lib/server/db/index.js';
import { apiKeys, renderLogs } from '#lib/server/db/schema.js';

export const POST: RequestHandler = async ({ params }) => {
	const id = params.id;
	if (!id) throw error(400, 'Missing ID');

	const [keyRecord] = await db.select().from(apiKeys).where(eq(apiKeys.id, id));

	if (!keyRecord || !keyRecord.isActive) {
		throw error(404, 'API Key not found or is inactive.');
	}

	// Increment total telemetry renders
	await db
		.update(apiKeys)
		.set({
			totalRenders: sql`${apiKeys.totalRenders} + 1`
		})
		.where(eq(apiKeys.id, id));

	await db.insert(renderLogs).values({
		id: nanoid(),
		apiKeyId: keyRecord.id,
		template: 'saas',
		isCacheHit: false
	});

	return Response.json({
		success: true,
		totalRenders: keyRecord.totalRenders + 1
	});
};
