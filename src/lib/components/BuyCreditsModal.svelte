<script lang="ts">
	import { Modal, Button, Badge, Icon, toast } from 'yaxa-svelte';
	import type { ApiKeyItem, PackageOption } from '$lib/types/dashboard';

	interface Props {
		open?: boolean;
		apiKey?: ApiKeyItem | null;
	}

	let { open = $bindable(false), apiKey = null }: Props = $props();

	let loadingTier = $state<string | null>(null);

	const packages: PackageOption[] = [
		{
			id: 'starter',
			name: 'Starter Bundle',
			credits: '1,000',
			price: '€9.00',
			perImage: '€0.009 / image'
		},
		{
			id: 'growth',
			name: 'Growth Bundle',
			credits: '5,000',
			price: '€29.00',
			perImage: '€0.0058 / image',
			popular: true
		},
		{
			id: 'scale',
			name: 'Scale Bundle',
			credits: '25,000',
			price: '€99.00',
			perImage: '€0.0039 / image'
		}
	];

	async function handleCheckout(tier: 'starter' | 'growth' | 'scale') {
		loadingTier = tier;
		try {
			const res = await fetch('/api/checkout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					apiKeyId: apiKey?.id || undefined,
					packageTier: tier
				})
			});

			if (!res.ok) {
				const errorData = await res.json().catch(() => ({}));
				throw new Error(errorData.message || 'Failed to initiate checkout session');
			}

			const data = await res.json();
			if (data.checkoutUrl) {
				window.location.href = data.checkoutUrl;
			} else {
				throw new Error('No checkout URL returned from server.');
			}
		} catch (err: unknown) {
			toast.error(
				(err instanceof Error ? err.message : 'Error') ||
					'Failed to initiate Polar checkout session.'
			);
		} finally {
			loadingTier = null;
		}
	}
</script>

<Modal bind:open title="Purchase API Credits" size="lg">
	<div class="space-y-6">
		{#if apiKey}
			<div
				class="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3"
			>
				<div>
					<span class="block text-xs text-neutral-400">Target API Key</span>
					<span class="text-sm font-semibold text-neutral-100">{apiKey.name}</span>
				</div>
				<span
					class="rounded border border-neutral-800 bg-neutral-900 px-2.5 py-1 font-mono text-xs text-neutral-400"
				>
					{apiKey.prefix}
				</span>
			</div>
		{/if}

		<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
			{#each packages as pkg (pkg.id)}
				<div
					class="relative flex flex-col justify-between rounded-xl border p-5 transition-all {pkg.popular
						? 'border-primary-500/50 bg-primary-950/20 shadow-lg shadow-primary-500/10'
						: 'border-neutral-800 bg-neutral-900 hover:border-neutral-700'}"
				>
					{#if pkg.popular}
						<Badge
							color="primary"
							variant="solid"
							size="xs"
							class="absolute -top-2.5 right-4 text-[10px] font-semibold"
						>
							BEST VALUE
						</Badge>
					{/if}

					<div class="space-y-2">
						<h3 class="text-sm font-semibold text-neutral-200">
							{pkg.name}
						</h3>
						<div class="flex items-baseline gap-1">
							<span class="font-mono text-2xl font-bold text-white">{pkg.price}</span>
						</div>
						<p class="font-mono text-xs font-semibold text-primary-400">
							{pkg.credits} Credits
						</p>
						<p class="text-[11px] text-neutral-400">
							{pkg.perImage}
						</p>
					</div>

					<div class="mt-2 border-t border-neutral-800/80 pt-4">
						<Button
							color={pkg.popular ? 'primary' : 'neutral'}
							variant={pkg.popular ? 'solid' : 'outline'}
							block
							size="sm"
							loading={loadingTier === pkg.id}
							disabled={loadingTier !== null}
							onclick={() => handleCheckout(pkg.id as 'starter' | 'growth' | 'scale')}
						>
							Buy {pkg.name.split(' ')[0]}
						</Button>
					</div>
				</div>
			{/each}
		</div>

		<div class="flex items-center justify-center gap-2 text-xs text-neutral-500">
			<Icon name="check" size="xs" class="text-emerald-400" />
			<span>Secure checkout via Polar.sh · Instant credit top-up</span>
		</div>
	</div>
</Modal>
