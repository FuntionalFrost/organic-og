import type { TemplateProps } from './types';
import {
	type ResolvedTheme,
	createSvgBadge,
	createSvgLogo,
	createCheckIconSvg,
	escapeXml,
	wrapSvgText,
	renderSvgMultilineText
} from './helpers';

export function renderChangelogTemplate(props: TemplateProps, theme: ResolvedTheme): string {
	const titleLines = wrapSvgText(props.title, 34, 2);
	const siteName = props.siteName || 'Product Changelog';
	const version = props.version || props.badge || 'v2.5.0 Release';
	const rawItems =
		props.items ||
		props.description ||
		'Native SVG Engine | Zero WASM Resvg | Distributed Edge Caching';
	const bulletItems = rawItems
		.split(/[|\n,]/)
		.map((s) => s.trim())
		.filter(Boolean)
		.slice(0, 3);

	// Top Bar: Version Badge & Logo
	const versionBadge = createSvgBadge(version, theme, 80, 60);
	const versionBadgeWidth = Math.max(90, version.length * 11 + 32);

	const siteNameSvg = `
		<text x="${80 + versionBadgeWidth + 20}" y="85" font-family="Inter, -apple-system, sans-serif" font-size="22" font-weight="700" fill="${theme.subtextColor}">
			${escapeXml(siteName)}
		</text>
	`;

	const logoSvg = props.logoDataUri ? createSvgLogo(props.logoDataUri, 1056, 60, 64, 16) : '';

	// Title
	const titleYStart = 175;
	const titleSvg = renderSvgMultilineText({
		lines: titleLines,
		x: 80,
		y: titleYStart,
		dy: 62,
		fontSize: 52,
		fontWeight: 800,
		fill: theme.textColor,
		letterSpacing: '-0.02em'
	});

	// Highlight Bullets
	const bulletYStart = titleYStart + titleLines.length * 62 + 25;
	const bulletsSvg = bulletItems
		.map((item, i) => {
			const yPos = bulletYStart + i * 56;
			return `
			<g transform="translate(80, ${yPos})">
				<rect width="1040" height="46" rx="12" fill="${theme.cardBg}" stroke="${theme.borderColor}" stroke-width="1" />
				${createCheckIconSvg(14, 12, 22, theme.accentColor)}
				<text x="48" y="29" font-family="Inter, -apple-system, sans-serif" font-size="21" font-weight="600" fill="${theme.textColor}">${escapeXml(item)}</text>
			</g>
		`;
		})
		.join('');

	return `
		${versionBadge}
		${siteNameSvg}
		${logoSvg}
		${titleSvg}
		${bulletsSvg}
	`;
}
