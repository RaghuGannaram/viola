<script lang="ts">
	import { onMount } from "svelte";
	import { trackMetadataList } from "$lib/stores/trackMetadataStore";

	onMount(() => {
		trackMetadataList
			.hydrate()
			.then(() => {
				console.log("Track metadata store hydrated:", $trackMetadataList);
			})
			.catch((error) => {
				console.error("Error hydrating track metadata store:", error);
			});
	});
</script>

<svelte:head>
	<title>Viola — Your Music Dashboard</title>
	<meta name="description" content="Your personal and intelligent music dashboard." />
</svelte:head>

<main class="min-h-screen p-8 flex flex-col gap-10">
	<section class="text-center text-neutral-200 space-y-6">
		<h1 class="text-4xl font-bold text-green-400">🎵 Welcome to Viola</h1>
		<p class="text-neutral-400 text-lg">Your personal music sanctuary. Upload, play, and manage your tracks freely.</p>

		{#if $trackMetadataList.length > 0}
			<p class="text-neutral-300">Track List:</p>
			<ul class="list-disc list-inside text-neutral-300">
				{#each $trackMetadataList as track}
					<li>{track.title} by {track.artist}</li>
				{/each}
			</ul>
		{:else}
			<p class="text-neutral-300">No tracks available. Please upload some music.</p>
		{/if}
	</section>
</main>
