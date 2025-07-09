<script lang="ts">
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { albumNova } from "$lib/stores/albumNovaStore";
	import { playback } from "$lib/stores/playbackStore";
	import type { IAlbum } from "$lib/types";

	let loading: boolean = $state(true);
	let album: IAlbum | null = $state(null);
	let error: string = $state("");

	const id = $page.params["id"];

	onMount(async () => {
		albumNova
			.hydrate({ id: id })
			.then(() => {
				album = $albumNova;
				console.log("viola-log: albumNova store hydrated:", $albumNova);
			})
			.catch((err) => {
				error = err.type || "Unknown error";
			})
			.finally(() => {
				loading = false;
			});
	});
</script>

<svelte:head>
	<title>{album?.title} - Viola</title>
</svelte:head>

<main class="min-h-screen px-4 py-8 space-y-12">
	{#if loading}
		<p class="text-center text-muted-foreground">Loading album...</p>
	{:else if error === "NOT_FOUND"}
		<p class="text-center text-muted-foreground">Album not found.</p>
	{:else if error}
		<p class="text-center text-destructive">{error}</p>
	{:else}
		<!-- 🎵 Album Header -->
		<section class="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
			<!-- Cover Art -->
			<div class="w-40 h-40 sm:w-48 sm:h-48 rounded-lg overflow-hidden shadow-lg border border-surface-700 bg-surface-600 flex items-center justify-center">
				{#if album.coverUrl && !album.coverUrl.includes("/null")}
					<img src={album.coverUrl} alt={album.title} class="w-full h-full object-cover" />
				{:else}
					<div class="text-surface-300 text-xl font-semibold px-3 text-center">{album.title}</div>
				{/if}
			</div>

			<!-- Album Info -->
			<div class="text-center sm:text-left space-y-2 flex-1">
				<h1 class="text-3xl font-bold text-surface-100">{album.title}</h1>

				{#if album.releaseDate}
					<p class="text-sm text-surface-400">
						Released: {new Date(album.releaseDate).toLocaleDateString("en-IN", { year: "numeric", month: "short" })}
					</p>
				{/if}

				{#if album.artists?.length}
					<div class="flex flex-wrap gap-3">
						{#each album.artists as { artist }}
							<a
								href={`/artist/${artist.id}`}
								class="flex items-center gap-2 px-3 py-1 bg-surface-700 rounded-full text-surface-300 text-sm hover:bg-surface-600 transition"
							>
								{#if artist.imageUrl}
									<img src={artist.imageUrl} alt={artist.name} class="w-6 h-6 rounded-full object-cover" />
								{:else}
									<div class="w-6 h-6 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center">
										<!-- {getInitials(artist.name)} -->
									</div>
								{/if}
								{artist.name}
							</a>
						{/each}
					</div>
				{/if}
			</div>
		</section>

		<!-- 📀 Tracklist -->
		<section>
			<h2 class="text-xl font-semibold text-surface-200 mb-4">Tracks</h2>
			{#if album.songs?.length}
				<ul class="divide-y divide-surface-700">
					{#each album.songs as song}
						<li class="py-3">
							<div class="flex items-center justify-between gap-4 hover:bg-surface-700/30 px-3 py-2 rounded transition">
								<div class="flex items-center gap-4">
									<!-- Song Thumbnail -->
									<div class="w-12 h-12 rounded bg-surface-600 overflow-hidden flex items-center justify-center">
										{#if song.artworkUrl}
											<img src={song.artworkUrl} alt={song.title} class="w-full h-full object-cover" />
										{:else}
											<div class="text-white text-xs">{song.title.slice(0, 1).toUpperCase()}</div>
										{/if}
									</div>

									<!-- Song Info -->
									<div>
										<p class="text-sm text-surface-100">{song.title}</p>
										<p class="text-xs text-surface-400 italic">Tap to play</p>
									</div>
								</div>
								<button
									class="btn btn-primary btn-sm"
									onclick={() => {
										// Dispatch play event for the song
										// This should be replaced with actual playback logic
										playback.set(song);
										goto("/player");
										console.log(`Playing song: ${song.title}`);
									}}
								>
									<span class="text-primary-300 text-sm">▶</span>
								</button>
							</div>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="text-surface-500 italic">No tracks found for this album.</p>
			{/if}
		</section>
	{/if}
</main>
