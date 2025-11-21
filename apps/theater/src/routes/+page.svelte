<script lang="ts">
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { formatDistanceToNow } from "date-fns";
	import { playback } from "$lib/stores/playbackStore";
	import { trackSpark } from "$lib/stores/trackSparkStore";

	let loading = $state(true);

	onMount(() => {
		trackSpark
			.hydrate()
			.then(() => {
				console.log("viola-log: trackSpark store hydrated:", $trackSpark);
			})
			.catch((error) => {
				console.error("viola-error: Error hydrating trackSpark store:", error);
			})
			.finally(() => {
				loading = false;
			});
	});

	function playTrack(track: any) {
		playback.set(track);
		goto("/player");
	}
</script>

<svelte:head>
	<title>Viola — Your Music Dashboard</title>
	<meta name="description" content="Your personal and intelligent music dashboard." />
</svelte:head>

<main class="min-h-screen p-8 flex flex-col gap-10">
	<section class="min-h-[70vh] flex flex-col justify-center text-center relative overflow-hidden">
		<!-- Background Gradient Layer -->
		<div class="absolute inset-0 bg-linear-to-br dark:from-[#3a82f7] dark:via-[#62a8ff] dark:to-[#c6dcff] from-[#62a8ff] via-[#62a8ff] to-[#c6dcff]"></div>

		<!-- Abstract Shape Overlay -->
		<div class="absolute -top-32 -right-32 w-[600px] h-[600px] bg-linear-to-tr from-white/20 to-transparent rounded-[30%] rotate-12 blur-2xl opacity-30"></div>
		<div class="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-linear-to-bl from-[#1b4dda]/40 to-transparent rounded-[40%] rotate-45 blur-3xl opacity-20"></div>

		<!-- Hero Content -->
		<div class="relative z-10 space-y-6">
			<div class="inline-flex items-center justify-center bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-lg shadow-blue-900/40">
				<svg class="w-32 h-32 text-white" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 19V6l12-2v13"></path>
				</svg>
			</div>

			<h1 class="text-6xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-white to-blue-100 tracking-tight drop-shadow-lg">Viola</h1>

			<p class="text-surface-50 text-xl font-light">Your private music sanctuary</p>
			<p class="text-surface-50 text-md italic">Pure control. Pure privacy. Pure music.</p>
		</div>
	</section>

	{#if loading}
		<div class="flex items-center justify-center text-surface-600-400">
			<span>Loading tracks...</span>
		</div>
	{:else}
		<section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
			{#if $trackSpark.length > 0}
				{#each $trackSpark as track}
					<button onclick={() => playTrack(track)}>
						<div class="flex items-center bg-surface-200-800 rounded-lg p-2 shadow-lg transition">
							<img src={track.artworkUrl} alt={track.title} class="w-16 h-16 rounded-md object-cover mr-4" />

							<div class="flex flex-col items-start gap-1 overflow-hidden">
								<span class="text-surface-800-200 font-medium truncate">{track.title}</span>
								<span class="text-surface-600-400 text-xs italic"> Uploaded {formatDistanceToNow(track.createdAt)} ago</span>
							</div>
						</div>
					</button>
				{/each}
			{:else}
				<div class="text-center text-surface-600-400 col-span-full">No tracks available.</div>
			{/if}
		</section>
	{/if}
</main>
