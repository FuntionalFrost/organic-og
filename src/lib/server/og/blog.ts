import type { TemplateProps } from './types';
import {
	type ResolvedTheme,
	createSvgLogo,
	escapeXml,
	wrapSvgText,
	renderSvgMultilineText
} from './helpers';

export function renderBlogTemplate(props: TemplateProps, theme: ResolvedTheme): string {
	const titleLines = wrapSvgText(props.title, 36, 3);
	const descLines = props.description ? wrapSvgText(props.description, 58, 2) : [];

	let currentY = 100;
	const logoSvg = props.logoDataUri ? createSvgLogo(props.logoDataUri, 568, currentY, 64, 32) : '';
	if (props.logoDataUri) currentY += 84;

	const badgeSvg = props.badge
		? `<text x="600" y="${currentY}" font-family="Inter, -apple-system, sans-serif" font-size="18" font-weight="700" fill="${theme.accentColor}" letter-spacing="0.1em" text-anchor="middle">${escapeXml(props.badge.toUpperCase())}</text>`
		: '';
	if (props.badge) currentY += 48;

	const titleSvg = renderSvgMultilineText({
		lines: titleLines,
		x: 600,
		y: currentY + 20,
		dy: 66,
		fontSize: 56,
		fontWeight: 800,
		fill: theme.textColor,
		letterSpacing: '-0.02em',
		textAnchor: 'middle'
	});

	const descYStart = currentY + 20 + titleLines.length * 66 + 10;
	const descSvg = renderSvgMultilineText({
		lines: descLines,
		x: 600,
		y: descYStart,
		dy: 36,
		fontSize: 24,
		fontWeight: 400,
		fill: theme.subtextColor,
		textAnchor: 'middle'
	});

	const siteNameSvg = props.siteName
		? `<text x="600" y="560" font-family="Inter, -apple-system, sans-serif" font-size="20" font-weight="700" fill="${theme.subtextColor}" text-anchor="middle">${escapeXml(props.siteName)}</text>`
		: '';

	return `
		${logoSvg}
		${badgeSvg}
		${titleSvg}
		${descSvg}
		${siteNameSvg}
	`;
}
