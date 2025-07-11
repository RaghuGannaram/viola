<!-- src/routes/library/+page.svelte -->
<script lang="ts">
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { Tabs } from "@skeletonlabs/skeleton-svelte";
	import { trackSpark } from "$lib/stores/trackSparkStore";
	import { albumSpark } from "$lib/stores/albumSparkStore";
	import { artistSpark } from "$lib/stores/artistSparkStore";
	import { playback } from "$lib/stores/playbackStore";
	import defaultAlbumImage from "$lib/assets/album.png";
	import type { ITrack, IAlbum, IArtist } from "$lib/types";

	let activeTab = $state("artists");
	let tracks: ITrack[] = $state([]);
	let albums: IAlbum[] = $state([]);
	let artists: IArtist[] = $state([]);

	onMount(() => {
		trackSpark
			.hydrate()
			.then(() => {
				tracks = $trackSpark;
				console.log("viola-log: trackSpark store hydrated:", $trackSpark);
			})
			.catch((error) => {
				console.error("viola-error: Error hydrating trackSpark store:", error);
			});

		albumSpark
			.hydrate()
			.then(() => {
				albums = $albumSpark;
				console.log("viola-log: albumSpark store hydrated:", $albumSpark);
			})
			.catch((error) => {
				console.error("viola-error: Error hydrating albumSpark store:", error);
			});
		artistSpark
			.hydrate()
			.then(() => {
				artists = $artistSpark;
				console.log("viola-log: artistSpark store hydrated:", $artistSpark);
			})
			.catch((error) => {
				console.error("viola-error: Error hydrating artistSpark store:", error);
			});
	});

	function playTrack(track: ITrack) {
		playback.set(track);
		goto("/player");
	}

	function getInitials(name: string): string {
		const words = name.trim().split(" ");

		if (words.length === 1 && words[0] && words[0][0]) {
			return words[0][0].toUpperCase();
		}

		if (words.length >= 2 && words[0] && words[1] && words[0][0] && words[1][0]) {
			return (words[0][0] + words[1][0]).toUpperCase();
		}

		return "";
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
				<div class="flex flex-wrap justify-start gap-8 px-3 py-4">
					{#if albums.length === 0}
						<div class=" w-full text-center text-surface-500">No albums found.</div>
					{/if}
					{#each albums as album}
						<div class=" w-[250px] bg-surface-800/50 rounded-xl">
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
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 px-2 py-4">
					{#if artists.length === 0}
						<div class="col-span-full text-center text-surface-500">No artists found.</div>
					{/if}

					{#each artists as artist}
						<a
							href={`/artist/${artist.id}`}
							class="group flex items-center gap-4 bg-surface-800/50 hover:bg-surface-700/50 rounded-xl px-4 py-3 shadow transition duration-300"
						>
							<!-- Avatar -->
							<div class="relative w-15 h-15 flex-shrink-0">
								{#if artist.imageUrl}
									<img
										src={artist.imageUrl}
										alt={artist.name}
										class="w-15 h-15 object-cover rounded-full border-2 border-primary-500"
										onerror={(event) => {
											const target = event.currentTarget as HTMLImageElement;
											target.src = "";
										}}
									/>
								{:else}
									<!-- Gradient Initials Fallback -->
									<div class="w-15 h-15 rounded-full bg-surface-700/50 flex items-center justify-center text-primary-400 text-md italic">
										{getInitials(artist.name)}
									</div>
								{/if}
							</div>

							<!-- Text Info -->
							<div class="flex-1">
								<h3 class="text-base font-semibold text-surface-100 group-hover:text-primary-300">{artist.name}</h3>

								{#if artist.bio}
									<p class="text-xs text-surface-400 line-clamp-2">{artist.bio}</p>
								{:else}
									<p class="text-xs text-surface-500 italic">No bio available</p>
								{/if}

								{#if artist.contributedAlbums?.length}
									<p class="text-xs text-surface-500 mt-1">
										🎵 Contributed to <strong>{artist.contributedAlbums.length}</strong>
										{artist.contributedAlbums.length === 1 ? "album" : "albums"}
									</p>
								{/if}
							</div>
						</a>
					{/each}
				</div>
			</Tabs.Panel>
		{/snippet}
	</Tabs>
</main>
