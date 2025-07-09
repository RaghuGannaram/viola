<script lang="ts">
	import { onMount } from "svelte";
	import { page } from "$app/stores";
	import { artistNova } from "$lib/stores/artistNovaStore";
	import type { IArtist } from "$lib/types";

	let loading: boolean = $state(true);
	let artist: IArtist | null = $state(null);
	let error: string = $state("");

	const id = $page.params["id"];

	onMount(async () => {
		artistNova
			.hydrate({ id: id })
			.then(() => {
				artist = $artistNova;
				console.log("viola-log: artistNova store hydrated:", $artistNova);
			})
			.catch((err) => {
				error = err.type || "Unknown error";
			})
			.finally(() => {
				loading = false;
			});
	});

	function getInitials(name: string): string {
		if (typeof name !== "string") return "";

		const words = name.trim().split(/\s+/).filter(Boolean);

		if (words.length === 0) return "";

		const first = words[0]?.[0] ?? "";
		const second = words[1]?.[0] ?? "";

		return (first + second).toUpperCase();
	}
</script>

<svelte:head>
	<title>{artist?.name || "Artist"} - Viola</title>
</svelte:head>

<main class="min-h-screen px-4 py-8 space-y-14">
	{#if loading}
		<p class="text-center text-muted-foreground">Loading artist...</p>
	{:else if error === "NOT_FOUND"}
		<p class="text-center text-muted-foreground">Artist not found.</p>
	{:else if error}
		<p class="text-center text-destructive">{error}</p>
	{:else}
		<!-- 🧑‍🎤 Artist Profile -->
		<section class="flex flex-col sm:flex-row items-center sm:items-start gap-8">
			<!-- Avatar -->
			<div class="relative w-36 h-36 shrink-0 rounded-full overflow-hidden border-2 border-primary-400/50 shadow-lg">
				{#if artist.imageUrl}
					<img src={artist.imageUrl} alt={artist.name} class="w-full h-full object-cover" />
				{:else}
					<div class="w-full h-full bg-gradient-to-br from-primary to-secondary text-primary-400/60 flex items-center justify-center text-4xl font-bold">
						{getInitials(artist.name)}
					</div>
				{/if}
			</div>

			<!-- Info -->
			<div class="text-center sm:text-left space-y-2 flex-1">
				<h1 class="text-3xl font-bold text-foreground">{artist.name}</h1>
				<p class="text-muted-foreground italic">{artist.bio || "No bio available."}</p>

				{#if Object.keys(artist.externalLinks || {}).length}
					<div class="flex flex-wrap gap-3 mt-2 justify-center sm:justify-start">
						{#each Object.entries(artist.externalLinks) as [platform, url]}
							<a href={url as string} target="_blank" rel="noopener noreferrer" class="text-sm text-primary hover:underline">
								{platform}
							</a>
						{/each}
					</div>
				{/if}
			</div>
		</section>

		<!-- 💿 Albums -->
		{#if artist.contributedAlbums?.length}
			<section>
				<h2 class="text-xl font-semibold text-foreground mb-4">Albums</h2>
				<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
					{#each artist.contributedAlbums as { album }}
						<a href={`/album/${album.id}`} class="group bg-muted rounded-xl overflow-hidden shadow hover:shadow-xl transition transform hover:-translate-y-1">
							<div class="relative aspect-square">
								<img src={album.coverUrl} alt={album.title} class="w-full h-full object-cover" loading="lazy" />
								<div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:from-black/30 transition"></div>
							</div>
							<div class="p-3">
								<h3 class="text-base text-foreground font-semibold truncate">{album.title}</h3>
								{#if album.releaseDate}
									<p class="text-xs text-muted-foreground">
										{new Date(album.releaseDate).toLocaleDateString("en-IN", {
											year: "numeric",
											month: "short",
										})}
									</p>
								{/if}
							</div>
						</a>
					{/each}
				</div>
			</section>
		{/if}

		<!-- 🎵 Songs -->
		<section>
			<h2 class="text-xl font-semibold text-foreground mb-4">Songs</h2>

			{#if artist.creditedSongs?.length}
				<ul class="space-y-2">
					{#each artist.creditedSongs as { song }}
						<li>
							<a href={`/album/${song.albumId || ""}`} class="flex items-center justify-between gap-4 bg-muted rounded-lg px-4 py-3 hover:bg-muted/80 transition">
								<div class="flex items-center gap-4">
									<img src={song.artworkUrl} alt={song.title} class="w-12 h-12 object-cover rounded bg-surface-600" loading="lazy" />
									<div>
										<p class="text-sm font-medium text-foreground truncate">{song.title}</p>
										<p class="text-xs text-muted-foreground italic">
											{song.duration ? `${Math.floor(song.duration / 60)}m ${song.duration % 60}s` : "Unknown duration"}
										</p>
									</div>
								</div>
								<span class="text-primary text-sm">▶</span>
							</a>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="text-sm text-muted-foreground italic">No credited songs available.</p>
			{/if}
		</section>
	{/if}
</main>
