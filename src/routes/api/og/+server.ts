import { error, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { eq, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { apiKeys, renderLogs } from '$lib/server/db/schema';
import {
	getTemplateSvg,
	type TemplateName,
	type TemplateProps,
	type PatternType,
	type FontType
} from '$lib/server/og';
import { renderSvgToPng } from '$lib/server/og/resvg';
import { createCanonicalQueryString, sha256, verifyHmacSignature } from '$lib/server/og/security';
import { fetchRemoteImageAsDataUri } from '$lib/server/og/imageFetcher';
import { getCachedImage, setCachedImage } from '$lib/server/og/cache';

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
		// In FOSS edition, clean renders are default; watermarking is opt-in only
		const isWatermarked = query.watermark === '1';

		if (authHeader?.startsWith('Bearer ')) {
			const rawKey = authHeader.replace('Bearer ', '').trim();
			const keyHash = await sha256(rawKey);

			const keys = await db.select().from(apiKeys).where(eq(apiKeys.keyHash, keyHash)).limit(1);
			apiKeyRecord = keys[0] || null;

			if (!apiKeyRecord || !apiKeyRecord.isActive) {
				throw error(401, 'Invalid or inactive API key.');
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
		}

		const templateName = ((query.template as string) || 'saas') as TemplateName;

		// 2. Check Hybrid Edge Cache
		const canonical = createCanonicalQueryString(query);
		const cacheKey = `img_${format}_${await sha256(canonical)}`;

		const cached = await getCachedImage(cacheKey);
		if (cached) {
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
				'CDN-Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400',
				'Vercel-CDN-Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400',
				'x-engine': 'organic-og-foss'
			});

			return new Response(cached.body as BodyInit, { headers });
		}

		// 3. Fetch Remote Logo/Avatar & Virtual DOM Construction
		const logoDataUri = await fetchRemoteImageAsDataUri(
			(query.logoUrl as string | undefined) || (query.avatarUrl as string | undefined)
		);

		const props: TemplateProps = {
			title: ((query.title as string) || 'Organic-OG').slice(0, 200),
			description: ((query.description as string) || '').slice(0, 400),
			badge: ((query.badge as string) || '').slice(0, 60),
			siteName: ((query.siteName as string) || '').slice(0, 80),
			theme: (query.theme as TemplateProps['theme']) || 'dark',
			pattern: (query.pattern as PatternType) || 'none',
			font: (query.font as FontType) || 'inter',
			customBg: query.bg as string | undefined,
			customAccent: query.accent as string | undefined,
			customTextColor: query.textColor as string | undefined,
			logoDataUri,
			// Ecommerce & GitHub
			price: ((query.price as string) || '').slice(0, 30),
			rating: ((query.rating as string) || '').slice(0, 30),
			stars: query.stars ? String(query.stars).slice(0, 20) : undefined,
			forks: query.forks ? String(query.forks).slice(0, 20) : undefined,
			language: ((query.language as string) || 'TypeScript').slice(0, 30),
			// Podcast
			episode: ((query.episode as string) || '').slice(0, 40),
			host: ((query.host as string) || '').slice(0, 60),
			guest: ((query.guest as string) || '').slice(0, 60),
			duration: ((query.duration as string) || '').slice(0, 30),
			// Event
			eventDate: ((query.eventDate as string) || '').slice(0, 60),
			location: ((query.location as string) || '').slice(0, 80),
			speaker: ((query.speaker as string) || '').slice(0, 80),
			// Quote
			author: ((query.author as string) || '').slice(0, 60),
			handle: ((query.handle as string) || '').slice(0, 40),
			role: ((query.role as string) || '').slice(0, 80),
			// Changelog
			version: ((query.version as string) || '').slice(0, 40),
			items: ((query.items as string) || '').slice(0, 300),
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

		// Store in dual-tier cache
		await setCachedImage(cacheKey, { body: responseBody, contentType: responseContentType });

		// 6. Telemetry & Response Headers
		try {
			if (apiKeyRecord) {
				await db
					.update(apiKeys)
					.set({
						totalRenders: sql`${apiKeys.totalRenders} + 1`
					})
					.where(eq(apiKeys.id, apiKeyRecord.id));

				await db.insert(renderLogs).values({
					id: crypto.randomUUID(),
					apiKeyId: apiKeyRecord.id,
					template: templateName,
					isCacheHit: false
				});
			} else {
				await db.insert(renderLogs).values({
					id: crypto.randomUUID(),
					apiKeyId: null,
					template: templateName,
					isCacheHit: false
				});
			}
		} catch (dbErr) {
			console.warn('Database telemetry log notice (cache miss):', dbErr);
		}

		const responseHeaders = new Headers({
			'Content-Type': responseContentType,
			'x-cache': 'MISS',
			'x-engine': 'organic-og-foss',
			'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
			'CDN-Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400',
			'Vercel-CDN-Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400'
		});

		return new Response(responseBody as BodyInit, { headers: responseHeaders });
	} catch (err: unknown) {
		console.error('OG Render Pipeline Error:', err);
		if (err && typeof err === 'object' && 'status' in err) throw err;
		throw error(500, err instanceof Error ? err.message : 'Internal Rendering Error');
	}
};
