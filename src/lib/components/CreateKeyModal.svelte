<script lang="ts">
	import { Modal, Button, Input, FormField, toast } from 'yaxa-svelte';
	import type { ApiKeyItem } from '$lib/types/dashboard';

	interface Props {
		open?: boolean;
		oncreated?: (key: ApiKeyItem) => void;
	}

	let { open = $bindable(false), oncreated }: Props = $props();

	let keyName = $state('');
	let isSubmitting = $state(false);
	let generatedRawKey = $state<string | null>(null);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!keyName.trim() || keyName.length < 2) {
			toast.error('Key name must be at least 2 characters.');
			return;
		}

		isSubmitting = true;
		try {
			const res = await fetch('/api/keys', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: keyName.trim() })
			});

			if (!res.ok) {
				const errorData = await res.json().catch(() => ({}));
				throw new Error(errorData.message || 'Failed to create API key');
			}

			const createdKey = await res.json();
			generatedRawKey = createdKey.rawKey;
			keyName = '';
			if (oncreated) oncreated(createdKey);
			toast.success('API Key Created');
		} catch (err: unknown) {
			toast.error(
				(err instanceof Error ? err.message : 'Failed to create API key') ||
					'Failed to create API key'
			);
		} finally {
			isSubmitting = false;
		}
	}

	function copyKey() {
		if (generatedRawKey) {
			navigator.clipboard.writeText(generatedRawKey);
			toast.success('Copied API Key to clipboard');
		}
	}

	function handleDone() {
		open = false;
		generatedRawKey = null;
	}
</script>

<Modal bind:open title="Create New API Key" size="md">
	{#if !generatedRawKey}
		<form onsubmit={handleSubmit} class="space-y-4">
			<p class="text-sm text-neutral-400">Enter a descriptive name (e.g. "Production Blog").</p>
			<FormField label="Key Name" required>
				<Input bind:value={keyName} placeholder="e.g. Production Blog" disabled={isSubmitting} />
			</FormField>
			<div class="flex justify-end gap-3 pt-2">
				<Button type="button" color="neutral" variant="outline" onclick={() => (open = false)}>
					Cancel
				</Button>
				<Button type="submit" color="primary" variant="solid" loading={isSubmitting}>
					Generate Key
				</Button>
			</div>
		</form>
	{:else}
		<div class="space-y-4">
			<div
				class="flex items-center gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3"
			>
				<p class="text-xs text-amber-200">
					⚠️ Copy this secret key now. You will not be able to see it again.
				</p>
			</div>
			<div class="flex items-center gap-2">
				<Input value={generatedRawKey} readonly class="font-mono text-xs" />
				<Button type="button" color="primary" variant="solid" onclick={copyKey}>Copy</Button>
			</div>
			<div class="flex justify-end pt-2">
				<Button type="button" color="primary" variant="solid" onclick={handleDone}>Done</Button>
			</div>
		</div>
	{/if}
</Modal>
