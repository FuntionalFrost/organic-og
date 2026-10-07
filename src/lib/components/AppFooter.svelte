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

			<!-- Community / Socials -->
			<div>
				<h3 class="text-xs font-semibold tracking-wider text-neutral-900 uppercase dark:text-white">
					Community
				</h3>
				<div class="mt-4 flex items-center gap-3 text-neutral-500 dark:text-neutral-400">
					{#if siteConfig.socials?.github}
						<a
							href={siteConfig.socials.github}
							target="_blank"
							rel="noopener noreferrer"
							class="transition-colors hover:text-neutral-900 dark:hover:text-white"
							aria-label="GitHub"
						>
							<Icon name="github" size="sm" />
						</a>
					{/if}
					{#if siteConfig.socials?.twitter}
						<a
							href={siteConfig.socials.twitter}
							target="_blank"
							rel="noopener noreferrer"
							class="transition-colors hover:text-neutral-900 dark:hover:text-white"
							aria-label="Twitter"
						>
							<Icon name="twitter" size="sm" />
						</a>
					{/if}
				</div>
			</div>
		</div>

		<!-- Footer Bottom Bar (Clean single copyright, no duplicated links) -->
		<div
			class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-neutral-200 pt-8 text-xs text-neutral-500 sm:flex-row dark:border-neutral-800 dark:text-neutral-400"
		>
			<p>© {currentYear} {siteConfig.name}. All rights reserved.</p>
			<div class="flex items-center gap-2">
				<span class="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
				<span class="font-mono text-[11px] text-neutral-400">All systems operational</span>
			</div>
		</div>
	</div>
</footer>
