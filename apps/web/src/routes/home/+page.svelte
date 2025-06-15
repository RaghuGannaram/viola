<script lang="ts">
	import { trackMetadataList } from "$lib/stores/trackMetadataStore";
	import { onMount } from "svelte";

	onMount(() => {
		trackMetadataList.hydrate();
	});
</script>

<section>
	<h1>Track Metadata</h1>
	<p>Here are the tracks loaded from the store:</p>
	{#each $trackMetadataList as track}
		<div><img src={track.artworkUrl} width="50px" height="50px" alt={track.title} /> <span>{track.title}</span></div>
	{/each}
</section>
