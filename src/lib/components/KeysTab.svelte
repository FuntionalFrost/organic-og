<script lang="ts">
	import { DataTable, Button, Badge, Card, MetricCard } from 'yaxa-svelte';
	import type { ApiKeyItem } from '#lib/types/dashboard.js';

	interface Props {
		keysList: ApiKeyItem[];
		ontestRender?: (keyId: string) => void;
		onrevokeKey?: (keyId: string) => void;
	}

	let { keysList = [], ontestRender, onrevokeKey }: Props = $props();

	const totalRenders = $derived(keysList.reduce((acc, k) => acc + (k.totalRenders || 0), 0));

	const columns = [
		{ key: 'name', label: 'Token Name' },
		{ key: 'prefix', label: 'Key Prefix' },
		{ key: 'totalRenders', label: 'Total Generated' },
		{ key: 'status', label: 'Status' },
		{ key: 'actions', label: 'Actions', class: 'text-right' }
	];
</script>

<main class="mx-auto w-full max-w-7xl flex-1 space-y-6 p-8">
	<div>
		<h1 class="text-xl font-bold text-neutral-900 dark:text-white">API Tokens & Telemetry</h1>
		<p class="text-sm text-neutral-600 dark:text-neutral-400">
			Manage cryptographic access tokens for headless CMS, CI/CD, and programmatic OpenGraph
			generation.
		</p>
	</div>

	<!-- Token Health & Telemetry Cards -->
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
		<MetricCard
			title="Total Generated Images"
			value={totalRenders.toLocaleString()}
			change={totalRenders > 0 ? 32 : 0}
			changePeriod="across all tokens"
			sparkline={[20, 45, 80, 110, 190, 280, Math.max(300, totalRenders || 300)]}
			sparklineColor="success"
			variant="outline"
		/>

		<MetricCard
			title="Active API Tokens"
			value={keysList.length}
			change={keysList.length > 0 ? 1 : 0}
			changeType="absolute"
			changePeriod="active credentials"
			sparkline={[1, 1, 2, 2, 3, 3, Math.max(3, keysList.length || 3)]}
			sparklineColor="primary"
			variant="outline"
		/>

		<MetricCard
			title="Access Tier"
			value="Unlimited"
			changePeriod="100% Free & Open Source"
			variant="outline"
		/>
	</div>

	<Card
		class="overflow-hidden border border-neutral-200 bg-white yaxa-surface-elevated dark:border-neutral-800/90 dark:bg-[#121215]"
	>
		<DataTable
			data={keysList}
			{columns}
			emptyText="No active API tokens found. Create one to get started."
		>
			{#snippet cell(item, col)}
				{#if col.key === 'name'}
					<span class="font-medium text-neutral-900 dark:text-neutral-100">{item.name}</span>
				{:else if col.key === 'prefix'}
					<span class="font-mono text-xs text-neutral-600 dark:text-neutral-400">{item.prefix}</span
					>
				{:else if col.key === 'totalRenders'}
					<span class="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
						>{item.totalRenders.toLocaleString()} renders</span
					>
				{:else if col.key === 'status'}
					<Badge color={item.isActive ? 'success' : 'neutral'} variant="subtle" size="xs">
						{item.isActive ? 'Active' : 'Inactive'}
					</Badge>
				{:else if col.key === 'actions'}
					<div class="flex items-center justify-end gap-2">
						<Button
							color="neutral"
							variant="subtle"
							size="xs"
							onclick={() => ontestRender && ontestRender(item.id)}
						>
							▶ Test Token
						</Button>
						<Button
							color="error"
							variant="ghost"
							size="xs"
							onclick={() => onrevokeKey && onrevokeKey(item.id)}
						>
							🗑 Revoke
						</Button>
					</div>
				{/if}
			{/snippet}
		</DataTable>
	</Card>
</main>
