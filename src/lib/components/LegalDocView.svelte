<script lang="ts">
	import { siteConfig } from '$lib/site.config';
	import { Badge, Button } from 'yaxa-svelte';
	import { ArrowLeft, Mail, Calendar, Building2 } from '@lucide/svelte';

	interface Props {
		type: 'privacy' | 'terms' | 'refunds' | 'impressum';
	}

	let { type }: Props = $props();

	const email = siteConfig.company?.contactEmail || 'devfrost@protonmail.com';
	const url = siteConfig.url || 'https://organic-og.netlify.app';
	const siteName = siteConfig.name || 'Organic-OG';
	const refundDays = siteConfig.legal?.refundDays ?? 14;

	interface Section {
		id: string;
		title: string;
		paragraphs: (
			string | { type: 'list'; items: string[] } | { type: 'kv'; items: [string, string][] }
		)[];
	}

	const docMeta = $derived.by(() => {
		switch (type) {
			case 'privacy':
				return {
					badge: 'GDPR & Privacy Compliant',
					title: 'Privacy Policy',
					description: `How ${siteName} handles, secures, and protects your personal data in full compliance with GDPR and international data protection standards.`,
					sections: [
						{
							id: 'overview',
							title: '1. Overview & Data Controller',
							paragraphs: [
								`This Privacy Policy outlines how ${siteName} ("we", "us", or "our"), operating ${siteName} at ${url}, collects, processes, and protects your personal data. We are dedicated to respecting your privacy and strictly upholding the European Union General Data Protection Regulation (GDPR), the UK GDPR, and applicable global data privacy regulations.`
							]
						},
						{
							id: 'data-collected',
							title: '2. Information We Collect',
							paragraphs: [
								'We collect minimal personal information essential for delivering our service:',
								{
									type: 'list',
									items: [
										'<strong>Account & Identity Data:</strong> When registering via GitHub authentication, we store your public username, email address, and avatar image.',
										'<strong>Authentication Logs:</strong> Cryptographically secure session tokens, sign-in timestamps, and anonymized security identifiers to prevent unauthorized access.',
										`<strong>Communications:</strong> Inquiries, bug reports, or support requests sent directly to <a href="mailto:${email}" class="text-primary-600 dark:text-primary-400 underline font-medium">${email}</a>.`
									]
								}
							]
						},
						{
							id: 'payments',
							title: '3. Payments & Merchant of Record',
							paragraphs: [
								'All payments, credit bundles, and European Union VAT / sales tax calculations are handled by <strong>Polar Payments Inc. ("Polar.sh")</strong> acting as Merchant of Record.',
								'We never receive, store, or process your credit card numbers or raw banking credentials on our local servers. Polar processes transaction data under strict PCI-DSS Level 1 compliance.'
							]
						},
						{
							id: 'advertising',
							title: '4. Privacy-First & Zero-Tracking Policy',
							paragraphs: [
								'We do not sell, rent, or monetize your personal information with third-party cross-site advertising networks. No invasive behavioral profiling trackers or third-party advertising cookies are used across the platform.'
							]
						},
						{
							id: 'cookies',
							title: '5. Cookies & Local Storage',
							paragraphs: [
								'Our website minimizes local device storage. We utilize client-side <code>localStorage</code> solely to preserve essential functional user preferences (such as your chosen dark/light color mode and active studio configuration).',
								'We do not use persistent advertising trackers or third-party profiling cookies.'
							]
						},
						{
							id: 'gdpr-rights',
							title: '6. Your Rights Under GDPR & Data Protection Laws',
							paragraphs: [
								'Under the GDPR and equivalent data protection frameworks, you are entitled to the following rights:',
								{
									type: 'list',
									items: [
										'<strong>Right of Access:</strong> Request a complete copy of the personal data we hold about you.',
										'<strong>Right to Rectification:</strong> Correct any inaccurate or incomplete personal information.',
										'<strong>Right to Erasure ("Right to be Forgotten"):</strong> Request permanent deletion of your account and personal data.',
										'<strong>Right to Restriction & Object:</strong> Restrict or object to specific processing of your information.',
										'<strong>Right to Data Portability:</strong> Receive your data in a structured, machine-readable format.',
										'<strong>Right to Lodge a Complaint:</strong> File a complaint with your competent national data protection supervisory authority.'
									]
								},
								`To exercise any of these rights, contact us directly at <a href="mailto:${email}" class="text-primary-600 dark:text-primary-400 underline font-medium">${email}</a>.`
							]
						},
						{
							id: 'contact',
							title: '7. Contact & Data Protection',
							paragraphs: [
								`If you have any questions, data requests, or inquiries regarding this Privacy Policy, please contact our Data Protection representative at <a href="mailto:${email}" class="text-primary-600 dark:text-primary-400 underline font-medium">${email}</a>.`
							]
						}
					] as Section[]
				};

			case 'terms':
				return {
					badge: 'Terms & Licensing',
					title: 'Terms of Service',
					description: `The terms and conditions governing your access to and use of ${siteName}.`,
					sections: [
						{
							id: 'acceptance',
							title: '1. Acceptance of Terms',
							paragraphs: [
								`By accessing or using <strong>${siteName}</strong> (<a href="${url}" class="text-primary-600 dark:text-primary-400 underline">${url}</a>), you agree to be bound by these Terms of Service. If you do not agree to all terms, do not access or use the service.`
							]
						},
						{
							id: 'license',
							title: '2. License & Acceptable Use',
							paragraphs: [
								`We grant you a non-exclusive, non-transferable, revocable license to use ${siteName} in accordance with your chosen credit tier or API usage plan.`,
								'You agree not to:',
								{
									type: 'list',
									items: [
										'Reverse engineer, decompile, or exploit our proprietary services except as permitted by applicable law.',
										'Use the service for unlawful activities, security vulnerabilities scanning, or spam distribution.',
										'Interfere with or disrupt the stability of our servers, edge rendering pipelines, or databases.'
									]
								}
							]
						},
						{
							id: 'subscriptions',
							title: '3. API Credits, Invoicing & Taxes',
							paragraphs: [
								'Credit packages and top-ups are billed in advance. Invoicing, payment collection, and applicable VAT / sales taxes are managed securely by <strong>Polar.sh</strong> as Merchant of Record.',
								'Credits are deducted per un-cached image generation according to the package rates listed on the platform.'
							]
						},
						{
							id: 'liability',
							title: '4. Limitation of Liability',
							paragraphs: [
								`To the maximum extent permitted by applicable law, <strong>${siteName}</strong> shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business interruption.`
							]
						},
						{
							id: 'dispute-resolution',
							title: '5. Dispute Resolution & Contact',
							paragraphs: [
								`We aim to resolve any concerns or disagreements directly and swiftly through friendly communication. Please contact us directly at <a href="mailto:${email}" class="text-primary-600 dark:text-primary-400 underline font-medium">${email}</a> with any questions regarding these terms.`
							]
						}
					] as Section[]
				};

			case 'refunds':
				return {
					badge: 'Customer Protection',
					title: 'Cancellation & Refund Policy',
					description: `Our transparent ${refundDays}-day money-back guarantee, credit refund terms, and EU statutory withdrawal rights.`,
					sections: [
						{
							id: 'cancellation',
							title: '1. Self-Serve Cancellation',
							paragraphs: [
								'You may stop using the service at any time without ongoing subscription obligations. Pay-as-you-go credit packages do not incur recurring charges.'
							]
						},
						{
							id: 'refund-policy',
							title: `2. ${refundDays}-Day Money-Back Guarantee`,
							paragraphs: [
								`We stand behind the quality of our rendering engine. If you are not satisfied with your purchase, we offer a <strong>100% money-back guarantee within ${refundDays} days</strong> of your initial purchase.`,
								`To request a refund within the ${refundDays}-day window, simply email <a href="mailto:${email}" class="text-primary-600 dark:text-primary-400 underline font-medium">${email}</a> with your account email or transaction ID. We process refunds promptly without unnecessary hurdles.`
							]
						},
						{
							id: 'eu-withdrawal',
							title: '3. EU Statutory Right of Withdrawal',
							paragraphs: [
								`If you are an EU consumer, you have the statutory right to withdraw from a purchase within 14 days without giving any reason.`,
								`For digital API credits and instant rendering access, if you explicitly consented to immediate service execution upon checkout, our ${refundDays}-day money-back guarantee remains fully accessible to you regardless.`
							]
						},
						{
							id: 'disputes',
							title: '4. Chargebacks & Friendly Resolution',
							paragraphs: [
								`If you experience any billing issue or unexpected charge, please reach out to us at <a href="mailto:${email}" class="text-primary-600 dark:text-primary-400 underline font-medium">${email}</a> before initiating a bank dispute or chargeback. We will gladly investigate and resolve billing discrepancies swiftly.`
							]
						}
					] as Section[]
				};

			case 'impressum':
				return {
					badge: 'Provider Identification',
					title: 'Impressum / Legal Notice',
					description:
						'Provider identification and mandatory legal disclosure pursuant to § 5 TMG / DDG and European E-Commerce directives.',
					sections: [
						{
							id: 'provider',
							title: '1. Provider Identification / Angaben gemäß § 5 TMG / DDG',
							paragraphs: [
								{
									type: 'kv',
									items: [
										['Entity / Project', siteName],
										['Platform Operator', 'Solo Developer / Independent Operator'],
										['Website', url]
									]
								}
							]
						},
						{
							id: 'contact-info',
							title: '2. Contact Information / Kontaktaufnahme',
							paragraphs: [
								{
									type: 'kv',
									items: [
										['Email Support', email],
										['Website URL', url]
									]
								}
							]
						},
						{
							id: 'register',
							title: '3. Commercial Register & Tax Information',
							paragraphs: [
								'Small business regulation (Kleinunternehmerregelung) / Independent software project. VAT identification number not applicable.'
							]
						},
						{
							id: 'dispute-resolution',
							title: '4. Consumer Dispute Resolution / Verbraucherstreitbeilegung',
							paragraphs: [
								'The European Commission provides a platform for online dispute resolution (ODR): <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" class="text-primary-600 dark:text-primary-400 underline inline-flex items-center gap-1">https://ec.europa.eu/consumers/odr <span class="text-xs">↗</span></a>.',
								'We are neither obligated nor willing to participate in dispute resolution proceedings before a consumer arbitration board.'
							]
						}
					] as Section[]
				};
		}
	});
</script>

<div
	class="min-h-screen bg-neutral-50 py-12 text-neutral-900 transition-colors dark:bg-neutral-950 dark:text-neutral-100"
>
	<div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
		<!-- Back to studio button -->
		<div class="mb-8">
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

		<!-- Document Card Container -->
		<div
			class="overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl sm:p-10 lg:p-12 dark:border-neutral-800 dark:bg-neutral-900/90"
		>
			<!-- Header -->
			<div class="border-b border-neutral-200 pb-8 dark:border-neutral-800">
				<div class="mb-4 flex flex-wrap items-center gap-3">
					<Badge color="primary" variant="soft" size="sm">Legal & Compliance</Badge>
					<Badge color="neutral" variant="outline" size="sm">
						{docMeta.badge}
					</Badge>
					<Badge color="neutral" variant="outline" size="sm">Polar.sh MoR</Badge>
				</div>

				<h1
					class="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl dark:text-white"
				>
					{docMeta.title}
				</h1>

				<p class="mt-4 max-w-3xl text-base text-neutral-600 dark:text-neutral-300">
					{docMeta.description}
				</p>

				<!-- Metadata row -->
				<div
					class="mt-6 flex flex-wrap items-center gap-4 text-xs text-neutral-500 sm:gap-6 dark:text-neutral-400"
				>
					<span class="inline-flex items-center gap-1.5">
						<Calendar class="h-3.5 w-3.5 text-neutral-400" />
						Last Updated:
						<strong class="font-semibold text-neutral-700 dark:text-neutral-200"
							>September 2026</strong
						>
					</span>
					<span>•</span>
					<span class="inline-flex items-center gap-1.5">
						<Building2 class="h-3.5 w-3.5 text-neutral-400" />
						Entity:
						<strong class="font-semibold text-neutral-700 dark:text-neutral-200">{siteName}</strong>
					</span>
					<span>•</span>
					<span class="inline-flex items-center gap-1.5">
						<Mail class="h-3.5 w-3.5 text-primary-500" />
						<a
							href="mailto:{email}"
							class="font-medium text-primary-600 hover:underline dark:text-primary-400"
						>
							{email}
						</a>
					</span>
				</div>
			</div>

			<!-- Main Content Grid -->
			<div class="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-4">
				<!-- Sticky Sidebar TOC -->
				<aside class="hidden lg:col-span-1 lg:block">
					<div
						class="sticky top-24 space-y-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800/80 dark:bg-neutral-950/60"
					>
						<h2
							class="text-[11px] font-bold tracking-wider text-neutral-500 uppercase dark:text-neutral-400"
						>
							Table of Contents
						</h2>
						<nav class="space-y-1.5">
							{#each docMeta.sections as sec (sec.id)}
								<a
									href="#{sec.id}"
									class="block text-xs text-neutral-600 transition-colors hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400"
								>
									{sec.title}
								</a>
							{/each}
						</nav>
					</div>
				</aside>

				<!-- Section Content -->
				<div class="space-y-10 lg:col-span-3">
					{#each docMeta.sections as sec (sec.id)}
						<section id={sec.id} class="scroll-mt-24 space-y-4">
							<h2
								class="border-b border-neutral-100 pb-2 text-lg font-bold tracking-tight text-neutral-900 dark:border-neutral-800 dark:text-white"
							>
								{sec.title}
							</h2>

							<div class="space-y-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
								{#each sec.paragraphs as para, i (i)}
									{#if typeof para === 'string'}
										<p>{@html para}</p>
									{:else if para.type === 'list'}
										<ul class="list-disc space-y-2 pl-5 marker:text-primary-500">
											{#each para.items as item, itemIdx (itemIdx)}
												<li>{@html item}</li>
											{/each}
										</ul>
									{:else if para.type === 'kv'}
										<div
											class="rounded-lg border border-neutral-200 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-950/50"
										>
											<dl class="divide-y divide-neutral-200 text-xs dark:divide-neutral-800">
												{#each para.items as [k, v] (k)}
													<div class="flex items-center justify-between py-2">
														<dt class="font-medium text-neutral-500 dark:text-neutral-400">{k}</dt>
														<dd class="font-mono font-semibold text-neutral-900 dark:text-white">
															{#if v.startsWith('http')}
																<a
																	href={v}
																	target="_blank"
																	rel="noopener noreferrer"
																	class="text-primary-500 hover:underline"
																>
																	{v}
																</a>
															{:else if v.includes('@')}
																<a href="mailto:{v}" class="text-primary-500 hover:underline">
																	{v}
																</a>
															{:else}
																{v}
															{/if}
														</dd>
													</div>
												{/each}
											</dl>
										</div>
									{/if}
								{/each}
							</div>
						</section>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
