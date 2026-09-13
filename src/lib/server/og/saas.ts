import type { TemplateProps } from './types';
import { resolveTheme, createSvgBadge, createSvgLogo, escapeXml, wrapSvgText } from './helpers';

export function renderSaasTemplate(props: TemplateProps): string {
	const theme = resolveTheme(props.theme);
	const titleLines = wrapSvgText(props.title, 34, 3);
	const descLines = props.description ? wrapSvgText(props.description, 55, 2) : [];

	const bgDef = theme.isBrand
		? `<defs>
				<linearGradient id="saas-bg" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" stop-color="#4f46e5" />
					<stop offset="100%" stop-color="#7c3aed" />
				</linearGradient>
			</defs>
			<rect width="1200" height="630" fill="url(#saas-bg)" />`
		: `<rect width="1200" height="630" fill="${theme.bg}" />`;

	const badgeSvg = props.badge ? createSvgBadge(props.badge, theme, 80, 60) : '';
	const badgeWidth = props.badge ? Math.max(90, props.badge.length * 11 + 32) : 0;
	const siteNameX = props.badge ? 80 + badgeWidth + 18 : 80;

	const siteNameSvg = props.siteName
		? `<text x="${siteNameX}" y="85" font-family="Inter, -apple-system, sans-serif" font-size="24" font-weight="700" fill="${theme.subtextColor}">${escapeXml(props.siteName)}</text>`
		: '';

	const logoSvg = props.logoDataUri ? createSvgLogo(props.logoDataUri, 1056, 60, 64, 16) : '';

	const titleYStart = descLines.length > 0 ? 230 : 280;
	const titleSvg = `
		<text x="80" y="${titleYStart}" font-family="Inter, -apple-system, sans-serif" font-size="58" font-weight="800" fill="${theme.textColor}" letter-spacing="-0.02em">
			${titleLines.map((line, i) => `<tspan x="80" dy="${i === 0 ? 0 : 70}">${escapeXml(line)}</tspan>`).join('')}
		</text>
	`;

	const descYStart = titleYStart + titleLines.length * 70 + 20;
	const descSvg =
		descLines.length > 0
			? `
		<text x="80" y="${descYStart}" font-family="Inter, -apple-system, sans-serif" font-size="26" font-weight="400" fill="${theme.subtextColor}" line-height="1.4">
			${descLines.map((line, i) => `<tspan x="80" dy="${i === 0 ? 0 : 38}">${escapeXml(line)}</tspan>`).join('')}
		</text>
	`
			: '';

	const accentBarSvg = `<rect x="80" y="556" width="1040" height="8" rx="4" fill="${theme.accentColor}" />`;

	return `
		${bgDef}
		${badgeSvg}
		${siteNameSvg}
		${logoSvg}
		${titleSvg}
		${descSvg}
		${accentBarSvg}
	`;
}
