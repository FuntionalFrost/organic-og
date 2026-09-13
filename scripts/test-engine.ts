import process from 'node:process';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5173';

async function runVerification() {
	console.log('🧪 Starting Organic-OG End-to-End Verification Suite for SvelteKit\n');
	let passed = 0;
	let failed = 0;

	const assert = (condition: boolean, testName: string, detail = '') => {
		if (condition) {
			console.log(`  ✅ PASS: ${testName}`);
			passed++;
		} else {
			console.error(`  ❌ FAIL: ${testName} ${detail ? `(${detail})` : ''}`);
			failed++;
		}
	};

	try {
		// 1. Test HMAC Signing & Public Render for All 5 Templates
		const templates = ['saas', 'blog', 'minimal', 'ecommerce', 'github'] as const;
		for (const template of templates) {
			const params: Record<string, string> = {
				title: `Test Render for ${template}`,
				description: 'Verifying SvelteKit image buffer generation',
				siteName: 'test.io',
				template,
				theme: 'brand'
			};
			const signRes = await fetch(`${BASE_URL}/api/sign`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ params })
			});
			const signData = await signRes.json();
			assert(
				signRes.status === 200 && Boolean(signData.signedUrl),
				`Signing endpoint succeeds for "${template}"`
			);

			const res = await fetch(`${BASE_URL}${signData.signedUrl}`);
			const contentType = res.headers.get('content-type');
			const buffer = await res.arrayBuffer();

			assert(
				res.status === 200 && contentType === 'image/png' && buffer.byteLength > 1000,
				`Template "${template}" produces valid PNG`,
				`HTTP ${res.status}, size: ${buffer.byteLength} bytes`
			);
		}

		// 2. Test HMAC Validation Failure with Invalid Signature
		const invalidRes = await fetch(`${BASE_URL}/api/og?title=Test&s=invalid_signature`);
		assert(invalidRes.status === 401, 'Invalid HMAC signature correctly rejected with HTTP 401');

		// 3. Test API Health Check
		const healthRes = await fetch(`${BASE_URL}/api/health`);
		const healthData = await healthRes.json();
		assert(
			healthRes.status === 200 &&
				(healthData.status === 'healthy' || healthData.status === 'degraded'),
			'Health endpoint reports operational status'
		);

		// 4. Test SEO: /robots.txt
		const robotsRes = await fetch(`${BASE_URL}/robots.txt`);
		const robotsTxt = await robotsRes.text();
		assert(
			robotsRes.status === 200 &&
				robotsTxt.includes('User-agent: *') &&
				robotsTxt.includes('Disallow: /api/keys') &&
				robotsTxt.includes('Sitemap: https://organic-og.netlify.app/sitemap.xml'),
			'GET /robots.txt returns correct directives and sitemap URL'
		);

		// 5. Test SEO: /sitemap.xml
		const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`);
		const sitemapXml = await sitemapRes.text();
		assert(
			sitemapRes.status === 200 &&
				sitemapXml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">') &&
				sitemapXml.includes('https://organic-og.netlify.app/privacy') &&
				sitemapXml.includes('https://organic-og.netlify.app/terms') &&
				sitemapXml.includes('<changefreq>daily</changefreq>'),
			'GET /sitemap.xml returns compliant XML sitemap including legal routes'
		);

		// 6. Test SEO: /sitemap.xsl
		const sitemapXslRes = await fetch(`${BASE_URL}/sitemap.xsl`);
		const sitemapXsl = await sitemapXslRes.text();
		assert(
			sitemapXslRes.status === 200 &&
				sitemapXsl.includes('xsl:stylesheet') &&
				sitemapXsl.includes('XML Sitemap'),
			'GET /sitemap.xsl returns interactive XML sitemap stylesheet'
		);

		// 7. Test SEO: /site.webmanifest
		const manifestRes = await fetch(`${BASE_URL}/site.webmanifest`);
		const manifestJson = await manifestRes.json();
		assert(
			manifestRes.status === 200 &&
				manifestJson.short_name === 'Organic-OG' &&
				manifestJson.display === 'standalone' &&
				manifestJson.icons?.[0]?.src === '/favicon.svg',
			'GET /site.webmanifest returns valid PWA web manifest'
		);

		// 8. Test SEO & Schema.org on Root Page
		const pageRes = await fetch(`${BASE_URL}/`);
		const pageHtml = await pageRes.text();
		assert(
			pageRes.status === 200 &&
				pageHtml.includes('Organic-OG') &&
				pageHtml.includes('property="og:image"') &&
				pageHtml.includes('name="twitter:card"') &&
				pageHtml.includes('application/ld+json') &&
				pageHtml.includes('Privacy') &&
				pageHtml.includes('Terms'),
			'GET / renders title, OpenGraph tags, Twitter cards, and Footer links'
		);

		// 9. Test Legal Pages (Privacy, Terms, Refunds, Impressum)
		const privacyRes = await fetch(`${BASE_URL}/privacy`);
		const privacyHtml = await privacyRes.text();
		assert(
			privacyRes.status === 200 &&
				privacyHtml.includes('Privacy Policy') &&
				privacyHtml.includes('Data Controller'),
			'GET /privacy renders yaxa-svelte LegalDocument'
		);

		const termsRes = await fetch(`${BASE_URL}/terms`);
		const termsHtml = await termsRes.text();
		assert(
			termsRes.status === 200 && termsHtml.includes('Terms of Service'),
			'GET /terms renders yaxa-svelte LegalDocument'
		);

		const refundsRes = await fetch(`${BASE_URL}/refunds`);
		const refundsHtml = await refundsRes.text();
		assert(
			refundsRes.status === 200 &&
				(refundsHtml.includes('Cancellation &amp; Refund') ||
					refundsHtml.includes('Cancellation & Refund')),
			'GET /refunds renders yaxa-svelte LegalDocument'
		);
	} catch (err: unknown) {
		console.error(
			'\n🚨 Network or execution failure during test run:',
			err instanceof Error ? err.message : String(err)
		);
		failed++;
	}

	console.log(`\n========================================`);
	console.log(`Summary: ${passed} passed, ${failed} failed`);
	console.log(`========================================\n`);

	if (failed > 0) process.exit(1);
}

runVerification();
