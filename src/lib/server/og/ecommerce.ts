import type { TemplateProps } from './types';
import { icons, h } from './helpers';

export function renderEcommerceTemplate(props: TemplateProps) {
	const ratingValue = (props.rating || '4.9').replace(/[^0-9.]/g, '') || '4.9';

	return h(
		'div',
		{
			height: '100%',
			width: '100%',
			flexDirection: 'column',
			justifyContent: 'space-between',
			backgroundColor: '#09090b',
			color: '#ffffff',
			padding: '80px',
			fontFamily: 'Inter',
			position: 'relative'
		},
		[
			// Header / Tag
			h('div', { alignItems: 'center', gap: '12px' }, [
				props.badge
					? h(
							'div',
							{
								backgroundColor: '#2563eb',
								padding: '6px 16px',
								borderRadius: '9999px',
								fontSize: 20,
								fontWeight: 700
							},
							props.badge
						)
					: null,
				h('div', { fontSize: 24, color: '#71717a' }, props.siteName || 'Store')
			]),
			// Content Area
			h(
				'div',
				{
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: '40px'
				},
				[
					h(
						'div',
						{
							fontSize: 56,
							fontWeight: 800,
							maxWidth: '750px',
							lineHeight: 1.15
						},
						props.title
					),
					// Price & Rating Card
					h(
						'div',
						{
							flexDirection: 'column',
							alignItems: 'center',
							backgroundColor: '#18181b',
							border: '1px solid #27272a',
							padding: '24px 36px',
							borderRadius: '20px',
							minWidth: '220px'
						},
						[
							h(
								'div',
								{
									fontSize: 16,
									color: '#a1a1aa',
									fontWeight: 600,
									letterSpacing: '0.05em'
								},
								'PRICE'
							),
							h(
								'div',
								{
									fontSize: 44,
									color: '#3b82f6',
									fontWeight: 800,
									margin: '4px 0 10px'
								},
								props.price || '€99'
							),
							h('div', { alignItems: 'center', gap: '6px' }, [
								h('span', { fontSize: 18, fontWeight: 700, color: '#eab308' }, ratingValue),
								icons.star,
								icons.star,
								icons.star,
								icons.star,
								icons.star
							])
						]
					)
				]
			),
			// Bottom Accent Line
			h('div', {
				position: 'absolute',
				bottom: 0,
				left: 0,
				right: 0,
				height: '8px',
				backgroundColor: '#2563eb'
			})
		]
	);
}
