import { json, error, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '$lib/server/db';
import { apiKeys } from '$lib/server/db/schema';
import { getPolarClient, createPolarCheckout, CREDIT_PACKAGES } from '$lib/server/og/polar';

const bodySchema = z
	.object({
		apiKeyId: z.string().optional(),
		packageTier: z.enum(['starter', 'growth', 'scale']).optional(),
		tier: z.enum(['starter', 'growth', 'scale']).optional()
	})
	.refine((data) => data.packageTier || data.tier, {
		message: 'Must provide either packageTier or tier'
	});

export const POST: RequestHandler = async ({ request, url, locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized: Please sign in with GitHub.');
	}

	try {
		const body = await request.json();
		const parsed = bodySchema.safeParse(body);
		if (!parsed.success) {
			throw error(422, 'Validation Error: ' + JSON.stringify(parsed.error));
		}

		const apiKeyId = parsed.data.apiKeyId;
		const selectedTier = (parsed.data.packageTier || parsed.data.tier)!;

		const polarToken = env.POLAR_ACCESS_TOKEN || process.env.POLAR_ACCESS_TOKEN || '';

		const starterProd =
			env.POLAR_PRODUCT_STARTER ||
			process.env.POLAR_PRODUCT_STARTER ||
			CREDIT_PACKAGES.starter?.polarProductId ||
			'';

		const growthProd =
			env.POLAR_PRODUCT_GROWTH ||
			process.env.POLAR_PRODUCT_GROWTH ||
			CREDIT_PACKAGES.growth?.polarProductId ||
			'';

		const scaleProd =
			env.POLAR_PRODUCT_SCALE ||
			process.env.POLAR_PRODUCT_SCALE ||
			CREDIT_PACKAGES.scale?.polarProductId ||
			'';

		const tierMap: Record<string, { productId: string; credits: number }> = {
			starter: { productId: starterProd, credits: 1000 },
			growth: { productId: growthProd, credits: 5000 },
			scale: { productId: scaleProd, credits: 25000 }
		};

		const packageConfig = tierMap[selectedTier];
		if (!packageConfig?.productId) {
			throw error(
				422,
				`Missing Polar Product ID for tier "${selectedTier}". Please configure POLAR_PRODUCT_${selectedTier.toUpperCase()} in your environment variables.`
			);
		}

		if (!polarToken) {
			throw error(500, 'Missing Polar Access Token in environment variables.');
		}

		// Verify API key if provided
		let verifiedKeyId: string | null = null;
		if (apiKeyId) {
			const [keyRecord] = await db
				.select()
				.from(apiKeys)
				.where(and(eq(apiKeys.id, apiKeyId), eq(apiKeys.userId, locals.user.id)));
			if (keyRecord && keyRecord.isActive) {
				verifiedKeyId = keyRecord.id;
			}
		}

		let baseUrl = (env.PUBLIC_BASE_URL || env.ORIGIN || '').trim();
		if (!baseUrl) {
			baseUrl = url.origin;
		} else if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
			baseUrl = `https://${baseUrl}`;
		}
		baseUrl = baseUrl.replace(/\/+$/, '');

		const successUrl = `${baseUrl}/?status=success&session_id={CHECKOUT_ID}`;

		const polarClient = getPolarClient({ accessToken: polarToken, server: 'production' });

		const checkout = await createPolarCheckout({
			productId: packageConfig.productId,
			successUrl,
			customerEmail: locals.user.email,
			polar: polarClient,
			metadata: {
				userId: locals.user.id,
				...(verifiedKeyId ? { apiKeyId: verifiedKeyId } : {}),
				credits: String(packageConfig.credits),
				packageTier: selectedTier
			}
		});

		return json({
			checkoutUrl: checkout.url,
			id: checkout.id
		});
	} catch (err: unknown) {
		console.error('Checkout creation error:', err);
		if (err && typeof err === 'object' && 'status' in err) throw err;
		throw error(500, err instanceof Error ? err.message : 'Checkout Error');
	}
};
