<script lang="ts">
	import "../app.css";
	import Header from "$lib/components/shared/Header.svelte";
	import Footer from "$lib/components/shared/Footer.svelte";

	let { children } = $props();
</script>

<div class="flex flex-col bg-neutral-900 text-neutral-100">
	<Header />

	<main>
		{@render children()}
	</main>

	<Footer />
</div>
