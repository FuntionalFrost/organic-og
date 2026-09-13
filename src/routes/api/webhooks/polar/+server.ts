import { json, error, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { Webhook, WebhookVerificationError } from 'standardwebhooks';
import { eq, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { db } from '$lib/server/db';
import { apiKeys, purchases, user } from '$lib/server/db/schema';

export const POST: RequestHandler = async ({ request }) => {
	const rawBody = await request.text();
	if (!rawBody) {
		throw error(400, 'Empty webhook payload');
	}

	const headersObj: Record<string, string> = {};
	request.headers.forEach((val, key) => {
		headersObj[key] = val;
	});

	const webhookSecret = env.POLAR_WEBHOOK_SECRET || process.env.POLAR_WEBHOOK_SECRET || '';

	if (!webhookSecret) {
		throw error(500, 'Missing Polar Webhook Secret in server configuration.');
	}

	let polarEvent: {
		id?: string;
		type?: string;
		data?: {
			status?: string;
			id?: string;
			order_id?: string;
			metadata?: Record<string, string>;
			checkout?: { metadata?: Record<string, string> };
		};
	};
	try {
		const base64Secret = Buffer.from(webhookSecret, 'utf-8').toString('base64');
		const wh = new Webhook(base64Secret);
		polarEvent = wh.verify(rawBody, headersObj) as typeof polarEvent;
	} catch (err) {
		if (err instanceof WebhookVerificationError) {
			throw error(403, 'Invalid Webhook Signature');
		}
		throw error(400, 'Webhook Verification Failed');
	}

	if (
		(polarEvent.type === 'order.created' || polarEvent.type === 'checkout.updated') &&
		polarEvent.data
	) {
		const data = polarEvent.data as {
			status?: string;
			id?: string;
			order_id?: string;
			amount?: number;
			totalAmount?: number;
			subtotal_amount?: number;
			currency?: string;
			metadata?: Record<string, string>;
			checkout?: { metadata?: Record<string, string> };
		};
		const isPaid =
			data.status === 'succeeded' ||
			data.status === 'confirmed' ||
			polarEvent.type === 'order.created';
		const metadata = data.metadata || data.checkout?.metadata || {};

		const userId = metadata.userId || null;
		const apiKeyId = metadata.apiKeyId || null;
		const creditsToAdd = metadata.credits ? parseInt(metadata.credits, 10) : 0;

		if (isPaid && creditsToAdd > 0) {
			const orderId = (data.id || data.order_id || polarEvent.id || `ord_${nanoid()}`) as string;

			// Idempotency check
			const [existingPurchase] = await db
				.select()
				.from(purchases)
				.where(eq(purchases.polarOrderId, orderId));

			if (!existingPurchase) {
				let targetUserId = userId;
				if (!targetUserId && apiKeyId) {
					const [keyRow] = await db
						.select({ userId: apiKeys.userId })
						.from(apiKeys)
						.where(eq(apiKeys.id, apiKeyId));
					targetUserId = keyRow?.userId || null;
				}

				const amountCents = data.amount || data.totalAmount || data.subtotal_amount || 0;
				const currency = (data.currency || 'usd').toLowerCase();

				const updatePromises: Promise<unknown>[] = [
					db.insert(purchases).values({
						id: nanoid(),
						userId: targetUserId,
						apiKeyId: apiKeyId || null,
						polarOrderId: orderId,
						creditsAdded: creditsToAdd,
						amountCents,
						currency
					})
				];

				if (targetUserId) {
					updatePromises.push(
						db
							.update(user)
							.set({
								creditsRemaining: sql`${user.creditsRemaining} + ${creditsToAdd}`
							})
							.where(eq(user.id, targetUserId))
					);
				}

				if (apiKeyId) {
					updatePromises.push(
						db
							.update(apiKeys)
							.set({
								creditsRemaining: sql`${apiKeys.creditsRemaining} + ${creditsToAdd}`
							})
							.where(eq(apiKeys.id, apiKeyId))
					);
				}

				await Promise.all(updatePromises);
			}
		}
	}

	return json({ received: true });
};
