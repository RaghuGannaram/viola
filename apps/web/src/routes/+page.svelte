<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { trackList } from "$lib/stores/trackStore";
	import { currentTrack } from "$lib/stores/playerStore";
	import type { ITrack } from "$lib/types";

	function saveTrack(event: Event) {
		const input = event.target as HTMLInputElement | null;
		if (!input?.files) return;
		trackList.add(Array.from(input.files));
	}

	function playTrack(track: ITrack) {
		currentTrack.set(track);
	}
</script>

<svelte:head>
	<title>Dashboard</title>
	<meta name="description" content="A user-friendly dashboard for managing your music library" />
</svelte:head>

<div class="grid grid-cols-1 sm:grid-cols-4">
	<aside class="sm:col-span-1 flex flex-col items-center bg-neutral-800 p-4 text-neutral-400">
		<div class="py-6">
			<label for="addTrack" class="bg-blue-500 text-white p-2 rounded cursor-pointer"> Upload Track </label>
			<input id="addTrack" type="file" multiple accept="audio/*" class="hidden" onchange={saveTrack} />
		</div>

		<div>
			<p class="text-neutral-300 mb-2">Pick a track to play</p>
			{#each $trackList as track (track.id)}
				<div class="flex items-center justify-between p-2 hover:bg-neutral-700 rounded-sm cursor-pointer">
					<span class="truncate">{track.name}</span>
					<button class="bg-blue-500 text-white p-1 rounded" onclick={() => playTrack(track)}> Play </button>
				</div>
			{/each}
		</div>
	</aside>

	<main class="sm:col-span-3 bg-neutral-900 flex items-center justify-center">
		{#if $currentTrack}
			<div class="text-center text-neutral-200 space-y-4">
				<img src={$currentTrack.coverImage} alt={$currentTrack.title} class="w-32 h-32 rounded-lg mx-auto" />
				<h1 class="text-xl font-semibold">Now Playing:</h1>
				<p class="text-lg">{$currentTrack.title}</p>
				<audio controls src={$currentTrack.url} class="mt-2"></audio>
			</div>
		{:else}
			<p class="text-neutral-500">No track selected</p>
		{/if}
	</main>
</div>
