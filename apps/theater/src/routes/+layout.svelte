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
	class="flex flex-col
        bg-gradient-to-br
        from-surface-200/50 to-surface-400/50
		dark:from-surface-900/50 dark:to-surface-950/50 text-surface-800-200"
>
	<Header />

	<div class="flex w-full">
		<SideBar customClass="w-[80px]" />

		<div class="flex-1 overflow-y-auto">
			{@render children()}
		</div>
	</div>

	<Footer />
</div>
