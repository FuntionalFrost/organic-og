<script lang="ts">
	import { siteConfig } from '#lib/site.config.js';
	import { Icon } from 'yaxa-svelte';
	import OrganicOgLogo from '#lib/components/OrganicOgLogo.svelte';

	const currentYear = new Date().getFullYear();
	const legalLinks = siteConfig.legal?.links;
</script>

<footer
	class="border-t border-neutral-200 bg-white transition-colors dark:border-neutral-800 dark:bg-neutral-950"
>
	<div class="mx-auto max-w-7xl px-8 py-12 md:py-16">
		<div class="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
			<!-- Brand Info -->
			<div class="space-y-4 md:col-span-2 lg:col-span-2">
				<OrganicOgLogo size="md" />
				<p class="max-w-sm text-sm text-neutral-600 dark:text-neutral-400">
					{siteConfig.description}
				</p>
				<p class="text-xs text-neutral-400 dark:text-neutral-500">
					© {currentYear}
					{siteConfig.name}
					{#if siteConfig.project?.licenseUrl}
						· <a
							href={siteConfig.project.licenseUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="underline-offset-2 transition-colors hover:text-neutral-700 hover:underline dark:hover:text-neutral-300"
						>
							MIT Licensed
						</a>
					{/if}
				</p>
			</div>

			<!-- Quick Links -->
			<div>
				<h3 class="text-xs font-semibold tracking-wider text-neutral-900 uppercase dark:text-white">
					Navigation
				</h3>
				<ul class="mt-4 space-y-2.5 text-sm text-neutral-600 dark:text-neutral-400">
					{#each siteConfig.nav || [] as item (item.href)}
						<li>
							<a
								href={item.href}
								class="transition-colors hover:text-primary-600 dark:hover:text-primary-400"
							>
								{item.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Legal Links (Rendered once cleanly in this column) -->
			{#if legalLinks}
				<div>
					<h3
						class="text-xs font-semibold tracking-wider text-neutral-900 uppercase dark:text-white"
					>
						Legal & Compliance
					</h3>
					<ul class="mt-4 space-y-2.5 text-sm text-neutral-600 dark:text-neutral-400">
						{#if legalLinks.privacy}
							<li>
								<a
									href={legalLinks.privacy}
									class="transition-colors hover:text-primary-600 dark:hover:text-primary-400"
								>
									Privacy Policy
								</a>
							</li>
						{/if}
						{#if legalLinks.terms}
							<li>
								<a
									href={legalLinks.terms}
									class="transition-colors hover:text-primary-600 dark:hover:text-primary-400"
								>
									Terms of Service
								</a>
							</li>
						{/if}
						{#if legalLinks.refunds}
							<li>
								<a
									href={legalLinks.refunds}
									class="transition-colors hover:text-primary-600 dark:hover:text-primary-400"
								>
									Cancellation & Refunds
								</a>
							</li>
						{/if}
						{#if legalLinks.impressum}
							<li>
								<a
									href={legalLinks.impressum}
									class="transition-colors hover:text-primary-600 dark:hover:text-primary-400"
								>
									Impressum
								</a>
							</li>
						{/if}
					</ul>
				</div>
			{/if}

			<!-- Community / Ecosystem -->
			<div>
				<h3 class="text-xs font-semibold tracking-wider text-neutral-900 uppercase dark:text-white">
					Community
				</h3>
				<ul class="mt-4 space-y-2.5 text-sm text-neutral-600 dark:text-neutral-400">
					{#if siteConfig.socials?.github}
						<li>
							<a
								href={siteConfig.socials.github}
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex items-center gap-1.5 transition-colors hover:text-primary-600 dark:hover:text-primary-400"
							>
								<Icon name="github" size="xs" />
								<span>GitHub ↗</span>
							</a>
						</li>
					{/if}
					<li>
						<a
							href="https://yaxa.vercel.app/"
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1.5 transition-colors hover:text-primary-600 dark:hover:text-primary-400"
						>
							<span>Built with Yaxa ↗</span>
						</a>
					</li>
				</ul>
			</div>
		</div>
	</div>
</footer>
