<script lang="ts">
	import { profile } from "$lib/stores/authStore.js";
	import { PROXY_ENDPOINTS } from "$lib/services/http/shared/endpoints";
	import proxyClient from "$lib/services/http/proxy/client";
	import Icon from "$lib/components/Icon/index.svelte";

	let showMenu = $state(false);
	let menuRef: HTMLDivElement | null = $state(null);
	let activeSearch = $state(false);

	function toggleMenu() {
		showMenu = !showMenu;
	}

	function handleClickOutside(event: MouseEvent) {
		if (menuRef && !menuRef.contains(event.target as Node)) {
			showMenu = false;
		}
	}

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

	$effect(() => {
		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	});
</script>

<header class="flex justify-between items-center py-2 pt-4 gap-4 md:gap-16 lg:gap-48">
	<div class="w-[80px] flex items-center justify-center">
		<a href="/" class="text-3xl font-bold text-primary-500">V</a>
	</div>

	<div class="relative flex-1">
		<input
			type="text"
			placeholder="Search tracks…"
			onfocus={() => (activeSearch = true)}
			onblur={() => (activeSearch = false)}
			class="w-full pl-4 py-2 rounded-4xl border border-neutral-600/50 text-neutral-200 placeholder-neutral-300/50 focus:placeholder-neutral-200 focus:outline-none transition"
		/>
		<span class="absolute inset-y-0 right-4 flex items-center pointer-events-none text-neutral-500">
			<Icon name="mdi:search" size={25} className={activeSearch ? "text-primary-200 transition" : "text-primary-300/50 transition"} />
		</span>
	</div>

	<div class="flex justify-center items-center pr-4">
		<div class="flex justify-between items-center bg-neutral-800/50 rounded-full px-4 py-1 gap-4">
			<button class="flex justify-center items-center" aria-label="Settings">
				<Icon name="mdi:cog" size={22} className="text-primary-300/50 hover:text-primary-200" />
			</button>
			<button class="flex justify-center items-center" aria-label="Notifications">
				<Icon name="mdi:bell-notification" size={22} className="text-primary-300/50 hover:text-primary-200" />
			</button>
		</div>
		<div bind:this={menuRef} class="relative ml-4">
			<button class="w-12 h-12 rounded-full flex justify-center items-center" aria-label="User menu" onclick={toggleMenu}>
				<Icon name="mdi:account-circle" size={35} className="text-primary-300/70 hover:text-primary-200" />
			</button>
			{#if showMenu}
				<div class=" absolute right-0 mt-2 w-48 bg-neutral-800/50 rounded-lg shadow-2xl">
					<ul class="py-2">
						<li>
							<a href="/profile" class="block px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-700/50">Profile</a>
						</li>
						<li>
							<button onclick={logoutHandler} class="block w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-700/50">Logout</button>
						</li>
					</ul>
				</div>
			{/if}
		</div>
	</div>
</header>
