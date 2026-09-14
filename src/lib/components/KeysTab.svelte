<script lang="ts">
	import { DataTable, Button, Badge, Card, MetricCard } from 'yaxa-svelte';
	import type { ApiKeyItem } from '$lib/types/dashboard';

	interface Props {
		keysList: ApiKeyItem[];
		onopenBuyCredits?: (key: ApiKeyItem) => void;
		ontestRender?: (keyId: string) => void;
		onrevokeKey?: (keyId: string) => void;
	}

	let { keysList = [], onopenBuyCredits, ontestRender, onrevokeKey }: Props = $props();

	const totalCredits = $derived(keysList.reduce((acc, k) => acc + (k.creditsRemaining || 0), 0));
	const totalRenders = $derived(keysList.reduce((acc, k) => acc + (k.totalRenders || 0), 0));

	const columns = [
		{ key: 'name', label: 'Key Name' },
		{ key: 'prefix', label: 'Token Prefix' },
		{ key: 'creditsRemaining', label: 'Credits Left' },
		{ key: 'totalRenders', label: 'Total Generated' },
		{ key: 'actions', label: 'Actions', class: 'text-right' }
	];
</script>

<main class="mx-auto w-full max-w-7xl flex-1 space-y-6 p-8">
	<div>
		<h1 class="text-xl font-bold text-neutral-900 dark:text-white">API Keys & Credits</h1>
		<p class="text-sm text-neutral-600 dark:text-neutral-400">
			Manage programmatic access tokens and monitor credit balances.
		</p>
	</div>

	<!-- Credit Health Overview Cards with Native yaxa-svelte Sparklines -->
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
		<MetricCard
			title="Total Available Credits"
			value={totalCredits.toLocaleString()}
			change={12}
			changePeriod="active balance"
			sparkline={[100, 250, 400, 350, 500, 750, Math.max(800, totalCredits || 800)]}
			sparklineColor="primary"
			variant="outline"
		/>

		<MetricCard
			title="Total Generated Images"
			value={totalRenders.toLocaleString()}
			change={totalRenders > 0 ? 32 : 0}
			changePeriod="across all keys"
			sparkline={[20, 45, 80, 110, 190, 280, Math.max(300, totalRenders || 300)]}
			sparklineColor="success"
			variant="outline"
		/>

		<MetricCard
			title="Active Key Credentials"
			value={keysList.length}
			change={keysList.length > 0 ? 1 : 0}
			changeType="absolute"
			changePeriod="authenticators"
			sparkline={[1, 1, 2, 2, 3, 3, Math.max(3, keysList.length || 3)]}
			sparklineColor="warning"
			variant="outline"
		/>
	</div>

	<Card class="overflow-hidden">
		<DataTable
			data={keysList}
			{columns}
			emptyText="No active API keys found. Create one to get started."
		>
			{#snippet cell(item, col)}
				{#if col.key === 'name'}
					<span class="font-medium text-neutral-900 dark:text-neutral-100">{item.name}</span>
				{:else if col.key === 'prefix'}
					<span class="font-mono text-xs text-neutral-400">{item.prefix}</span>
				{:else if col.key === 'creditsRemaining'}
					<Badge
						color={item.creditsRemaining > 20 ? 'success' : 'warning'}
						variant="subtle"
						size="sm"
					>
						{item.creditsRemaining} credits
					</Badge>
				{:else if col.key === 'totalRenders'}
					<span class="text-xs text-neutral-400">{item.totalRenders} renders</span>
				{:else if col.key === 'actions'}
					<div class="flex items-center justify-end gap-2">
						<Button
							color="primary"
							variant="soft"
							size="xs"
							onclick={() => onopenBuyCredits && onopenBuyCredits(item)}
						>
							⚡ Buy Credits
						</Button>
						<Button
							color="neutral"
							variant="subtle"
							size="xs"
							onclick={() => ontestRender && ontestRender(item.id)}
						>
							▶ Test (-1)
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
