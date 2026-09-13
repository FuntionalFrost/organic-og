import type { TemplateProps } from './types';
import { createSvgBadge, createStarIconSvg, escapeXml, wrapSvgText } from './helpers';

export function renderEcommerceTemplate(props: TemplateProps): string {
	const ratingValue = (props.rating || '4.9').replace(/[^0-9.]/g, '') || '4.9';
	const titleLines = wrapSvgText(props.title, 26, 3);
	const priceText = props.price || '€99';

	const badgeSvg = props.badge
		? createSvgBadge(
				props.badge,
				{
					isBrand: false,
					isDark: true,
					bg: '',
					textColor: '#fff',
					subtextColor: '',
					accentColor: '#2563eb',
					cardBg: '',
					borderColor: ''
				},
				80,
				60
			)
		: '';
	const badgeWidth = props.badge ? Math.max(90, props.badge.length * 11 + 32) : 0;
	const siteNameX = props.badge ? 80 + badgeWidth + 18 : 80;

	const siteNameSvg = `<text x="${siteNameX}" y="85" font-family="Inter, -apple-system, sans-serif" font-size="24" font-weight="600" fill="#71717a">${escapeXml(props.siteName || 'Store')}</text>`;

	const titleSvg = `
		<text x="80" y="270" font-family="Inter, -apple-system, sans-serif" font-size="54" font-weight="800" fill="#ffffff" letter-spacing="-0.02em">
			${titleLines.map((line, i) => `<tspan x="80" dy="${i === 0 ? 0 : 66}">${escapeXml(line)}</tspan>`).join('')}
		</text>
	`;

	// Price Card Container on Right (x: 820, y: 190, width: 300, height: 200)
	const priceCardSvg = `
		<g transform="translate(820, 190)">
			<rect width="300" height="200" rx="20" fill="#18181b" stroke="#27272a" stroke-width="1.5" />
			<text x="150" y="44" font-family="Inter, -apple-system, sans-serif" font-size="14" font-weight="700" fill="#a1a1aa" letter-spacing="0.08em" text-anchor="middle">PRICE</text>
			<text x="150" y="105" font-family="Inter, -apple-system, sans-serif" font-size="44" font-weight="800" fill="#3b82f6" text-anchor="middle">${escapeXml(priceText)}</text>
			<g transform="translate(65, 135)">
				<text x="0" y="18" font-family="Inter, -apple-system, sans-serif" font-size="18" font-weight="700" fill="#eab308">${escapeXml(ratingValue)}</text>
				${createStarIconSvg(35, 2, 18)}
				${createStarIconSvg(58, 2, 18)}
				${createStarIconSvg(81, 2, 18)}
				${createStarIconSvg(104, 2, 18)}
				${createStarIconSvg(127, 2, 18)}
			</g>
		</g>
	`;

	const accentBarSvg = `<rect x="0" y="622" width="1200" height="8" fill="#2563eb" />`;

	return `
		<rect width="1200" height="630" fill="#09090b" />
		${badgeSvg}
		${siteNameSvg}
		${titleSvg}
		${priceCardSvg}
		${accentBarSvg}
	`;
}
