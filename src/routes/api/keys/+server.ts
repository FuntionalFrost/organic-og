import { json, error, type RequestHandler } from '@sveltejs/kit';
import { desc, eq, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { db } from '$lib/server/db';
import { apiKeys, user } from '$lib/server/db/schema';
import { sha256 } from '$lib/server/og/security';

const bodySchema = z.object({
	name: z.string().min(2).max(50)
});

function generateRandomHex(byteLength = 16): string {
	const bytes = new Uint8Array(byteLength);
	crypto.getRandomValues(bytes);
	return Array.from(bytes)
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return json([]);
	}

	const [userRow] = await db
		.select({ creditsRemaining: user.creditsRemaining })
		.from(user)
		.where(eq(user.id, locals.user.id));

	const userCredits = userRow?.creditsRemaining ?? 10;

	const keys = await db
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
		.where(eq(apiKeys.userId, locals.user.id))
		.orderBy(desc(apiKeys.createdAt));

	return json(
		keys.map((k) => ({
			...k,
			creditsRemaining: userCredits
		}))
	);
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized: Please sign in with GitHub.');
	}

	try {
		const body = await request.json();
		const { name } = bodySchema.parse(body);

		// Limit max 5 keys per account
		const existing = await db
			.select({ count: sql<number>`count(*)` })
			.from(apiKeys)
			.where(eq(apiKeys.userId, locals.user.id));

		if ((existing[0]?.count || 0) >= 5) {
			throw error(400, 'Limit reached: Maximum of 5 API keys allowed per account.');
		}

		// Fetch user credit balance
		const [userRecord] = await db.select().from(user).where(eq(user.id, locals.user.id));

		const initialCredits = userRecord?.creditsRemaining ?? 10;

		// 1. Generate token and hash
		const randomHex = generateRandomHex(16);
		const rawToken = `og_live_${randomHex}`;
		const keyHash = await sha256(rawToken);
		const prefix = `${rawToken.slice(0, 12)}...${rawToken.slice(-4)}`;

		const newKey = {
			id: nanoid(),
			userId: locals.user.id,
			name,
			keyHash,
			prefix,
			creditsRemaining: initialCredits,
			totalRenders: 0,
			isActive: true
		};

		// 2. Insert into DB
		await db.insert(apiKeys).values(newKey);

		// 3. Return raw key once to client
		return json({
			...newKey,
			rawKey: rawToken
		});
	} catch (err: unknown) {
		console.error('Failed to create API key:', err);
		if (err && typeof err === 'object' && 'status' in err) throw err;
		throw error(500, err instanceof Error ? err.message : 'Failed to create API key in database');
	}
};
