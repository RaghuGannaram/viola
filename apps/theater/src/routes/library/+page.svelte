<!-- src/routes/library/+page.svelte -->
<script lang="ts">
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { Tabs } from "@skeletonlabs/skeleton-svelte";
	import { trackMetadataList } from "$lib/stores/trackMetadataStore";
	import { playback } from "$lib/stores/playbackStore";
	import defaultAlbumImage from "$lib/assets/album.png";
	import defaultArtistImage from "$lib/assets/artist.png";
	import type { ITrack } from "$lib/types";

	let activeTab = $state("songs");
	let tracks: ITrack[] = $state([]);

	onMount(() => {
		trackMetadataList
			.hydrate()
			.then(() => {
				tracks = $trackMetadataList;
				console.log("Track metadata store hydrated:", $trackMetadataList);
			})
			.catch((error) => {
				console.error("Error hydrating track metadata store:", error);
			});
		``;
	});

	function playTrack(track: ITrack) {
		playback.set(track);
		goto("/player");
	}

	function groupBy(items: ITrack[], fn: (t: ITrack) => string): Record<string, ITrack[]> {
		return items.reduce(
			(acc, t) => {
				const rawKey = fn(t) || "Unknown";
				const keys = rawKey.split(",").map((k) => k.trim());
				for (const key of keys) {
					(acc[key] ||= []).push(t);
				}
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

<main class="min-h-screen p-6 space-y-10">
	<Tabs value={activeTab} onValueChange={(event: { value: string }) => (activeTab = event.value)}>
		{#snippet list()}
			<Tabs.Control {...{ value: "songs" } as any}>All Songs</Tabs.Control>
			<Tabs.Control {...{ value: "albums" } as any}>Albums</Tabs.Control>
			<Tabs.Control {...{ value: "artists" } as any}>Artists</Tabs.Control>
		{/snippet}

		{#snippet content()}
			<Tabs.Panel {...{ value: "songs" } as any}>
				<h2 class="text-2xl font-bold mb-6 text-green-400">All Tracks</h2>
				<ul class="divide-y divide-surface-700">
					{#each tracks as track}
						<li class="flex justify-between items-center py-4 hover:bg-surface-800/50 px-3 rounded">
							<div class="flex items-center space-x-4">
								<img
									src={track.artworkUrl || defaultAlbumImage}
									alt={track.title}
									class=" w-14 h-14 object-cover rounded"
									onerror={(event) => {
										const target = event.currentTarget as HTMLImageElement;
										target.src = defaultAlbumImage;
									}}
								/>
								<div class="flex flex-col">
									<span class="font-medium truncate">{track.title}</span>
									<span class="text-sm text-surface-400">{track.artists.map(({ artist }: { artist: any }) => artist.name).join(", ")} — {track.album.title}</span>
								</div>
							</div>
							<button class="btn btn-primary btn-sm" onclick={() => playTrack(track)}>▶</button>
						</li>
					{/each}
				</ul>
			</Tabs.Panel>

			<Tabs.Panel {...{ value: "albums" } as any}>
				<h2 class="text-2xl font-bold mb-6 text-green-400">Albums</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{#each Object.entries(groupBy(tracks, (t) => t.album.title ?? "Unknown Album")).sort((a, b) => a[0].localeCompare(b[0])) as [album, list]}
						<a href={`/album/${encodeURIComponent(album)}`} class="flex bg-surface-800 rounded-lg overflow-hidden">
							<div class="flex bg-surface-800 rounded-lg overflow-hidden">
								<img
									src={list[0]?.artworkUrl || defaultAlbumImage}
									alt={album}
									class="h-20 w-20 object-cover"
									onerror={(event) => {
										const target = event.currentTarget as HTMLImageElement;
										target.src = defaultAlbumImage;
									}}
								/>

								<div class="p-4 gap-y-2">
									<h3 class="text-sm font-semibold truncate">{album}</h3>
									<p class="text-sm text-surface-400">{list.length} {list.length > 1 ? "tracks" : "track"}</p>
								</div>
							</div>
						</a>
					{/each}
				</div>
			</Tabs.Panel>

			<!-- Artists -->
			<Tabs.Panel {...{ value: "artists" } as any}>
				<h2 class="text-2xl font-bold mb-6 text-green-400">Artists</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{#each Object.entries(groupBy(tracks, (t) => t.artists
								.map((a) => a.artist?.name || "Unknown Artist")
								.join(", "))).sort((a, b) => a[0].localeCompare(b[0])) as [artistNames, list]}
						<a href={`/artist/${encodeURIComponent(artistNames)}`} class="flex bg-surface-800 rounded-lg overflow-hidden">
							<div class="flex bg-surface-800 rounded-lg overflow-hidden p-4">
								<img
									src={defaultArtistImage}
									alt={artistNames}
									class="h-20 w-20 object-cover"
									onerror={(event) => {
										const target = event.currentTarget as HTMLImageElement;
										target.src = defaultArtistImage;
									}}
								/>
								<div class="pl-4">
									<h3 class="text-sm font-semibold truncate">{artistNames}</h3>
									<p class="text-sm text-surface-400">{list.length} {list.length > 1 ? "tracks" : "track"}</p>
								</div>
							</div>
						</a>
					{/each}
				</div>
			</Tabs.Panel>
		{/snippet}
	</Tabs>
</main>
