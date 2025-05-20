<script lang="ts">
	import "../app.css";
	import Header from "$lib/components/shared/Header.svelte";
	import Footer from "$lib/components/shared/Footer.svelte";
	import { accessToken, profile } from "$lib/stores/authStore";

	let { children, data } = $props();

	$effect(() => {
		if (data.accessToken) accessToken.set(data.accessToken);
		if (data.profile) profile.set(data.profile);
	});
</script>

<div class="flex flex-col bg-neutral-900 text-neutral-100">
	<Header />

	<main>
		{@render children()}
	</main>

	<Footer />
</div>
