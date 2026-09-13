import { json, error, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { z } from 'zod';
import { createCanonicalQueryString, generateHmacSignature } from '$lib/server/og/security';

const bodySchema = z.object({
	params: z.record(z.string(), z.any())
});

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const body = await request.json();
		const { params } = bodySchema.parse(body);

		const secret =
			env.OG_SIGNING_SECRET ||
			process.env.OG_SIGNING_SECRET ||
			(process.env.NODE_ENV !== 'production' ? 'fallback-secret-key-32-chars-min' : '');

		if (!secret) {
			throw error(500, 'OG Signing Secret is not configured.');
		}

		// Attach demo flag if unauthenticated so studio previews are watermarked
		const signedParams = { ...params };
		if (!locals.user && !signedParams.demo) {
			signedParams.demo = '1';
		}

		const canonical = createCanonicalQueryString(signedParams);
		const signature = await generateHmacSignature(canonical, secret);

		return json({
			signature,
			canonical,
			signedUrl: `/api/og?${canonical}&s=${signature}`
		});
	} catch (err: unknown) {
		console.error('Signing Endpoint Error:', err);
		if (err && typeof err === 'object' && 'status' in err) throw err;
		throw error(500, err instanceof Error ? err.message : 'Signing failed');
	}
};
