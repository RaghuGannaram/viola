<script lang="ts">
	import { page } from "$app/state";
	import { navigationItems } from "$lib/constants";
	import Icon from "$lib/components/Icon/index.svelte";

	let { customClass } = $props();
	let currentPath = $derived(page.url.pathname);
</script>

<nav
	class={`flex justify-around items-center
			   bg-surface-100/80 dark:bg-surface-900/80
			   backdrop-blur-xl
			   border-t border-surface-300/50 dark:border-surface-700/50
			   py-3 px-2 ${customClass}`}
>
	{#each navigationItems as item}
		<a href={item.href} class="flex gap-1 py-1 {currentPath === item.href ? 'text-primary-500' : 'text-primary-700-300'} hover:text-primary-500">
			<div
				class="flex items-center justify-center w-12 h-12 rounded-xl {currentPath === item.href
					? 'bg-surface-300-700'
					: 'bg-surface-200-800'} hover:bg-surface-300-700 transition"
			>
				<Icon name={item.icon ?? ""} size={24} />
			</div>
		</a>
	{/each}
</nav>
