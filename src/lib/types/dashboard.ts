// app/types/dashboard.ts

export type TemplateType = 'saas' | 'blog' | 'minimal' | 'ecommerce' | 'github';
export type ThemeType = 'dark' | 'light' | 'brand';

export interface StudioState {
	title: string;
	description: string;
	siteName: string;
	badge: string;
	logoUrl: string;
	theme: ThemeType;
	template: TemplateType;
	price: string;
	rating: string;
	stars: string;
	forks: string;
	language: string;
}

export interface ApiKeyItem {
	id: string;
	name: string;
	prefix: string;
	creditsRemaining: number;
	totalRenders: number;
	isActive: boolean;
	createdAt: string | null;
}

export interface AnalyticsData {
	metrics: {
		totalRenders: number;
		cacheHits: number;
		cacheHitRate: number;
		activeKeys: number;
		creditsPurchased: number;
	};
	templateBreakdown: Array<{ template: string; count: number }>;
	recentLogs: Array<{
		id: string;
		template: string;
		isCacheHit: boolean;
		createdAt: string | null;
		keyName: string | null;
		keyPrefix: string | null;
	}>;
}

export interface PackageOption {
	id: 'starter' | 'growth' | 'scale';
	name: string;
	credits: string;
	price: string;
	perImage: string;
	popular?: boolean;
}
