<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import {
		Tabs,
		Button,
		Badge,
		Avatar,
		Icon,
		Kbd,
		DropdownMenu,
		type MenuItem,
		CommandPalette,
		type CommandItem,
		useShortcuts,
		useColorMode,
		toast
	} from 'yaxa-svelte';
	import {
		Download,
		Copy,
		RefreshCw,
		Plus,
		LogOut,
		Coins,
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
		Receipt,
		Scale
	} from '@lucide/svelte';
	import { authClient } from '$lib/utils/authClient';
	import type { StudioState, ApiKeyItem } from '$lib/types/dashboard';
	import { getActiveParams } from '$lib/utils/snippets';
	import StudioTab from '$lib/components/StudioTab.svelte';
	import KeysTab from '$lib/components/KeysTab.svelte';
	import AnalyticsTab from '$lib/components/AnalyticsTab.svelte';
	import DocsTab from '$lib/components/DocsTab.svelte';
	import AuthGatedState from '$lib/components/AuthGatedState.svelte';
	import CreateKeyModal from '$lib/components/CreateKeyModal.svelte';
	import BuyCreditsModal from '$lib/components/BuyCreditsModal.svelte';
	import OrganicOgLogo from '$lib/components/OrganicOgLogo.svelte';

	let { data } = $props();

	const colorMode = useColorMode();
	let activeTab = $state('studio');
	let isCommandPaletteOpen = $state(false);
	const tabItems = [
		{ label: 'Studio Preview', value: 'studio', icon: Sliders },
		{ label: 'API Keys & Credits', value: 'keys', icon: Key },
		{ label: 'Developer Docs', value: 'docs', icon: BookOpen },
		{ label: 'Analytics & Logs', value: 'analytics', icon: BarChart3 }
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
		siteName: 'organic-og.netlify.app',
		badge: 'Production Ready',
		logoUrl: 'https://avatars.githubusercontent.com/u/28706372?v=4',
		theme: 'brand',
		template: 'saas',
		format: 'png',
		price: '€129.00',
		rating: '4.9 ★★★★★',
		stars: '14.2k',
		forks: '1.8k',
		language: 'TypeScript'
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
	let isBuyCreditsOpen = $state(false);
	let selectedKeyForPurchase = $state<ApiKeyItem | null>(null);

	function openBuyCreditsModal(key: ApiKeyItem) {
		selectedKeyForPurchase = key;
		isBuyCreditsOpen = true;
	}

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
				const resData = await res.json();
				toast.success(
					`Test render generated! 1 credit deducted (Remaining: ${resData.creditsRemaining})`
				);
				await invalidateAll();
			} else {
				const errData = await res.json().catch(() => ({}));
				throw new Error(errData.message || 'Insufficient credits or invalid key.');
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

	async function handleSignIn() {
		await authClient.signIn.social({
			provider: 'github',
			callbackURL: window.location.href
		});
	}

	async function handleSignOut() {
		await authClient.signOut();
		window.location.reload();
	}

	const userMenuItems: MenuItem[] = $derived([
		{
			id: 'user-header',
			label: `${data.user?.name || data.user?.email || 'User'} · ${data.user?.creditsRemaining ?? 10} credits`,
			disabled: true
		},
		{
			id: 'user-sep1',
			label: '',
			separator: true
		},
		{
			id: 'menu-studio',
			label: 'Studio Preview',
			icon: Sliders,
			shortcut: '1',
			onSelect: () => {
				activeTab = 'studio';
			}
		},
		{
			id: 'menu-keys',
			label: 'API Keys & Credits',
			icon: Key,
			shortcut: '2',
			onSelect: () => {
				activeTab = 'keys';
			}
		},
		{
			id: 'menu-docs',
			label: 'Developer Docs',
			icon: BookOpen,
			shortcut: '3',
			onSelect: () => {
				activeTab = 'docs';
			}
		},
		{
			id: 'menu-analytics',
			label: 'Analytics & Logs',
			icon: BarChart3,
			shortcut: '4',
			onSelect: () => {
				activeTab = 'analytics';
			}
		},
		{
			id: 'user-sep2',
			label: '',
			separator: true
		},
		{
			id: 'sign-out',
			label: 'Sign Out',
			icon: LogOut,
			destructive: true,
			onSelect: () => handleSignOut()
		}
	]);

	$effect(() => {
		if (page.url.searchParams.get('status') === 'success') {
			toast.success('Payment Successful! Your API credits have been added to your balance.');
			invalidateAll();
		}
	});

	const commandItems: CommandItem[] = [
		// Navigation
		{
			id: 'nav-studio',
			label: 'Studio Preview',
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
			label: 'API Keys & Credits',
			description: 'Manage HMAC signing keys, top up credits, and review allowances',
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
			icon: Coins,
			group: 'Templates',
			onSelect: () => {
				studioForm.template = 'ecommerce';
				activeTab = 'studio';
				toast.success('Applied E-Commerce template');
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
			id: 'doc-refunds',
			label: 'Cancellation & Refund Policy',
			description: '14-day money-back guarantee terms',
			icon: Receipt,
			group: 'Legal & Links',
			href: '/refunds'
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
	class="flex min-h-screen flex-col bg-white text-neutral-900 transition-colors dark:bg-neutral-950 dark:text-neutral-100"
>
	<!-- Navbar Header -->
	<header
		class="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 bg-white/80 px-8 py-3.5 backdrop-blur-md transition-colors dark:border-neutral-800 dark:bg-neutral-950/80"
	>
		<div class="flex items-center gap-6">
			<OrganicOgLogo size="md" />
			<div class="w-auto">
				<Tabs items={tabItems} bind:value={activeTab} variant="segmented" />
			</div>
		</div>

		<!-- Header Actions & Auth Widget -->
		<div class="flex items-center gap-3">
			<!-- Command Palette Launcher -->
			<Button
				color="neutral"
				variant="outline"
				size="sm"
				class="gap-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
				onclick={() => (isCommandPaletteOpen = true)}
				aria-label="Open Command Palette"
			>
				<Icon icon={Search} size="xs" />
				<span class="hidden text-xs md:inline">Search commands...</span>
				<Kbd value="⌘K" size="xs" class="ml-0.5 hidden sm:inline-block" />
			</Button>

			{#if activeTab === 'studio'}
				<Button color="neutral" variant="outline" size="sm" class="gap-1.5" onclick={downloadImage}>
					<Icon icon={Download} size="xs" />
					<span>Download PNG</span>
				</Button>
				<Button color="primary" variant="solid" size="sm" class="gap-1.5" onclick={copyMetaTag}>
					<Icon icon={Copy} size="xs" />
					<span>Copy Meta Tag</span>
				</Button>
			{:else if activeTab === 'keys' && data.user}
				<Button
					color="neutral"
					variant="outline"
					size="sm"
					class="gap-1.5"
					onclick={() => invalidateAll()}
				>
					<Icon icon={RefreshCw} size="xs" />
					<span>Refresh</span>
				</Button>
				<Button
					color="primary"
					variant="solid"
					size="sm"
					class="gap-1.5"
					onclick={() => (isCreateKeyOpen = true)}
				>
					<Icon icon={Plus} size="xs" />
					<span>Create API Key</span>
				</Button>
			{:else if activeTab === 'analytics' && data.user}
				<Button
					color="neutral"
					variant="outline"
					size="sm"
					class="gap-1.5"
					onclick={() => invalidateAll()}
				>
					<Icon icon={RefreshCw} size="xs" />
					<span>Refresh</span>
				</Button>
			{/if}

			<!-- Light / Dark Mode Toggle Button -->
			<Button
				color="neutral"
				variant="outline"
				size="sm"
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

			<!-- User Auth Profile Widget -->
			<div
				class="flex items-center gap-2.5 border-l border-neutral-200 pl-3 dark:border-neutral-800"
			>
				{#if data.user}
					<Badge
						color="primary"
						variant="subtle"
						size="sm"
						class="hidden items-center gap-1 font-mono sm:flex"
					>
						<Icon icon={Coins} size="xs" class="text-primary-500 dark:text-primary-400" />
						<span>{data.user.creditsRemaining ?? 10} credits</span>
					</Badge>
					<DropdownMenu items={userMenuItems}>
						{#snippet trigger()}
							<button
								type="button"
								class="flex cursor-pointer items-center gap-2 rounded-lg p-1 transition-colors hover:bg-neutral-100 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary-500 dark:hover:bg-neutral-800"
								aria-label="User Account Menu"
							>
								{#if data.user.image}
									<Avatar src={data.user.image} alt={data.user.name || 'User'} size="xs" />
								{:else}
									<Avatar alt={data.user.name || 'User'} size="xs" />
								{/if}
								<span
									class="max-w-[120px] truncate text-xs font-medium text-neutral-700 dark:text-neutral-300"
								>
									{data.user.name || data.user.email}
								</span>
								<Icon name="chevron-down" size="xs" class="text-neutral-400" />
							</button>
						{/snippet}
					</DropdownMenu>
				{:else}
					<Button color="neutral" variant="outline" size="sm" class="gap-2" onclick={handleSignIn}>
						<Icon name="github" size="xs" />
						<span>Sign in with GitHub</span>
					</Button>
				{/if}
			</div>
		</div>
	</header>

	<!-- Active Tab Body -->
	{#if activeTab === 'studio'}
		<StudioTab
			bind:studioState={studioForm}
			{signedPreviewUrl}
			{signatureToken}
			{isRendering}
			baseUrl={data.baseUrl}
		/>
	{:else if activeTab === 'keys'}
		{#if data.user}
			<KeysTab
				keysList={data.keys}
				onopenBuyCredits={openBuyCreditsModal}
				ontestRender={testRenderWithKey}
				onrevokeKey={revokeApiKey}
			/>
		{:else}
			<AuthGatedState
				icon={Key}
				iconColorClass="text-primary-400"
				title="API Keys & Credit Balances"
				description="Sign in with GitHub to generate programmatic API keys, purchase credit bundles, and receive 10 free renders."
				buttonLabel="Continue with GitHub (+10 Credits)"
				onlogin={handleSignIn}
			/>
		{/if}
	{:else if activeTab === 'docs'}
		<DocsTab
			studioState={studioForm}
			apiKeyPrefix={data.keys?.[0]?.prefix ?? 'YOUR_API_KEY'}
			{signedPreviewUrl}
			baseUrl={data.baseUrl}
		/>
	{:else if activeTab === 'analytics'}
		{#if data.user}
			<AnalyticsTab analyticsData={data.analytics} />
		{:else}
			<AuthGatedState
				icon={Sparkles}
				iconColorClass="text-emerald-400"
				title="Private Usage Analytics"
				description="Sign in with GitHub to view your real-time cache efficiency, template performance, and API request audit logs."
				buttonLabel="Sign in with GitHub"
				onlogin={handleSignIn}
			/>
		{/if}
	{/if}

	<!-- Command Palette -->
	<CommandPalette
		bind:open={isCommandPaletteOpen}
		items={commandItems}
		placeholder="Search templates, presets, actions, or shortcuts..."
	/>

	<!-- Modals -->
	<CreateKeyModal bind:open={isCreateKeyOpen} oncreated={() => invalidateAll()} />

	<BuyCreditsModal bind:open={isBuyCreditsOpen} apiKey={selectedKeyForPurchase} />
</div>
