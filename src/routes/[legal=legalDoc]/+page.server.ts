import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { definePageSeo } from 'yaxa-svelte';
import { siteConfig } from '$lib/site.config';

type LegalType = 'privacy' | 'terms' | 'refunds' | 'impressum';

const legalMeta: Record<LegalType, { title: string; description: string }> = {
	privacy: {
		title: 'Privacy Policy',
		description: `Privacy policy, data protection disclosures, and GDPR compliance details for ${siteConfig.name}.`
	},
	terms: {
		title: 'Terms of Service',
		description: `Terms and conditions governing API licensing and usage of ${siteConfig.name}.`
	},
	refunds: {
		title: 'Cancellation & Refunds',
		description: `${siteConfig.legal?.refundDays ?? 14}-day money-back guarantee, credit refund terms, and withdrawal rights for ${siteConfig.name}.`
	},
	impressum: {
		title: 'Legal Notice (Impressum)',
		description: `Provider identification and legal notice pursuant to § 5 TMG for ${siteConfig.name}.`
	}
};

export const load: PageServerLoad = async ({ params }) => {
	const legalType = params.legal as LegalType;
	const meta = legalMeta[legalType];

	if (!meta) {
		throw error(404, 'Legal Document Not Found');
	}

	const canonical = `${siteConfig.url}/${legalType}`;
	const seo = definePageSeo({
		title: meta.title,
		description: meta.description,
		canonical
	});

	return {
		type: legalType,
		title: meta.title,
		description: meta.description,
		canonical,
		seo
	};
};
