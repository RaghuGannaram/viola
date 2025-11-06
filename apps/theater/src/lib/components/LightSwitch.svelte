<script lang="ts">
	import { Switch } from "@skeletonlabs/skeleton-svelte";
	import Icon from "$lib/components/Icon/index.svelte";
	import { localStore } from "$lib/stores/localStore";

	let mode = localStore<string | null>("data-mode", "dark");
	let checked = $state($mode === "light");

	const handleModeChange = (event: { checked: boolean }) => {
		checked = event.checked;

		document.documentElement.setAttribute("data-mode", event.checked ? "light" : "dark");
		mode.set(event.checked ? "light" : "dark");
	};
</script>

<svelte:head>
	<script>
		const dataMode = $mode || "dark";
		document.documentElement.setAttribute("data-mode", dataMode);
	</script>
</svelte:head>

<Switch name="mode" controlActive="bg-primary-700" {checked} onCheckedChange={(event: { checked: boolean }) => handleModeChange(event)}>
	{#snippet inactiveChild()}<Icon name="line-md:sunny-filled-loop-to-moon-filled-alt-loop-transition" size={14} />{/snippet}
	{#snippet activeChild()}<Icon name="line-md:moon-alt-to-sunny-outline-loop-transition" size={14} />{/snippet}
</Switch>
