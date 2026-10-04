// src/lib/server/og/cache.ts
import { Redis } from '@upstash/redis';
import { env } from '$env/dynamic/private';

export interface CachedImage {
	body: Uint8Array | string;
	contentType: string;
}

// In-memory Tier 1 LRU-style cache
const memoryCache = new Map<string, CachedImage>();
const MAX_MEMORY_ITEMS = 500;

// Upstash Redis Tier 2 Edge Cache
let redisClient: Redis | null = null;

function getRedisClient(): Redis | null {
	if (redisClient !== null) return redisClient;

	const url = env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_URL;
	const token = env.UPSTASH_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

	if (url && token) {
		try {
			redisClient = new Redis({ url, token });
			return redisClient;
		} catch (err) {
			console.warn('Failed to initialize Upstash Redis client:', err);
			return null;
		}
	}

	return null;
}

export async function getCachedImage(cacheKey: string): Promise<CachedImage | null> {
	// 1. Check Fast Tier 1 In-Memory Cache
	if (memoryCache.has(cacheKey)) {
		return memoryCache.get(cacheKey)!;
	}

	// 2. Check Distributed Tier 2 Upstash Redis Cache
	const redis = getRedisClient();
	if (redis) {
		try {
			const data = (await redis.get(cacheKey)) as {
				bodyBase64?: string;
				bodySvg?: string;
				contentType: string;
			} | null;

			if (data) {
				let body: Uint8Array | string;
				if (data.bodySvg) {
					body = data.bodySvg;
				} else if (data.bodyBase64) {
					body = Uint8Array.from(Buffer.from(data.bodyBase64, 'base64'));
				} else {
					return null;
				}

				const cached: CachedImage = {
					body,
					contentType: data.contentType
				};

				// Populate Tier 1
				setMemoryCache(cacheKey, cached);
				return cached;
			}
		} catch (redisErr) {
			console.warn('Tier 2 Redis Cache Read Warning:', redisErr);
		}
	}

	return null;
}

function setMemoryCache(cacheKey: string, image: CachedImage) {
	if (memoryCache.size >= MAX_MEMORY_ITEMS) {
		const firstKey = memoryCache.keys().next().value;
		if (firstKey) memoryCache.delete(firstKey);
	}
	memoryCache.set(cacheKey, image);
}

export async function setCachedImage(
	cacheKey: string,
	image: CachedImage,
	ttlSeconds = 604800 // 7 days default
): Promise<void> {
	// 1. Store in Tier 1 Memory Cache
	setMemoryCache(cacheKey, image);

	// 2. Store in Tier 2 Distributed Redis Cache
	const redis = getRedisClient();
	if (redis) {
		try {
			if (typeof image.body === 'string') {
				await redis.set(
					cacheKey,
					{
						bodySvg: image.body,
						contentType: image.contentType
					},
					{ ex: ttlSeconds }
				);
			} else {
				const bodyBase64 = Buffer.from(image.body).toString('base64');
				await redis.set(
					cacheKey,
					{
						bodyBase64,
						contentType: image.contentType
					},
					{ ex: ttlSeconds }
				);
			}
		} catch (redisErr) {
			console.warn('Tier 2 Redis Cache Write Warning:', redisErr);
		}
	}
}
