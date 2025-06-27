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

<div
	class="flex flex-col min-h-screen
        bg-gradient-to-br
        from-surface-50/50 to-surface-100/50
		dark:from-surface-900/50 dark:to-surface-950/50 text-surface-800-200"
>
	<Header />

	<div class="flex flex-1 w-full">
		<SideBar customCalss="w-[80px]" />

		<main class="flex-1 min-h-screen overflow-y-auto">
			{@render children()}
		</main>
	</div>

	<Footer />
</div>
