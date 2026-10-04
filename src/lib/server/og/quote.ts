import type { TemplateProps } from './types';
import {
	type ResolvedTheme,
	createSvgLogo,
	createQuoteIconSvg,
	createCheckIconSvg,
	escapeXml,
	wrapSvgText,
	renderSvgMultilineText
} from './helpers';

export function renderQuoteTemplate(props: TemplateProps, theme: ResolvedTheme): string {
	const rawQuoteLines = wrapSvgText(props.title, 34, 3);
	const quoteLines = rawQuoteLines.map((line, i) =>
		i === 0 && rawQuoteLines.length === 1
			? `“${line}”`
			: i === 0
				? `“${line}`
				: i === rawQuoteLines.length - 1
					? `${line}”`
					: line
	);

	const author = props.author || props.siteName || 'Alex Rivers';
	const handle = props.handle || '@alexrivers';
	const role = props.role || props.description || 'Founder & CEO at InnovateLab';

	// Huge Decorative Quotation Mark in Background
	const quoteWatermark = createQuoteIconSvg(
		80,
		50,
		110,
		theme.isDark || theme.isBrand ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'
	);

	// Quote Text
	const quoteSvg = renderSvgMultilineText({
		lines: quoteLines,
		x: 80,
		y: 170,
		dy: 58,
		fontSize: 44,
		fontWeight: 700,
		fontStyle: 'italic',
		fill: theme.textColor,
		letterSpacing: '-0.01em'
	});

	// Author Avatar & Info Card at Bottom
	const authorCardY = 460;
	const avatarSvg = props.logoDataUri
		? createSvgLogo(props.logoDataUri, 80, authorCardY, 84, 42)
		: `
		<g transform="translate(80, ${authorCardY})">
			<circle cx="42" cy="42" r="42" fill="${theme.accentColor}" />
			<text x="42" y="52" font-family="Inter, -apple-system, sans-serif" font-size="32" font-weight="800" fill="#ffffff" text-anchor="middle">${escapeXml(author.charAt(0))}</text>
		</g>
	`;

	const authorInfoSvg = `
		<g transform="translate(184, ${authorCardY + 12})">
			<text x="0" y="24" font-family="Inter, -apple-system, sans-serif" font-size="28" font-weight="800" fill="${theme.textColor}">${escapeXml(author)}</text>
			${createCheckIconSvg(escapeXml(author).length * 16 + 12, 6, 22, theme.accentColor)}
			<text x="0" y="56" font-family="Inter, -apple-system, sans-serif" font-size="20" font-weight="500" fill="${theme.subtextColor}">${escapeXml(handle)} · <tspan fill="${theme.accentColor}">${escapeXml(role)}</tspan></text>
		</g>
	`;

	// Accent accent line
	const accentBarSvg = `<rect x="80" y="574" width="1040" height="6" rx="3" fill="${theme.accentColor}" />`;

	return `
		${quoteWatermark}
		${quoteSvg}
		${avatarSvg}
		${authorInfoSvg}
		${accentBarSvg}
	`;
}
