import type { TemplateProps } from './types';
import {
	type ResolvedTheme,
	createSvgBadge,
	createSvgLogo,
	createCalendarIconSvg,
	createMapPinIconSvg,
	escapeXml,
	wrapSvgText,
	renderSvgMultilineText
} from './helpers';

export function renderEventTemplate(props: TemplateProps, theme: ResolvedTheme): string {
	const titleLines = wrapSvgText(props.title, 32, 3);
	const siteName = props.siteName || 'Tech Conference';
	const eventDate = props.eventDate || props.badge || 'OCTOBER 15, 2026';
	const location = props.location || 'San Francisco, CA & Virtual';
	const speaker = props.speaker || props.host || 'Keynote Speakers';

	// Top Bar: Date Badge & Logo
	const dateBadge = createSvgBadge(eventDate, theme, 80, 60);
	const dateBadgeWidth = Math.max(90, eventDate.length * 11 + 32);

	const siteNameSvg = `
		<text x="${80 + dateBadgeWidth + 20}" y="85" font-family="Inter, -apple-system, sans-serif" font-size="22" font-weight="700" fill="${theme.subtextColor}">
			${escapeXml(siteName)}
		</text>
	`;

	const logoSvg = props.logoDataUri ? createSvgLogo(props.logoDataUri, 1056, 60, 64, 16) : '';

	// Title
	const titleYStart = 180;
	const titleSvg = renderSvgMultilineText({
		lines: titleLines,
		x: 80,
		y: titleYStart,
		dy: 66,
		fontSize: 56,
		fontWeight: 800,
		fill: theme.textColor,
		letterSpacing: '-0.02em'
	});

	// Location & Speaker Badges
	const cardY = titleYStart + titleLines.length * 66 + 30;

	const locationSvg = `
		<g transform="translate(80, ${cardY})">
			<rect width="400" height="64" rx="16" fill="${theme.cardBg}" stroke="${theme.borderColor}" stroke-width="1.5" />
			<circle cx="36" cy="32" r="18" fill="${theme.accentColor}" fill-opacity="0.2" />
			${createMapPinIconSvg(25, 21, 22, theme.accentColor)}
			<text x="70" y="38" font-family="Inter, -apple-system, sans-serif" font-size="19" font-weight="600" fill="${theme.textColor}">${escapeXml(location)}</text>
		</g>
	`;

	const speakerSvg = `
		<g transform="translate(500, ${cardY})">
			<rect width="380" height="64" rx="16" fill="${theme.cardBg}" stroke="${theme.borderColor}" stroke-width="1.5" />
			<circle cx="36" cy="32" r="18" fill="${theme.accentColor}" fill-opacity="0.2" />
			${createCalendarIconSvg(25, 21, 22, theme.accentColor)}
			<text x="70" y="38" font-family="Inter, -apple-system, sans-serif" font-size="19" font-weight="600" fill="${theme.textColor}">${escapeXml(speaker)}</text>
		</g>
	`;

	// Registration Callout Button
	const ctaSvg = `
		<g transform="translate(900, ${cardY})">
			<rect width="220" height="64" rx="16" fill="${theme.accentColor}" />
			<text x="110" y="39" font-family="Inter, -apple-system, sans-serif" font-size="18" font-weight="800" fill="#ffffff" text-anchor="middle">REGISTER NOW →</text>
		</g>
	`;

	return `
		${dateBadge}
		${siteNameSvg}
		${logoSvg}
		${titleSvg}
		${locationSvg}
		${speakerSvg}
		${ctaSvg}
	`;
}
