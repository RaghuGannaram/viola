<script lang="ts">
	import { onMount } from "svelte";
	import { Switch } from "@skeletonlabs/skeleton-svelte";
	import Icon from "$lib/components/Icon/index.svelte";

	let checked = $state(false);

	const handleModeChange = (event: { checked: boolean }) => {
		checked = event.checked;

		const mode = event.checked ? "light" : "dark";

		document.documentElement.setAttribute("data-mode", mode);

		localStorage.setItem("viola:mode", mode);
	};

	onMount(() => {
		const currentMode = document.documentElement.getAttribute("data-mode");

		checked = currentMode === "light";
	});
</script>

<svelte:head>
	<script>
		(function () {
			try {
				const savedMode = localStorage.getItem("viola:mode") || "dark";

				document.documentElement.setAttribute("data-mode", savedMode);
			} catch (e) {
				document.documentElement.setAttribute("data-mode", "dark");
			}
		})();
	</script>
</svelte:head>

<Switch {checked} onCheckedChange={handleModeChange}>
	<Switch.Control>
		<Switch.Thumb>
			<Switch.Context>
				{#snippet children(switch_)}
					{#if switch_().checked}
						<Icon name="line-md:moon-alt-to-sunny-outline-loop-transition" size={14} />
					{:else}
						<Icon name="line-md:sunny-filled-loop-to-moon-filled-alt-loop-transition" size={14} />
					{/if}
				{/snippet}
			</Switch.Context>
		</Switch.Thumb>
	</Switch.Control>
	<Switch.HiddenInput />
</Switch>
