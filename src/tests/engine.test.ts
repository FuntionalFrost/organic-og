import { describe, it, expect } from 'vitest';
import { getTemplateSvg, type TemplateName, type TemplateProps } from '#lib/server/og/index.js';
import { renderSvgToPng } from '#lib/server/og/resvg.js';

describe('Zero-WASM OpenGraph Template Engine', () => {
	const templates: TemplateName[] = [
		'saas',
		'blog',
		'minimal',
		'ecommerce',
		'github',
		'podcast',
		'event',
		'quote',
		'changelog'
	];

	const baseProps: TemplateProps = {
		title: 'Organic-OG Engine Test',
		description: 'Dynamic Zero-WASM social image generation',
		siteName: 'organic-og.vercel.app',
		badge: 'v2.0',
		theme: 'brand'
	};

	describe('SVG Generation for all 9 Commercial Templates', () => {
		for (const tpl of templates) {
			it(`generates valid 1200x630 SVG structure for "${tpl}" template`, () => {
				const props: TemplateProps = {
					...baseProps,
					price: '$199',
					rating: '5.0 ★★★★★',
					stars: '14.2k',
					forks: '1.2k',
					language: 'TypeScript',
					episode: 'EPISODE #42',
					host: 'Rich Harris',
					guest: 'Evan You',
					duration: '52 MIN',
					eventDate: 'OCTOBER 15, 2026',
					location: 'San Francisco, CA',
					speaker: 'Keynote Speaker',
					author: 'Guillermo Rauch',
					handle: '@rauchg',
					role: 'CEO at Vercel',
					version: 'v2.4.0',
					items: 'Zero-WASM SVG | Resvg Engine | Redis Cache'
				};

				const svg = getTemplateSvg(tpl, props);

				expect(typeof svg).toBe('string');
				expect(svg.startsWith('<svg')).toBe(true);
				expect(svg.endsWith('</svg>')).toBe(true);
				expect(svg).toContain('viewBox="0 0 1200 630"');
				expect(svg).toContain('width="1200"');
				expect(svg).toContain('height="630"');
				expect(svg).toContain('Organic-OG Engine Test');
			});
		}
	});

	describe('Visual Customization & Overrides', () => {
		it('supports pattern overlays: none, grid, dots, glow', () => {
			const noneSvg = getTemplateSvg('saas', { ...baseProps, pattern: 'none' });
			const gridSvg = getTemplateSvg('saas', { ...baseProps, pattern: 'grid' });
			const dotsSvg = getTemplateSvg('saas', { ...baseProps, pattern: 'dots' });
			const glowSvg = getTemplateSvg('saas', { ...baseProps, pattern: 'glow' });

			expect(gridSvg).toContain('id="grid-pattern"');
			expect(dotsSvg).toContain('id="dots-pattern"');
			expect(glowSvg).toContain('id="glow-grad"');
			expect(noneSvg).not.toContain('id="grid-pattern"');
			expect(noneSvg).not.toContain('id="dots-pattern"');
		});

		it('supports typography font presets', () => {
			const monoSvg = getTemplateSvg('saas', { ...baseProps, font: 'mono' });
			const outfitSvg = getTemplateSvg('saas', { ...baseProps, font: 'outfit' });
			const serifSvg = getTemplateSvg('quote', { ...baseProps, font: 'serif' });

			expect(monoSvg).toContain("'JetBrains Mono'");
			expect(outfitSvg).toContain("'Outfit'");
			expect(serifSvg).toContain("'Playfair Display'");
		});

		it('applies custom hex colors for background, accent, and text', () => {
			const customSvg = getTemplateSvg('saas', {
				...baseProps,
				theme: 'dark',
				customBg: '#0f172a',
				customAccent: '#ec4899',
				customTextColor: '#f8fafc'
			});

			expect(customSvg).toContain('fill="#0f172a"');
			expect(customSvg).toContain('fill="#ec4899"');
			expect(customSvg).toContain('fill="#f8fafc"');
		});

		it('embeds watermark only when explicitly enabled', () => {
			const cleanSvg = getTemplateSvg('saas', { ...baseProps, watermark: false });
			const watermarkedSvg = getTemplateSvg('saas', { ...baseProps, watermark: true });

			expect(cleanSvg).not.toContain('Created with Organic-OG');
			expect(watermarkedSvg).toContain('Created with Organic-OG');
		});
	});

	describe('Native Resvg Rasterizer (SVG -> PNG)', () => {
		it('renders SVG into binary PNG buffer with correct magic bytes', async () => {
			const svg = getTemplateSvg('saas', baseProps);
			const pngBuffer = await renderSvgToPng(svg, 1200);

			expect(Buffer.isBuffer(pngBuffer)).toBe(true);
			expect(pngBuffer.length).toBeGreaterThan(1000);

			// Check PNG signature: 89 50 4E 47 0D 0A 1A 0A
			const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
			expect(pngBuffer.subarray(0, 8).equals(pngSignature)).toBe(true);
		});
	});
});
