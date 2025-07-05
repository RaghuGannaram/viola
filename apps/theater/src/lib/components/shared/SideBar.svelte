<script lang="ts">
	import { page } from "$app/state";
	import { navigationItems } from "$lib/constants";
	import Icon from "$lib/components/Icon/index.svelte";

	let { customClass } = $props();
	let currentPath = $derived(page.url.pathname);
</script>

<aside class={`hidden sm:flex h-auto p-4 border-r border-surface-600/50 ${customClass}`}>
	<nav class="flex flex-col space-y-4">
		{#each navigationItems as item}
			<a href={item.href} class="flex gap-1 py-1 {currentPath === item.href ? 'text-primary-200' : 'text-primary-300/50'} hover:text-primary-200">
				<div class="flex items-center justify-center w-12 h-12 rounded-xl bg-surface-800 hover:bg-surface-600 transition">
					<Icon name={item.icon ?? ""} size={24} />
				</div>
			</a>
		{/each}
	</nav>
</aside>
