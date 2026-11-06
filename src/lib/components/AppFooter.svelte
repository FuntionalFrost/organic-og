<script lang="ts">
	import { siteConfig } from '#lib/site.config.js';
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
								<svg class="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
									<path
										fill-rule="evenodd"
										clip-rule="evenodd"
										d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
									/>
								</svg>
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
