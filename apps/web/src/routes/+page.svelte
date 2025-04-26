<script lang="ts" context="module">
import { trackList } from "$lib/stores/trackStore";
import { currentTrack } from "$lib/stores/playerStore";
import { type ITrack } from "$lib/types";

function saveTrack(event: Event) {
	const input = event.target as HTMLInputElement | null;

	if (!input || !input.files) return;

	const files = input.files;

	if (files.length > 0) {
		trackList.add(Array.from(files));
	}
}

function playTrack(track: ITrack) {
	// Logic to play the track
	currentTrack.set(track);
}
</script>

<div class="grid grid-cols-1 sm:grid-cols-4 h-screen">
	<aside class="sm:col-span-1 flex flex-col items-center bg-neutral-800 p-4 text-neutral-400">
		<div class="py-6">
			<label for="addTrack" class="bg-blue-500 text-white p-2 rounded cursor-pointer">Upload ITrack</label>
			<input type="file" class="hidden" id="addTrack" accept="audio/*" multiple on:change={saveTrack} />
		</div>
		<div>
			<p class="text-neutral-300">Pick a track to play</p>
			{#each $trackList as track}
				<div class="flex items-center justify-between p-2 hover:bg-neutral-700 rounded-sm cursor-pointer">
					<span>{track.name}</span>
					<button class="bg-blue-500 text-white p-1 rounded" on:click={() => playTrack(track)}>Play</button>
					<!-- <button class="bg-red-500 text-white p-1 rounded" on:click={() => trackList.remove(track)}>Remove</button> -->
				</div>
			{/each}
		</div>
	</aside>
	<main class="sm:col-span-3">
		<div class="flex items-center justify-center h-full bg-neutral-900 text-neutral-300">
			<h1 class="text-2xl">
				{#if $currentTrack}
					Now Playing: {$currentTrack.name}
					<audio controls src={$currentTrack.url}></audio>
				{:else}
					No track selected
				{/if}
			</h1>
		</div>
	</main>
</div>
