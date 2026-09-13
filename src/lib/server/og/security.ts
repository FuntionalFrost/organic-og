// server/utils/security.ts

/**
 * Creates a deterministic canonical query string by sorting keys alphabetically
 * and omitting signature/auth parameters.
 */
export function createCanonicalQueryString(query: Record<string, unknown>): string {
	const filteredKeys = Object.keys(query)
		.filter((key) => key !== 's' && key !== 'apiKey')
		.sort();

	return filteredKeys
		.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(String(query[key] ?? ''))}`)
		.join('&');
}

/**
 * Edge-safe SHA-256 hash (used for API key lookups).
 */
export async function sha256(str: string): Promise<string> {
	const data = new TextEncoder().encode(str);
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	return Array.from(new Uint8Array(hashBuffer))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

/**
 * Generates an HMAC-SHA256 signature (truncated to 16 hex characters).
 */
export async function generateHmacSignature(queryString: string, secret: string): Promise<string> {
	const encoder = new TextEncoder();
	const key = await crypto.subtle.importKey(
		'raw',
		encoder.encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign']
	);
	const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(queryString));
	const fullHex = Array.from(new Uint8Array(signatureBuffer))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');

	return fullHex.slice(0, 16);
}

/**
 * Constant-time comparison for strings to prevent timing attacks without Node.js Buffer.
 */
export function timingSafeEqual(a: string, b: string): boolean {
	if (a.length !== b.length) return false;
	let mismatch = 0;
	for (let i = 0; i < a.length; i++) {
		mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
	}
	return mismatch === 0;
}

/**
 * Validates the HMAC signature using constant-time comparison.
 */
export async function verifyHmacSignature(
	query: Record<string, unknown>,
	signature: string,
	secret: string
): Promise<boolean> {
	if (!signature || signature.length !== 16 || !secret) return false;

	const canonical = createCanonicalQueryString(query);
	const expected = await generateHmacSignature(canonical, secret);

	return timingSafeEqual(signature, expected);
}
