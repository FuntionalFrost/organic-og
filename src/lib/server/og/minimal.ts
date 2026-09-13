import type { TemplateProps } from './types';
import { escapeXml, wrapSvgText } from './helpers';

export function renderMinimalTemplate(props: TemplateProps): string {
	const isLight = props.theme === 'light';
	const bgColor = isLight ? '#f4f4f5' : '#09090b';
	const textColor = isLight ? '#09090b' : '#ffffff';
	const subtextColor = isLight ? '#52525b' : '#71717a';
	const accentColor = '#2563eb';

	const titleLines = wrapSvgText(props.title, 32, 3);
	const descLines = props.description ? wrapSvgText(props.description, 48, 2) : [];

	const titleYStart = descLines.length > 0 ? 250 : 310;
	const titleSvg = `
		<text x="140" y="${titleYStart}" font-family="Inter, -apple-system, sans-serif" font-size="62" font-weight="800" fill="${textColor}" letter-spacing="-0.02em">
			${titleLines.map((line, i) => `<tspan x="140" dy="${i === 0 ? 0 : 74}">${escapeXml(line)}</tspan>`).join('')}
		</text>
	`;

	const descYStart = titleYStart + titleLines.length * 74 + 16;
	const descSvg =
		descLines.length > 0
			? `
		<text x="140" y="${descYStart}" font-family="Inter, -apple-system, sans-serif" font-size="28" font-weight="400" fill="${subtextColor}">
			${descLines.map((line, i) => `<tspan x="140" dy="${i === 0 ? 0 : 42}">${escapeXml(line)}</tspan>`).join('')}
		</text>
	`
			: '';

	return `
		<rect width="1200" height="630" fill="${bgColor}" />
		<rect x="0" y="0" width="28" height="630" fill="${accentColor}" />
		${titleSvg}
		${descSvg}
	`;
}
