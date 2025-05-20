<script lang="ts">
	import { page } from "$app/state";
	import { navigationItems } from "$lib/constants";
	import { profile } from "$lib/stores/authStore.js";
	import { PROXY_ENDPOINTS } from "$lib/services/http/shared/endpoints";
	import proxyClient from "$lib/services/http/proxy/client";

	let currentPath = $derived(page.url.pathname);

	async function logoutHandler() {
		try {
			const response = await proxyClient.delete(PROXY_ENDPOINTS.AUTH.LOGOUT);
			if (response.status !== 200) {
				throw new Error("Logout failed");
			}

			console.log("Logout successful", response.data);
			profile.set(null);
		} catch (error) {
			console.error("Logout failed", error);
		}
	}
</script>

<header class="flex items-center justify-between bg-neutral-800 text-neutral-100 px-6 py-4 shadow-sm">
	<div class="flex items-center space-x-8">
		<a href="/" class="text-2xl font-extrabold text-green-400 hover:text-green-500"> Viola </a>
		<nav class="hidden md:flex space-x-2">
			{#each navigationItems as item}
				<a
					href={item.href}
					class="px-3 py-2 rounded-lg transition-colors {currentPath === item.href
						? 'bg-neutral-700 text-white'
						: 'text-neutral-300 hover:bg-neutral-700 hover:text-white'}"
				>
					{item.name}
				</a>
			{/each}
		</nav>
	</div>

	<div class="flex items-center space-x-4">
		<div class="relative">
			<input
				type="search"
				placeholder="Search tracks…"
				class="bg-neutral-700 text-neutral-200 placeholder-neutral-400 pl-3 pr-10 py-2 rounded-lg
                 focus:outline-none focus:ring-2 focus:ring-green-400 transition w-64"
			/>
			<span class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-neutral-500"> 🔍 </span>
		</div>

		<button
			class="w-8 h-8 rounded-full bg-neutral-600 flex items-center justify-center
               hover:bg-neutral-500 transition"
			aria-label="User menu"
		>
			<span class="text-sm font-medium">JD</span>
		</button>
		{#if $profile}
			<button onclick={logoutHandler}>Logout</button>
		{/if}
	</div>
</header>
