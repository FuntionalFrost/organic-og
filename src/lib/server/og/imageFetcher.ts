// server/utils/imageFetcher.ts
const ALLOWED_MIME_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']);

const inMemoryImageCache = new Map<string, string>();

export async function fetchRemoteImageAsDataUri(url: string | undefined): Promise<string | null> {
	if (!url) return null;

	// Validate URL format and prevent SSRF
	try {
		const parsed = new URL(url);
		if (!['http:', 'https:'].includes(parsed.protocol)) return null;

		// Disallow non-standard ports
		if (parsed.port && parsed.port !== '80' && parsed.port !== '443') {
			return null;
		}

		const host = parsed.hostname.toLowerCase();

		// Block localhost, link-local, loopback, private ranges, cloud metadata (169.254.169.254)
		if (
			host === 'localhost' ||
			host === '0.0.0.0' ||
			host === '::' ||
			host === '::1' ||
			host === '[::1]' ||
			host.endsWith('.local') ||
			host.endsWith('.internal') ||
			host.endsWith('.localhost') ||
			/^(127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/.test(host) ||
			/^fc00:|^fe80:|^fd[0-9a-f]{2}:/i.test(host)
		) {
			return null;
		}
	} catch {
		return null;
	}

	// Cache hit
	if (inMemoryImageCache.has(url)) {
		return inMemoryImageCache.get(url)!;
	}

	try {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 2500);

		const response = await fetch(url, {
			signal: controller.signal,
			headers: { 'User-Agent': 'OG-Engine-Bot/1.0' }
		});
		clearTimeout(timeout);

		if (!response.ok) return null;

		const contentType = response.headers.get('content-type')?.split(';')[0]?.toLowerCase();
		if (!contentType || !ALLOWED_MIME_TYPES.has(contentType)) return null;

		const arrayBuffer = await response.arrayBuffer();
		const base64 = Buffer.from(arrayBuffer).toString('base64');
		const dataUri = `data:${contentType};base64,${base64}`;

		// Store in short-lived in-memory cache (limit cache size)
		if (inMemoryImageCache.size > 200) inMemoryImageCache.clear();
		inMemoryImageCache.set(url, dataUri);

		return dataUri;
	} catch {
		return null;
	}
}
