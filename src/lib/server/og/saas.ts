import type { TemplateProps } from './types';
import {
	type ResolvedTheme,
	createSvgBadge,
	createSvgLogo,
	escapeXml,
	wrapSvgText,
	renderSvgMultilineText
} from './helpers';

export function renderSaasTemplate(props: TemplateProps, theme: ResolvedTheme): string {
	const titleLines = wrapSvgText(props.title, 34, 3);
	const descLines = props.description ? wrapSvgText(props.description, 55, 2) : [];

	const badgeSvg = props.badge ? createSvgBadge(props.badge, theme, 80, 60) : '';
	const badgeWidth = props.badge ? Math.max(90, props.badge.length * 11 + 32) : 0;
	const siteNameX = props.badge ? 80 + badgeWidth + 18 : 80;

	const siteNameSvg = props.siteName
		? `<text x="${siteNameX}" y="85" font-family="Inter, -apple-system, sans-serif" font-size="24" font-weight="700" fill="${theme.subtextColor}">${escapeXml(props.siteName)}</text>`
		: '';

	const logoSvg = props.logoDataUri ? createSvgLogo(props.logoDataUri, 1056, 60, 64, 16) : '';

	const titleYStart = descLines.length > 0 ? 230 : 280;
	const titleSvg = renderSvgMultilineText({
		lines: titleLines,
		x: 80,
		y: titleYStart,
		dy: 70,
		fontSize: 58,
		fontWeight: 800,
		fill: theme.textColor,
		letterSpacing: '-0.02em'
	});

	const descYStart = titleYStart + titleLines.length * 70 + 20;
	const descSvg = renderSvgMultilineText({
		lines: descLines,
		x: 80,
		y: descYStart,
		dy: 38,
		fontSize: 26,
		fontWeight: 400,
		fill: theme.subtextColor
	});

	const accentBarSvg = `<rect x="80" y="556" width="1040" height="8" rx="4" fill="${theme.accentColor}" />`;

	return `
		${badgeSvg}
		${siteNameSvg}
		${logoSvg}
		${titleSvg}
		${descSvg}
		${accentBarSvg}
	`;
}
