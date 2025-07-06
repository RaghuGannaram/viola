<!-- src/routes/library/+page.svelte -->
<script lang="ts">
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { Tabs } from "@skeletonlabs/skeleton-svelte";
	import { trackMetadataList } from "$lib/stores/trackMetadataStore";
	import { albumList } from "$lib/stores/albumStore";
	import { playback } from "$lib/stores/playbackStore";
	import defaultAlbumImage from "$lib/assets/album.png";
	import defaultArtistImage from "$lib/assets/artist.png";
	import type { ITrack, IAlbum } from "$lib/types";

	let activeTab = $state("albums");
	let tracks: ITrack[] = $state([]);
	let albums: IAlbum[] = $state([]);

	onMount(() => {
		trackMetadataList
			.hydrate()
			.then(() => {
				tracks = $trackMetadataList;
				console.log("viola-log: Track metadata store hydrated:", $trackMetadataList);
			})
			.catch((error) => {
				console.error("viola-error: Error hydrating track metadata store:", error);
			});

		albumList
			.hydrate()
			.then(() => {
				albums = $albumList;
				console.log("viola-log: Album store hydrated:", $albumList);
			})
			.catch((error) => {
				console.error("viola-error: Error hydrating album store:", error);
			});
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
	<Tabs
		value={activeTab}
		onValueChange={(event: { value: string }) => (activeTab = event.value)}
		listClasses="text-primary-200"
		listBorder="border-b border-primary-400/50"
		defaultValue="albums"
	>
		{#snippet list()}
			<Tabs.Control {...{ value: "songs" } as any} labelClasses="hover:bg-surface-600 hover:text-primary-300">All Songs</Tabs.Control>
			<Tabs.Control {...{ value: "albums" } as any} labelClasses="hover:bg-surface-600 hover:text-primary-300">Albums</Tabs.Control>
			<Tabs.Control {...{ value: "artists" } as any} labelClasses="hover:bg-surface-600 hover:text-primary-300">Artists</Tabs.Control>
		{/snippet}

		{#snippet content()}
			<Tabs.Panel {...{ value: "songs" } as any}>
				<ul class="divide-y divide-surface-700">
					{#each tracks as track}
						<li class="flex justify-between items-center py-4 hover:bg-surface-800/50 px-3">
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
								<div class="flex flex-col gap-y-1">
									<span class="text-surface-200 font-medium truncate">{track.title}</span>
									<span class="text-surface-400 text-xs italic"
										>{track.album.title} - {track.artists.map(({ artist }: { artist: any }) => artist.name).join(", ")}</span
									>
								</div>
							</div>
							<button class="btn btn-primary text-primary-400 btn-sm" onclick={() => playTrack(track)}>▶</button>
						</li>
					{/each}
				</ul>
			</Tabs.Panel>

			<Tabs.Panel {...{ value: "albums" } as any}>
				<div class="flex flex-wrap justify-start gap-8 mt-8">
					{#if albums.length === 0}
						<div class="col-span-full text-center text-surface-500">No albums found.</div>
					{/if}
					{#each albums as album}
						<div class=" w-[250px] bg-surface-800/50 rounded-x">
							<a href={`/album/${album.id}`} class="group bg-surface-800 overflow-hidden shadow-md hover:shadow-lg hover:bg-surface-700/50 transition">
								<div class="relative">
									<img
										src={album.coverUrl || defaultAlbumImage}
										alt={album.title}
										class="w-[250px] h-[250px] object-cover rounded-t-xl"
										onerror={(event) => {
											const target = event.currentTarget as HTMLImageElement;
											target.src = defaultAlbumImage;
										}}
									/>
									<div class="absolute inset-0 rounded-t-xl bg-surface-800/50 hover:bg-surface-600/40 transition"></div>
								</div>

								<!-- Text Info -->
								<div class="p-4 space-y-1">
									<h3 class="text-base font-semibold text-surface-200 group-hover:text-primary-200">{album.title}</h3>
									{#if album.description}
										<p class="text-sm text-surface-400 line-clamp-2">{album.description}</p>
									{/if}

									{#if album.artists?.length}
										<p class="text-xs text-surface-400 italic">
											{album.artists.map(({ artist }: any) => artist.name).join(", ")}
										</p>
									{/if}

									<p class="text-xs text-surface-500">
										{album.songs.length}
										{album.songs.length === 1 ? "song" : "songs"}
										{#if album.releaseDate}
											• {new Date(album.releaseDate).toLocaleDateString("en-IN", { year: "numeric", month: "short" })}
										{/if}
									</p>
								</div>
							</a>
						</div>
					{/each}
				</div>
			</Tabs.Panel>

			<!-- Artists -->
			<Tabs.Panel {...{ value: "artists" } as any}>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{#each Object.entries(groupBy(tracks, (t) => t.artists
								.map((a: any) => a.artist?.name || "Unknown Artist")
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
