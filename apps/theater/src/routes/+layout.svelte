<script lang="ts">
	import "../app.css";
	import Header from "$lib/components/shared/Header.svelte";
	import SideBar from "$lib/components/shared/SideBar.svelte";
	import NavBar from "$lib/components/shared/NavBar.svelte";
	import Footer from "$lib/components/shared/Footer.svelte";
	import { accessToken, profile } from "$lib/stores/authStore";

	let { children, data } = $props();

	$effect(() => {
		if (data.accessToken) accessToken.set(data.accessToken);
		if (data.profile) profile.set(data.profile);
	});
</script>

<div
	class="flex flex-col
        pb-24 md:pb-0
        bg-linear-to-br
        from-surface-200/50 to-surface-400/50
		dark:from-surface-900/50 dark:to-surface-950/50 text-surface-800-200"
>
	<Header />

	<div class="flex w-full">
		<SideBar customClass="hidden md:block w-[80px]" />

		<NavBar customClass="block md:hidden fixed bottom-0 left-0 right-0 w-full z-10" />

		<div class="flex-1 overflow-y-auto">
			{@render children()}
		</div>
	</div>

	<Footer />
</div>
