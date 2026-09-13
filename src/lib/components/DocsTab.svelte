<script lang="ts">
	import { Button, toast } from 'yaxa-svelte';
	import type { StudioState } from '$lib/types/dashboard';
	import {
		generateCurlSnippet,
		generateTypeScriptSnippet,
		generatePythonSnippet,
		generateSvelteKitSnippet
	} from '$lib/utils/snippets';

	interface Props {
		studioState: StudioState;
		apiKeyPrefix: string;
		signedPreviewUrl: string;
		baseUrl: string;
	}

	let { studioState, apiKeyPrefix, signedPreviewUrl, baseUrl }: Props = $props();

	let docLanguage = $state<'curl' | 'typescript' | 'python' | 'svelte'>('curl');

	let generatedCode = $derived.by(() => {
		switch (docLanguage) {
			case 'curl':
				return generateCurlSnippet(studioState, apiKeyPrefix, baseUrl);
			case 'typescript':
				return generateTypeScriptSnippet(studioState, apiKeyPrefix, baseUrl);
			case 'python':
				return generatePythonSnippet(studioState, apiKeyPrefix, baseUrl);
			case 'svelte':
				return generateSvelteKitSnippet(signedPreviewUrl, baseUrl);
			default:
				return '';
		}
	});

	const queryParams = [
		{
			param: 'template',
			type: 'string',
			default: 'saas',
			desc: 'Layout type: saas, blog, ecommerce, github, minimal'
		},
		{
			param: 'title',
			type: 'string',
			default: 'Dynamic OG Engine',
			desc: 'Main headline text (supports auto-wrapping)'
		},
		{
			param: 'description',
			type: 'string',
			default: "''",
			desc: 'Subheading or article summary excerpt'
		},
		{ param: 'siteName', type: 'string', default: "''", desc: 'Brand or domain name in header' },
		{
			param: 'badge',
			type: 'string',
			default: "''",
			desc: 'Accent pill tag (e.g. "Sale", "New", "v2.0")'
		},
		{ param: 'theme', type: 'string', default: 'dark', desc: 'Color palette: dark, light, brand' },
		{
			param: 'price',
			type: 'string',
			default: "''",
			desc: 'Price string (used in ecommerce template)'
		},
		{ param: 'stars', type: 'string', default: "''", desc: 'Star count (used in github template)' },
		{ param: 'forks', type: 'string', default: "''", desc: 'Fork count (used in github template)' },
		{
			param: 's',
			type: 'string',
			default: "''",
			desc: 'HMAC-SHA256 signature for unauthenticated public URLs'
		}
	];

	function copySnippet() {
		navigator.clipboard.writeText(generatedCode);
		toast.success('Copied Code Snippet');
	}
</script>

<main class="mx-auto w-full max-w-7xl flex-1 space-y-12 p-8">
	<div>
		<h1 class="text-xl font-bold text-white">Developer Integration Hub</h1>
		<p class="text-sm text-neutral-400">
			Complete API reference, interactive SDK snippets, and authentication guides.
		</p>
	</div>

	<!-- 1. Interactive SDK Code Generator -->
	<section class="space-y-4">
		<div class="flex items-center justify-between">
			<h2 class="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
				Live SDK Snippets (Synced with Studio)
			</h2>
			<div class="flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-900 p-1">
				<Button
					variant={docLanguage === 'curl' ? 'solid' : 'ghost'}
					color="primary"
					size="xs"
					onclick={() => (docLanguage = 'curl')}
				>
					cURL
				</Button>
				<Button
					variant={docLanguage === 'typescript' ? 'solid' : 'ghost'}
					color="primary"
					size="xs"
					onclick={() => (docLanguage = 'typescript')}
				>
					TypeScript
				</Button>
				<Button
					variant={docLanguage === 'python' ? 'solid' : 'ghost'}
					color="primary"
					size="xs"
					onclick={() => (docLanguage = 'python')}
				>
					Python
				</Button>
				<Button
					variant={docLanguage === 'svelte' ? 'solid' : 'ghost'}
					color="primary"
					size="xs"
					onclick={() => (docLanguage = 'svelte')}
				>
					SvelteKit / HTML
				</Button>
			</div>
		</div>

		<div class="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 shadow-xl">
			<div
				class="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6 py-3"
			>
				<span class="font-mono text-xs text-neutral-400"
					>{docLanguage.toUpperCase()} Implementation</span
				>
				<Button color="neutral" variant="ghost" size="xs" onclick={copySnippet}>
					📋 Copy Snippet
				</Button>
			</div>
			<pre class="overflow-x-auto p-6 font-mono text-xs leading-relaxed text-neutral-200"><code
					>{generatedCode}</code
				></pre>
		</div>
	</section>

	<!-- 2. Authentication Methods -->
	<section class="space-y-4">
		<h2 class="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
			Authentication Reference
		</h2>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<div class="space-y-2 rounded-xl border border-neutral-800 bg-neutral-900/60 p-5">
				<div class="flex items-center gap-2 font-semibold text-white">
					<span class="text-amber-400">🔑</span>
					<span>1. Bearer API Key</span>
				</div>
				<p class="text-xs leading-relaxed text-neutral-400">
					Ideal for backend servers, headless CMS hooks, and CI/CD pipelines. Deducts 1 credit per
					uncached render.
				</p>
				<pre
					class="mt-2 overflow-x-auto rounded bg-neutral-950 p-2.5 font-mono text-xs text-amber-200">Authorization: Bearer og_live_...</pre>
			</div>

			<div class="space-y-2 rounded-xl border border-neutral-800 bg-neutral-900/60 p-5">
				<div class="flex items-center gap-2 font-semibold text-white">
					<span class="text-emerald-400">🛡️</span>
					<span
						>2. HMAC URL Signature (<code class="font-mono text-xs text-emerald-300">s=</code
						>)</span
					>
				</div>
				<p class="text-xs leading-relaxed text-neutral-400">
					Ideal for public <code class="text-neutral-300">&lt;meta&gt;</code> tags. Prevents URL parameter
					tampering without leaking private keys.
				</p>
				<pre
					class="mt-2 overflow-x-auto rounded bg-neutral-950 p-2.5 font-mono text-xs text-emerald-200">/api/og?title=Edge&s=4f8b92a1c0d3e5f7</pre>
			</div>
		</div>
	</section>

	<!-- 3. API Endpoints -->
	<section class="space-y-4">
		<h2 class="text-xs font-semibold tracking-wider text-neutral-400 uppercase">Endpoints</h2>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<div class="space-y-2 rounded-xl border border-neutral-800 bg-neutral-900/60 p-5">
				<div class="flex items-center gap-3">
					<span
						class="rounded border border-emerald-800 bg-emerald-950 px-2 py-0.5 font-mono text-xs font-bold text-emerald-400"
						>GET</span
					>
					<span class="font-mono text-sm font-semibold text-neutral-200">/api/og</span>
				</div>
				<p class="text-xs text-neutral-400">
					Rasterizes and streams a binary PNG image (1200x630 px) directly from edge cache or native
					Node.js renderers.
				</p>
			</div>

			<div class="space-y-2 rounded-xl border border-neutral-800 bg-neutral-900/60 p-5">
				<div class="flex items-center gap-3">
					<span
						class="rounded border border-blue-800 bg-blue-950 px-2 py-0.5 font-mono text-xs font-bold text-blue-400"
						>POST</span
					>
					<span class="font-mono text-sm font-semibold text-neutral-200">/api/sign</span>
				</div>
				<p class="text-xs text-neutral-400">
					Generates a 16-character canonical HMAC signature and pre-signed URL from any query
					parameter payload.
				</p>
			</div>
		</div>
	</section>

	<!-- 4. Query Parameters Table -->
	<section class="space-y-4">
		<h2 class="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
			URL Parameters Specification
		</h2>
		<div class="overflow-x-auto rounded-xl border border-neutral-800">
			<table class="w-full text-left text-sm">
				<thead
					class="border-b border-neutral-800 bg-neutral-950 font-mono text-xs text-neutral-400"
				>
					<tr>
						<th class="p-3">Parameter</th>
						<th class="p-3">Type</th>
						<th class="p-3">Default</th>
						<th class="p-3">Description</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-neutral-800 bg-neutral-900/40">
					{#each queryParams as item (item.param)}
						<tr class="hover:bg-neutral-800/30">
							<td class="p-3 font-mono font-bold text-primary-400">{item.param}</td>
							<td class="p-3 font-mono text-xs text-neutral-400">{item.type}</td>
							<td class="p-3 font-mono text-xs text-neutral-500">{item.default}</td>
							<td class="p-3 text-xs text-neutral-300">{item.desc}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>
</main>
