// server/templates/index.ts
import { renderSaasTemplate } from './saas';
import { renderBlogTemplate } from './blog';
import { renderMinimalTemplate } from './minimal';
import { renderEcommerceTemplate } from './ecommerce';
import { renderGithubTemplate } from './github';
import { renderPodcastTemplate } from './podcast';
import { renderEventTemplate } from './event';
import { renderQuoteTemplate } from './quote';
import { renderChangelogTemplate } from './changelog';
import type { TemplateName, TemplateProps } from './types';
import {
	createSvgWatermark,
	createSvgPatternOverlay,
	renderSvgBackground,
	resolveTheme,
	resolveFontFamily,
	type ResolvedTheme
} from './helpers';

export * from './types';
export * from './helpers';

const templateRegistry: Record<
	TemplateName,
	(props: TemplateProps, theme: ResolvedTheme) => string
> = {
	saas: renderSaasTemplate,
	blog: renderBlogTemplate,
	minimal: renderMinimalTemplate,
	ecommerce: renderEcommerceTemplate,
	github: renderGithubTemplate,
	podcast: renderPodcastTemplate,
	event: renderEventTemplate,
	quote: renderQuoteTemplate,
	changelog: renderChangelogTemplate
};

export function getTemplateSvg(templateName: TemplateName, props: TemplateProps): string {
	const renderer = templateRegistry[templateName] || templateRegistry.saas;
	const theme = resolveTheme(props.theme, {
		bg: props.customBg,
		accent: props.customAccent,
		textColor: props.customTextColor
	});

	const backgroundSvg = renderSvgBackground(theme);
	const patternSvg = createSvgPatternOverlay(props.pattern, theme);
	const bodySvg = renderer(props, theme);
	const watermarkSvg = props.watermark ? createSvgWatermark() : '';
	const fontFamily = resolveFontFamily(props.font);

	return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
	<style>
		text {
			font-family: ${fontFamily};
			-webkit-font-smoothing: antialiased;
		}
	</style>
	${backgroundSvg}
	${patternSvg}
	${bodySvg}
	${watermarkSvg}
</svg>
	`.trim();
}
