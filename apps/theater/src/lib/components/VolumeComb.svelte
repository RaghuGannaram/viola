<style>
	input[type="range"].volume-slider {
		@apply appearance-none w-full bg-transparent cursor-pointer relative;
	}

	input[type="range"].volume-slider::-webkit-slider-runnable-track {
		height: 10px;
		visibility: hidden;
	}

	input[type="range"].volume-slider::-moz-range-track {
		height: 10px;
		visibility: hidden;
	}

	.ticks {
		position: absolute;
		top: 40%;
		left: 0;
		width: 100%;
		display: flex;
		justify-content: space-between;
		pointer-events: none;
	}

	.ticks span {
		width: 1px;
		height: 10px;
		border-radius: 1px;
		background-color: #3f3f46;
		transition: background-color 0.2s;
	}

	.ticks span.filled {
		background-color: #3a82f7;
	}
</style>

<script lang="ts">
	import Icon from "$lib/components/Icon/index.svelte";

	let {
		volume,
		mute,
		volumeHandler,
		muteHandler,
	}: {
		volume: number;
		mute: boolean;
		volumeHandler: (e: Event) => void;
		muteHandler: () => void;
	} = $props();

	const tickCount = 50;
</script>

<div class="flex items-center w-full gap-2 group">
	<!-- Mute/Unmute Icon -->
	<button onclick={muteHandler} class="text-primary-600-400 hover:text-primary-600/80 dark:hover:text-primary-400/80 transition" aria-label="Toggle Mute">
		<div class="w-6 h-6 flex items-center justify-center">
			<Icon name={mute ? "mdi:volume-mute" : "mdi:volume-high"} size={20} />
		</div>
	</button>

	<div class="relative w-full mb-1">
		<!-- Tick marks over the slider -->
		<div class="ticks">
			{#each Array(tickCount) as _, i}
				<span class={(i + 1) / tickCount <= volume ? "filled" : ""}></span>
			{/each}
		</div>

		<!-- Styled Volume Slider -->
		<input type="range" min="0" max="1" step="0.01" bind:value={volume} oninput={volumeHandler} class="volume-slider flex-1" style="--vol: {(volume * 100).toFixed(0)}%" />
	</div>
</div>
