<style>
	.iconify-icon-container {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>

<script lang="ts">
	import "iconify-icon";

	const {
		name,
		size = 24,
		className = "",
	} = $props<{
		name: string;
		size?: number;
		className?: string;
	}>();
</script>

<div style="width: {size}px; height: {size}px;" class="iconify-icon-container">
	<iconify-icon icon={name} width={size} height={size} class={className}></iconify-icon>
</div>
