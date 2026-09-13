import type { TemplateProps } from './types';
import { icons, h } from './helpers';

export function renderGithubTemplate(props: TemplateProps) {
	const repoName = props.title || 'repository';
	const owner = props.siteName || 'github.com / repo';
	const language = props.language || 'TypeScript';

	return h(
		'div',
		{
			height: '100%',
			width: '100%',
			flexDirection: 'column',
			justifyContent: 'space-between',
			backgroundColor: '#0d1117',
			color: '#ffffff',
			padding: '80px',
			fontFamily: 'Inter'
		},
		[
			// Top repo breadcrumb
			h('div', { fontSize: 28, color: '#58a6ff', fontWeight: 600 }, owner),
			// Main Title
			h(
				'div',
				{
					fontSize: 64,
					fontWeight: 800,
					letterSpacing: '-0.02em',
					lineHeight: 1.1
				},
				repoName
			),
			// Metric Badges
			h('div', { alignItems: 'center', gap: '16px' }, [
				props.stars
					? h(
							'div',
							{
								alignItems: 'center',
								gap: '8px',
								backgroundColor: '#161b22',
								border: '1px solid #30363d',
								padding: '8px 16px',
								borderRadius: '8px',
								fontSize: 20,
								color: '#c9d1d9'
							},
							[icons.star, `${props.stars} stars`]
						)
					: null,
				props.forks
					? h(
							'div',
							{
								alignItems: 'center',
								gap: '8px',
								backgroundColor: '#161b22',
								border: '1px solid #30363d',
								padding: '8px 16px',
								borderRadius: '8px',
								fontSize: 20,
								color: '#c9d1d9'
							},
							[icons.fork, `${props.forks} forks`]
						)
					: null,
				h(
					'div',
					{
						alignItems: 'center',
						gap: '8px',
						backgroundColor: '#161b22',
						border: '1px solid #30363d',
						padding: '8px 16px',
						borderRadius: '8px',
						fontSize: 20,
						color: '#c9d1d9'
					},
					[
						h('div', {
							width: '12px',
							height: '12px',
							borderRadius: '50%',
							backgroundColor: '#3178c6'
						}),
						language
					]
				)
			])
		]
	);
}
