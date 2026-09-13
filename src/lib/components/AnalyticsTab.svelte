<script lang="ts">
	import { Card, DataTable, Badge, Progress } from 'yaxa-svelte';
	import type { AnalyticsData } from '$lib/types/dashboard';

	interface Props {
		analyticsData: AnalyticsData | null;
	}

	let { analyticsData }: Props = $props();

	const logColumns = [
		{ key: 'createdAt', label: 'Timestamp' },
		{ key: 'keyName', label: 'API Key Origin' },
		{ key: 'template', label: 'Template' },
		{ key: 'isCacheHit', label: 'Cache Status', class: 'text-right' }
	];
</script>

<main class="mx-auto w-full max-w-7xl flex-1 space-y-8 p-8">
	<div>
		<h1 class="text-xl font-bold text-neutral-900 dark:text-white">Analytics & Health Deck</h1>
		<p class="text-sm text-neutral-600 dark:text-neutral-400">
			Real-time render throughput, cache efficiency, and API usage logs.
		</p>
	</div>

	<!-- KPI Summary Cards -->
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<Card class="space-y-2 p-5">
			<div class="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
				<span class="text-xs font-semibold uppercase">Total Renders</span>
				<span class="text-primary-500 dark:text-primary-400">🖼</span>
			</div>
			<div class="font-mono text-3xl font-bold text-neutral-900 dark:text-white">
				{analyticsData?.metrics.totalRenders ?? 0}
			</div>
			<span class="block text-xs text-neutral-500">Lifetime image requests</span>
		</Card>

		<Card class="space-y-2 p-5">
			<div class="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
				<span class="text-xs font-semibold uppercase">Cache Hit Rate</span>
				<span class="text-emerald-500 dark:text-emerald-400">⚡</span>
			</div>
			<div class="font-mono text-3xl font-bold text-emerald-600 dark:text-emerald-400">
				{analyticsData?.metrics.cacheHitRate ?? 0}%
			</div>
			<Progress
				value={analyticsData?.metrics.cacheHitRate ?? 0}
				color="success"
				size="xs"
				class="mt-2"
			/>
			<span class="block text-xs text-neutral-500">
				{analyticsData?.metrics.cacheHits ?? 0} cached responses
			</span>
		</Card>

		<Card class="space-y-2 p-5">
			<div class="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
				<span class="text-xs font-semibold uppercase">Active API Keys</span>
				<span class="text-amber-500 dark:text-amber-400">🔑</span>
			</div>
			<div class="font-mono text-3xl font-bold text-neutral-900 dark:text-white">
				{analyticsData?.metrics.activeKeys ?? 0}
			</div>
			<span class="block text-xs text-neutral-500">Provisioned credentials</span>
		</Card>

		<Card class="space-y-2 p-5">
			<div class="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
				<span class="text-xs font-semibold uppercase">Credits Sold</span>
				<span class="text-indigo-500 dark:text-indigo-400">💳</span>
			</div>
			<div class="font-mono text-3xl font-bold text-indigo-600 dark:text-indigo-400">
				{(analyticsData?.metrics.creditsPurchased ?? 0).toLocaleString()}
			</div>
			<span class="block text-xs text-neutral-500">Via Polar checkouts</span>
		</Card>
	</div>

	<!-- Template Breakdown Grid -->
	<Card class="space-y-4 p-6">
		<div class="flex items-center justify-between">
			<h3
				class="text-sm font-semibold tracking-wider text-neutral-500 uppercase dark:text-neutral-400"
			>
				Template Usage Distribution
			</h3>
			<Badge color="neutral" variant="subtle" size="xs">
				{analyticsData?.templateBreakdown?.length || 0} Templates Active
			</Badge>
		</div>

		<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
			{#each analyticsData?.templateBreakdown || [] as item (item.template)}
				<Card variant="subtle" class="flex flex-col justify-between p-4">
					<div class="flex items-center justify-between">
						<span
							class="font-mono text-xs font-semibold text-neutral-500 uppercase dark:text-neutral-400"
						>
							{item.template}
						</span>
					</div>
					<div class="mt-2 text-2xl font-bold text-neutral-900 dark:text-white">
						{item.count}
					</div>
					<Progress
						value={item.count}
						max={analyticsData?.metrics.totalRenders || 1}
						color="primary"
						size="xs"
						class="mt-2"
					/>
				</Card>
			{/each}
			{#if !analyticsData?.templateBreakdown?.length}
				<div class="col-span-full py-4 text-center text-sm text-neutral-500">
					No template renders logged yet.
				</div>
			{/if}
		</div>
	</Card>

	<!-- Live Audit / Render Logs Table -->
	<div class="space-y-3">
		<h3
			class="text-sm font-semibold tracking-wider text-neutral-500 uppercase dark:text-neutral-400"
		>
			Recent Render Activity (Last 15)
		</h3>
		<Card class="overflow-hidden p-0">
			<DataTable
				data={analyticsData?.recentLogs || []}
				columns={logColumns}
				emptyText="No activity logged yet."
			>
				{#snippet cell(item, col)}
					{#if col.key === 'createdAt'}
						<span class="font-mono text-xs text-neutral-500 dark:text-neutral-400">
							{item.createdAt}
						</span>
					{:else if col.key === 'keyName'}
						{#if item.keyName}
							<span class="text-xs font-medium text-neutral-900 dark:text-neutral-200">
								{item.keyName}
							</span>
						{:else}
							<span class="font-mono text-xs text-neutral-500">HMAC Public Embed</span>
						{/if}
					{:else if col.key === 'template'}
						<Badge color="neutral" variant="subtle" size="xs" class="font-mono">
							{item.template}
						</Badge>
					{:else if col.key === 'isCacheHit'}
						<div class="flex justify-end">
							<Badge color={item.isCacheHit ? 'success' : 'warning'} variant="subtle" size="xs">
								{item.isCacheHit ? 'CACHE HIT' : 'RENDER MISS'}
							</Badge>
						</div>
					{/if}
				{/snippet}
			</DataTable>
		</Card>
	</div>
</main>
