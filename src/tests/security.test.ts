import { describe, it, expect } from 'vitest';
import {
	createCanonicalQueryString,
	generateHmacSignature,
	verifyHmacSignature,
	timingSafeEqual,
	sha256
} from '#lib/server/og/security.js';

describe('Security & Cryptography Utilities', () => {
	it('creates deterministic canonical query strings sorted alphabetically', () => {
		const query = {
			title: 'Hello World',
			template: 'saas',
			theme: 'brand',
			badge: 'v1.0'
		};

		const canonical = createCanonicalQueryString(query);
		expect(canonical).toBe('badge=v1.0&template=saas&theme=brand&title=Hello%20World');
	});

	it('omits signature (s) and apiKey parameters from canonical query string', () => {
		const query = {
			title: 'Protected',
			s: 'tampered-signature',
			apiKey: 'secret-key-12345',
			template: 'blog'
		};

		const canonical = createCanonicalQueryString(query);
		expect(canonical).toBe('template=blog&title=Protected');
		expect(canonical).not.toContain('tampered-signature');
		expect(canonical).not.toContain('secret-key-12345');
	});

	it('generates consistent 16-character HMAC signatures and verifies correctly', async () => {
		const secret = 'super-secret-signing-key-for-testing';
		const query = { template: 'saas', title: 'Test' };
		const canonical = createCanonicalQueryString(query);

		const signature = await generateHmacSignature(canonical, secret);
		expect(signature).toHaveLength(16);
		expect(typeof signature).toBe('string');

		const isValid = await verifyHmacSignature(query, signature, secret);
		expect(isValid).toBe(true);
	});

	it('rejects tampered query parameters or invalid signatures', async () => {
		const secret = 'super-secret-signing-key-for-testing';
		const query = { template: 'saas', title: 'Test' };
		const canonical = createCanonicalQueryString(query);
		const signature = await generateHmacSignature(canonical, secret);

		const tamperedQuery = { template: 'saas', title: 'Hacked' };
		const isTamperedValid = await verifyHmacSignature(tamperedQuery, signature, secret);
		expect(isTamperedValid).toBe(false);

		const isBogusSignatureValid = await verifyHmacSignature(query, '0123456789abcdef', secret);
		expect(isBogusSignatureValid).toBe(false);

		const isShortSignatureValid = await verifyHmacSignature(query, 'short', secret);
		expect(isShortSignatureValid).toBe(false);
	});

	it('compares strings with timing-safe equality', () => {
		expect(timingSafeEqual('abcdef1234567890', 'abcdef1234567890')).toBe(true);
		expect(timingSafeEqual('abcdef1234567890', 'abcdef1234567891')).toBe(false);
		expect(timingSafeEqual('short', 'longer-string')).toBe(false);
	});

	it('computes edge-safe SHA-256 hashes', async () => {
		const hash = await sha256('test-api-token');
		expect(hash).toHaveLength(64);
		expect(/^[0-9a-f]{64}$/.test(hash)).toBe(true);
	});
});
