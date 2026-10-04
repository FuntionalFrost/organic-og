// server/templates/helpers.ts
import type { ThemeMode, ResolvedTheme, PatternType, FontType } from './types';
export type { ThemeMode, ResolvedTheme, PatternType, FontType };

/** Sanitize and validate custom CSS/SVG color expressions */
export function sanitizeColor(color: string | undefined, fallback: string): string {
	if (!color) return fallback;
	const trimmed = color.trim();
	// Valid hex, rgb, rgba, hsl, hsla, or standard named colors
	if (/^#([0-9a-fA-F]{3,8})$/.test(trimmed)) return trimmed;
	if (/^(rgb|rgba|hsl|hsla)\([^)]+\)$/.test(trimmed)) return trimmed;
	if (/^[a-zA-Z]{3,20}$/.test(trimmed)) return trimmed;
	return fallback;
}

export function resolveTheme(
	theme: ThemeMode,
	custom?: { bg?: string; accent?: string; textColor?: string }
): ResolvedTheme {
	const isBrand = theme === 'brand';
	const isDark = theme === 'dark';

	const defaultBg = isBrand
		? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
		: isDark
			? '#09090b'
			: '#f8fafc';

	const defaultTextColor = isDark || isBrand ? '#ffffff' : '#0f172a';
	const defaultSubtextColor = isDark || isBrand ? '#94a3b8' : '#475569';
	const defaultAccent = isBrand ? '#a78bfa' : '#3b82f6';
	const defaultCardBg = isDark || isBrand ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)';
	const defaultBorder = isDark || isBrand ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)';

	const bg = custom?.bg ? sanitizeColor(custom.bg, defaultBg) : defaultBg;
	const textColor = custom?.textColor
		? sanitizeColor(custom.textColor, defaultTextColor)
		: defaultTextColor;
	const accentColor = custom?.accent ? sanitizeColor(custom.accent, defaultAccent) : defaultAccent;

	return {
		isBrand,
		isDark,
		bg,
		textColor,
		subtextColor: defaultSubtextColor,
		accentColor,
		cardBg: defaultCardBg,
		borderColor: defaultBorder
	};
}

/** Universal SVG Background with theme gradient support */
export function renderSvgBackground(theme: ResolvedTheme): string {
	if (theme.isBrand) {
		return `
			<defs>
				<linearGradient id="og-brand-bg" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" stop-color="#4f46e5" />
					<stop offset="100%" stop-color="#7c3aed" />
				</linearGradient>
			</defs>
			<rect width="1200" height="630" fill="url(#og-brand-bg)" />
		`.trim();
	}
	return `<rect width="1200" height="630" fill="${theme.bg}" />`;
}

/** Reusable Multiline SVG Text Generator */
export function renderSvgMultilineText(options: {
	lines: string[];
	x: number | string;
	y: number;
	dy?: number;
	fontSize: number;
	fontWeight?: number | string;
	fontStyle?: string;
	fill: string;
	letterSpacing?: string;
	textAnchor?: 'start' | 'middle' | 'end';
	fontFamily?: string;
}): string {
	const {
		lines,
		x,
		y,
		dy = 40,
		fontSize,
		fontWeight = 400,
		fontStyle,
		fill,
		letterSpacing = 'normal',
		textAnchor = 'start',
		fontFamily = 'Inter, -apple-system, sans-serif'
	} = options;

	if (!lines || lines.length === 0) return '';

	return `
		<text x="${x}" y="${y}" font-family="${fontFamily}" font-size="${fontSize}" font-weight="${fontWeight}" ${fontStyle ? `font-style="${fontStyle}"` : ''} fill="${fill}" letter-spacing="${letterSpacing}" ${textAnchor !== 'start' ? `text-anchor="${textAnchor}"` : ''}>
			${lines.map((line, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : dy}">${escapeXml(line)}</tspan>`).join('')}
		</text>
	`.trim();
}

/** Get Font Family CSS definition */
export function resolveFontFamily(font: FontType = 'inter'): string {
	switch (font) {
		case 'mono':
			return `'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
		case 'outfit':
			return `'Outfit', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif`;
		case 'serif':
			return `'Playfair Display', 'Merriweather', Georgia, Cambria, 'Times New Roman', serif`;
		case 'inter':
		default:
			return `'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
	}
}

/** XML Special Characters Escaping */
export function escapeXml(unsafe: string | null | undefined): string {
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
			<text x="${width / 2}" y="24" font-size="15" font-weight="700" fill="#ffffff" text-anchor="middle">${escaped}</text>
		</g>
	`;
}

/** Embedded Base64 / Remote Image Logo or Avatar */
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

/** Zero-WASM Pattern Overlay Layer (Grid, Dots, Glow) */
export function createSvgPatternOverlay(
	pattern: PatternType = 'none',
	theme: ResolvedTheme
): string {
	if (pattern === 'grid') {
		const strokeColor =
			theme.isDark || theme.isBrand ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.05)';
		return `
			<defs>
				<pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
					<path d="M 40 0 L 0 0 0 40" fill="none" stroke="${strokeColor}" stroke-width="1" />
				</pattern>
			</defs>
			<rect width="1200" height="630" fill="url(#grid-pattern)" />
		`;
	}

	if (pattern === 'dots') {
		const dotColor =
			theme.isDark || theme.isBrand ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)';
		return `
			<defs>
				<pattern id="dots-pattern" width="30" height="30" patternUnits="userSpaceOnUse">
					<circle cx="2" cy="2" r="1.5" fill="${dotColor}" />
				</pattern>
			</defs>
			<rect width="1200" height="630" fill="url(#dots-pattern)" />
		`;
	}

	if (pattern === 'glow') {
		return `
			<defs>
				<radialGradient id="glow-grad" cx="80%" cy="20%" r="60%">
					<stop offset="0%" stop-color="${theme.accentColor}" stop-opacity="0.25" />
					<stop offset="100%" stop-color="${theme.accentColor}" stop-opacity="0" />
				</radialGradient>
			</defs>
			<rect width="1200" height="630" fill="url(#glow-grad)" />
		`;
	}

	return '';
}

/** High-Fidelity Audio Sound Waveform Bar */
export function createWaveformSvg(
	x: number,
	y: number,
	width: number,
	height: number,
	color: string
): string {
	const barCount = 32;
	const barWidth = Math.floor(width / (barCount * 1.6));
	const gap = Math.floor((width - barCount * barWidth) / (barCount - 1));
	const heights = [
		20, 35, 60, 45, 80, 100, 75, 40, 65, 90, 100, 85, 60, 30, 50, 70, 95, 80, 55, 40, 75, 90, 60,
		45, 70, 85, 60, 40, 30, 20, 15, 10
	];

	return `
		<g transform="translate(${x}, ${y})">
			${heights
				.map((hPercent, i) => {
					const barH = Math.max(4, Math.round((hPercent / 100) * height));
					const barY = Math.round((height - barH) / 2);
					const barX = i * (barWidth + gap);
					return `<rect x="${barX}" y="${barY}" width="${barWidth}" height="${barH}" rx="${Math.min(3, barWidth / 2)}" fill="${color}" opacity="${0.4 + (hPercent / 100) * 0.6}" />`;
				})
				.join('')}
		</g>
	`;
}

/** Microphone Vector Icon */
export function createMicIconSvg(x: number, y: number, size = 20, color = '#ffffff'): string {
	return `
		<g transform="translate(${x}, ${y})">
			<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" transform="scale(${size / 24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
			<path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" transform="scale(${size / 24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
		</g>
	`;
}

/** Clock / Duration Vector Icon */
export function createClockIconSvg(x: number, y: number, size = 20, color = '#ffffff'): string {
	return `
		<g transform="translate(${x}, ${y})">
			<circle cx="12" cy="12" r="10" transform="scale(${size / 24})" fill="none" stroke="${color}" stroke-width="2" />
			<polyline points="12 6 12 12 16 14" transform="scale(${size / 24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
		</g>
	`;
}

/** Calendar Vector Icon */
export function createCalendarIconSvg(x: number, y: number, size = 20, color = '#ffffff'): string {
	return `
		<g transform="translate(${x}, ${y})">
			<rect x="3" y="4" width="18" height="18" rx="2" ry="2" transform="scale(${size / 24})" fill="none" stroke="${color}" stroke-width="2" />
			<line x1="16" y1="2" x2="16" y2="6" transform="scale(${size / 24})" stroke="${color}" stroke-width="2" stroke-linecap="round" />
			<line x1="8" y1="2" x2="8" y2="6" transform="scale(${size / 24})" stroke="${color}" stroke-width="2" stroke-linecap="round" />
			<line x1="3" y1="10" x2="21" y2="10" transform="scale(${size / 24})" stroke="${color}" stroke-width="2" />
		</g>
	`;
}

/** Map Pin / Location Vector Icon */
export function createMapPinIconSvg(x: number, y: number, size = 20, color = '#ffffff'): string {
	return `
		<g transform="translate(${x}, ${y})">
			<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" transform="scale(${size / 24})" fill="none" stroke="${color}" stroke-width="2" />
			<circle cx="12" cy="10" r="3" transform="scale(${size / 24})" fill="none" stroke="${color}" stroke-width="2" />
		</g>
	`;
}

/** Large Quote Mark Vector */
export function createQuoteIconSvg(
	x: number,
	y: number,
	size = 64,
	color = 'rgba(255, 255, 255, 0.15)'
): string {
	return `
		<g transform="translate(${x}, ${y})">
			<path d="M3 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2H4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h3c0 4-2 6-4 6v2zm13 0c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h3c0 4-2 6-4 6v2z" transform="scale(${size / 24})" fill="${color}" />
		</g>
	`;
}

/** Checkmark Vector Icon */
export function createCheckIconSvg(x: number, y: number, size = 20, color = '#22c55e'): string {
	return `
		<g transform="translate(${x}, ${y})">
			<circle cx="12" cy="12" r="10" transform="scale(${size / 24})" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="1.5" />
			<polyline points="9 12 11 14 15 10" transform="scale(${size / 24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
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
			<text x="100" y="23" font-size="13" font-weight="600" fill="#ffffff" text-anchor="middle">Created with Organic-OG</text>
		</g>
	`;
}
