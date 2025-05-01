<!-- src/routes/library/+page.svelte -->
<script lang="ts">
	import { goto } from "$app/navigation";
	import { Tabs } from "@skeletonlabs/skeleton-svelte";
	import { trackList } from "$lib/stores/trackStore";
	import { currentTrack } from "$lib/stores/playerStore";
	import defaultAlbumImage from "$lib/assets/album.png";
	import defaultArtistImage from "$lib/assets/artist.png";
	import type { ITrack } from "$lib/types";

	let activeTab = $state("songs");
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
		goto("/player");
	}

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

<main class="min-h-screen bg-neutral-900 text-neutral-200 p-6 space-y-10">
	<!-- Search Bar -->
	<div>
		<input type="text" bind:value={searchQuery} placeholder="Search songs, artists, albums..." class="form-input w-full p-3 text-base" oninput={onSearch} />
	</div>
	<Tabs value={activeTab} onValueChange={(event: { value: string }) => (activeTab = event.value)}>
		{#snippet list()}
			<Tabs.Control {...{ value: "songs" } as any}>All Songs</Tabs.Control>
			<Tabs.Control {...{ value: "albums" } as any}>Albums</Tabs.Control>
			<Tabs.Control {...{ value: "artists" } as any}>Artists</Tabs.Control>
		{/snippet}

		{#snippet content()}
			<Tabs.Panel {...{ value: "songs" } as any}>
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
			</Tabs.Panel>

			<Tabs.Panel {...{ value: "albums" } as any}>
				<h2 class="text-2xl font-bold mb-6 text-green-400">Albums</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{#each Object.entries(groupBy(tracks, (t) => t.album ?? "Unknown Album")).sort((a, b) => a[0].localeCompare(b[0])) as [album, list]}
						<a href={`/album/${encodeURIComponent(album)}`} class="flex bg-neutral-800 rounded-lg overflow-hidden">
							<div class="flex bg-neutral-800 rounded-lg overflow-hidden">
								<img
									src={list[0]?.coverImage}
									alt={album}
									class="h-20 w-20 object-cover"
									onerror={(event) => {
										const target = event.currentTarget as HTMLImageElement;
										target.src = defaultAlbumImage;
									}}
								/>

								<div class="p-4">
									<h3 class="text-sm font-semibold truncate">{album}</h3>
									<p class="text-sm text-neutral-400">{list.length} {list.length > 1 ? "tracks" : "track"}</p>
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
					{#each Object.entries(groupBy(tracks, (t) => t.artist ?? "Unknown Artist")).sort((a, b) => a[0].localeCompare(b[0])) as [artist, list]}
						<a href={`/artist/${encodeURIComponent(artist)}`} class="flex bg-neutral-800 rounded-lg overflow-hidden">
							<div class="flex bg-neutral-800 rounded-lg overflow-hidden p-4">
								<img
									src={defaultArtistImage}
									alt={artist}
									class="h-20 w-20 object-cover"
									onerror={(event) => {
										const target = event.currentTarget as HTMLImageElement;
										target.src = defaultArtistImage;
									}}
								/>
								<div class="pl-4">
									<h3 class="text-sm font-semibold truncate">{artist}</h3>
									<p class="text-sm text-neutral-400">{list.length} {list.length > 1 ? "tracks" : "track"}</p>
								</div>
							</div>
						</a>
					{/each}
				</div>
			</Tabs.Panel>
		{/snippet}
	</Tabs>
</main>
