// server/templates/types.ts
export type ThemeMode = 'dark' | 'light' | 'brand';
export type TemplateName = 'saas' | 'blog' | 'minimal' | 'ecommerce' | 'github';

export interface TemplateProps {
	title: string;
	description?: string;
	siteName?: string;
	badge?: string;
	logoDataUri?: string | null;
	theme: ThemeMode;
	price?: string;
	rating?: string;
	stars?: string;
	forks?: string;
	language?: string;
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
