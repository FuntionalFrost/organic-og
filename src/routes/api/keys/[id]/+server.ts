import { json, error, type RequestHandler } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { apiKeys, purchases, renderLogs } from '$lib/server/db/schema';

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized: Please sign in with GitHub.');
	}

	const id = params.id;
	if (!id) {
		throw error(400, 'Missing ID');
	}

	// 1. Verify user ownership
	const [target] = await db
		.select()
		.from(apiKeys)
		.where(and(eq(apiKeys.id, id), eq(apiKeys.userId, locals.user.id)));

	if (!target) {
		throw error(404, 'API Key not found or does not belong to your account.');
	}

	// 2. Disassociate purchases
	await db.update(purchases).set({ apiKeyId: null }).where(eq(purchases.apiKeyId, id));

	// 3. Clean up render logs and delete parent API key
	await db.delete(renderLogs).where(eq(renderLogs.apiKeyId, id));
	await db.delete(apiKeys).where(eq(apiKeys.id, id));

	return json({ success: true });
};
