import type { TemplateProps } from './types';
import {
	type ResolvedTheme,
	createSvgBadge,
	createStarIconSvg,
	escapeXml,
	wrapSvgText,
	renderSvgMultilineText
} from './helpers';

export function renderEcommerceTemplate(props: TemplateProps, theme: ResolvedTheme): string {
	const ratingValue = (props.rating || '4.9').replace(/[^0-9.]/g, '') || '4.9';
	const titleLines = wrapSvgText(props.title, 26, 3);
	const priceText = props.price || '€99';

	const badgeSvg = props.badge ? createSvgBadge(props.badge, theme, 80, 60) : '';
	const badgeWidth = props.badge ? Math.max(90, props.badge.length * 11 + 32) : 0;
	const siteNameX = props.badge ? 80 + badgeWidth + 18 : 80;

	const siteNameSvg = `<text x="${siteNameX}" y="85" font-family="Inter, -apple-system, sans-serif" font-size="24" font-weight="600" fill="${theme.subtextColor}">${escapeXml(props.siteName || 'Store')}</text>`;

	const titleSvg = renderSvgMultilineText({
		lines: titleLines,
		x: 80,
		y: 270,
		dy: 66,
		fontSize: 54,
		fontWeight: 800,
		fill: theme.textColor,
		letterSpacing: '-0.02em'
	});

	// Price Card Container on Right (x: 820, y: 190, width: 300, height: 200)
	const priceCardSvg = `
		<g transform="translate(820, 190)">
			<rect width="300" height="200" rx="20" fill="${theme.cardBg}" stroke="${theme.borderColor}" stroke-width="1.5" />
			<text x="150" y="44" font-family="Inter, -apple-system, sans-serif" font-size="14" font-weight="700" fill="${theme.subtextColor}" letter-spacing="0.08em" text-anchor="middle">PRICE</text>
			<text x="150" y="105" font-family="Inter, -apple-system, sans-serif" font-size="44" font-weight="800" fill="${theme.accentColor}" text-anchor="middle">${escapeXml(priceText)}</text>
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

	const accentBarSvg = `<rect x="0" y="622" width="1200" height="8" fill="${theme.accentColor}" />`;

	return `
		${badgeSvg}
		${siteNameSvg}
		${titleSvg}
		${priceCardSvg}
		${accentBarSvg}
	`;
}
