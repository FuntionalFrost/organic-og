// server/templates/index.ts
import { renderSaasTemplate } from './saas';
import { renderBlogTemplate } from './blog';
import { renderMinimalTemplate } from './minimal';
import { renderEcommerceTemplate } from './ecommerce';
import { renderGithubTemplate } from './github';
import type { TemplateName, TemplateProps } from './types';
import { createWatermark } from './helpers';

export * from './types';
export * from './helpers';

const templateRegistry: Record<
	TemplateName,
	(props: TemplateProps) => { type: string; props: Record<string, unknown> }
> = {
	saas: renderSaasTemplate,
	blog: renderBlogTemplate,
	minimal: renderMinimalTemplate,
	ecommerce: renderEcommerceTemplate,
	github: renderGithubTemplate
};

export function getTemplateTree(templateName: TemplateName, props: TemplateProps) {
	const renderer = templateRegistry[templateName] || templateRegistry.saas;
	const tree = renderer(props);

	if (props.watermark) {
		const watermarkNode = createWatermark();
		if (tree && tree.props && Array.isArray(tree.props.children)) {
			tree.props.children.push(watermarkNode);
		}
	}

	return tree;
}
