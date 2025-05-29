<script lang="ts">
	import "../app.css";
	import Header from "$lib/components/shared/Header.svelte";
	import SideBar from "$lib/components/shared/SideBar.svelte";
	import Footer from "$lib/components/shared/Footer.svelte";
	import { accessToken, profile } from "$lib/stores/authStore";

	let { children, data } = $props();

	$effect(() => {
		if (data.accessToken) accessToken.set(data.accessToken);
		if (data.profile) profile.set(data.profile);
	});
</script>

<div class="flex flex-col min-h-screen bg-gradient-to-br from-neutral-950/50 to-neutral-900/50 text-surface-50">
	<Header />

	<div class="flex flex-1 overflow-hidden">
		<SideBar customCalss="w-[100%] md:w-[80px]" />

		<main class="w-[100%] md:w-[80%] overflow-y-auto">
			{@render children()}
		</main>
	</div>

	<Footer />
</div>
