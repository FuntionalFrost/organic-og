<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { Tabs, Button, Badge, Avatar, Icon, useShortcuts, toast } from 'yaxa-svelte';
	import { Download, Copy, RefreshCw, Plus, LogOut, Coins } from '@lucide/svelte';
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

	let { data } = $props();

	let activeTab = $state('studio');
	const tabItems = [
		{ label: 'Studio Preview', value: 'studio', icon: 'computer' },
		{ label: 'API Keys & Credits', value: 'keys', icon: 'key' },
		{ label: 'Developer Docs', value: 'docs', icon: 'info' },
		{ label: 'Analytics & Logs', value: 'analytics', icon: 'sparkles' }
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
		}
	});

	// Studio state
	let studioForm = $state<StudioState>({
		title: 'Automate OpenGraph Images with SvelteKit & Yaxa',
		description: 'Generate dynamic, on-brand social assets on edge runtimes in milliseconds.',
		siteName: 'ogengine.io',
		badge: 'Production Ready',
		logoUrl: 'https://avatars.githubusercontent.com/u/28706372?v=4',
		theme: 'brand',
		template: 'saas',
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

	$effect(() => {
		if (page.url.searchParams.get('status') === 'success') {
			toast.success('Payment Successful! Your API credits have been added to your balance.');
			invalidateAll();
		}
	});
</script>

<div class="flex min-h-screen flex-col bg-neutral-950 text-neutral-100">
	<!-- Navbar Header -->
	<header
		class="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 px-8 py-3.5"
	>
		<div class="flex items-center gap-6">
			<div class="flex items-center gap-3">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-lg border border-primary-500/40 bg-primary-500/20 text-xs font-extrabold text-primary-400 shadow-inner"
				>
					OG
				</div>
				<span class="text-lg font-bold tracking-tight text-white">OG Engine Platform</span>
			</div>
			<div class="w-auto">
				<Tabs items={tabItems} bind:value={activeTab} variant="segmented" />
			</div>
		</div>

		<!-- Header Actions & Auth Widget -->
		<div class="flex items-center gap-3">
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

			<!-- User Auth Profile Widget -->
			<div class="flex items-center gap-2.5 border-l border-neutral-800 pl-3">
				{#if data.user}
					<Badge
						color="primary"
						variant="subtle"
						size="sm"
						class="flex items-center gap-1 font-mono"
					>
						<Icon icon={Coins} size="xs" class="text-primary-400" />
						<span>{data.user.creditsRemaining ?? 10} credits</span>
					</Badge>
					<div class="flex items-center gap-2">
						{#if data.user.image}
							<Avatar src={data.user.image} alt={data.user.name || 'User'} size="xs" />
						{:else}
							<Avatar alt={data.user.name || 'User'} size="xs" />
						{/if}
						<span class="max-w-[120px] truncate text-xs font-medium text-neutral-300">
							{data.user.name || data.user.email}
						</span>
					</div>
					<Button
						color="neutral"
						variant="ghost"
						size="xs"
						square
						onclick={handleSignOut}
						title="Sign Out"
					>
						<Icon icon={LogOut} size="xs" />
					</Button>
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
				icon="key"
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
				icon="sparkles"
				iconColorClass="text-emerald-400"
				title="Private Usage Analytics"
				description="Sign in with GitHub to view your real-time cache efficiency, template performance, and API request audit logs."
				buttonLabel="Sign in with GitHub"
				onlogin={handleSignIn}
			/>
		{/if}
	{/if}

	<!-- Modals -->
	<CreateKeyModal bind:open={isCreateKeyOpen} oncreated={() => invalidateAll()} />

	<BuyCreditsModal bind:open={isBuyCreditsOpen} apiKey={selectedKeyForPurchase} />
</div>
