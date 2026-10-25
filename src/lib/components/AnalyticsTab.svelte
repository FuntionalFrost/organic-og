<script lang="ts">
	import { Card, DataTable, Badge, Progress, MetricCard, DonutChart } from 'yaxa-svelte';
	import type { AnalyticsData } from '#lib/types/dashboard.js';

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

	const donutData = $derived(
		(analyticsData?.templateBreakdown || []).map((t) => ({
			label: t.template.toUpperCase(),
			value: t.count
		}))
	);
</script>

<main class="mx-auto w-full max-w-7xl flex-1 space-y-8 p-8">
	<div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
		<div>
			<h1 class="text-xl font-bold text-neutral-900 dark:text-white">Analytics & Health Deck</h1>
			<p class="text-sm text-neutral-600 dark:text-neutral-400">
				Real-time render throughput, cache efficiency, and API usage logs.
			</p>
		</div>
		<div
			class="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-50/50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-950/30 dark:text-emerald-300"
		>
			<span class="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
			<span class="font-mono text-xs">All systems operational</span>
		</div>
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
			title="Cache Hits"
			value={(analyticsData?.metrics.cacheHits ?? 0).toLocaleString()}
			change={18}
			changePeriod="bandwidth saved"
			sparkline={[
				20,
				45,
				70,
				110,
				160,
				220,
				Math.max(250, analyticsData?.metrics.cacheHits || 250)
			]}
			sparklineColor="primary"
			variant="outline"
		/>
	</div>

	<!-- Template Breakdown Grid -->
	<Card
		class="space-y-4 border border-neutral-200 bg-white p-6 yaxa-surface-elevated dark:border-neutral-800/90 dark:bg-[#121215]"
	>
		<div class="flex items-center justify-between">
			<h3
				class="text-sm font-semibold tracking-wider text-neutral-600 uppercase dark:text-neutral-400"
			>
				Template Usage Distribution
			</h3>
			<Badge color="neutral" variant="subtle" size="xs">
				{analyticsData?.templateBreakdown?.length || 0} Templates Active
			</Badge>
		</div>

		{#if donutData.length > 0}
			<div class="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
				<!-- Proportional Donut Chart -->
				<div class="flex flex-col items-center justify-center lg:col-span-4">
					<DonutChart
						data={donutData}
						size={220}
						strokeWidth={24}
						centerLabel="Total Renders"
						centerValue={analyticsData?.metrics.totalRenders ?? 0}
						showLegend={false}
						showTooltip={true}
					/>
				</div>

				<!-- Grid of Individual Template Cards -->
				<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:col-span-8">
					{#each analyticsData?.templateBreakdown || [] as item (item.template)}
						<Card
							variant="subtle"
							class="flex flex-col justify-between border border-neutral-200 bg-neutral-50 p-4 shadow-2xs dark:border-neutral-800/80 dark:bg-[#0c0c0e]"
						>
							<div class="flex items-center justify-between">
								<span
									class="font-mono text-xs font-semibold text-neutral-600 uppercase dark:text-neutral-400"
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
				</div>
			</div>
		{:else}
			<div class="col-span-full py-6 text-center text-sm text-neutral-500">
				No template renders logged yet.
			</div>
		{/if}
	</Card>

	<!-- Live Audit / Render Logs Table -->
	<div class="space-y-3">
		<h3
			class="text-sm font-semibold tracking-wider text-neutral-600 uppercase dark:text-neutral-400"
		>
			Recent Render Activity (Last 15)
		</h3>
		<Card
			class="overflow-hidden border border-neutral-200 bg-white p-0 yaxa-surface-elevated dark:border-neutral-800/90 dark:bg-[#121215]"
		>
			<DataTable
				data={analyticsData?.recentLogs || []}
				columns={logColumns}
				emptyText="No activity logged yet."
			>
				{#snippet cell(item, col)}
					{#if col.key === 'createdAt'}
						<span class="font-mono text-xs text-neutral-600 dark:text-neutral-400">
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
