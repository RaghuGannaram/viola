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

<iconify-icon icon={name} width={size} height={size} class={className}></iconify-icon>
