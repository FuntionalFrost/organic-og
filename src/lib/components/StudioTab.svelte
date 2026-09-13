<script lang="ts">
	import { FormField, Input, Textarea, Select, Badge, Icon } from 'yaxa-svelte';
	import { Monitor, MessageSquare, ExternalLink } from '@lucide/svelte';
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
		{ label: 'Raw (1200×630)', value: 'canvas', icon: Monitor },
		{ label: 'Twitter / X', value: 'twitter', icon: 'twitter' },
		{ label: 'Discord', value: 'discord', icon: MessageSquare },
		{ label: 'LinkedIn', value: 'linkedin', icon: ExternalLink },
		{ label: 'WhatsApp', value: 'whatsapp', icon: 'whatsapp' }
	];
</script>

<main class="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-8 p-8 lg:grid-cols-12">
	<!-- Controls Column -->
	<div
		class="h-fit space-y-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 lg:col-span-5"
	>
		<div class="flex items-center justify-between">
			<h2 class="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
				Layout & Parameters
			</h2>
			{#if signatureToken}
				<Badge color="success" variant="subtle" class="font-mono text-[10px]">
					HMAC: {signatureToken}
				</Badge>
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
			<div class="grid grid-cols-2 gap-4 border-t border-neutral-800 pt-2">
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
			<div class="grid grid-cols-3 gap-3 border-t border-neutral-800 pt-2">
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
	</div>

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
			<div class="flex items-center gap-1 rounded-lg border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-800 dark:bg-neutral-900">
				{#each previewModes as m (m.value)}
					<button
						type="button"
						class="flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors {previewMode ===
						m.value
							? 'bg-white text-neutral-900 shadow-xs dark:bg-neutral-800 dark:text-white'
							: 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'}"
						onclick={() =>
							(previewMode = m.value as
								| 'canvas'
								| 'twitter'
								| 'discord'
								| 'linkedin'
								| 'whatsapp')}
					>
						{#if m.value === 'whatsapp'}
							<svg
								viewBox="0 0 24 24"
								class="h-3.5 w-3.5 fill-current text-emerald-500"
								aria-hidden="true"
							>
								<path
									d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 012.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.59.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.29z"
								/>
							</svg>
						{:else}
							<Icon name={m.icon} size="xs" />
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
							{studioState.siteName || 'ogengine.io'}
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
						{studioState.siteName || 'OG Engine Platform'}
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
							<div class="text-xs font-semibold text-neutral-200">Dynamic OG Engine</div>
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
							{studioState.siteName || 'ogengine.io'} • Read more
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
						class="ml-auto w-full max-w-[340px] sm:max-w-[360px] rounded-2xl rounded-tr-xs bg-[#d9fdd3] p-1.5 text-neutral-900 shadow-md dark:bg-[#005c4b] dark:text-white"
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
									class="text-[10px] font-medium uppercase tracking-wider text-emerald-700 dark:text-emerald-400"
								>
									{studioState.siteName || 'ogengine.io'}
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
								https://{studioState.siteName || 'ogengine.io'}
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
		<div class="rounded-lg border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
			<span class="mb-2 block font-mono text-xs text-neutral-500 dark:text-neutral-400">Signed Embed Code</span>
			<code class="font-mono text-xs break-all text-primary-600 dark:text-primary-400 select-all">
				&lt;meta property="og:image" content="{baseUrl}{signedPreviewUrl}" /&gt;
			</code>
		</div>
	</div>
</main>
