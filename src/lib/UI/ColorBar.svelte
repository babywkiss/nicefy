<script lang="ts">
	import { variants } from '@catppuccin/palette';

	export let palette: keyof typeof variants;

	$: colors = Object.entries(variants[palette]).map(([_, { hex }]) => hex);
</script>

<div class={`flex w-full h-3 ${$$restProps.class}`}>
	{#each colors as color}
		<div style:background={color} class="w-full" />
	{/each}
</div>
