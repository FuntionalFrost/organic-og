import type { TemplateProps } from './types';
import { type ResolvedTheme, wrapSvgText, renderSvgMultilineText } from './helpers';

export function renderMinimalTemplate(props: TemplateProps, theme: ResolvedTheme): string {
	const titleLines = wrapSvgText(props.title, 32, 3);
	const descLines = props.description ? wrapSvgText(props.description, 48, 2) : [];

	const titleYStart = descLines.length > 0 ? 250 : 310;
	const titleSvg = renderSvgMultilineText({
		lines: titleLines,
		x: 140,
		y: titleYStart,
		dy: 74,
		fontSize: 62,
		fontWeight: 800,
		fill: theme.textColor,
		letterSpacing: '-0.02em'
	});

	const descYStart = titleYStart + titleLines.length * 74 + 16;
	const descSvg = renderSvgMultilineText({
		lines: descLines,
		x: 140,
		y: descYStart,
		dy: 42,
		fontSize: 28,
		fontWeight: 400,
		fill: theme.subtextColor
	});

	return `
		<rect x="0" y="0" width="28" height="630" fill="${theme.accentColor}" />
		${titleSvg}
		${descSvg}
	`;
}
