import type { TemplateProps } from './types';
import { resolveTheme, createBadge, createLogo, h } from './helpers';

export function renderSaasTemplate(props: TemplateProps) {
	const theme = resolveTheme(props.theme);

	return h(
		'div',
		{
			height: '100%',
			width: '100%',
			flexDirection: 'column',
			justifyContent: 'space-between',
			padding: '60px 80px',
			background: theme.bg,
			fontFamily: 'Inter'
		},
		[
			// Top Header
			h('div', { alignItems: 'center', justifyContent: 'space-between', width: '100%' }, [
				h('div', { alignItems: 'center', gap: '14px' }, [
					createBadge(props.badge || '', theme),
					props.siteName
						? h(
								'span',
								{ fontSize: 24, fontWeight: 700, color: theme.subtextColor },
								props.siteName
							)
						: null
				]),
				createLogo(props.logoDataUri, 60, 16)
			]),
			// Body Content
			h('div', { flexDirection: 'column', gap: '16px' }, [
				h(
					'h1',
					{ fontSize: 60, fontWeight: 700, color: theme.textColor, lineHeight: 1.15, margin: 0 },
					props.title
				),
				props.description
					? h(
							'p',
							{ fontSize: 26, color: theme.subtextColor, margin: 0, lineHeight: 1.4 },
							props.description
						)
					: null
			]),
			// Accent Bar
			h('div', { height: '8px', width: '100%', borderRadius: '4px', background: theme.accentColor })
		]
	);
}
