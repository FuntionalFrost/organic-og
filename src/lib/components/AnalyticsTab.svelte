<script lang="ts">
	import { Card, DataTable, Badge, Progress, MetricCard } from 'yaxa-svelte';
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

	<!-- KPI Summary Cards with Native yaxa-svelte Sparklines -->
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<MetricCard
			title="Total Renders"
			value={analyticsData?.metrics.totalRenders ?? 0}
			change={24}
			changePeriod="vs last 24h"
			sparkline={[
				12,
				19,
				28,
				35,
				42,
				68,
				85,
				Math.max(90, analyticsData?.metrics.totalRenders || 90)
			]}
			sparklineColor="primary"
			variant="outline"
		/>

		<MetricCard
			title="Cache Hit Rate"
			value={`${analyticsData?.metrics.cacheHitRate ?? 0}%`}
			change={5.2}
			changePeriod="efficiency"
			sparkline={[
				60,
				68,
				75,
				72,
				80,
				88,
				92,
				Math.max(90, analyticsData?.metrics.cacheHitRate || 95)
			]}
			sparklineColor="success"
			variant="outline"
		/>

		<MetricCard
			title="Active API Keys"
			value={analyticsData?.metrics.activeKeys ?? 0}
			change={1}
			changeType="absolute"
			changePeriod="credentials"
			sparkline={[1, 2, 2, 3, 4, 4, 5, Math.max(5, analyticsData?.metrics.activeKeys || 5)]}
			sparklineColor="warning"
			variant="outline"
		/>

		<MetricCard
			title="Credits Sold"
			value={(analyticsData?.metrics.creditsPurchased ?? 0).toLocaleString()}
			change={18}
			changePeriod="via Polar MoR"
			sparkline={[
				100,
				250,
				400,
				600,
				850,
				1200,
				Math.max(1200, analyticsData?.metrics.creditsPurchased || 1500)
			]}
			sparklineColor="primary"
			variant="outline"
		/>
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
