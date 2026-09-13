// src/lib/server/og/polar.ts
import { env } from '$env/dynamic/private';
import { getPolarClient, createPolarCheckout as yaxaCreateCheckout } from 'yaxa-svelte/polar';

export type PackageTier = 'starter' | 'growth' | 'scale';

export interface CreditPackage {
	id: PackageTier;
	polarProductId: string;
	name: string;
	credits: number;
	priceCents: number;
	badge?: string;
}

export const CREDIT_PACKAGES: Record<PackageTier, CreditPackage> = {
	starter: {
		id: 'starter',
		polarProductId: env.POLAR_PRODUCT_STARTER || process.env.POLAR_PRODUCT_STARTER || '',
		name: 'Starter Bundle',
		credits: 1000,
		priceCents: 900
	},
	growth: {
		id: 'growth',
		polarProductId: env.POLAR_PRODUCT_GROWTH || process.env.POLAR_PRODUCT_GROWTH || '',
		name: 'Growth Bundle',
		credits: 5000,
		priceCents: 2900
	},
	scale: {
		id: 'scale',
		polarProductId: env.POLAR_PRODUCT_SCALE || process.env.POLAR_PRODUCT_SCALE || '',
		name: 'Scale Bundle',
		credits: 25000,
		priceCents: 9900
	}
};

export { getPolarClient, yaxaCreateCheckout as createPolarCheckout };
