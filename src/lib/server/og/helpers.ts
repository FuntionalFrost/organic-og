// server/templates/helpers.ts
import type { ThemeMode, ResolvedTheme } from './types';

export function resolveTheme(theme: ThemeMode): ResolvedTheme {
	const isBrand = theme === 'brand';
	const isDark = theme === 'dark';

	return {
		isBrand,
		isDark,
		bg: isBrand
			? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
			: isDark
				? '#09090b'
				: '#f8fafc',
		textColor: isDark || isBrand ? '#ffffff' : '#0f172a',
		subtextColor: isDark || isBrand ? '#94a3b8' : '#475569',
		accentColor: isBrand ? '#a78bfa' : '#3b82f6',
		cardBg: isDark || isBrand ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
		borderColor: isDark || isBrand ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'
	};
}

/** XML Special Characters Escaping */
export function escapeXml(unsafe: string): string {
	if (!unsafe) return '';
	return String(unsafe)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

/** Smart Word Wrapping for SVG Text */
export function wrapSvgText(text: string, maxCharsPerLine: number, maxLines = 3): string[] {
	if (!text) return [];
	const words = text.trim().split(/\s+/);
	const lines: string[] = [];
	let currentLine = '';

	for (const word of words) {
		if (!currentLine) {
			currentLine = word;
		} else if ((currentLine + ' ' + word).length <= maxCharsPerLine) {
			currentLine += ' ' + word;
		} else {
			lines.push(currentLine);
			currentLine = word;
			if (lines.length >= maxLines - 1) {
				break;
			}
		}
	}
	if (currentLine && lines.length < maxLines) {
		lines.push(currentLine);
	}
	return lines;
}

/** Native SVG Badge Pill */
export function createSvgBadge(label: string, theme: ResolvedTheme, x: number, y: number): string {
	if (!label) return '';
	const escaped = escapeXml(label);
	const width = Math.max(90, escaped.length * 11 + 32);
	const height = 36;
	const bgFill = theme.isBrand ? '#1e1b4b' : theme.accentColor;
	const strokeAttr = theme.isBrand ? 'stroke="rgba(99, 102, 241, 0.4)" stroke-width="1"' : '';

	return `
		<g transform="translate(${x}, ${y})">
			<rect width="${width}" height="${height}" rx="18" fill="${bgFill}" ${strokeAttr} />
			<text x="${width / 2}" y="24" font-family="Inter, -apple-system, sans-serif" font-size="16" font-weight="700" fill="#ffffff" text-anchor="middle">${escaped}</text>
		</g>
	`;
}

/** Embedded Base64 / Remote Image Logo */
export function createSvgLogo(
	url: string | null | undefined,
	x: number,
	y: number,
	size = 64,
	rx = 16
): string {
	if (!url) return '';
	const clipId = `logo-clip-${Math.random().toString(36).substring(2, 8)}`;
	return `
		<g transform="translate(${x}, ${y})">
			<defs>
				<clipPath id="${clipId}">
					<rect width="${size}" height="${size}" rx="${rx}" ry="${rx}" />
				</clipPath>
			</defs>
			<rect width="${size}" height="${size}" rx="${rx}" fill="rgba(255, 255, 255, 0.1)" stroke="rgba(255, 255, 255, 0.15)" stroke-width="2" />
			<image href="${escapeXml(url)}" width="${size}" height="${size}" clip-path="url(#${clipId})" preserveAspectRatio="xMidYMid slice" />
		</g>
	`;
}

/** Star Vector Icon */
export function createStarIconSvg(x: number, y: number, size = 20): string {
	return `
		<g transform="translate(${x}, ${y})">
			<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" transform="scale(${size / 24})" fill="#eab308" />
		</g>
	`;
}

/** Fork Vector Icon */
export function createForkIconSvg(x: number, y: number, size = 20): string {
	return `
		<g transform="translate(${x}, ${y})">
			<path d="M6 3v12a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V3M18 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm6 12a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" transform="scale(${size / 24})" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
		</g>
	`;
}

/** Watermark for preview/demo renders */
export function createSvgWatermark(): string {
	return `
		<g transform="translate(940, 564)">
			<rect width="200" height="36" rx="8" fill="rgba(0, 0, 0, 0.75)" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1" />
			<text x="100" y="23" font-family="Inter, -apple-system, sans-serif" font-size="13" font-weight="600" fill="#ffffff" text-anchor="middle">Created with Organic-OG</text>
		</g>
	`;
}
