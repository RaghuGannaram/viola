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
	import { goto } from "$app/navigation";
	import { currentTrack } from "$lib/stores/playerStore";
	import { trackList } from "$lib/stores/trackStore";
	import Icon from "$lib/components/Icon/index.svelte";

	let audioElement: HTMLAudioElement | null = $state(null);
	let play = $state(true);
	let trackDuration = $state(0);
	let trackProgress = $state(0);
	let volume = $state(0.2);
	let mute = $state(false);
	let shuffle = $state(false);
	let repeat = $state(false);

	$effect(() => {
		if (audioElement && $currentTrack) {
			console.log("Current Track:", $currentTrack);
			audioElement.src = $currentTrack.url;
			audioElement.load();
		}
	});

	$effect(() => {
		if (audioElement && $currentTrack) {
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

	function trackEndHandler() {
		if (repeat) {
			audioElement!.currentTime = 0;
			audioElement!.play();
			play = true;
		} else if (shuffle) {
			const allTracks = $trackList;
			if (allTracks.length > 0) {
				const randomIndex = Math.floor(Math.random() * allTracks.length);
				const randomTrack = allTracks[randomIndex];
				currentTrack.set(randomTrack!);
			}
		} else {
			play = false;
		}
	}

	function shuffleHandler() {
		shuffle = !shuffle;
	}

	function repeatHandler() {
		repeat = !repeat;
	}

	function navigateToAlbum() {
		if ($currentTrack) {
			const albumName = $currentTrack.album ?? "Unknown Album";
			goto(`/album/${encodeURIComponent(albumName)}`);
		}
	}
</script>

<main class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-neutral-900 to-black text-neutral-100 p-6 gap-8">
	{#if $currentTrack}
		<!-- Cover Art -->
		<div class="relative w-64 h-64 rounded-full overflow-hidden shadow-lg">
			<img src={$currentTrack.coverImage ?? "/images/default-album.jpg"} alt={$currentTrack.title} class="w-full h-full object-cover {play ? 'animate-spin-slow' : ''}" />
		</div>

		<!-- Track Info -->
		<div class="text-center space-y-2">
			<h1 class="text-3xl font-bold text-green-400 truncate">{$currentTrack.title}</h1>
			<p class="text-sm text-neutral-400 truncate">{$currentTrack.artist} — {$currentTrack.album}</p>
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

		<!-- Volume Control -->
		<div class="flex items-center gap-4 w-full max-w-md mt-6">
			<button onclick={muteHandler} class="text-neutral-400 hover:text-primary transition">
				<div class="w-6 h-6 flex items-center justify-center">
					{#if mute}
						<Icon name="mdi:volume-mute" size={24} />
					{:else}
						<Icon name="mdi:volume-high" size={24} />
					{/if}
				</div>
			</button>
			<input type="range" min="0" max="1" step="0.01" bind:value={volume} oninput={volumeHandler} class="form-range flex-1 accent-green-400 mb-1" />
		</div>
		<!-- Go to Album Button -->
		{#if $currentTrack?.album}
			<div class=" mt-4">
				<button class="btn btn-outline flex items-center gap-2 px-4 py-2 text-sm hover:text-green-400 hover:border-green-400 transition" onclick={navigateToAlbum}>
					<Icon name="f7:music-albums" size={20} />
					<span>Go to Album</span>
					<Icon name="fluent:arrow-up-right-20-regular" size={20} className="mt-1 ml-1" />
				</button>
			</div>
		{/if}

		<audio
			bind:this={audioElement}
			class="hidden"
			onloadedmetadata={() => {
				trackDuration = audioElement!.duration;
			}}
			ontimeupdate={() => {
				trackProgress = audioElement!.currentTime;
			}}
			onended={trackEndHandler}
		></audio>
	{:else}
		<p class="text-neutral-400">No track selected. Please pick a track from the Library.</p>
	{/if}
</main>
