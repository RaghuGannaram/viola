<style>
	input[type="range"].track-slider {
		@apply w-full appearance-none bg-transparent cursor-pointer;
	}

	input[type="range"].track-slider::-webkit-slider-thumb {
		appearance: none;
		height: 14px;
		width: 14px;
		border-radius: 9999px;
		background: #3a82f7;
		cursor: pointer;
		box-shadow: 0 0 0 4px rgba(69, 108, 171, 0.2);
		margin-top: -5px;
	}

	input[type="range"].track-slider::-moz-range-thumb {
		height: 14px;
		width: 14px;
		border-radius: 9999px;
		background: #3a82f7;
		cursor: pointer;
		box-shadow: 0 0 0 4px rgba(69, 108, 171, 0.2);
		border: none;
	}

	input[type="range"].track-slider::-webkit-slider-runnable-track {
		height: 4px;
		border-radius: 9999px;
		background: linear-gradient(to right, #3a82f7 var(--progress), #3f3f46 var(--progress));
	}

	input[type="range"].track-slider::-moz-range-track {
		height: 4px;
		border-radius: 9999px;
		background: linear-gradient(to right, #3a82f7 var(--progress), #3f3f46 var(--progress));
	}
</style>

<script lang="ts">
	let { trackProgress, trackDuration, seekHandler }: { trackProgress: number; trackDuration: number; seekHandler: (e: Event) => void } = $props();

	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	}
</script>

<div class="w-full max-w-2xl space-y-2">
	<input
		type="range"
		min="0"
		max={trackDuration}
		step="0.01"
		bind:value={trackProgress}
		oninput={seekHandler}
		class="track-slider"
		style="--progress: {(trackProgress / trackDuration) * 100}%"
	/>

	<div class="flex justify-between text-xs text-surface-500">
		<span>{formatTime(trackProgress)}</span>
		<span>{formatTime(trackDuration)}</span>
	</div>
</div>
