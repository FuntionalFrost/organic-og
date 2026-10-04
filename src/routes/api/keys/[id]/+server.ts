import { json, error, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { apiKeys, renderLogs } from '$lib/server/db/schema';

export const DELETE: RequestHandler = async ({ params }) => {
	const id = params.id;
	if (!id) {
		throw error(400, 'Missing ID');
	}

	// 1. Clean up render logs and delete API key
	await db.delete(renderLogs).where(eq(renderLogs.apiKeyId, id));
	await db.delete(apiKeys).where(eq(apiKeys.id, id));

	return json({ success: true });
};
