<script lang="ts">
	interface Props {
		size?: 'sm' | 'md' | 'lg';
		showText?: boolean;
		hideTextOnMobile?: boolean;
		class?: string;
	}

	let {
		size = 'md',
		showText = true,
		hideTextOnMobile = false,
		class: className = ''
	}: Props = $props();

	const sizeMap = {
		sm: {
			icon: 'h-4.5 w-4.5 sm:h-5 sm:w-5',
			text: 'text-sm sm:text-base',
			badge: 'h-7.5 w-7.5 sm:h-8 sm:w-8'
		},
		md: { icon: 'h-5.5 w-5.5', text: 'text-base sm:text-lg', badge: 'h-9 w-9' },
		lg: { icon: 'h-7 w-7', text: 'text-xl sm:text-2xl', badge: 'h-11 w-11' }
	};
</script>

<a href="/" class="inline-flex items-center gap-2.5 font-bold tracking-tight {className}">
	<!-- SVG Logo Emblem: Organic Sprout + OpenGraph Card Canvas -->
	<div
		class="relative flex items-center justify-center rounded-lg bg-linear-to-br from-neutral-900 via-neutral-900 to-neutral-950 p-1 shadow-sm ring-1 ring-white/10 transition-transform duration-200 hover:scale-105 dark:bg-[#121215] dark:ring-neutral-800 {sizeMap[
			size
		].badge}"
	>
		<svg
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			class="{sizeMap[size].icon} shrink-0"
			aria-hidden="true"
		>
			<defs>
				<linearGradient id="org-leaf-grad" x1="0%" y1="100%" x2="100%" y2="0%">
					<stop offset="0%" stop-color="#10b981" />
					<stop offset="100%" stop-color="#34d399" />
				</linearGradient>
				<linearGradient id="org-og-grad" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" stop-color="#f97316" />
					<stop offset="100%" stop-color="#ea580c" />
				</linearGradient>
			</defs>

			<!-- OpenGraph Viewport / Card Frame -->
			<rect
				x="2"
				y="3"
				width="20"
				height="18"
				rx="3.5"
				stroke="url(#org-og-grad)"
				stroke-width="1.75"
				fill="#18181b"
				fill-opacity="0.7"
			/>

			<!-- Radiant Social Preview Aperture / Sun Indicator -->
			<circle cx="16.5" cy="8" r="1.75" fill="#f97316" />

			<!-- Organic Sprouting Leaf Body -->
			<path
				d="M5.5 17 C 5.5 12, 9 10, 14 10.5 C 14 15, 10.5 17, 5.5 17 Z"
				fill="url(#org-leaf-grad)"
			/>
			<!-- Central Leaf Spine -->
			<path
				d="M5.5 17 C 8.5 14.5, 11 13.5, 13.5 11"
				stroke="#ffffff"
				stroke-width="1.2"
				stroke-linecap="round"
			/>
			<!-- Secondary Leaf Accent -->
			<path
				d="M5.5 14.5 C 7 13, 8.5 13.2, 9.5 14.5 C 8.5 15.2, 7 15.2, 5.5 14.5 Z"
				fill="#10b981"
				fill-opacity="0.85"
			/>
		</svg>
	</div>

	{#if showText}
		<span
			class="font-bold tracking-tight text-neutral-900 transition-colors dark:text-white {sizeMap[
				size
			].text} {hideTextOnMobile ? 'hidden sm:inline-block' : ''}"
		>
			Organic<span class="text-primary-500">-OG</span>
		</span>
	{/if}
</a>
