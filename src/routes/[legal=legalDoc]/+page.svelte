<script lang="ts">
	import { Seo, LegalDocument, Button } from 'yaxa-svelte';
	import { siteConfig } from '$lib/site.config';
	import { ArrowLeft } from '@lucide/svelte';

	let { data } = $props();
</script>

<Seo title={data.title} description={data.description} canonical={data.canonical} />

<div class="min-h-screen bg-neutral-50 py-8 transition-colors dark:bg-neutral-950">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="mb-6">
			<Button
				href="/"
				variant="ghost"
				color="neutral"
				size="sm"
				class="gap-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
			>
				<ArrowLeft class="h-4 w-4" />
				<span>Back to Studio</span>
			</Button>
		</div>

		<div
			class="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-10 dark:border-neutral-800 dark:bg-neutral-900"
		>
			<LegalDocument type={data.type} config={siteConfig} />
		</div>
	</div>
</div>
