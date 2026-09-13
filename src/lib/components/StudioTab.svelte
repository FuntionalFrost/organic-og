<script lang="ts">
	import { FormField, Input, Textarea, Select, Badge, Icon } from 'yaxa-svelte';
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

	let previewMode = $state<'canvas' | 'twitter' | 'discord' | 'linkedin'>('canvas');

	const previewModes = [
		{ label: 'Raw (1200×630)', value: 'canvas', icon: 'computer' },
		{ label: 'Twitter / X', value: 'twitter', icon: 'twitter' },
		{ label: 'Discord', value: 'discord', icon: 'info' },
		{ label: 'LinkedIn', value: 'linkedin', icon: 'external-link' }
	];
</script>

<main class="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-8 p-8 lg:grid-cols-12">
	<!-- Controls Column -->
	<div
		class="h-fit space-y-4 rounded-xl border border-neutral-800 bg-neutral-900 p-6 lg:col-span-5"
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
			<div class="flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-900 p-1">
				{#each previewModes as m (m.value)}
					<button
						type="button"
						class="flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors {previewMode ===
						m.value
							? 'bg-neutral-800 text-white shadow-xs'
							: 'text-neutral-400 hover:text-neutral-200'}"
						onclick={() => (previewMode = m.value as 'canvas' | 'twitter' | 'discord' | 'linkedin')}
					>
						<Icon name={m.icon} size="xs" />
						<span>{m.label}</span>
					</button>
				{/each}
			</div>
		</div>

		<!-- Simulator Canvas Container -->
		<div
			class="flex w-full items-center justify-center rounded-xl border border-neutral-900 bg-neutral-950/60 py-4"
		>
			<!-- 1. Raw Canvas Mode -->
			{#if previewMode === 'canvas'}
				<div
					class="relative aspect-[1200/630] w-full overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 shadow-2xl"
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
			{/if}
		</div>

		<!-- Embed Tag Code snippet -->
		<div class="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
			<span class="mb-2 block font-mono text-xs text-neutral-400">Signed Embed Code</span>
			<code class="font-mono text-xs break-all text-primary-400 select-all">
				&lt;meta property="og:image" content="{baseUrl}{signedPreviewUrl}" /&gt;
			</code>
		</div>
	</div>
</main>
