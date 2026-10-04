// server/templates/types.ts
export type ThemeMode = 'dark' | 'light' | 'brand';
export type TemplateName =
	| 'saas'
	| 'blog'
	| 'minimal'
	| 'ecommerce'
	| 'github'
	| 'podcast'
	| 'event'
	| 'quote'
	| 'changelog';

export type PatternType = 'none' | 'grid' | 'dots' | 'glow';
export type FontType = 'inter' | 'mono' | 'outfit' | 'serif';

export interface TemplateProps {
	title: string;
	description?: string;
	siteName?: string;
	badge?: string;
	logoDataUri?: string | null;
	theme: ThemeMode;
	pattern?: PatternType;
	font?: FontType;
	customBg?: string;
	customAccent?: string;
	customTextColor?: string;
	// E-commerce & GitHub
	price?: string;
	rating?: string;
	stars?: string;
	forks?: string;
	language?: string;
	// Podcast
	episode?: string;
	host?: string;
	guest?: string;
	duration?: string;
	// Event
	eventDate?: string;
	location?: string;
	speaker?: string;
	// Quote
	author?: string;
	handle?: string;
	role?: string;
	// Changelog
	version?: string;
	items?: string;
	watermark?: boolean;
}

export interface ResolvedTheme {
	bg: string;
	textColor: string;
	subtextColor: string;
	accentColor: string;
	cardBg: string;
	borderColor: string;
	isBrand: boolean;
	isDark: boolean;
}
