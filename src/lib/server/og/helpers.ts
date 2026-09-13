// server/templates/helpers.ts
import type { ThemeMode, ResolvedTheme } from './types';

export function resolveTheme(theme: ThemeMode): ResolvedTheme {
	const isBrand = theme === 'brand';
	const isDark = theme === 'dark';

	return {
		isBrand,
		isDark,
		bg: isBrand
			? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
			: isDark
				? '#09090b'
				: '#f8fafc',
		textColor: isDark || isBrand ? '#ffffff' : '#0f172a',
		subtextColor: isDark || isBrand ? '#94a3b8' : '#475569',
		accentColor: isBrand ? '#a78bfa' : '#3b82f6',
		cardBg: isDark || isBrand ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
		borderColor: isDark || isBrand ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'
	};
}

/** Satori Hyperscript Helper */
export function h(type: string, style: Record<string, unknown> = {}, children?: unknown) {
	return {
		type,
		props: {
			style: { display: 'flex', ...style },
			children: Array.isArray(children) ? children.filter(Boolean) : children
		}
	};
}

/** Reusable Badge Pill */
export function createBadge(label: string, theme: ResolvedTheme) {
	if (!label) return null;
	return {
		type: 'div',
		props: {
			style: {
				backgroundColor: theme.isBrand ? 'rgba(30, 27, 75, 0.8)' : theme.accentColor,
				border: theme.isBrand ? '1px solid rgba(99, 102, 241, 0.4)' : 'none',
				color: '#ffffff',
				padding: '6px 18px',
				borderRadius: '9999px',
				fontSize: 20,
				fontWeight: 700,
				display: 'flex',
				alignItems: 'center'
			},
			children: label
		}
	};
}

/** Reusable Remote Image / Avatar / Logo Box */
export function createLogo(url: string | null | undefined, size = 60, radius = 16) {
	if (!url) return null;
	return {
		type: 'img',
		props: {
			src: url,
			style: {
				width: `${size}px`,
				height: `${size}px`,
				borderRadius: `${radius}px`,
				objectFit: 'cover',
				border: '2px solid rgba(255, 255, 255, 0.15)'
			}
		}
	};
}

/** Vector SVG Icons (avoids tofu glyph artifacts) */
export const icons = {
	star: {
		type: 'svg',
		props: {
			viewBox: '0 0 24 24',
			width: '20',
			height: '20',
			fill: '#eab308',
			children: [
				{
					type: 'path',
					props: {
						d: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
					}
				}
			]
		}
	},
	fork: {
		type: 'svg',
		props: {
			viewBox: '0 0 24 24',
			width: '20',
			height: '20',
			fill: 'none',
			stroke: '#94a3b8',
			strokeWidth: '2',
			strokeLinecap: 'round',
			strokeLinejoin: 'round',
			children: [
				{
					type: 'path',
					props: {
						d: 'M6 3v12a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V3M18 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm6 12a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'
					}
				}
			]
		}
	}
};

/** Reusable Metric Counter Pill (Supports text, emoji, or SVG nodes) */
export function createMetricPill(
	icon: unknown,
	value: string,
	label: string,
	theme: ResolvedTheme
) {
	return {
		type: 'div',
		props: {
			style: {
				display: 'flex',
				alignItems: 'center',
				gap: '8px',
				backgroundColor: theme.cardBg,
				border: `1px solid ${theme.borderColor}`,
				padding: '8px 16px',
				borderRadius: '12px',
				fontSize: 20,
				fontWeight: 700,
				color: theme.textColor
			},
			children: [
				typeof icon === 'string'
					? {
							type: 'span',
							props: {
								style: { color: theme.accentColor, display: 'flex' },
								children: icon
							}
						}
					: icon,
				{ type: 'span', props: { children: value } },
				{
					type: 'span',
					props: {
						style: { color: theme.subtextColor, fontWeight: 400 },
						children: label
					}
				}
			].filter(Boolean)
		}
	};
}

/** Watermark badge for preview/demo renders */
export function createWatermark() {
	return {
		type: 'div',
		props: {
			style: {
				position: 'absolute',
				bottom: '24px',
				right: '28px',
				display: 'flex',
				alignItems: 'center',
				gap: '6px',
				backgroundColor: 'rgba(0, 0, 0, 0.75)',
				border: '1px solid rgba(255, 255, 255, 0.2)',
				padding: '6px 14px',
				borderRadius: '8px',
				fontSize: 14,
				fontWeight: 600,
				color: '#ffffff',
				zIndex: 50
			},
			children: 'Created with OG Engine'
		}
	};
}
