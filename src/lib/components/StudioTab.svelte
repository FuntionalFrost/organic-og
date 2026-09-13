<script lang="ts">
	import {
		Card,
		FormField,
		Input,
		Textarea,
		Select,
		Badge,
		Button,
		Tooltip,
		useClipboard,
		toast
	} from 'yaxa-svelte';
	import type { StudioState } from '$lib/types/dashboard';

	interface Props {
		studioState: StudioState;
		signedPreviewUrl: string;
		signatureToken: string;
		isRendering: boolean;
		baseUrl: string;
	}

	let {
		studioState = $bindable(),
		signedPreviewUrl,
		signatureToken,
		isRendering,
		baseUrl
	}: Props = $props();

	const clipboard = useClipboard();

	const templateOptions = [
		{ label: 'SaaS Card', value: 'saas' },
		{ label: 'Blog Hero', value: 'blog' },
		{ label: 'Minimalist Border', value: 'minimal' },
		{ label: 'E-Commerce Product', value: 'ecommerce' },
		{ label: 'GitHub Repository', value: 'github' }
	];

	const themeOptions = [
		{ label: 'Brand Gradient', value: 'brand' },
		{ label: 'Dark Slate', value: 'dark' },
		{ label: 'Light Clean', value: 'light' }
	];

	let previewMode = $state<'canvas' | 'twitter' | 'discord' | 'linkedin' | 'whatsapp'>('canvas');

	const previewModes = [
		{ label: 'Raw (1200×630)', value: 'canvas', icon: 'monitor' },
		{ label: 'Twitter / X', value: 'twitter', icon: 'twitter' },
		{ label: 'Discord', value: 'discord', icon: 'discord' },
		{ label: 'LinkedIn', value: 'linkedin', icon: 'linkedin' },
		{ label: 'WhatsApp', value: 'whatsapp', icon: 'message-circle' }
	];

	function copyMetaTag() {
		const tag = `<meta property="og:image" content="${baseUrl}${signedPreviewUrl}" />`;
		clipboard.copy(tag);
		toast.success('Copied Signed Meta Tag to Clipboard');
	}

	function copyImageUrl() {
		clipboard.copy(`${baseUrl}${signedPreviewUrl}`);
		toast.success('Copied Image URL to Clipboard');
	}
</script>

<main class="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-8 p-8 lg:grid-cols-12">
	<!-- Controls Column -->
	<Card class="h-fit space-y-4 p-6 lg:col-span-5">
		<div class="flex items-center justify-between">
			<h2 class="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
				Layout & Parameters
			</h2>
			{#if signatureToken}
				<Tooltip text="HMAC-SHA256 Cryptographic URL Signature">
					<Badge color="success" variant="subtle" class="font-mono text-[10px]">
						HMAC: {signatureToken}
					</Badge>
				</Tooltip>
			{/if}
		</div>

		<div class="grid grid-cols-2 gap-4">
			<FormField label="Layout Template">
				<Select bind:value={studioState.template} options={templateOptions} class="w-full" />
			</FormField>
			<FormField label="Theme Style">
				<Select bind:value={studioState.theme} options={themeOptions} class="w-full" />
			</FormField>
		</div>

		<!-- Dynamic Title Field -->
		<FormField
			label={studioState.template === 'github'
				? 'Repository Name'
				: studioState.template === 'ecommerce'
					? 'Product Name'
					: 'Headline Title'}
		>
			<Input
				bind:value={studioState.title}
				placeholder={studioState.template === 'github' ? 'e.g. dynamic-og-engine' : 'Card title...'}
			/>
		</FormField>

		<!-- Description (SaaS, Blog, Minimal) -->
		{#if studioState.template === 'saas' || studioState.template === 'blog' || studioState.template === 'minimal'}
			<FormField label="Description / Excerpt">
				<Textarea
					bind:value={studioState.description}
					placeholder="Short description..."
					rows={3}
				/>
			</FormField>
		{/if}

		<!-- Site Name & Badge (SaaS, Blog, Ecommerce, GitHub) -->
		{#if studioState.template !== 'minimal'}
			<div class="grid gap-4 {studioState.template === 'github' ? 'grid-cols-1' : 'grid-cols-2'}">
				<FormField
					label={studioState.template === 'github'
						? 'Repository Breadcrumb / Owner'
						: studioState.template === 'ecommerce'
							? 'Store / Brand Name'
							: 'Site Name / Domain'}
				>
					<Input
						bind:value={studioState.siteName}
						placeholder={studioState.template === 'github' ? 'github.com / owner' : 'mybrand.com'}
					/>
				</FormField>
				{#if studioState.template !== 'github'}
					<FormField
						label={studioState.template === 'ecommerce' ? 'Tag / Promotion' : 'Badge / Category'}
					>
						<Input
							bind:value={studioState.badge}
							placeholder={studioState.template === 'ecommerce' ? '20% OFF' : 'Tutorial'}
						/>
					</FormField>
				{/if}
			</div>
		{/if}

		<!-- E-Commerce Dynamic Inputs -->
		{#if studioState.template === 'ecommerce'}
			<div class="grid grid-cols-2 gap-4 border-t border-neutral-200 pt-2 dark:border-neutral-800">
				<FormField label="Price Tag">
					<Input bind:value={studioState.price} placeholder="€99.00" />
				</FormField>
				<FormField label="Star Rating">
					<Input bind:value={studioState.rating} placeholder="4.9 ★★★★★" />
				</FormField>
			</div>
		{/if}

		<!-- GitHub Dynamic Inputs -->
		{#if studioState.template === 'github'}
			<div class="grid grid-cols-3 gap-3 border-t border-neutral-200 pt-2 dark:border-neutral-800">
				<FormField label="Stars Count">
					<Input bind:value={studioState.stars} placeholder="12.4k" />
				</FormField>
				<FormField label="Forks Count">
					<Input bind:value={studioState.forks} placeholder="1.2k" />
				</FormField>
				<FormField label="Language">
					<Input bind:value={studioState.language} placeholder="TypeScript" />
				</FormField>
			</div>
		{/if}

		<!-- Logo / Avatar (SaaS, Blog) -->
		{#if studioState.template === 'saas' || studioState.template === 'blog'}
			<FormField label="Logo / Avatar URL">
				<Input bind:value={studioState.logoUrl} placeholder="https://.../logo.png" />
			</FormField>
		{/if}
	</Card>

	<!-- Preview Column -->
	<div class="flex flex-col gap-4 lg:col-span-7">
		<div class="flex flex-wrap items-center justify-between gap-2">
			<div class="flex items-center gap-2">
				<h2 class="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
					Social Simulator
				</h2>
				{#if isRendering}
					<span class="animate-pulse font-mono text-xs text-primary-400">Rendering...</span>
				{/if}
			</div>
			<!-- Mode Switcher Buttons -->
			<div
				class="flex items-center gap-1 rounded-lg border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-800 dark:bg-neutral-900"
			>
				{#each previewModes as m (m.value)}
					<button
						type="button"
						class="flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors {previewMode ===
						m.value
							? 'bg-white text-neutral-900 shadow-xs dark:bg-neutral-800 dark:text-white'
							: 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'}"
						onclick={() =>
							(previewMode = m.value as 'canvas' | 'twitter' | 'discord' | 'linkedin' | 'whatsapp')}
					>
						{#if m.icon === 'monitor'}
							<svg
								viewBox="0 0 24 24"
								class="h-3.5 w-3.5 fill-none stroke-current"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								aria-hidden="true"
							>
								<rect width="20" height="14" x="2" y="3" rx="2" />
								<line x1="8" x2="16" y1="21" y2="21" />
								<line x1="12" x2="12" y1="17" y2="21" />
							</svg>
						{:else if m.icon === 'twitter'}
							<svg viewBox="0 0 24 24" class="h-3.5 w-3.5 fill-current" aria-hidden="true">
								<path
									d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
								/>
							</svg>
						{:else if m.icon === 'discord'}
							<svg viewBox="0 0 24 24" class="h-3.5 w-3.5 fill-current" aria-hidden="true">
								<path
									d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
								/>
							</svg>
						{:else if m.icon === 'linkedin'}
							<svg viewBox="0 0 24 24" class="h-3.5 w-3.5 fill-current" aria-hidden="true">
								<path
									d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.97 0 1.75-.79 1.75-1.76s-.78-1.75-1.75-1.75a1.75 1.75 0 0 0-1.75 1.75c0 .97.78 1.76 1.75 1.76m1.4 9.74v-8.37H5.06v8.37h2.8z"
								/>
							</svg>
						{:else if m.icon === 'message-circle'}
							<svg
								viewBox="0 0 24 24"
								class="h-3.5 w-3.5 fill-current text-emerald-500"
								aria-hidden="true"
							>
								<path
									d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 012.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.59.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.29z"
								/>
							</svg>
						{/if}
						<span>{m.label}</span>
					</button>
				{/each}
			</div>
		</div>

		<!-- Simulator Canvas Container -->
		<div
			class="flex w-full items-center justify-center rounded-xl border border-neutral-200 bg-neutral-100/70 py-4 dark:border-neutral-900 dark:bg-neutral-950/60"
		>
			<!-- 1. Raw Canvas Mode -->
			{#if previewMode === 'canvas'}
				<div
					class="relative aspect-[1200/630] w-full overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
				>
					{#if signedPreviewUrl}
						<img
							src={signedPreviewUrl}
							alt="Live Dynamic OG Card"
							class="h-full w-full object-cover transition-opacity duration-150 {isRendering
								? 'opacity-60'
								: ''}"
						/>
					{/if}
				</div>

				<!-- 2. Twitter / X Large Card Mockup -->
			{:else if previewMode === 'twitter'}
				<div
					class="w-full max-w-xl space-y-0 overflow-hidden rounded-2xl border border-neutral-800 bg-black shadow-2xl"
				>
					<div class="relative aspect-[1200/630] w-full overflow-hidden bg-neutral-900">
						{#if signedPreviewUrl}
							<img
								src={signedPreviewUrl}
								alt="Twitter Card Preview"
								class="h-full w-full object-cover {isRendering ? 'opacity-60' : ''}"
							/>
						{/if}
					</div>
					<div class="space-y-0.5 border-t border-neutral-800/80 bg-[#0d0e10] p-3">
						<div class="text-[11px] font-normal text-neutral-500">
							{studioState.siteName || 'organic-og.netlify.app'}
						</div>
						<div class="truncate text-xs font-semibold text-neutral-200">
							{studioState.title}
						</div>
						<div class="line-clamp-1 text-[11px] text-neutral-400">
							{studioState.description}
						</div>
					</div>
				</div>

				<!-- 3. Discord Embed Mockup -->
			{:else if previewMode === 'discord'}
				<div
					class="w-full max-w-lg space-y-2 rounded-lg border-l-4 border-indigo-500 bg-[#2b2d31] p-4 text-xs shadow-2xl"
				>
					<div class="text-[11px] font-medium text-neutral-400">
						{studioState.siteName || 'organic-og.netlify.app'}
					</div>
					<div class="cursor-pointer text-sm font-bold text-sky-400 hover:underline">
						{studioState.title}
					</div>
					<div class="text-xs text-neutral-300">
						{studioState.description}
					</div>
					<div
						class="mt-2 aspect-[1200/630] w-full overflow-hidden rounded-md border border-neutral-800 bg-neutral-900"
					>
						{#if signedPreviewUrl}
							<img
								src={signedPreviewUrl}
								alt="Discord Embed Preview"
								class="h-full w-full object-cover {isRendering ? 'opacity-60' : ''}"
							/>
						{/if}
					</div>
				</div>

				<!-- 4. LinkedIn Feed Post Mockup -->
			{:else if previewMode === 'linkedin'}
				<div
					class="w-full max-w-xl overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 shadow-2xl"
				>
					<div class="flex items-center gap-2.5 border-b border-neutral-800/60 p-3">
						<div
							class="flex h-8 w-8 items-center justify-center rounded-full border border-primary-500/40 bg-primary-500/20 text-xs font-bold text-primary-400"
						>
							OG
						</div>
						<div>
							<div class="text-xs font-semibold text-neutral-200">Organic-OG</div>
							<div class="text-[10px] text-neutral-500">Promoted • Just now</div>
						</div>
					</div>
					<div class="aspect-[1200/630] w-full overflow-hidden bg-neutral-950">
						{#if signedPreviewUrl}
							<img
								src={signedPreviewUrl}
								alt="LinkedIn Post Preview"
								class="h-full w-full object-cover {isRendering ? 'opacity-60' : ''}"
							/>
						{/if}
					</div>
					<div class="space-y-0.5 border-t border-neutral-800 bg-neutral-950/80 p-3">
						<div class="truncate text-xs font-semibold text-neutral-200">
							{studioState.title}
						</div>
						<div class="text-[11px] text-neutral-400">
							{studioState.siteName || 'organic-og.netlify.app'} • Read more
						</div>
					</div>
				</div>

				<!-- 5. WhatsApp Chat Link Card Mockup -->
			{:else if previewMode === 'whatsapp'}
				<div
					class="w-full max-w-md overflow-hidden rounded-2xl border border-neutral-200 bg-[#efeae2] p-4 shadow-2xl dark:border-neutral-800 dark:bg-[#0b141a]"
				>
					<!-- Outgoing Message Bubble -->
					<div
						class="ml-auto w-full max-w-[340px] rounded-2xl rounded-tr-xs bg-[#d9fdd3] p-1.5 text-neutral-900 shadow-md sm:max-w-[360px] dark:bg-[#005c4b] dark:text-white"
					>
						<!-- Link Preview Container -->
						<div
							class="overflow-hidden rounded-xl border border-neutral-300/80 bg-[#f0f2f5] dark:border-[#202c33] dark:bg-[#111b21]"
						>
							<div
								class="relative aspect-[1200/630] w-full overflow-hidden bg-neutral-200 dark:bg-[#202c33]"
							>
								{#if signedPreviewUrl}
									<img
										src={signedPreviewUrl}
										alt="WhatsApp Link Preview"
										class="h-full w-full object-cover {isRendering ? 'opacity-60' : ''}"
									/>
								{/if}
							</div>
							<div class="space-y-0.5 p-2.5">
								<div
									class="text-[10px] font-medium tracking-wider text-emerald-700 uppercase dark:text-emerald-400"
								>
									{studioState.siteName || 'organic-og.netlify.app'}
								</div>
								<div class="truncate text-xs font-semibold text-neutral-900 dark:text-neutral-100">
									{studioState.title}
								</div>
								<div
									class="line-clamp-2 text-[11px] leading-tight text-neutral-600 dark:text-neutral-300"
								>
									{studioState.description}
								</div>
							</div>
						</div>

						<!-- Link Message & Timestamp Bar -->
						<div class="flex items-end justify-between px-2 pt-2 pb-1 text-xs">
							<span
								class="max-w-[210px] truncate text-[12px] text-emerald-800 underline dark:text-emerald-200"
							>
								https://{studioState.siteName || 'organic-og.netlify.app'}
							</span>
							<div
								class="flex shrink-0 items-center gap-1 text-[10px] text-neutral-600 dark:text-emerald-200/70"
							>
								<span>12:45 PM</span>
								<!-- WhatsApp Blue Double Checks -->
								<svg
									class="h-3.5 w-3.5 text-sky-500 dark:text-sky-400"
									viewBox="0 0 16 15"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M15.01 3.316l-7.79 7.79a.75.75 0 01-1.06 0l-3.89-3.89a.75.75 0 111.06-1.06l3.36 3.36 7.26-7.26a.75.75 0 111.06 1.06z"
										fill="currentColor"
									/>
									<path
										d="M11.51 3.316l-7.79 7.79a.75.75 0 01-1.06 0l-1.89-1.89a.75.75 0 111.06-1.06l1.36 1.36 7.26-7.26a.75.75 0 111.06 1.06z"
										fill="currentColor"
									/>
								</svg>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- Embed Tag Code snippet -->
		<Card class="space-y-3 p-4">
			<div class="flex items-center justify-between">
				<span
					class="font-mono text-xs font-semibold text-neutral-500 uppercase dark:text-neutral-400"
				>
					Signed Embed Code
				</span>
				<div class="flex items-center gap-2">
					<Button color="neutral" variant="soft" size="xs" onclick={copyImageUrl}>Copy URL</Button>
					<Button color="primary" variant="solid" size="xs" onclick={copyMetaTag}>
						Copy Meta Tag
					</Button>
				</div>
			</div>
			<div
				class="rounded-md bg-neutral-100 p-3 font-mono text-xs break-all text-primary-600 select-all dark:bg-neutral-950 dark:text-primary-400"
			>
				&lt;meta property="og:image" content="{baseUrl}{signedPreviewUrl}" /&gt;
			</div>
		</Card>
	</div>
</main>
