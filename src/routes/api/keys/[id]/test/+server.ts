import { json, error, type RequestHandler } from '@sveltejs/kit';
import { and, eq, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { db } from '$lib/server/db';
import { apiKeys, renderLogs, user } from '$lib/server/db/schema';

export const POST: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized: Please sign in with GitHub.');
	}

	const id = params.id;
	if (!id) throw error(400, 'Missing ID');

	const [keyRecord] = await db
		.select()
		.from(apiKeys)
		.where(and(eq(apiKeys.id, id), eq(apiKeys.userId, locals.user.id)));

	if (!keyRecord || !keyRecord.isActive) {
		throw error(404, 'API Key not found or does not belong to your account.');
	}

	const [userRecord] = await db
		.select({ creditsRemaining: user.creditsRemaining })
		.from(user)
		.where(eq(user.id, locals.user.id));

	const currentCredits = userRecord?.creditsRemaining ?? 0;

	if (currentCredits <= 0) {
		throw error(402, 'Credit balance exhausted. Please purchase more credits.');
	}

	// Atomic update to user balance & key telemetry
	await db
		.update(user)
		.set({
			creditsRemaining: sql`${user.creditsRemaining} - 1`
		})
		.where(and(eq(user.id, locals.user.id), sql`${user.creditsRemaining} > 0`));

	await db
		.update(apiKeys)
		.set({
			creditsRemaining: sql`max(0, ${user.creditsRemaining} - 1)`,
			totalRenders: sql`${apiKeys.totalRenders} + 1`
		})
		.where(eq(apiKeys.id, id));

	await db.insert(renderLogs).values({
		id: nanoid(),
		apiKeyId: keyRecord.id,
		template: 'saas',
		isCacheHit: false
	});

	return json({
		success: true,
		creditsRemaining: currentCredits - 1,
		totalRenders: keyRecord.totalRenders + 1
	});
};
