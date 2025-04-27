<script lang="ts">
	import { page } from "$app/stores";
	import { derived } from "svelte/store";

	// Derive the current path for active link styling
	const activePath = derived(page, ($page) => $page.url.pathname);

	const links = [
		{ href: "/library", label: "Library" },
		{ href: "/search", label: "Search" },
		{ href: "/playlists", label: "Playlists" },
		{ href: "/player", label: "Player" },
		{ href: "/upload", label: "Upload" },
		{ href: "/settings", label: "Settings" },
	];
</script>

<aside class="hidden sm:flex flex-col w-64 h-screen bg-base-200 p-4">
	<!-- Brand Logo / Title -->
	<div class="mb-8">
		<a href="/" class="text-3xl font-bold text-primary">Viola</a>
	</div>

	<!-- Navigation Links -->
	<nav class="flex-1 space-y-1">
		{#each links as { href, label }}
			<a {href} class="btn btn-ghost w-full justify-start {$activePath === href ? 'bg-base-300' : ''}">
				{label}
			</a>
		{/each}
	</nav>

	<!-- Footer Links -->
	<div class="mt-auto space-y-1 pt-4 border-t border-base-300">
		<a href="/terms" class="text-sm text-neutral-500 hover:underline">Terms</a>
		<a href="/privacy" class="text-sm text-neutral-500 hover:underline">Privacy</a>
	</div>
</aside>
