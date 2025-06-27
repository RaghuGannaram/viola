<script lang="ts">
	import { page } from "$app/state";
	import { trackList } from "$lib/stores/trackStore";
	import { currentTrack } from "$lib/stores/playbackStore";
	import { goto } from "$app/navigation";
	import defaultArtistImage from "$lib/assets/artist.png";
	import Icon from "$lib/components/Icon/index.svelte";
	import type { ITrack } from "$lib/types";

	let artistName = page.params["artist_name"] ?? "Unknown Artist";
	let artistTracks: ITrack[] = $state([]);

	$effect(() => {
		artistTracks = $trackList.filter((t) => (t.artist ?? "Unknown Artist").includes(artistName));
	});

	function playTrack(track: ITrack) {
		currentTrack.set(track);
		goto("/player");
	}

	function groupByAlbum(tracks: ITrack[]): Record<string, ITrack[]> {
		return tracks.reduce(
			(acc, t) => {
				const album = t.album ?? "Unknown Album";
				(acc[album] ||= []).push(t);
				return acc;
			},
			{} as Record<string, ITrack[]>,
		);
	}
</script>

<svelte:head>
	<title>{artistName} | Viola Artist</title>
	<meta name="description" content={`Songs by ${artistName}`} />
</svelte:head>

<main class="min-h-screen bg-neutral-900 text-neutral-200 p-6 md:p-12 space-y-10">
	<!-- Artist Header -->
	<section class="flex flex-col md:flex-row gap-8 items-center">
		<img src={defaultArtistImage} alt={artistName} class="w-48 h-48 object-cover rounded-full shadow-md border border-neutral-700" />

		<div class="space-y-2 text-center md:text-left">
			<h1 class="text-3xl font-bold text-green-400 flex items-center gap-3">
				<Icon name="mdi:account-music" size={24} />
				{artistName}
			</h1>
			<p class="text-sm text-neutral-400 flex items-center gap-2">
				<Icon name="mdi:music" size={20} />
				{artistTracks.length}
				{artistTracks.length === 1 ? "track" : "tracks"}
			</p>
			<p class="text-sm text-neutral-400 flex items-center gap-2">
				<Icon name="mdi:album" size={20} />
				{Object.keys(groupByAlbum(artistTracks)).length} album{Object.keys(groupByAlbum(artistTracks)).length !== 1 ? "s" : ""}
			</p>
		</div>
	</section>

	<!-- Track List Grouped by Album -->
	<section class="space-y-10">
		{#each Object.entries(groupByAlbum(artistTracks)).sort((a, b) => a[0].localeCompare(b[0])) as [album, tracks]}
			<div class="space-y-4">
				<h2 class="text-xl font-semibold text-green-300 flex items-center gap-2">
					<Icon name="mdi:album" size={20} />
					{album}
				</h2>

				<ul class="space-y-3">
					{#each tracks as track}
						<li class="flex justify-between items-center bg-neutral-800 hover:bg-neutral-700 transition px-5 py-3 rounded-lg">
							<div class="flex flex-col sm:flex-row sm:items-center sm:gap-4 w-full">
								<Icon name="mdi:music-note" size={20} />
								<p class="text-base font-medium text-neutral-100 truncate">{track.title}</p>
							</div>
							<button class="btn btn-sm btn-primary flex items-center gap-1 px-3 py-1.5" onclick={() => playTrack(track)}>
								<Icon name="mdi:play" size={20} />
								<span class="text-sm">Play</span>
							</button>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</section>
</main>
