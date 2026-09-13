<script lang="ts">
	import { Button, Icon } from 'yaxa-svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		icon?: any;
		iconColorClass?: string;
		title: string;
		description: string;
		buttonLabel?: string;
		onlogin?: () => void;
		children?: Snippet;
	}

	let {
		icon,
		iconColorClass = 'text-primary-400',
		title,
		description,
		buttonLabel = 'Sign in with GitHub',
		onlogin,
		children
	}: Props = $props();
</script>

<div class="mx-auto my-auto w-full max-w-lg flex-1 space-y-6 p-8 text-center">
	<div
		class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900 shadow-xl {iconColorClass}"
	>
		<Icon name={icon} size="lg" />
	</div>
	<div class="space-y-2">
		<h2 class="text-xl font-bold text-white">
			{title}
		</h2>
		<p class="text-sm text-neutral-400">
			{description}
		</p>
	</div>
	{#if children}
		{@render children()}
	{/if}
	{#if onlogin}
		<Button icon="github" color="primary" variant="solid" size="md" onclick={onlogin}>
			{buttonLabel}
		</Button>
	{/if}
</div>
