<!-- src/routes/library/+page.svelte -->
<script lang="ts">
	import { trackList } from "$lib/stores/trackStore";
	import { currentTrack } from "$lib/stores/playerStore";
	import defaultAlbumImage from "$lib/assets/album.png";
	import defaultArtistImage from "$lib/assets/artist.png";
	import type { ITrack } from "$lib/types";

	let tracks: ITrack[] = $state([]);
	let searchQuery = $state("");

	$effect(() => {
		if (!searchQuery.trim()) {
			tracks = $trackList;
		}
	});

	async function onSearch() {
		if (searchQuery.trim()) {
			tracks = await trackList.search(searchQuery);
		} else {
			tracks = $trackList;
		}
	}

	function playTrack(track: ITrack) {
		currentTrack.set(track);
	}

	// function uploadTracks(e: Event) {
	// 	const input = e.target as HTMLInputElement;
	// 	if (!input.files) return;
	// 	trackList.add(Array.from(input.files));
	// }

	function groupBy(items: ITrack[], fn: (t: ITrack) => string): Record<string, ITrack[]> {
		return items.reduce(
			(acc, t) => {
				const key = fn(t) || "Unknown";
				(acc[key] ||= []).push(t);
				return acc;
			},
			{} as Record<string, ITrack[]>,
		);
	}
</script>

<svelte:head>
	<title>Library</title>
	<meta name="description" content="Your personal music library" />
</svelte:head>

<div class="flex flex-col sm:grid sm:grid-cols-4">
	<!-- Sidebar -->
	<!-- <aside class="bg-neutral-800 p-6 flex flex-col gap-6 sm:col-span-1">
		<div class="flex flex-col gap-3">
			<label for="upload" class="btn btn-primary">Upload Tracks</label>
			<input id="upload" type="file" multiple accept="audio/*" class="hidden" onchange={uploadTracks} />
		</div>

		<div class="space-y-4 overflow-auto">
			<h3 class="text-xl font-semibold text-neutral-300">Quick Play</h3>
			<ul class="flex flex-col gap-2">
				{#each $trackList.slice(0, 10) as t}
					<li class="flex justify-between items-center p-2 rounded hover:bg-neutral-700">
						<span class="truncate">{t.title}</span>
						<button class="btn btn-tonal btn-sm" onclick={() => playTrack(t)}>▶</button>
					</li>
				{/each}
			</ul>
		</div>
	</aside> -->

	<!-- Main content -->
	<main class="sm:col-span-4 bg-neutral-900 p-8 text-neutral-200 overflow-y-auto">
		<!-- Search -->
		<div class="mb-10">
			<input type="text" bind:value={searchQuery} placeholder="Search tracks..." class="form-input w-full p-3 text-base" oninput={onSearch} />
		</div>

		<!-- Albums -->
		<section class="mb-14">
			<h2 class="text-2xl font-bold mb-6 text-green-400">Albums</h2>
			<div class="grid grid-cols-2 md:grid-cols-4 gap-6">
				{#each Object.entries(groupBy(tracks, (t) => t.album ?? "Unknown Album")) as [album, list]}
					<div class="flex bg-neutral-800 rounded-lg">
						<div class="w-30">
							<img src={list[0]?.coverImage ?? defaultAlbumImage} alt={album} class="h-20 object-contain" />
						</div>
						<div class=" p-4">
							<h3 class="text-sm font-semibold truncate">{album}</h3>
							<p class="text-sm text-neutral-400">{list.length} {list.length > 1 ? "tracks" : "track"}</p>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<!-- All Tracks -->
		<section>
			<h2 class="text-2xl font-bold mb-6 text-green-400">All Tracks</h2>
			<ul class="divide-y divide-neutral-700">
				{#each tracks as track}
					<li class="flex justify-between items-center py-4 hover:bg-neutral-800 px-3 rounded">
						<div class="flex flex-col">
							<span class="font-medium truncate">{track.title}</span>
							<span class="text-sm text-neutral-400">{track.artist} — {track.album}</span>
						</div>
						<button class="btn btn-primary btn-sm" onclick={() => playTrack(track)}>▶</button>
					</li>
				{/each}
			</ul>
		</section>

		<!-- Artists -->
		<section class="mb-14">
			<h2 class="text-2xl font-bold mb-6 text-green-400">Artists</h2>
			<div class="grid grid-cols-2 md:grid-cols-4 gap-6">
				{#each Object.entries(groupBy(tracks, (track) => track.artist ?? "Unknown Artist")) as [artist, list]}
					<div class="flex bg-neutral-800 rounded-lg p-4">
						<div class="w-30">
							<img src={defaultArtistImage} alt={artist} class="h-20 object-contain" />
						</div>
						<div class="">
							<h3 class="text-sm font-semibold">{artist}</h3>
							<p class="text-sm text-neutral-400">{list.length} {list.length > 1 ? "tracks" : "track"}</p>
						</div>
					</div>
				{/each}
			</div>
		</section>
	</main>
</div>
