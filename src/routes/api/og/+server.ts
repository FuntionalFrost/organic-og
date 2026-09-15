import { error, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { and, eq, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { apiKeys, renderLogs, user } from '$lib/server/db/schema';
import { getTemplateSvg, type TemplateName, type TemplateProps } from '$lib/server/og';
import { renderSvgToPng } from '$lib/server/og/resvg';
import { createCanonicalQueryString, sha256, verifyHmacSignature } from '$lib/server/og/security';
import { fetchRemoteImageAsDataUri } from '$lib/server/og/imageFetcher';

// In-memory LRU-style cache
interface CachedImage {
	body: Uint8Array | string;
	contentType: string;
}
const memoryCache = new Map<string, CachedImage>();

export const GET: RequestHandler = async ({ url, request }) => {
	try {
		const query: Record<string, string> = {};
		for (const [k, v] of url.searchParams.entries()) {
			query[k] = v;
		}

		const format = (query.format as string)?.toLowerCase() === 'svg' ? 'svg' : 'png';

		const secret =
			env.OG_SIGNING_SECRET ||
			process.env.OG_SIGNING_SECRET ||
			(process.env.NODE_ENV !== 'production' ? 'fallback-secret-key-32-chars-min' : '');

		// 1. Authenticate Request
		const authHeader = request.headers.get('authorization');
		let apiKeyRecord: typeof apiKeys.$inferSelect | null = null;
		let userRecord: typeof user.$inferSelect | null = null;
		let isWatermarked = false;

		if (authHeader?.startsWith('Bearer ')) {
			const rawKey = authHeader.replace('Bearer ', '').trim();
			const keyHash = await sha256(rawKey);

			const keys = await db.select().from(apiKeys).where(eq(apiKeys.keyHash, keyHash)).limit(1);
			apiKeyRecord = keys[0] || null;

			if (!apiKeyRecord || !apiKeyRecord.isActive) {
				throw error(401, 'Invalid or inactive API key.');
			}

			// Check owner user credit balance
			if (apiKeyRecord.userId) {
				const users = await db.select().from(user).where(eq(user.id, apiKeyRecord.userId)).limit(1);
				userRecord = users[0] || null;
			}

			const availableCredits = userRecord?.creditsRemaining ?? apiKeyRecord.creditsRemaining;
			if (availableCredits <= 0) {
				throw error(402, 'Credit limit reached. Please purchase more credits.');
			}
		} else if (query.s) {
			if (!secret) {
				throw error(500, 'OG Signing Secret is not configured.');
			}
			const signature = String(query.s);
			const isValid = await verifyHmacSignature(query, signature, secret);
			if (!isValid) {
				throw error(401, 'Invalid HMAC signature.');
			}

			if (query.demo === '1' || query.preview === '1') {
				isWatermarked = true;
			}
		} else {
			// Public social crawlers and preview demo fallback
			isWatermarked = true;
		}

		const templateName = ((query.template as string) || 'saas') as TemplateName;

		// 2. Check Memory Cache
		const canonical = createCanonicalQueryString(query);
		const cacheKey = `img_${format}_${await sha256(canonical)}`;

		if (memoryCache.has(cacheKey)) {
			const cached = memoryCache.get(cacheKey)!;
			try {
				if (apiKeyRecord) {
					await db
						.update(apiKeys)
						.set({ totalRenders: sql`${apiKeys.totalRenders} + 1` })
						.where(eq(apiKeys.id, apiKeyRecord.id));

					await db.insert(renderLogs).values({
						id: crypto.randomUUID(),
						apiKeyId: apiKeyRecord.id,
						template: templateName,
						isCacheHit: true
					});
				} else {
					await db.insert(renderLogs).values({
						id: crypto.randomUUID(),
						apiKeyId: null,
						template: templateName,
						isCacheHit: true
					});
				}
			} catch (dbErr) {
				console.warn('Database telemetry log notice (cache hit):', dbErr);
			}

			const headers = new Headers({
				'Content-Type': cached.contentType,
				'x-cache': 'HIT',
				'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
				'Netlify-CDN-Cache-Control': 'public, max-age=604800, durable'
			});

			if (apiKeyRecord) {
				headers.set('x-credits-remaining', String(apiKeyRecord.creditsRemaining));
			}

			return new Response(cached.body as BodyInit, { headers });
		}

		// 3. Fetch Remote Logo & Virtual DOM Construction
		const logoDataUri = await fetchRemoteImageAsDataUri(query.logoUrl as string | undefined);

		const props: TemplateProps = {
			title: ((query.title as string) || 'Organic-OG').slice(0, 200),
			description: ((query.description as string) || '').slice(0, 400),
			badge: ((query.badge as string) || '').slice(0, 60),
			siteName: ((query.siteName as string) || '').slice(0, 80),
			theme: (query.theme as TemplateProps['theme']) || 'dark',
			logoDataUri,
			price: ((query.price as string) || '').slice(0, 30),
			rating: ((query.rating as string) || '').slice(0, 30),
			stars: query.stars ? String(query.stars).slice(0, 20) : undefined,
			forks: query.forks ? String(query.forks).slice(0, 20) : undefined,
			language: ((query.language as string) || 'TypeScript').slice(0, 30),
			watermark: isWatermarked
		};

		// 4. Generate Native SVG Markup (Zero-WASM Architecture)
		const svg = getTemplateSvg(templateName, props);

		let responseBody: Uint8Array | string;
		let responseContentType: string;

		if (format === 'svg') {
			// Fast-path: Direct SVG Vector Streaming (<1ms)
			responseBody = svg;
			responseContentType = 'image/svg+xml; charset=utf-8';
		} else {
			// Default: High-performance PNG Rasterization via Resvg
			const png = await renderSvgToPng(svg, 1200);
			responseBody = new Uint8Array(png);
			responseContentType = 'image/png';
		}

		// Store in cache (limit memory size)
		if (memoryCache.size > 500) {
			const firstKey = memoryCache.keys().next().value;
			if (firstKey) memoryCache.delete(firstKey);
		}
		memoryCache.set(cacheKey, { body: responseBody, contentType: responseContentType });

		// 6. Metering & Response Headers
		let remainingCredits: number | null = null;
		try {
			if (apiKeyRecord) {
				let remaining = apiKeyRecord.creditsRemaining - 1;
				if (apiKeyRecord.userId) {
					await db
						.update(user)
						.set({
							creditsRemaining: sql`${user.creditsRemaining} - 1`
						})
						.where(and(eq(user.id, apiKeyRecord.userId), sql`${user.creditsRemaining} > 0`));

					const [updatedUser] = await db
						.select({ creditsRemaining: user.creditsRemaining })
						.from(user)
						.where(eq(user.id, apiKeyRecord.userId));

					if (updatedUser) {
						remaining = updatedUser.creditsRemaining;
					}
				}

				await db
					.update(apiKeys)
					.set({
						creditsRemaining: remaining,
						totalRenders: sql`${apiKeys.totalRenders} + 1`
					})
					.where(eq(apiKeys.id, apiKeyRecord.id));

				await db.insert(renderLogs).values({
					id: crypto.randomUUID(),
					apiKeyId: apiKeyRecord.id,
					template: templateName,
					isCacheHit: false
				});

				remainingCredits = remaining;
			} else {
				await db.insert(renderLogs).values({
					id: crypto.randomUUID(),
					apiKeyId: null,
					template: templateName,
					isCacheHit: false
				});
			}
		} catch (dbErr) {
			console.warn('Database metering/telemetry log notice (cache miss):', dbErr);
		}

		const responseHeaders = new Headers({
			'Content-Type': responseContentType,
			'x-cache': 'MISS',
			'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
			'Netlify-CDN-Cache-Control': 'public, max-age=604800, durable'
		});

		if (remainingCredits !== null) {
			responseHeaders.set('x-credits-remaining', String(remainingCredits));
		}

		return new Response(responseBody as BodyInit, { headers: responseHeaders });
	} catch (err: unknown) {
		console.error('OG Render Pipeline Error:', err);
		if (err && typeof err === 'object' && 'status' in err) throw err;
		throw error(500, err instanceof Error ? err.message : 'Internal Rendering Error');
	}
};
