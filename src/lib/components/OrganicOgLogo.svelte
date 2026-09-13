<script lang="ts">
	interface Props {
		size?: 'sm' | 'md' | 'lg';
		showText?: boolean;
		class?: string;
	}

	let { size = 'md', showText = true, class: className = '' }: Props = $props();

	const sizeMap = {
		sm: { icon: 'h-6 w-6', text: 'text-base', badge: 'h-6 w-6' },
		md: { icon: 'h-8 w-8', text: 'text-lg', badge: 'h-8 w-8' },
		lg: { icon: 'h-10 w-10', text: 'text-2xl', badge: 'h-10 w-10' }
	};
</script>

<a href="/" class="inline-flex items-center gap-2.5 font-bold tracking-tight {className}">
	<!-- SVG Logo Emblem: Organic Sprout + OpenGraph Card Frame -->
	<div
		class="relative flex items-center justify-center rounded-xl bg-neutral-900 shadow-md ring-1 ring-neutral-800 transition-transform duration-200 hover:scale-105 {sizeMap[
			size
		].badge}"
	>
		<svg
			viewBox="0 0 32 32"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			class="h-full w-full p-1.5"
			aria-hidden="true"
		>
			<defs>
				<linearGradient id="org-leaf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" stop-color="#22c55e" />
					<stop offset="100%" stop-color="#10b981" />
				</linearGradient>
				<linearGradient id="org-og-grad" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" stop-color="#f97316" />
					<stop offset="100%" stop-color="#ea580c" />
				</linearGradient>
			</defs>

			<!-- Outer OG Frame with Rounded Corners -->
			<rect
				x="3"
				y="5"
				width="26"
				height="22"
				rx="5"
				stroke="url(#org-og-grad)"
				stroke-width="2"
				fill="#18181b"
			/>

			<!-- Header Dots / Ratio Indicator -->
			<circle cx="8" cy="9" r="1.25" fill="#f97316" />
			<circle cx="12" cy="9" r="1.25" fill="#71717a" />
			<line x1="3" y1="13" x2="29" y2="13" stroke="#27272a" stroke-width="1" />

			<!-- Organic Sprouting Leaf Graphic inside the card -->
			<path
				d="M10 23 C 10 16, 17 14, 23 15 C 23 21, 17 23, 10 23 Z"
				fill="url(#org-leaf-grad)"
				fill-opacity="0.85"
			/>
			<path
				d="M10 23 C 14 19, 18 18, 22 16"
				stroke="#ffffff"
				stroke-width="1.2"
				stroke-linecap="round"
			/>
			<circle cx="21.5" cy="18.5" r="1.25" fill="#fb923c" />
		</svg>
	</div>

	{#if showText}
		<span class="font-bold tracking-tight text-neutral-900 dark:text-white {sizeMap[size].text}">
			Organic<span class="text-primary-500">-OG</span>
		</span>
	{/if}
</a>
