/**
 * Lightweight Zero-Browser HTTP Integration Probe
 * Uses native fetch to verify a running Organic-OG server without Playwright or Chromium.
 */

const BASE_URL = process.env.TEST_URL || 'http://127.0.0.1:5173';

async function runProbe() {
	console.log(`🌐 Running Zero-Browser HTTP verification against ${BASE_URL}...\n`);

	const templates = [
		{ name: 'saas', query: 'template=saas&title=SaaS+Scale&badge=Live' },
		{ name: 'blog', query: 'template=blog&title=Deep+Dive+into+Svelte+5&description=Runes' },
		{ name: 'minimal', query: 'template=minimal&title=Minimal+Aesthetic' },
		{ name: 'ecommerce', query: 'template=ecommerce&title=Pro+Keyboard&price=$199' },
		{ name: 'github', query: 'template=github&title=organic-og&stars=2.4k&forks=320' },
		{
			name: 'podcast',
			query:
				'template=podcast&title=Building+the+Future&host=Rich+Harris&guest=Evan+You&duration=52+min&pattern=grid'
		},
		{
			name: 'event',
			query:
				'template=event&title=Global+Dev+Summit&eventDate=OCT+15&location=San+Francisco&pattern=dots'
		},
		{
			name: 'quote',
			query:
				'template=quote&title=Svelte+5+runes+are+amazing&author=Guillermo+Rauch&role=CEO&pattern=glow'
		},
		{
			name: 'changelog',
			query: 'template=changelog&title=v2.5.0+Release&version=v2.5.0&items=SVG|Zero+WASM|Cache'
		}
	];

	try {
		// 1. Verify health endpoint
		console.log('📍 1. Testing /api/health...');
		const healthRes = await fetch(`${BASE_URL}/api/health`);
		if (!healthRes.ok) throw new Error(`Health check failed: Status ${healthRes.status}`);
		console.log(`  ✅ Health check passed (${healthRes.status} OK)`);

		// 2. Verify all 9 templates in both PNG & SVG formats
		console.log('\n📍 2. Testing 9 Commercial Templates (PNG & SVG Dual-Mode)...');
		for (const t of templates) {
			// PNG
			const pngRes = await fetch(`${BASE_URL}/api/og?${t.query}&format=png`);
			if (!pngRes.ok || !pngRes.headers.get('content-type')?.includes('image/png')) {
				throw new Error(`Failed PNG render for ${t.name}: Status ${pngRes.status}`);
			}
			console.log(`  ✅ Template "${t.name}" PNG (200 OK, image/png)`);

			// SVG
			const svgRes = await fetch(`${BASE_URL}/api/og?${t.query}&format=svg`);
			if (!svgRes.ok || !svgRes.headers.get('content-type')?.includes('image/svg+xml')) {
				throw new Error(`Failed SVG render for ${t.name}: Status ${svgRes.status}`);
			}
			console.log(`  ✅ Template "${t.name}" SVG (200 OK, image/svg+xml)`);
		}

		// 3. Test custom colors and font overrides
		console.log('\n📍 3. Testing Custom Color Overrides & Typography...');
		const customRes = await fetch(
			`${BASE_URL}/api/og?template=podcast&bg=%230f172a&accent=%23ec4899&textColor=%23f8fafc&font=mono&pattern=grid`
		);
		if (!customRes.ok) throw new Error(`Custom overrides failed: Status ${customRes.status}`);
		console.log(`  ✅ Custom overrides passed (${customRes.status} OK)`);

		// 4. Test SEO and site utility endpoints
		console.log('\n📍 4. Testing SEO & Utility Routes...');
		const routes = ['/robots.txt', '/sitemap.xml', '/sitemap.xsl', '/site.webmanifest'];
		for (const route of routes) {
			const res = await fetch(`${BASE_URL}${route}`);
			if (!res.ok) throw new Error(`Failed route "${route}": Status ${res.status}`);
			console.log(`  ✅ Visited "${route}" (${res.status} OK)`);
		}

		console.log('\n🎉 All zero-browser probe tests passed with 0 errors!');
	} catch (err) {
		console.error('❌ Probe error:', err);
		process.exit(1);
	}
}

runProbe();
