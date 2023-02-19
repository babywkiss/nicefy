<script lang="ts">
	const variants = ['mocha', 'macchiato', 'frappe', 'latte'];
	export let pixelSize: number;
	export let to_dither: boolean;
	export let bayerLevel: number;
	export let palette: string;
</script>

<div class="flex flex-col w-72 p-5 bg-base-100 rounded-lg">
	<span class="">Pixel size</span>
	<input type="range" class="range range-sm" min="1" max="16" bind:value={pixelSize} />
	<span class="font-bold">{pixelSize}</span>
	<div class="divider" />
	<div class="flex gap-3">
		<span>Apply dithering</span>
		<input type="checkbox" class="checkbox" bind:checked={to_dither} />
	</div>
	{#if to_dither}
		<span class="">Bayer level</span>
		<input type="range" class="range range-sm" min="0" max="10" bind:value={bayerLevel} />
		<span class="font-bold">{bayerLevel}</span>
	{/if}
	<div class="divider" />
	<div class="input-group">
		<span>Palette</span>
		<select
			bind:value={palette}
			class="select select-sm select-bordered outline-none focus:outline-none"
		>
			{#each variants as variant}
				<option value={variant}>{variant}</option>
			{/each}
		</select>
	</div>
</div>
