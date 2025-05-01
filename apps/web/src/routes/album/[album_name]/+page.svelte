<script lang="ts">
	import { page } from "$app/state";
	import { trackList } from "$lib/stores/trackStore";
	import { currentTrack } from "$lib/stores/playerStore";
	import { goto } from "$app/navigation";
	import defaultAlbumImage from "$lib/assets/album.png";
	import Icon from "$lib/components/Icon/index.svelte";
	import type { ITrack } from "$lib/types";

	let albumName = page.params["album_name"];
	let albumTracks: ITrack[] = $state([]);

	$effect(() => {
		albumTracks = $trackList.filter((t) => (t.album ?? "Unknown Album") === albumName);
	});

	function playTrack(track: ITrack) {
		currentTrack.set(track);
		goto("/player");
	}
</script>

<svelte:head>
	<title>{albumName} | Viola Album</title>
	<meta name="description" content={`Songs from the album ${albumName}`} />
</svelte:head>

<main class="min-h-screen bg-neutral-900 text-neutral-200 p-6 md:p-12">
	<!-- Album Header -->
	<section class="flex flex-col md:flex-row gap-8 items-center mb-12">
		<img
			src={albumTracks[0]?.coverImage}
			alt={albumName}
			class="w-56 h-56 object-cover rounded-lg shadow-lg border border-neutral-700"
			onerror={(e) => {
				const target = e.currentTarget as HTMLImageElement;
				target.src = defaultAlbumImage;
			}}
		/>

		<div class="space-y-3 text-center md:text-left">
			<div class="flex items-center gap-2 text-3xl font-bold text-green-400">
				<Icon name="mdi:music-box-multiple-outline" size={24} className="mt-1" />
				<h1>{albumName}</h1>
			</div>
			<div class="text-sm text-neutral-400 flex items-center gap-2">
				<Icon name="mdi:account-music-outline" size={24} />
				Artists:
				<span class="text-neutral-300 ml-1">
					{[...new Set(albumTracks.map((t) => t.artist ?? "Unknown"))].join(", ")}
				</span>
			</div>
			<div class="text-sm text-neutral-400 flex items-center gap-2">
				<Icon name="mdi:music-note-outline" size={24} />
				{albumTracks.length}
				{albumTracks.length === 1 ? "track" : "tracks"}
			</div>
		</div>
	</section>

	<!-- Track List -->
	<section class="space-y-4">
		{#each albumTracks as track}
			<div class="flex justify-between items-center bg-neutral-800 hover:bg-neutral-700 transition px-5 py-4 rounded-lg">
				<div class="flex flex-col sm:flex-row sm:items-center sm:gap-4 w-full">
					<Icon name="mdi:music-circle-outline" size={24} />
					<div class="flex-1">
						<p class="text-base font-medium text-neutral-100 truncate">{track.title}</p>
						<p class="text-sm text-neutral-400 truncate">{track.artist ?? "Unknown Artist"}</p>
					</div>
				</div>
				<button class="btn btn-sm btn-primary flex items-center gap-1 px-3 py-1.5" onclick={() => playTrack(track)}>
					<Icon name="mdi:play" size={24} />
					<span class="text-sm font-medium">Play</span>
				</button>
			</div>
		{/each}
	</section>
</main>
