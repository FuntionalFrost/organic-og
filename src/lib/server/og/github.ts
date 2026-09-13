import type { TemplateProps } from './types';
import { createStarIconSvg, createForkIconSvg, escapeXml, wrapSvgText } from './helpers';

export function renderGithubTemplate(props: TemplateProps): string {
	const repoName = props.title || 'repository';
	const owner = props.siteName || 'github.com / repo';
	const language = props.language || 'TypeScript';

	const titleLines = wrapSvgText(repoName, 32, 2);

	const breadcrumbSvg = `<text x="80" y="110" font-family="Inter, -apple-system, sans-serif" font-size="28" font-weight="600" fill="#58a6ff">${escapeXml(owner)}</text>`;

	const titleSvg = `
		<text x="80" y="270" font-family="Inter, -apple-system, sans-serif" font-size="64" font-weight="800" fill="#ffffff" letter-spacing="-0.02em">
			${titleLines.map((line, i) => `<tspan x="80" dy="${i === 0 ? 0 : 76}">${escapeXml(line)}</tspan>`).join('')}
		</text>
	`;

	// Metrics row at y: 490
	let currentX = 80;
	let starsSvg = '';
	if (props.stars) {
		const label = `${props.stars} stars`;
		const width = label.length * 11 + 50;
		starsSvg = `
			<g transform="translate(${currentX}, 490)">
				<rect width="${width}" height="44" rx="8" fill="#161b22" stroke="#30363d" stroke-width="1" />
				${createStarIconSvg(14, 12, 20)}
				<text x="42" y="28" font-family="Inter, -apple-system, sans-serif" font-size="18" font-weight="600" fill="#c9d1d9">${escapeXml(label)}</text>
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
				<rect width="${width}" height="44" rx="8" fill="#161b22" stroke="#30363d" stroke-width="1" />
				${createForkIconSvg(14, 12, 20)}
				<text x="42" y="28" font-family="Inter, -apple-system, sans-serif" font-size="18" font-weight="600" fill="#c9d1d9">${escapeXml(label)}</text>
			</g>
		`;
		currentX += width + 16;
	}

	const langWidth = language.length * 11 + 44;
	const langSvg = `
		<g transform="translate(${currentX}, 490)">
			<rect width="${langWidth}" height="44" rx="8" fill="#161b22" stroke="#30363d" stroke-width="1" />
			<circle cx="20" cy="22" r="6" fill="#3178c6" />
			<text x="34" y="28" font-family="Inter, -apple-system, sans-serif" font-size="18" font-weight="600" fill="#c9d1d9">${escapeXml(language)}</text>
		</g>
	`;

	return `
		<rect width="1200" height="630" fill="#0d1117" />
		${breadcrumbSvg}
		${titleSvg}
		${starsSvg}
		${forksSvg}
		${langSvg}
	`;
}
