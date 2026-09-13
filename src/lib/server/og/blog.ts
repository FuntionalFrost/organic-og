import type { TemplateProps } from './types';
import { resolveTheme, createSvgLogo, escapeXml, wrapSvgText } from './helpers';

export function renderBlogTemplate(props: TemplateProps): string {
	const theme = resolveTheme(props.theme);
	const titleLines = wrapSvgText(props.title, 36, 3);
	const descLines = props.description ? wrapSvgText(props.description, 58, 2) : [];

	const bgDef = theme.isBrand
		? `<defs>
				<linearGradient id="blog-bg" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" stop-color="#4f46e5" />
					<stop offset="100%" stop-color="#7c3aed" />
				</linearGradient>
			</defs>
			<rect width="1200" height="630" fill="url(#blog-bg)" />`
		: `<rect width="1200" height="630" fill="${theme.bg}" />`;

	let currentY = 100;
	const logoSvg = props.logoDataUri ? createSvgLogo(props.logoDataUri, 568, currentY, 64, 32) : '';
	if (props.logoDataUri) currentY += 84;

	const badgeSvg = props.badge
		? `<text x="600" y="${currentY}" font-family="Inter, -apple-system, sans-serif" font-size="18" font-weight="700" fill="${theme.accentColor}" letter-spacing="0.1em" text-anchor="middle">${escapeXml(props.badge.toUpperCase())}</text>`
		: '';
	if (props.badge) currentY += 48;

	const titleSvg = `
		<text x="600" y="${currentY + 20}" font-family="Inter, -apple-system, sans-serif" font-size="56" font-weight="800" fill="${theme.textColor}" letter-spacing="-0.02em" text-anchor="middle">
			${titleLines.map((line, i) => `<tspan x="600" dy="${i === 0 ? 0 : 66}">${escapeXml(line)}</tspan>`).join('')}
		</text>
	`;

	const descYStart = currentY + 20 + titleLines.length * 66 + 10;
	const descSvg =
		descLines.length > 0
			? `
		<text x="600" y="${descYStart}" font-family="Inter, -apple-system, sans-serif" font-size="24" font-weight="400" fill="${theme.subtextColor}" text-anchor="middle">
			${descLines.map((line, i) => `<tspan x="600" dy="${i === 0 ? 0 : 36}">${escapeXml(line)}</tspan>`).join('')}
		</text>
	`
			: '';

	const siteNameSvg = props.siteName
		? `<text x="600" y="560" font-family="Inter, -apple-system, sans-serif" font-size="20" font-weight="700" fill="${theme.subtextColor}" text-anchor="middle">${escapeXml(props.siteName)}</text>`
		: '';

	return `
		${bgDef}
		${logoSvg}
		${badgeSvg}
		${titleSvg}
		${descSvg}
		${siteNameSvg}
	`;
}
