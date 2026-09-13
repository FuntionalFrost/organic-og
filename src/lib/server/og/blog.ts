import type { TemplateProps } from './types';
import { resolveTheme, createLogo, h } from './helpers';

export function renderBlogTemplate(props: TemplateProps) {
	const theme = resolveTheme(props.theme);

	return h(
		'div',
		{
			height: '100%',
			width: '100%',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			textAlign: 'center',
			padding: '70px',
			background: theme.bg,
			fontFamily: 'Inter'
		},
		[
			createLogo(props.logoDataUri, 64, 9999),
			props.badge
				? h(
						'span',
						{
							fontSize: 18,
							fontWeight: 700,
							color: theme.accentColor,
							textTransform: 'uppercase',
							letterSpacing: '0.1em',
							marginBottom: '16px',
							marginTop: props.logoDataUri ? '16px' : '0px'
						},
						props.badge
					)
				: null,
			h(
				'h1',
				{
					fontSize: 60,
					fontWeight: 700,
					color: theme.textColor,
					lineHeight: 1.15,
					margin: 0,
					maxWidth: '980px'
				},
				props.title
			),
			props.description
				? h(
						'p',
						{
							fontSize: 24,
							color: theme.subtextColor,
							marginTop: '20px',
							maxWidth: '850px',
							lineHeight: 1.4
						},
						props.description
					)
				: null,
			props.siteName
				? h(
						'div',
						{ marginTop: '32px', fontSize: 20, fontWeight: 700, color: theme.subtextColor },
						props.siteName
					)
				: null
		]
	);
}
