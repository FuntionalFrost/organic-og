// src/lib/server/og/polar.ts
import { env } from '$env/dynamic/private';

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

export interface CreatePolarCheckoutParams {
	products: string[];
	successUrl: string;
	metadata?: Record<string, string>;
}

export interface PolarCheckoutResponse {
	id: string;
	url: string;
}

export async function createPolarCheckout(
	accessToken: string,
	params: CreatePolarCheckoutParams
): Promise<PolarCheckoutResponse> {
	if (!accessToken) {
		throw new Error('Missing Polar Access Token.');
	}

	const res = await fetch('https://api.polar.sh/v1/checkouts/', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			products: params.products,
			success_url: params.successUrl,
			metadata: params.metadata || {}
		})
	});

	if (!res.ok) {
		const errorText = await res.text();
		throw new Error(`Polar checkout creation failed (${res.status}): ${errorText}`);
	}

	return (await res.json()) as PolarCheckoutResponse;
}
