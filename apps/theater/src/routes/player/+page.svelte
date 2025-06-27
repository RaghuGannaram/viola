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

			if (response.data && response.data.streamUrl) {
				$playback.streamUrl = response.data.streamUrl;
				console.log("viola-log: Streaming URL fetched successfully:", $playback.streamUrl);
			} else {
				console.error("viola-error: Failed to fetch streaming URL for playback.");
			}
		}

		fetchStreamingUrl();
	});

	async function syncCurrentTrack() {
		console.log("viola-log: Syncing current track...");
		if (!$playback) return;

		let attempts = 0;
		const maxAttempts = 10;
		const delay = 10;

		while (attempts < maxAttempts) {
			console.log("viola-log: Attempting to sync current track...", attempts);
			// const allTracks = get(trackList);
			// const match = allTracks.find((t) => t.id === $playback.id);
			// if (match) {
			// 	console.log("viola-log: Track found in trackList:", match);
			// 	playback.set(match);
			// 	return;
			// }

			await new Promise((res) => setTimeout(res, delay));
			attempts++;
		}

		console.warn("syncCurrentTrack: Track not found in trackList after retries.");
	}

	function formatTime(sec: number) {
		const m = Math.floor(sec / 60);
		const s = Math.floor(sec % 60)
			.toString()
			.padStart(2, "0");
		return `${m}:${s}`;
	}

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
			const albumName = $playback.album ?? "Unknown Album";
			goto(`/album/${encodeURIComponent(albumName)}`);
		}
	}

	function trackEndHandler() {
		if (repeat) {
			audioElement!.currentTime = 0;
			audioElement!.play();
			play = true;
		} else if (shuffle) {
			// const allTracks = $trackList;
			// if (allTracks.length > 0) {
			// 	const randomIndex = Math.floor(Math.random() * allTracks.length);
			// 	const randomTrack = allTracks[randomIndex];
			// 	playback.set(randomTrack!);
			// }
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
			syncCurrentTrack();
		}
	}
</script>

<main class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br p-6 gap-8">
	{#if $playback}
		<!-- Cover Art -->
		<div class="relative w-64 h-64 rounded-full overflow-hidden shadow-lg">
			<img src={$playback.artworkUrl ?? "/images/default-album.jpg"} alt={$playback.title} class="w-full h-full object-cover {play ? 'animate-spin-slow' : ''}" />
		</div>

		<!-- Track Info -->
		<div class="text-center space-y-2 w-full">
			<h1 class="text-3xl font-bold text-green-400">{$playback.title}</h1>
			<p class="text-sm text-neutral-400 truncate">{$playback.artist} — {$playback.album}</p>
		</div>

		<!-- Progress Bar -->
		<div class="w-full max-w-2xl space-y-2">
			<input type="range" min="0" max={trackDuration} step="0.01" bind:value={trackProgress} oninput={seekHandler} class="form-range w-full accent-green-400" />
			<div class="flex justify-between text-xs text-neutral-500">
				<span>{formatTime(trackProgress)}</span>
				<span>{formatTime(trackDuration)}</span>
			</div>
		</div>

		<!-- Playback Controls -->
		<div class="flex justify-between items-center w-full max-w-md mt-6">
			<button class="btn btn-circle btn-outline pl-0 {shuffle ? 'text-green-400' : ''}" onclick={shuffleHandler}>
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

			<button class="btn btn-circle btn-outline pr-0 {repeat ? 'text-green-400' : ''}" onclick={repeatHandler}>
				<Icon name="mdi:repeat" size={24} />
			</button>
		</div>

		<div class="flex items-center w-full max-w-md justify-between mt-6">
			<!-- Volume Control -->
			<!-- Volume control: show slider only on hover -->
			<div class="  flex items-center w-full gap-2">
				<!-- Volume Button -->
				<button onclick={muteHandler} class="group-hover:text-green-400 transition">
					<div class="w-6 h-6 flex items-center justify-center">
						<Icon name={mute ? "mdi:volume-mute" : "mdi:volume-high"} size={24} />
					</div>
				</button>

				<!-- Slider (only visible on hover) -->
				<input type="range" min="0" max="1" step="0.01" bind:value={volume} oninput={volumeHandler} class="form-range flex-1 accent-green-400" />
			</div>

			<!-- Go to Album Button -->
			{#if $playback?.album}
				<button class="btn btn-outline pr-0 ml-8 mb-1 text-sm hover:text-green-400 hover:border-green-400 transition" onclick={navigateToAlbum}>
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
		<p class="text-neutral-400">No track selected. Please pick a track from the Library.</p>
	{/if}
</main>
