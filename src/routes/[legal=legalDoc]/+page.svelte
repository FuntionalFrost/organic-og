<script lang="ts">
	import { Seo } from 'yaxa-svelte';
	import LegalDocView from '$lib/components/LegalDocView.svelte';

	let { data } = $props();
</script>

<Seo title={data.title} description={data.description} canonical={data.canonical} />

<LegalDocView type={data.type} />
