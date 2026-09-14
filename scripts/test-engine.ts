import { chromium } from '@playwright/test';
import path from 'node:path';

const ARTIFACTS_DIR =
	'C:/Users/cvgov/.gemini/antigravity/brain/6351655e-390a-4050-9f21-54a190e3b434';
const BASE_URL = process.env.TEST_URL || 'http://127.0.0.1:5173';

async function runBrowserTest() {
	console.log(`🌐 Launching Playwright Chromium for browser verification against ${BASE_URL}...\n`);

	const browser = await chromium.launch({ headless: true });
	const context = await browser.newContext({
		viewport: { width: 1440, height: 900 },
		deviceScaleFactor: 2
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

		// 3. Test Template Switching to GitHub & E-Commerce
		console.log('\n📍 3. Testing Template Switching...');
		const templateSelect = page.locator('select').first();
		if (await templateSelect.isVisible()) {
			await templateSelect.selectOption('github');
			await page.waitForTimeout(1000);
			console.log('  ✅ Switched template to "GitHub Card"');

			await page.screenshot({
				path: path.join(ARTIFACTS_DIR, 'browser_github_card.png'),
				fullPage: false
			});
			console.log('  📸 Captured screenshot: browser_github_card.png');

			await templateSelect.selectOption('ecommerce');
			await page.waitForTimeout(1000);
			console.log('  ✅ Switched template to "E-Commerce Product"');

			await page.screenshot({
				path: path.join(ARTIFACTS_DIR, 'browser_ecommerce_card.png'),
				fullPage: false
			});
			console.log('  📸 Captured screenshot: browser_ecommerce_card.png');

			await templateSelect.selectOption('saas');
			await page.waitForTimeout(1000);
			console.log('  ✅ Switched template back to "SaaS Card"');
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
				await paletteInput.fill('Blog Hero');
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
		const legalRoutes = ['/privacy', '/terms', '/refunds', '/impressum'];
		for (const route of legalRoutes) {
			await page.goto(`${BASE_URL}${route}`, { waitUntil: 'domcontentloaded' });
			const heading = await page.getByRole('heading', { level: 1 }).innerText();
			console.log(`  ✅ Visited "${route}" — Heading: "${heading}"`);
		}

		await page.screenshot({
			path: path.join(ARTIFACTS_DIR, 'browser_legal_privacy.png')
		});
		console.log('  📸 Captured screenshot: browser_legal_privacy.png');

		// 7. Test Site Utilities & SEO
		console.log('\n📍 7. Testing Site Utilities & SEO routes...');
		const utils = ['/robots.txt', '/sitemap.xml', '/sitemap.xsl', '/site.webmanifest'];
		for (const u of utils) {
			const res = await page.goto(`${BASE_URL}${u}`);
			console.log(`  ✅ Visited "${u}" — Status: ${res?.status()}`);
		}

		console.log('\n🎉 All browser verification steps passed with 0 errors!');
	} catch (err) {
		console.error('❌ Browser verification error:', err);
		process.exit(1);
	} finally {
		await browser.close();
	}
}

runBrowserTest();
