// app/types/dashboard.ts

export type TemplateType =
	| 'saas'
	| 'blog'
	| 'minimal'
	| 'ecommerce'
	| 'github'
	| 'podcast'
	| 'event'
	| 'quote'
	| 'changelog';

export type ThemeType = 'dark' | 'light' | 'brand';
export type PatternOption = 'none' | 'grid' | 'dots' | 'glow';
export type FontOption = 'inter' | 'mono' | 'outfit' | 'serif';

export interface StudioState {
	title: string;
	description: string;
	siteName: string;
	badge: string;
	logoUrl: string;
	theme: ThemeType;
	template: TemplateType;
	format?: 'png' | 'svg';
	pattern?: PatternOption;
	font?: FontOption;
	bg?: string;
	accent?: string;
	textColor?: string;
	// E-commerce & GitHub
	price: string;
	rating: string;
	stars: string;
	forks: string;
	language: string;
	// Podcast
	episode: string;
	host: string;
	guest: string;
	duration: string;
	// Event
	eventDate: string;
	location: string;
	speaker: string;
	// Quote
	author: string;
	handle: string;
	role: string;
	// Changelog
	version: string;
	items: string;
}

export interface ApiKeyItem {
	id: string;
	name: string;
	prefix: string;
	creditsRemaining?: number;
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
		creditsPurchased?: number;
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
