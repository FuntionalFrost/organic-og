// server/templates/index.ts
import { renderSaasTemplate } from './saas';
import { renderBlogTemplate } from './blog';
import { renderMinimalTemplate } from './minimal';
import { renderEcommerceTemplate } from './ecommerce';
import { renderGithubTemplate } from './github';
import type { TemplateName, TemplateProps } from './types';
import { createSvgWatermark } from './helpers';

export * from './types';
export * from './helpers';

const templateRegistry: Record<TemplateName, (props: TemplateProps) => string> = {
	saas: renderSaasTemplate,
	blog: renderBlogTemplate,
	minimal: renderMinimalTemplate,
	ecommerce: renderEcommerceTemplate,
	github: renderGithubTemplate
};

export function getTemplateSvg(templateName: TemplateName, props: TemplateProps): string {
	const renderer = templateRegistry[templateName] || templateRegistry.saas;
	const bodySvg = renderer(props);
	const watermarkSvg = props.watermark ? createSvgWatermark() : '';

	return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
	<style>
		text {
			font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
			-webkit-font-smoothing: antialiased;
		}
	</style>
	${bodySvg}
	${watermarkSvg}
</svg>
	`.trim();
}
