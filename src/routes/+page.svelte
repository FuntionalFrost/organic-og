<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import {
		Tabs,
		Button,
		Icon,
		Kbd,
		CommandPalette,
		type CommandItem,
		useShortcuts,
		useColorMode,
		toast,
		theme
	} from 'yaxa-svelte';
	import {
		Download,
		Copy,
		RefreshCw,
		Plus,
		Sliders,
		Key,
		BookOpen,
		BarChart3,
		Sparkles,
		Sun,
		Moon,
		Search,
		LayoutTemplate,
		Palette,
		ExternalLink,
		ShieldCheck,
		FileText,
		Scale,
		ShoppingBag
	} from '@lucide/svelte';
	import type { StudioState } from '#lib/types/dashboard.js';
	import { getActiveParams } from '#lib/utils/snippets.js';
	import StudioTab from '#lib/components/StudioTab.svelte';
	import KeysTab from '#lib/components/KeysTab.svelte';
	import AnalyticsTab from '#lib/components/AnalyticsTab.svelte';
	import DocsTab from '#lib/components/DocsTab.svelte';
	import CreateKeyModal from '#lib/components/CreateKeyModal.svelte';
	import OrganicOgLogo from '#lib/components/OrganicOgLogo.svelte';

	let { data } = $props();

	const colorMode = useColorMode();
	let activeTab = $state('studio');
	let isCommandPaletteOpen = $state(false);
	const tabItems = [
		{ label: 'Studio', value: 'studio', icon: Sliders },
		{ label: 'API Keys', value: 'keys', icon: Key },
		{ label: 'Docs', value: 'docs', icon: BookOpen },
		{ label: 'Analytics', value: 'analytics', icon: BarChart3 }
	];

	// Global keyboard shortcuts matching Nuxt UI via yaxa-svelte
	useShortcuts({
		'1': () => {
			activeTab = 'studio';
		},
		'2': () => {
			activeTab = 'keys';
		},
		'3': () => {
			activeTab = 'docs';
		},
		'4': () => {
			activeTab = 'analytics';
		},
		meta_k: () => {
			isCommandPaletteOpen = !isCommandPaletteOpen;
		},
		meta_enter: () => {
			updateSignedUrl();
		}
	});

	// Studio state
	let studioForm = $state<StudioState>({
		title: 'Automate OpenGraph Images with SvelteKit & Yaxa',
		description: 'Generate dynamic, on-brand social assets on edge runtimes in milliseconds.',
		siteName: 'organic-og.vercel.app',
		badge: 'Production Ready',
		logoUrl: 'https://avatars.githubusercontent.com/u/28706372?v=4',
		theme: 'brand',
		template: 'saas',
		format: 'png',
		pattern: 'none',
		font: 'inter',
		price: '€129.00',
		rating: '4.9 ★★★★★',
		stars: '14.2k',
		forks: '1.8k',
		language: 'TypeScript',
		episode: 'EPISODE #42',
		host: 'Rich Harris',
		guest: 'Evan You',
		duration: '52 MIN',
		eventDate: 'OCTOBER 15, 2026',
		location: 'San Francisco & Virtual',
		speaker: 'Keynote Speakers',
		author: 'Guillermo Rauch',
		handle: '@rauchg',
		role: 'CEO at Vercel',
		version: 'v2.5.0 Release',
		items: 'Native SVG Engine | Zero WASM Resvg | Distributed Edge Caching'
	});

	let signedPreviewUrl = $state('');
	let signatureToken = $state('');
	let isRendering = $state(false);

	$effect(() => {
		if (!signedPreviewUrl && data.defaultOgUrl) {
			signedPreviewUrl = data.defaultOgUrl;
		}
	});

	async function updateSignedUrl() {
		isRendering = true;
		try {
			const activeParams = getActiveParams(studioForm);
			const res = await fetch('/api/sign', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ params: activeParams })
			});
			if (res.ok) {
				const signData = await res.json();
				signedPreviewUrl = signData.signedUrl;
				signatureToken = signData.signature;
			}
		} catch (err) {
			console.error('Signing failed', err);
		} finally {
			isRendering = false;
		}
	}

	$effect(() => {
		// Deep track form properties
		void { ...studioForm };
		isRendering = true;
		const timer = setTimeout(() => {
			updateSignedUrl();
		}, 250);
		return () => clearTimeout(timer);
	});

	// Modals
	let isCreateKeyOpen = $state(false);

	async function revokeApiKey(id: string) {
		try {
			const res = await fetch(`/api/keys/${id}`, { method: 'DELETE' });
			if (res.ok) {
				toast.success('Key revoked successfully');
				await invalidateAll();
			} else {
				throw new Error();
			}
		} catch {
			toast.error('Failed to revoke API key');
		}
	}

	async function testRenderWithKey(keyId: string) {
		try {
			const res = await fetch(`/api/keys/${keyId}/test`, { method: 'POST' });
			if (res.ok) {
				toast.success('Test render generated successfully! (Unlimited FOSS Token)');
				await invalidateAll();
			} else {
				const errData = await res.json().catch(() => ({}));
				throw new Error(errData.message || 'Test render failed.');
			}
		} catch (err: unknown) {
			toast.error((err instanceof Error ? err.message : 'Error') || 'Test render failed');
		}
	}

	async function copyMetaTag() {
		const fullUrl = signedPreviewUrl.startsWith('http')
			? signedPreviewUrl
			: `${data.baseUrl}${signedPreviewUrl}`;
		const metaSnippet = `<meta property="og:image" content="${fullUrl}" />`;
		await navigator.clipboard.writeText(metaSnippet);
		toast.success('Meta tag copied to clipboard!');
	}

	async function copyImageUrl() {
		const fullUrl = signedPreviewUrl.startsWith('http')
			? signedPreviewUrl
			: `${data.baseUrl}${signedPreviewUrl}`;
		await navigator.clipboard.writeText(fullUrl);
		toast.success('Image URL copied to clipboard!');
	}

	async function downloadImage() {
		try {
			const targetUrl = signedPreviewUrl.startsWith('http')
				? signedPreviewUrl
				: `${data.baseUrl}${signedPreviewUrl}`;
			const res = await fetch(targetUrl);
			const blob = await res.blob();
			const blobUrl = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = blobUrl;
			a.download = `og-${studioForm.template}-${Date.now()}.png`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(blobUrl);
			toast.success('PNG image downloaded!');
		} catch {
			toast.error('Failed to download image.');
		}
	}

	const commandItems: CommandItem[] = [
		// Navigation
		{
			id: 'nav-studio',
			label: 'Studio',
			description: 'Interactive OpenGraph canvas and multi-platform previewer',
			icon: Sliders,
			shortcut: '1',
			group: 'Navigation',
			onSelect: () => {
				activeTab = 'studio';
			}
		},
		{
			id: 'nav-keys',
			label: 'API Tokens & Telemetry',
			description: 'Manage HMAC signing keys and monitor API usage',
			icon: Key,
			shortcut: '2',
			group: 'Navigation',
			onSelect: () => {
				activeTab = 'keys';
			}
		},
		{
			id: 'nav-docs',
			label: 'Developer Documentation',
			description: 'SvelteKit, Next.js, and HTTP API integration guides',
			icon: BookOpen,
			shortcut: '3',
			group: 'Navigation',
			onSelect: () => {
				activeTab = 'docs';
			}
		},
		{
			id: 'nav-analytics',
			label: 'Usage Analytics & Audit Logs',
			description: 'Private edge cache hit ratios and performance metrics',
			icon: BarChart3,
			shortcut: '4',
			group: 'Navigation',
			onSelect: () => {
				activeTab = 'analytics';
			}
		},

		// Templates
		{
			id: 'tpl-saas',
			label: 'SaaS Card Template',
			description: 'Hero layout with badge, title, subtitle & branding',
			icon: LayoutTemplate,
			group: 'Templates',
			onSelect: () => {
				studioForm.template = 'saas';
				activeTab = 'studio';
				toast.success('Applied SaaS template');
			}
		},
		{
			id: 'tpl-github',
			label: 'GitHub Repository Template',
			description: 'Repo metadata with stars, forks, language & owner',
			icon: Sparkles,
			group: 'Templates',
			onSelect: () => {
				studioForm.template = 'github';
				activeTab = 'studio';
				toast.success('Applied GitHub template');
			}
		},
		{
			id: 'tpl-blog',
			label: 'Blog Hero Template',
			description: 'Editorial article header with reading time & tags',
			icon: BookOpen,
			group: 'Templates',
			onSelect: () => {
				studioForm.template = 'blog';
				activeTab = 'studio';
				toast.success('Applied Blog template');
			}
		},
		{
			id: 'tpl-minimal',
			label: 'Minimalist Border Template',
			description: 'Clean typographic layout with subtle geometric border',
			icon: Sliders,
			group: 'Templates',
			onSelect: () => {
				studioForm.template = 'minimal';
				activeTab = 'studio';
				toast.success('Applied Minimalist template');
			}
		},
		{
			id: 'tpl-ecommerce',
			label: 'E-Commerce Product Template',
			description: 'Product showcase with pricing in € and rating',
			icon: ShoppingBag,
			group: 'Templates',
			onSelect: () => {
				studioForm.template = 'ecommerce';
				activeTab = 'studio';
				toast.success('Applied E-Commerce template');
			}
		},
		{
			id: 'tpl-podcast',
			label: 'Podcast & Episode Template',
			description: 'Show card with host, guest, duration & audio waveform',
			icon: Sparkles,
			group: 'Templates',
			onSelect: () => {
				studioForm.template = 'podcast';
				activeTab = 'studio';
				toast.success('Applied Podcast template');
			}
		},
		{
			id: 'tpl-event',
			label: 'Event & Conference Template',
			description: 'Conference banner with date, venue & speaker lineup',
			icon: LayoutTemplate,
			group: 'Templates',
			onSelect: () => {
				studioForm.template = 'event';
				activeTab = 'studio';
				toast.success('Applied Event template');
			}
		},
		{
			id: 'tpl-quote',
			label: 'Social Quote / Testimonial Template',
			description: 'Quote card with author attribution and verified check',
			icon: FileText,
			group: 'Templates',
			onSelect: () => {
				studioForm.template = 'quote';
				activeTab = 'studio';
				toast.success('Applied Quote template');
			}
		},
		{
			id: 'tpl-changelog',
			label: 'Changelog Release Template',
			description: 'Product update card with version badge and bullet highlights',
			icon: Sparkles,
			group: 'Templates',
			onSelect: () => {
				studioForm.template = 'changelog';
				activeTab = 'studio';
				toast.success('Applied Changelog template');
			}
		},

		// Themes
		{
			id: 'theme-brand',
			label: 'Brand Gradient Theme',
			description: 'Vibrant organic emerald & cyan backdrop',
			icon: Palette,
			group: 'Themes',
			onSelect: () => {
				studioForm.theme = 'brand';
				activeTab = 'studio';
				toast.success('Theme set to Brand Gradient');
			}
		},
		{
			id: 'theme-dark',
			label: 'Dark Slate Theme',
			description: 'Deep contrast midnight slate backdrop',
			icon: Moon,
			group: 'Themes',
			onSelect: () => {
				studioForm.theme = 'dark';
				activeTab = 'studio';
				toast.success('Theme set to Dark Slate');
			}
		},
		{
			id: 'theme-light',
			label: 'Light Clean Theme',
			description: 'Crisp bright background for modern cards',
			icon: Sun,
			group: 'Themes',
			onSelect: () => {
				studioForm.theme = 'light';
				activeTab = 'studio';
				toast.success('Theme set to Light Clean');
			}
		},

		// Actions
		{
			id: 'act-copy-meta',
			label: 'Copy Meta Tag',
			description: 'Copy <meta property="og:image" ... /> tag to clipboard',
			icon: Copy,
			shortcut: '⌘C',
			group: 'Actions',
			onSelect: () => copyMetaTag()
		},
		{
			id: 'act-copy-url',
			label: 'Copy Image URL',
			description: 'Copy full signed image URL to clipboard',
			icon: Copy,
			group: 'Actions',
			onSelect: () => copyImageUrl()
		},
		{
			id: 'act-download',
			label: 'Download PNG Asset',
			description: 'Download the rendered 1200x630 PNG directly',
			icon: Download,
			group: 'Actions',
			onSelect: () => downloadImage()
		},
		{
			id: 'act-refresh',
			label: 'Refresh Render Canvas',
			description: 'Re-sign and reload active studio canvas',
			icon: RefreshCw,
			shortcut: '⌘↵',
			group: 'Actions',
			onSelect: () => updateSignedUrl()
		},
		{
			id: 'act-toggle-theme',
			label: 'Toggle Dark / Light Mode',
			description: 'Switch website UI between light and dark mode',
			icon: Sparkles,
			group: 'Actions',
			onSelect: () => colorMode.toggle()
		},

		// Accents & Styling
		{
			id: 'accent-svelte',
			label: 'Svelte Orange Accent',
			description: 'Vibrant flame orange brand accent',
			icon: Palette,
			group: 'Accents & Styling',
			onSelect: () => {
				theme.setAccent('svelte');
				toast.success('Accent set to Svelte Orange');
			}
		},
		{
			id: 'accent-emerald',
			label: 'Emerald Organic Accent',
			description: 'Clean nature-inspired emerald green accent',
			icon: Palette,
			group: 'Accents & Styling',
			onSelect: () => {
				theme.setAccent('emerald');
				toast.success('Accent set to Emerald Green');
			}
		},
		{
			id: 'accent-sky',
			label: 'Sky Blue Accent',
			description: 'Bright modern sky blue accent',
			icon: Palette,
			group: 'Accents & Styling',
			onSelect: () => {
				theme.setAccent('sky');
				toast.success('Accent set to Sky Blue');
			}
		},
		{
			id: 'accent-violet',
			label: 'Violet Purple Accent',
			description: 'Electric violet deep indigo accent',
			icon: Palette,
			group: 'Accents & Styling',
			onSelect: () => {
				theme.setAccent('violet');
				toast.success('Accent set to Violet');
			}
		},
		{
			id: 'accent-rose',
			label: 'Rose Pink Accent',
			description: 'Warm modern rose magenta accent',
			icon: Palette,
			group: 'Accents & Styling',
			onSelect: () => {
				theme.setAccent('rose');
				toast.success('Accent set to Rose');
			}
		},
		{
			id: 'accent-amber',
			label: 'Amber Gold Accent',
			description: 'Radiant warm amber gold accent',
			icon: Palette,
			group: 'Accents & Styling',
			onSelect: () => {
				theme.setAccent('amber');
				toast.success('Accent set to Amber');
			}
		},
		{
			id: 'accent-indigo',
			label: 'Indigo Classic Accent',
			description: 'Deep high-tech indigo accent',
			icon: Palette,
			group: 'Accents & Styling',
			onSelect: () => {
				theme.setAccent('indigo');
				toast.success('Accent set to Indigo');
			}
		},
		{
			id: 'radius-rounded',
			label: 'Rounded Corners (Default)',
			description: 'Harmonic 0.5rem radius scale across all UI primitives',
			icon: Sparkles,
			group: 'Accents & Styling',
			onSelect: () => {
				theme.setRadius('default');
				toast.success('Corner radius set to Rounded');
			}
		},
		{
			id: 'radius-subtle',
			label: 'Subtle Corners',
			description: 'Crisp compact 0.25rem radius scale',
			icon: Sparkles,
			group: 'Accents & Styling',
			onSelect: () => {
				theme.setRadius('subtle');
				toast.success('Corner radius set to Subtle');
			}
		},
		{
			id: 'radius-pill',
			label: 'Pill Curvature',
			description: 'Ultra-rounded harmonic pill radius scale',
			icon: Sparkles,
			group: 'Accents & Styling',
			onSelect: () => {
				theme.setRadius('pill');
				toast.success('Corner radius set to Pill');
			}
		},
		{
			id: 'radius-sharp',
			label: 'Sharp Rectangular',
			description: 'Brutalist 0px border radius across all cards and inputs',
			icon: Sparkles,
			group: 'Accents & Styling',
			onSelect: () => {
				theme.setRadius('sharp');
				toast.success('Corner radius set to Sharp');
			}
		},

		// Legal & Links
		{
			id: 'doc-privacy',
			label: 'Privacy Policy',
			description: 'GDPR compliance & zero-tracking policy',
			icon: ShieldCheck,
			group: 'Legal & Links',
			href: '/privacy'
		},
		{
			id: 'doc-terms',
			label: 'Terms of Service',
			description: 'API licensing & acceptable use conditions',
			icon: FileText,
			group: 'Legal & Links',
			href: '/terms'
		},
		{
			id: 'doc-impressum',
			label: 'Impressum / Legal Notice',
			description: 'Mandatory provider identification pursuant to § 5 TMG',
			icon: Scale,
			group: 'Legal & Links',
			href: '/impressum'
		},
		{
			id: 'ext-github',
			label: 'GitHub Repository',
			description: 'View source code & issue tracker on GitHub',
			icon: ExternalLink,
			group: 'Legal & Links',
			href: 'https://github.com/FuntionalFrost'
		}
	];
</script>

<div
	class="flex min-h-screen flex-col bg-neutral-50 text-neutral-900 transition-colors dark:bg-[#09090b] dark:text-neutral-100"
>
	<!-- Modern Sticky Navbar Header with Yaxa Glassmorphism -->
	<header
		class="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-neutral-200/80 yaxa-glass px-4 transition-colors sm:px-6 dark:border-neutral-800/80"
	>
		<!-- Left: Brand Logo & Navigation Segment -->
		<div class="flex items-center gap-3 sm:gap-5">
			<OrganicOgLogo size="sm" />
			<div class="w-auto">
				<Tabs items={tabItems} bind:value={activeTab} variant="segmented" />
			</div>
		</div>

		<!-- Right: Quick Actions, Theme Toggle & Auth -->
		<div class="flex items-center gap-1.5 sm:gap-2.5">
			<!-- Command Palette Launcher -->
			<Button
				color="neutral"
				variant="outline"
				size="xs"
				class="gap-1.5 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
				onclick={() => (isCommandPaletteOpen = true)}
				aria-label="Open Command Palette"
			>
				<Icon icon={Search} size="xs" />
				<span class="hidden text-xs lg:inline">Search</span>
				<Kbd value="⌘K" size="xs" class="hidden sm:inline-block" />
			</Button>

			{#if activeTab === 'studio'}
				<Button
					color="neutral"
					variant="outline"
					size="xs"
					class="hidden gap-1 md:inline-flex"
					onclick={downloadImage}
				>
					<Icon icon={Download} size="xs" />
					<span>Download</span>
				</Button>
				<Button
					color="primary"
					variant="solid"
					size="xs"
					class="gap-1 font-semibold shadow-xs"
					onclick={copyMetaTag}
				>
					<Icon icon={Copy} size="xs" />
					<span class="hidden sm:inline">Copy Tag</span>
				</Button>
			{:else if activeTab === 'keys'}
				<Button
					color="neutral"
					variant="outline"
					size="xs"
					class="gap-1"
					onclick={() => invalidateAll()}
				>
					<Icon icon={RefreshCw} size="xs" />
					<span class="hidden sm:inline">Refresh</span>
				</Button>
				<Button
					color="primary"
					variant="solid"
					size="xs"
					class="gap-1 shadow-xs"
					onclick={() => (isCreateKeyOpen = true)}
				>
					<Icon icon={Plus} size="xs" />
					<span>Create Key</span>
				</Button>
			{:else if activeTab === 'analytics'}
				<Button
					color="neutral"
					variant="outline"
					size="xs"
					class="gap-1"
					onclick={() => invalidateAll()}
				>
					<Icon icon={RefreshCw} size="xs" />
					<span class="hidden sm:inline">Refresh</span>
				</Button>
			{/if}

			<!-- Light / Dark Mode Toggle Button -->
			<Button
				color="neutral"
				variant="outline"
				size="xs"
				square
				onclick={() => colorMode.toggle()}
				title={colorMode.isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
				aria-label="Toggle Theme"
			>
				{#if colorMode.isDark}
					<Icon icon={Sun} size="xs" class="text-amber-400" />
				{:else}
					<Icon icon={Moon} size="xs" class="text-neutral-700" />
				{/if}
			</Button>

			<!-- Dynamic Brand Accent Selector Button -->
			<Button
				color="neutral"
				variant="outline"
				size="xs"
				square
				onclick={() => {
					const accents = [
						'svelte',
						'emerald',
						'sky',
						'violet',
						'rose',
						'amber',
						'indigo'
					] as const;
					const nextIndex = (accents.indexOf(theme.accent) + 1) % accents.length;
					theme.setAccent(accents[nextIndex]);
					toast.success(`Theme accent: ${accents[nextIndex].toUpperCase()}`);
				}}
				title={`Current Accent: ${theme.accent} (click to cycle)`}
				aria-label="Cycle Accent Color"
			>
				<Icon icon={Palette} size="xs" class="text-primary-500" />
			</Button>

			<!-- GitHub Repository Link -->
			<div
				class="flex items-center gap-2 border-l border-neutral-200/80 pl-2 sm:gap-2.5 sm:pl-3 dark:border-neutral-800"
			>
				<a
					href="https://github.com/FunctionalFrost/organic-og"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200/80 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
				>
					<svg class="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
						/>
					</svg>
					<span class="hidden sm:inline">GitHub</span>
				</a>
			</div>
		</div>
	</header>

	<!-- Tab Panels -->
	<div class="flex flex-1 flex-col">
		{#if activeTab === 'studio'}
			<StudioTab
				bind:studioState={studioForm}
				{signedPreviewUrl}
				{signatureToken}
				{isRendering}
				baseUrl={data.baseUrl}
			/>
		{:else if activeTab === 'keys'}
			<KeysTab keysList={data.keys} ontestRender={testRenderWithKey} onrevokeKey={revokeApiKey} />
		{:else if activeTab === 'docs'}
			<DocsTab
				studioState={studioForm}
				apiKeyPrefix={data.keys[0]?.prefix || 'og_live_demo123456789'}
				{signedPreviewUrl}
				baseUrl={data.baseUrl}
			/>
		{:else if activeTab === 'analytics'}
			<AnalyticsTab analyticsData={data.analytics} />
		{/if}
	</div>
</div>

<!-- Command Palette Modal -->
<CommandPalette
	bind:open={isCommandPaletteOpen}
	items={commandItems}
	placeholder="Search templates, presets, actions, or shortcuts..."
/>

<!-- Modals -->
<CreateKeyModal bind:open={isCreateKeyOpen} oncreated={() => invalidateAll()} />
