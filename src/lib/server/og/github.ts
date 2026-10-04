import type { TemplateProps } from './types';
import {
	type ResolvedTheme,
	createStarIconSvg,
	createForkIconSvg,
	escapeXml,
	wrapSvgText,
	renderSvgMultilineText
} from './helpers';

export function renderGithubTemplate(props: TemplateProps, theme: ResolvedTheme): string {
	const repoName = props.title || 'repository';
	const owner = props.siteName || 'github.com / repo';
	const language = props.language || 'TypeScript';

	const titleLines = wrapSvgText(repoName, 32, 2);

	const breadcrumbSvg = `<text x="80" y="110" font-family="Inter, -apple-system, sans-serif" font-size="28" font-weight="600" fill="${theme.accentColor}">${escapeXml(owner)}</text>`;

	const titleSvg = renderSvgMultilineText({
		lines: titleLines,
		x: 80,
		y: 270,
		dy: 76,
		fontSize: 64,
		fontWeight: 800,
		fill: theme.textColor,
		letterSpacing: '-0.02em'
	});

	// Metrics row at y: 490
	let currentX = 80;
	let starsSvg = '';
	if (props.stars) {
		const label = `${props.stars} stars`;
		const width = label.length * 11 + 50;
		starsSvg = `
			<g transform="translate(${currentX}, 490)">
				<rect width="${width}" height="44" rx="8" fill="${theme.cardBg}" stroke="${theme.borderColor}" stroke-width="1" />
				${createStarIconSvg(14, 12, 20)}
				<text x="42" y="28" font-family="Inter, -apple-system, sans-serif" font-size="18" font-weight="600" fill="${theme.textColor}">${escapeXml(label)}</text>
			</g>
		`;
		currentX += width + 16;
	}

	let forksSvg = '';
	if (props.forks) {
		const label = `${props.forks} forks`;
		const width = label.length * 11 + 50;
		forksSvg = `
			<g transform="translate(${currentX}, 490)">
				<rect width="${width}" height="44" rx="8" fill="${theme.cardBg}" stroke="${theme.borderColor}" stroke-width="1" />
				${createForkIconSvg(14, 12, 20)}
				<text x="42" y="28" font-family="Inter, -apple-system, sans-serif" font-size="18" font-weight="600" fill="${theme.textColor}">${escapeXml(label)}</text>
			</g>
		`;
		currentX += width + 16;
	}

	const langWidth = language.length * 11 + 44;
	const langSvg = `
		<g transform="translate(${currentX}, 490)">
			<rect width="${langWidth}" height="44" rx="8" fill="${theme.cardBg}" stroke="${theme.borderColor}" stroke-width="1" />
			<circle cx="20" cy="22" r="6" fill="${theme.accentColor}" />
			<text x="34" y="28" font-family="Inter, -apple-system, sans-serif" font-size="18" font-weight="600" fill="${theme.textColor}">${escapeXml(language)}</text>
		</g>
	`;

	return `
		${breadcrumbSvg}
		${titleSvg}
		${starsSvg}
		${forksSvg}
		${langSvg}
	`;
}
