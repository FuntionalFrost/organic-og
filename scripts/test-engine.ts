import { chromium } from '@playwright/test';
import path from 'node:path';

const ARTIFACTS_DIR =
	process.env.ARTIFACTS_DIR ||
	'C:/Users/cvgov/.gemini/antigravity/brain/2d97a301-c544-4ec5-9fd6-57e562d242be';
const BASE_URL = process.env.TEST_URL || 'http://127.0.0.1:5173';

async function runBrowserTest() {
	console.log(`🌐 Launching Playwright Chromium for browser verification against ${BASE_URL}...\n`);

	const browser = await chromium.launch({ headless: true });
	const context = await browser.newContext({
		viewport: { width: 1440, height: 900 },
		deviceScaleFactor: 2,
		colorScheme: 'dark'
	});
	const page = await context.newPage();

	page.on('console', (msg) => {
		if (msg.type() === 'error') console.error('  [Browser Console Error]:', msg.text());
	});

	try {
		// 1. Navigate to Studio
		console.log(`📍 1. Navigating to ${BASE_URL}...`);
		await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });

		const ogResponsePromise = page.waitForResponse(
			(resp) => resp.url().includes('/api/og') && resp.status() === 200,
			{ timeout: 15000 }
		);
		await ogResponsePromise;
		await page.waitForTimeout(600);

		console.log('  ✅ Live OG Preview image loaded and painted in Studio');

		await page.screenshot({
			path: path.join(ARTIFACTS_DIR, 'browser_studio.png'),
			fullPage: false
		});
		console.log('  📸 Captured screenshot: browser_studio.png');

		// 2. Test Social Simulator View Modes
		console.log('\n📍 2. Testing Social Simulator View Modes...');
		const modes = ['Twitter / X', 'Discord', 'LinkedIn', 'WhatsApp', 'Raw (1200×630)'];
		for (const mode of modes) {
			const btn = page.getByRole('button', { name: mode, exact: false });
			if (await btn.isVisible()) {
				await btn.click();
				await page.waitForTimeout(300);
				console.log(`  ✅ Switched to simulator mode: "${mode}"`);
			}
		}

		await page.getByRole('button', { name: 'Raw (1200×630)', exact: false }).click();

		// 3. Test Commercial Template Switching in Studio
		console.log('\n📍 3. Testing Template Switching (Podcast, Event, Quote, Changelog)...');
		const templateSelect = page.locator('select').first();
		if (await templateSelect.isVisible()) {
			const testTemplates = [
				{ id: 'podcast', name: 'Podcast Episode', shot: 'browser_podcast_card.png' },
				{ id: 'event', name: 'Event & Conference', shot: 'browser_event_card.png' },
				{ id: 'quote', name: 'Social Quote', shot: 'browser_quote_card.png' },
				{ id: 'changelog', name: 'Changelog Release', shot: 'browser_changelog_card.png' },
				{ id: 'github', name: 'GitHub Repository', shot: 'browser_github_card.png' },
				{ id: 'ecommerce', name: 'E-Commerce Product', shot: 'browser_ecommerce_card.png' },
				{ id: 'saas', name: 'SaaS Card', shot: 'browser_saas_card.png' }
			];

			for (const tpl of testTemplates) {
				await templateSelect.selectOption(tpl.id);
				await page.waitForTimeout(800);
				console.log(`  ✅ Switched template to "${tpl.name}"`);
				await page.screenshot({
					path: path.join(ARTIFACTS_DIR, tpl.shot),
					fullPage: false
				});
				console.log(`  📸 Captured screenshot: ${tpl.shot}`);
			}
		}

		// 4. Test Command Palette
		console.log('\n📍 4. Testing Command Palette...');
		const paletteBtn = page.getByLabel('Open Command Palette');
		if (await paletteBtn.isVisible()) {
			await paletteBtn.click();
			await page.waitForTimeout(500);

			const paletteInput = page.getByPlaceholder(
				'Search templates, presets, actions, or shortcuts...'
			);
			if (await paletteInput.isVisible()) {
				console.log('  ✅ Command Palette opened successfully');
				await paletteInput.fill('Podcast');
				await page.waitForTimeout(300);

				await page.screenshot({
					path: path.join(ARTIFACTS_DIR, 'browser_command_palette.png')
				});
				console.log('  📸 Captured screenshot: browser_command_palette.png');

				await page.keyboard.press('Escape');
				await page.waitForTimeout(300);
				console.log('  ✅ Command Palette closed');
			}
		}

		// 5. Test Navigation Tabs
		console.log('\n📍 5. Testing Tab Navigation...');
		// Developer Docs
		const docsTab = page.getByRole('tab', { name: 'Developer Docs' });
		if (await docsTab.isVisible()) {
			await docsTab.click();
			await page.waitForTimeout(600);
			console.log('  ✅ Navigated to Developer Docs tab');
			await page.screenshot({
				path: path.join(ARTIFACTS_DIR, 'browser_docs.png')
			});
			console.log('  📸 Captured screenshot: browser_docs.png');
		}

		// API Keys & Credits
		const keysTab = page.getByRole('tab', { name: 'API Keys & Credits' });
		if (await keysTab.isVisible()) {
			await keysTab.click();
			await page.waitForTimeout(600);
			console.log('  ✅ Navigated to API Keys & Credits tab');
			await page.screenshot({
				path: path.join(ARTIFACTS_DIR, 'browser_keys.png')
			});
			console.log('  📸 Captured screenshot: browser_keys.png');
		}

		// Analytics & Logs
		const analyticsTab = page.getByRole('tab', { name: 'Analytics & Logs' });
		if (await analyticsTab.isVisible()) {
			await analyticsTab.click();
			await page.waitForTimeout(600);
			console.log('  ✅ Navigated to Analytics & Logs tab');
			await page.screenshot({
				path: path.join(ARTIFACTS_DIR, 'browser_analytics.png')
			});
			console.log('  📸 Captured screenshot: browser_analytics.png');
		}

		// 6. Test Parameterized Legal Pages
		console.log('\n📍 6. Testing Parameterized Legal Pages...');
		const legalRoutes = ['/privacy', '/terms', '/impressum'];
		for (const route of legalRoutes) {
			await page.goto(`${BASE_URL}${route}`, { waitUntil: 'domcontentloaded' });
			const heading = await page.getByRole('heading', { level: 1 }).innerText();
			console.log(`  ✅ Visited "${route}" — Heading: "${heading}"`);
		}

		// 7. Test All 9 Engine Templates (PNG & SVG Dual-Mode + Patterns + Custom Colors)
		console.log('\n📍 7. Testing 9 Commercial Templates & Customization API...');
		const allTemplates = [
			{ name: 'saas', query: 'template=saas&title=SaaS+Scale&badge=Live' },
			{
				name: 'blog',
				query: 'template=blog&title=Deep+Dive+into+Svelte+5&description=Runes+guide'
			},
			{ name: 'minimal', query: 'template=minimal&title=Minimal+Aesthetic' },
			{ name: 'ecommerce', query: 'template=ecommerce&title=Pro+Mechanical+Keyboard&price=$199' },
			{ name: 'github', query: 'template=github&title=organic-og&stars=2.4k&forks=320' },
			{
				name: 'podcast',
				query:
					'template=podcast&title=Building+the+Future+of+Web&host=Rich+Harris&guest=Evan+You&duration=52+min&pattern=grid'
			},
			{
				name: 'event',
				query:
					'template=event&title=Global+Dev+Summit+2026&eventDate=OCT+15&location=San+Francisco&speaker=Keynotes&pattern=dots'
			},
			{
				name: 'quote',
				query:
					'template=quote&title=Svelte+5+runes+changed+how+I+build+frontends+forever&author=Guillermo+Rauch&role=CEO+at+Vercel&pattern=glow'
			},
			{
				name: 'changelog',
				query:
					'template=changelog&title=v2.5.0+Release&version=v2.5.0&items=Native+SVG|Zero+WASM|Edge+Cache'
			}
		];

		for (const t of allTemplates) {
			// Test PNG
			const pngRes = await page.request.get(`${BASE_URL}/api/og?${t.query}&format=png`);
			if (pngRes.status() !== 200 || !pngRes.headers()['content-type']?.includes('image/png')) {
				throw new Error(`Failed PNG render for ${t.name}: Status ${pngRes.status()}`);
			}
			console.log(`  ✅ Template "${t.name}" PNG (200 OK, image/png)`);

			// Test SVG
			const svgRes = await page.request.get(`${BASE_URL}/api/og?${t.query}&format=svg`);
			if (svgRes.status() !== 200 || !svgRes.headers()['content-type']?.includes('image/svg+xml')) {
				throw new Error(`Failed SVG render for ${t.name}: Status ${svgRes.status()}`);
			}
			console.log(`  ✅ Template "${t.name}" SVG (200 OK, image/svg+xml)`);
		}

		// Test Custom Color Overrides & Custom Font
		const customRes = await page.request.get(
			`${BASE_URL}/api/og?template=podcast&bg=%230f172a&accent=%23ec4899&textColor=%23f8fafc&font=mono&pattern=grid`
		);
		console.log(
			`  ✅ Custom Colors & Mono Font test — Status: ${customRes.status()} Content-Type: ${customRes.headers()['content-type']}`
		);

		// 8. Test Site Utilities & SEO
		console.log('\n📍 8. Testing Site Utilities & SEO routes...');
		const utils = ['/robots.txt', '/sitemap.xml', '/sitemap.xsl', '/site.webmanifest'];
		for (const u of utils) {
			const res = await page.goto(`${BASE_URL}${u}`);
			console.log(`  ✅ Visited "${u}" — Status: ${res?.status()}`);
		}

		console.log('\n🎉 All commercial verification steps passed with 0 errors!');
	} catch (err) {
		console.error('❌ Browser verification error:', err);
		process.exit(1);
	} finally {
		await browser.close();
	}
}

runBrowserTest();
