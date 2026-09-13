import type { TemplateProps } from './types';
import { h } from './helpers';

export function renderMinimalTemplate(props: TemplateProps) {
	return h(
		'div',
		{
			height: '100%',
			width: '100%',
			flexDirection: 'row',
			backgroundColor: props.theme === 'light' ? '#f4f4f5' : '#09090b',
			color: props.theme === 'light' ? '#09090b' : '#ffffff',
			fontFamily: 'Inter'
		},
		[
			// Left Accent Bar
			h('div', { width: '28px', height: '100%', backgroundColor: '#2563eb' }),
			// Center Content
			h(
				'div',
				{
					flexDirection: 'column',
					justifyContent: 'center',
					padding: '0 80px',
					flex: 1
				},
				[
					h('div', { fontSize: 64, fontWeight: 800, lineHeight: 1.15 }, props.title),
					props.description
						? h('div', { fontSize: 28, color: '#71717a', marginTop: '20px' }, props.description)
						: null
				]
			)
		]
	);
}
