<script lang="ts">
	import { LegalDocument, Container, Button, Icon, Seo } from 'yaxa-svelte';
</script>

<Seo
	title="Terms of Service"
	description="Terms of service, usage limits, and API licensing agreements for OG Engine."
	canonical="https://ogengine.dev/terms"
/>

<div class="min-h-screen bg-neutral-950 py-12 text-neutral-100">
	<Container size="lg">
		<div class="mb-8">
			<Button href="/" variant="ghost" color="neutral" size="sm" class="gap-2">
				<Icon name="arrow-left" size="xs" />
				Back to Studio
			</Button>
		</div>
		<div class="rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-2xl sm:p-12">
			<LegalDocument type="terms" />
		</div>
	</Container>
</div>
