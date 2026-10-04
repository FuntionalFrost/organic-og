import type { TemplateProps } from './types';
import {
	type ResolvedTheme,
	createSvgBadge,
	createSvgLogo,
	createMicIconSvg,
	createClockIconSvg,
	createWaveformSvg,
	escapeXml,
	wrapSvgText,
	renderSvgMultilineText
} from './helpers';

export function renderPodcastTemplate(props: TemplateProps, theme: ResolvedTheme): string {
	const titleLines = wrapSvgText(props.title, 26, 3);
	const showName = props.siteName || 'Podcast Episode';
	const episodeText = props.episode || props.badge || 'EPISODE #01';
	const host = props.host || 'Host';
	const guest = props.guest || '';
	const duration = props.duration || '45 MIN';

	// Left Column Cover Art (420x420)
	const coverArtSvg = props.logoDataUri
		? createSvgLogo(props.logoDataUri, 80, 80, 420, 24)
		: `
		<g transform="translate(80, 80)">
			<rect width="420" height="420" rx="24" fill="${theme.cardBg}" stroke="${theme.borderColor}" stroke-width="2" />
			<rect x="20" y="20" width="380" height="380" rx="18" fill="rgba(0,0,0,0.2)" />
			<circle cx="210" cy="210" r="90" fill="${theme.accentColor}" fill-opacity="0.2" stroke="${theme.accentColor}" stroke-width="2" />
			${createMicIconSvg(185, 180, 52, theme.accentColor)}
			<text x="210" y="340" font-size="20" font-weight="700" fill="${theme.textColor}" text-anchor="middle">${escapeXml(showName)}</text>
		</g>
	`;

	// Right Column: Show Badge & Metadata
	const badgeSvg = createSvgBadge(episodeText, theme, 540, 80);
	const badgeWidth = Math.max(90, episodeText.length * 11 + 32);

	const showNameSvg = `
		<text x="${540 + badgeWidth + 20}" y="105" font-size="22" font-weight="700" fill="${theme.subtextColor}">
			${escapeXml(showName)}
		</text>
	`;

	// Right Column Title
	const titleYStart = 180;
	const titleSvg = renderSvgMultilineText({
		lines: titleLines,
		x: 540,
		y: titleYStart,
		dy: 56,
		fontSize: 46,
		fontWeight: 800,
		fill: theme.textColor,
		letterSpacing: '-0.02em'
	});

	// Host & Guest Details
	const metaY = titleYStart + titleLines.length * 56 + 20;
	const guestRow = guest
		? `
		<g transform="translate(540, ${metaY + 42})">
			<circle cx="16" cy="16" r="16" fill="${theme.cardBg}" stroke="${theme.borderColor}" />
			${createMicIconSvg(6, 6, 20, theme.accentColor)}
			<text x="44" y="22" font-size="20" font-weight="600" fill="${theme.textColor}">Guest: <tspan font-weight="400" fill="${theme.subtextColor}">${escapeXml(guest)}</tspan></text>
		</g>
	`
		: '';

	const hostRow = `
		<g transform="translate(540, ${metaY})">
			<circle cx="16" cy="16" r="16" fill="${theme.cardBg}" stroke="${theme.borderColor}" />
			${createMicIconSvg(6, 6, 20, theme.subtextColor)}
			<text x="44" y="22" font-size="20" font-weight="600" fill="${theme.textColor}">Host: <tspan font-weight="400" fill="${theme.subtextColor}">${escapeXml(host)}</tspan></text>
		</g>
	`;

	// Duration Chip
	const durationSvg = `
		<g transform="translate(540, 510)">
			<rect width="140" height="36" rx="10" fill="${theme.cardBg}" stroke="${theme.borderColor}" />
			${createClockIconSvg(12, 8, 20, theme.subtextColor)}
			<text x="42" y="24" font-size="15" font-weight="700" fill="${theme.subtextColor}">${escapeXml(duration)}</text>
		</g>
	`;

	// Bottom Audio Waveform Visualizer
	const waveformSvg = createWaveformSvg(700, 508, 420, 40, theme.accentColor);

	return `
		${coverArtSvg}
		${badgeSvg}
		${showNameSvg}
		${titleSvg}
		${hostRow}
		${guestRow}
		${durationSvg}
		${waveformSvg}
	`;
}
