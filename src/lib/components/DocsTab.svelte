<script lang="ts">
	import { Card, Button, ButtonGroup, Badge, CodeBlock } from 'yaxa-svelte';
	import type { StudioState } from '$lib/types/dashboard';
	import {
		generateCurlSnippet,
		generateTypeScriptSnippet,
		generateNextJsSnippet,
		generatePythonSnippet,
		generateSvelteKitSnippet,
		generateMarkdownSnippet
	} from '$lib/utils/snippets';

	interface Props {
		studioState: StudioState;
		apiKeyPrefix: string;
		signedPreviewUrl: string;
		baseUrl: string;
	}

	let { studioState, apiKeyPrefix, signedPreviewUrl, baseUrl }: Props = $props();

	let docLanguage = $state<'curl' | 'typescript' | 'nextjs' | 'python' | 'svelte' | 'markdown'>(
		'curl'
	);

	function getCodeLanguage(lang: typeof docLanguage): string {
		switch (lang) {
			case 'curl':
				return 'bash';
			case 'typescript':
			case 'nextjs':
				return 'typescript';
			case 'python':
				return 'python';
			case 'svelte':
				return 'svelte';
			case 'markdown':
				return 'markdown';
			default:
				return 'typescript';
		}
	}

	function getFilename(lang: typeof docLanguage): string {
		switch (lang) {
			case 'curl':
				return 'curl.sh';
			case 'typescript':
				return 'og-client.ts';
			case 'nextjs':
				return 'app/blog/[slug]/page.tsx';
			case 'python':
				return 'generate_og.py';
			case 'svelte':
				return 'src/routes/+page.svelte';
			case 'markdown':
				return 'README.md';
			default:
				return 'snippet.txt';
		}
	}

	let generatedCode = $derived.by(() => {
		switch (docLanguage) {
			case 'curl':
				return generateCurlSnippet(studioState, apiKeyPrefix, baseUrl);
			case 'typescript':
				return generateTypeScriptSnippet(studioState, apiKeyPrefix, baseUrl);
			case 'nextjs':
				return generateNextJsSnippet(signedPreviewUrl, baseUrl);
			case 'python':
				return generatePythonSnippet(studioState, apiKeyPrefix, baseUrl);
			case 'svelte':
				return generateSvelteKitSnippet(signedPreviewUrl, baseUrl);
			case 'markdown':
				return generateMarkdownSnippet(signedPreviewUrl, baseUrl, studioState.title);
			default:
				return '';
		}
	});

	const queryParams = [
		{
			param: 'template',
			type: 'string',
			default: 'saas',
			desc: 'Layout type: saas, blog, minimal, ecommerce, github, podcast, event, quote, changelog'
		},
		{
			param: 'format',
			type: 'string',
			default: 'png',
			desc: 'Output format: png (social cards) or svg (vector streaming for web/README)'
		},
		{
			param: 'pattern',
			type: 'string',
			default: 'none',
			desc: 'Pattern overlay: none, grid, dots, glow'
		},
		{
			param: 'font',
			type: 'string',
			default: 'inter',
			desc: 'Typography family: inter, mono, outfit, serif'
		},
		{
			param: 'bg / accent / textColor',
			type: 'string (hex/rgb)',
			default: 'preset',
			desc: 'Custom color overrides (e.g. bg=%230f172a&accent=%23ec4899)'
		},
		{
			param: 'title',
			type: 'string',
			default: 'Organic-OG',
			desc: 'Main headline text or quote body (auto-wrapping)'
		},
		{
			param: 'description',
			type: 'string',
			default: "''",
			desc: 'Subheading, article excerpt, or author role'
		},
		{
			param: 'siteName',
			type: 'string',
			default: "''",
			desc: 'Brand, podcast show name, or domain'
		},
		{
			param: 'badge',
			type: 'string',
			default: "''",
			desc: 'Accent badge or tag (e.g. "Tutorial", "EPISODE #01", "v2.5.0")'
		},
		{
			param: 'theme',
			type: 'string',
			default: 'dark',
			desc: 'Color palette preset: dark, light, brand'
		},
		{
			param: 'logoUrl / avatarUrl',
			type: 'string (URL)',
			default: "''",
			desc: 'Remote brand logo, avatar, or cover art'
		},
		{
			param: 'episode / host / guest / duration',
			type: 'string',
			default: "''",
			desc: 'Podcast show metadata'
		},
		{
			param: 'eventDate / location / speaker',
			type: 'string',
			default: "''",
			desc: 'Event and conference metadata'
		},
		{
			param: 'author / handle / role',
			type: 'string',
			default: "''",
			desc: 'Quote and testimonial author attribution'
		},
		{
			param: 'version / items',
			type: 'string',
			default: "''",
			desc: 'Changelog release version and pipe-separated highlights'
		},
		{
			param: 's',
			type: 'string',
			default: "''",
			desc: 'HMAC-SHA256 signature for unauthenticated public URLs'
		}
	];
</script>

<main class="mx-auto w-full max-w-7xl flex-1 space-y-12 p-8">
	<div>
		<h1 class="text-xl font-bold text-neutral-900 dark:text-white">Developer Integration Hub</h1>
		<p class="text-sm text-neutral-600 dark:text-neutral-400">
			Complete API reference, interactive multi-framework SDK snippets, and authentication guides.
		</p>
	</div>

	<!-- 1. Interactive SDK Code Generator -->
	<section class="space-y-4">
		<div class="flex flex-wrap items-center justify-between gap-3">
			<h2
				class="text-xs font-semibold tracking-wider text-neutral-600 uppercase dark:text-neutral-400"
			>
				Live SDK Snippets (Synced with Studio)
			</h2>
			<ButtonGroup>
				<Button
					variant={docLanguage === 'curl' ? 'solid' : 'outline'}
					color="primary"
					size="xs"
					onclick={() => (docLanguage = 'curl')}
				>
					cURL
				</Button>
				<Button
					variant={docLanguage === 'typescript' ? 'solid' : 'outline'}
					color="primary"
					size="xs"
					onclick={() => (docLanguage = 'typescript')}
				>
					TypeScript
				</Button>
				<Button
					variant={docLanguage === 'nextjs' ? 'solid' : 'outline'}
					color="primary"
					size="xs"
					onclick={() => (docLanguage = 'nextjs')}
				>
					Next.js
				</Button>
				<Button
					variant={docLanguage === 'python' ? 'solid' : 'outline'}
					color="primary"
					size="xs"
					onclick={() => (docLanguage = 'python')}
				>
					Python
				</Button>
				<Button
					variant={docLanguage === 'svelte' ? 'solid' : 'outline'}
					color="primary"
					size="xs"
					onclick={() => (docLanguage = 'svelte')}
				>
					SvelteKit / HTML
				</Button>
				<Button
					variant={docLanguage === 'markdown' ? 'solid' : 'outline'}
					color="primary"
					size="xs"
					onclick={() => (docLanguage = 'markdown')}
				>
					Markdown (README)
				</Button>
			</ButtonGroup>
		</div>

		<div
			class="overflow-hidden rounded-xl border border-neutral-200/80 shadow-sm dark:border-neutral-800/80"
		>
			<CodeBlock
				code={generatedCode}
				language={getCodeLanguage(docLanguage)}
				filename={getFilename(docLanguage)}
				showLineNumbers={true}
				themeMode="adaptive"
			/>
		</div>
	</section>

	<!-- 2. Authentication Methods -->
	<section class="space-y-4">
		<h2
			class="text-xs font-semibold tracking-wider text-neutral-600 uppercase dark:text-neutral-400"
		>
			Authentication Reference
		</h2>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<Card
				class="space-y-3 border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-[#121215]"
			>
				<div class="flex items-center gap-2 font-semibold text-neutral-900 dark:text-white">
					<span class="text-amber-500 dark:text-amber-400">🔑</span>
					<span>1. Bearer API Key</span>
				</div>
				<p class="text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
					Ideal for backend servers, headless CMS hooks, and CI/CD automation. Provides unlimited
					free rendering and live telemetry tracking.
				</p>
				<CodeBlock
					code={`Authorization: Bearer ${apiKeyPrefix || 'og_live_prod_abcdef123456'}`}
					language="bash"
					themeMode="adaptive"
				/>
			</Card>

			<Card
				class="space-y-3 border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-[#121215]"
			>
				<div class="flex items-center gap-2 font-semibold text-neutral-900 dark:text-white">
					<span class="text-emerald-500 dark:text-emerald-400">🛡️</span>
					<span>
						2. HMAC URL Signature (<code
							class="font-mono text-xs text-emerald-600 dark:text-emerald-300">s=</code
						>)
					</span>
				</div>
				<p class="text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
					Ideal for public <code class="text-neutral-800 dark:text-neutral-200">&lt;meta&gt;</code> tags.
					Prevents URL parameter tampering without leaking private keys.
				</p>
				<CodeBlock
					code={`GET ${baseUrl || 'https://organic-og.io'}/api/og?title=Edge&s=4f8b92a1c0d3e5f7`}
					language="bash"
					themeMode="adaptive"
				/>
			</Card>
		</div>
	</section>

	<!-- 3. API Endpoints -->
	<section class="space-y-4">
		<h2
			class="text-xs font-semibold tracking-wider text-neutral-600 uppercase dark:text-neutral-400"
		>
			Endpoints
		</h2>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<Card
				class="space-y-2 border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-[#121215]"
			>
				<div class="flex items-center gap-3">
					<Badge color="success" variant="solid" size="xs" class="font-mono font-bold">GET</Badge>
					<span class="font-mono text-sm font-semibold text-neutral-900 dark:text-white">
						/api/og
					</span>
				</div>
				<p class="text-xs text-neutral-600 dark:text-neutral-300">
					Rasterizes and streams a binary PNG image (1200x630 px) or native vector SVG directly from
					hybrid edge cache or Resvg renderer.
				</p>
			</Card>

			<Card
				class="space-y-2 border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-[#121215]"
			>
				<div class="flex items-center gap-3">
					<Badge color="primary" variant="solid" size="xs" class="font-mono font-bold">POST</Badge>
					<span class="font-mono text-sm font-semibold text-neutral-900 dark:text-white">
						/api/sign
					</span>
				</div>
				<p class="text-xs text-neutral-600 dark:text-neutral-300">
					Generates a 16-character canonical HMAC signature and pre-signed URL from any query
					parameter payload.
				</p>
			</Card>
		</div>
	</section>

	<!-- 4. Query Parameters Table -->
	<section class="space-y-4">
		<h2
			class="text-xs font-semibold tracking-wider text-neutral-600 uppercase dark:text-neutral-400"
		>
			URL Parameters Specification
		</h2>
		<Card
			class="overflow-x-auto border border-neutral-200 bg-white p-0 shadow-sm dark:border-neutral-800 dark:bg-[#121215]"
		>
			<table class="w-full text-left text-sm">
				<thead
					class="border-b border-neutral-200 bg-neutral-50 font-mono text-xs text-neutral-600 dark:border-neutral-800 dark:bg-[#0c0c0e] dark:text-neutral-300"
				>
					<tr>
						<th class="p-3.5">Parameter</th>
						<th class="p-3.5">Type</th>
						<th class="p-3.5">Default</th>
						<th class="p-3.5">Description</th>
					</tr>
				</thead>
				<tbody
					class="divide-y divide-neutral-200 bg-white dark:divide-neutral-800/80 dark:bg-[#121215]"
				>
					{#each queryParams as item (item.param)}
						<tr class="transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
							<td class="p-3.5 font-mono font-bold text-primary-600 dark:text-primary-400">
								{item.param}
							</td>
							<td class="p-3.5 font-mono text-xs text-neutral-600 dark:text-neutral-400">
								{item.type}
							</td>
							<td class="p-3.5 font-mono text-xs text-neutral-500 dark:text-neutral-400">
								{item.default}
							</td>
							<td class="p-3.5 text-xs text-neutral-800 dark:text-neutral-200">{item.desc}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</Card>
	</section>
</main>
