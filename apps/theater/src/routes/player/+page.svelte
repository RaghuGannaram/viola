<!-- src/routes/player/+page.svelte -->

<style>
	@keyframes spin-slow {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
	.animate-spin-slow {
		animation: spin-slow 10s linear infinite;
	}
</style>

<script lang="ts">
	// import { get } from "svelte/store";
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { playback } from "$lib/stores/playbackStore";
	// import { trackList } from "$lib/stores/trackStore";
	import Icon from "$lib/components/Icon/index.svelte";
	import SeekBar from "$lib/components/SeekBar.svelte";
	import VolumeComb from "$lib/components/VolumeComb.svelte";
	import proxyClient from "$lib/services/http/proxy/client";
	import { PROXY_ENDPOINTS } from "$lib/services/http/shared/endpoints";

	let audioElement: HTMLAudioElement | null = $state(null);
	let play = $state(true);
	let trackDuration = $state(0);
	let trackProgress = $state(0);
	let volume = $state(0.2);
	let mute = $state(false);
	let shuffle = $state(false);
	let repeat = $state(false);

	$effect(() => {
		if (audioElement && $playback) {
			audioElement.src = $playback.streamUrl || "";
			audioElement.load();
		}
	});

	$effect(() => {
		if (audioElement && $playback) {
			play ? audioElement?.play() : audioElement?.pause();
		}
	});

	$effect(() => {
		if (audioElement) {
			audioElement.volume = volume;
		}
	});

	$effect(() => {
		if (audioElement) {
			audioElement.loop = repeat;
		}
	});

	onMount(() => {
		async function fetchStreamingUrl() {
			const response = await proxyClient.get(`${PROXY_ENDPOINTS.AUDIO.STREAM}/${$playback.id}`);
			const { data } = response.data;

			if (data && data.streamUrl) {
				$playback.streamUrl = data.streamUrl;
				console.log("viola-log: Streaming URL fetched successfully:", $playback.streamUrl);
			} else {
				console.error("viola-error: Failed to fetch streaming URL for playback.");
			}
		}

		fetchStreamingUrl();
	});

	function playPauseHandler() {
		play = !play;
	}

	function seekHandler(event: Event) {
		audioElement!.currentTime = Number((event.currentTarget as HTMLInputElement).value);
	}

	function volumeHandler(event: Event) {
		volume = Number((event.currentTarget as HTMLInputElement).value);
		mute = volume === 0 ? true : false;
	}

	function muteHandler() {
		volume = !mute ? 0 : 0.2;
		mute = !mute;
	}

	function shuffleHandler() {
		shuffle = !shuffle;
	}

	function repeatHandler() {
		repeat = !repeat;
	}

	function navigateToAlbum() {
		if ($playback) {
			goto(`/album/${$playback.album.id}`);
		}
	}

	function trackEndHandler() {
		if (repeat) {
			audioElement!.currentTime = 0;
			audioElement!.play();
			play = true;
		} else if (shuffle) {
			// Logic for shuffling to the next track can be implemented here
			// For now, we will just reset the play state
			audioElement!.currentTime = 0;
			audioElement!.play();
			play = true;
		} else {
			play = false;
		}
	}

	function trackErrorHandler(event: Event) {
		const audioEl = event.target as HTMLAudioElement;
		const error = audioEl.error;
		if (error) {
			console.error("viola-error: Audio error code: ", error.code);
			switch (error.code) {
				case MediaError.MEDIA_ERR_ABORTED:
					console.error("viola-error: You aborted the audio playback.\n error: ", error);
					break;
				case MediaError.MEDIA_ERR_NETWORK:
					console.error("viola-error: A network error occurred while fetching the audio.\n error: ", error);
					break;
				case MediaError.MEDIA_ERR_DECODE:
					console.error(
						"viola-error: The audio playback was aborted due to a corruption problem or because the media used features your browser did not support. \n error: ",
						error,
					);
					break;
				case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
					console.error(
						"viola-error: The audio could not be loaded, either because the server or network failed or because the format is not supported. \n error: ",
						error,
					);
					break;
				default:
					console.error("viola-error: An unknown error occurred. \n error: ", error);
					break;
			}
		}
	}
</script>

<main class="flex flex-col items-center justify-center min-h-screen bg-linear-to-br p-6 gap-8 select-none">
	{#if $playback}
		<!-- Cover Art -->
		<div class="relative w-64 h-64 rounded-full overflow-hidden shadow-lg">
			<img src={$playback.artworkUrl ?? "/images/default-album.jpg"} alt={$playback.title} class="w-full h-full object-cover {play ? 'animate-spin-slow' : ''}" />
		</div>

		<!-- Track Info -->
		<div class="text-center space-y-2 w-full">
			<h1 class="text-3xl font-bold text-primary-600/80 dark:text-primary-400/80">{$playback.title}</h1>
			<p class="text-sm text-surface-600-400 truncate">{$playback.artists.map((a: any) => a.artist.name).join(", ")} — {$playback.album.title}</p>
		</div>

		<!-- Progress Bar -->
		<SeekBar {trackProgress} {trackDuration} {seekHandler} />

		<!-- Playback Controls -->
		<div class="flex justify-between items-center w-full max-w-md mt-6">
			<button class="btn btn-circle btn-outline pl-0 {shuffle ? 'text-primary-600-400' : ''}" onclick={shuffleHandler}>
				<Icon name="mdi:shuffle" size={24} />
			</button>

			<button class="btn btn-circle btn-lg btn-outline" disabled>
				<Icon name="mdi:skip-previous" size={28} />
			</button>

			<button class="btn btn-circle btn-primary btn-xl" onclick={playPauseHandler}>
				<div class="w-8 h-8 flex items-center justify-center">
					{#if play}
						<Icon name="mdi:pause" size={32} />
					{:else}
						<Icon name="mdi:play" size={32} />
					{/if}
				</div>
			</button>

			<button class="btn btn-circle btn-lg btn-outline" disabled>
				<Icon name="mdi:skip-next" size={28} />
			</button>

			<button class="btn btn-circle btn-outline pr-0 {repeat ? 'text-primary-600-400' : ''}" onclick={repeatHandler}>
				<Icon name="mdi:repeat" size={24} />
			</button>
		</div>

		<div class="flex items-center w-full max-w-md justify-between mt-6">
			<!-- Volume Control -->
			<VolumeComb {volume} {mute} {volumeHandler} {muteHandler} />

			<!-- Go to Album Button -->
			{#if $playback?.album}
				<button class="btn btn-outline pr-0 ml-1 mb-1 text-sm hover:text-primary-600-400 hover:border-primary-600-400 transition" onclick={navigateToAlbum}>
					<Icon name="f7:music-albums" size={20} />
				</button>
			{/if}
		</div>

		<audio
			bind:this={audioElement}
			class="hidden"
			onloadedmetadata={() => {
				trackDuration = audioElement?.duration ?? 0;
			}}
			ontimeupdate={() => {
				trackProgress = audioElement?.currentTime ?? 0;
			}}
			onended={trackEndHandler}
			onerror={trackErrorHandler}
		></audio>
	{:else}
		<p class="text-surface-600-400">No track selected. Please pick a track from the Library.</p>
	{/if}
</main>
