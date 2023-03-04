<script lang="ts">
	const variants = ['mocha', 'macchiato', 'frappe', 'latte'];
	export let labComparison: boolean;
	export let rescaleBack: boolean;
	export let pixelSize: number;
	export let to_dither: boolean;
	export let bayerLevel: number;
	export let palette: string;
	export let noiseLevel: number;
</script>

<div class="flex flex-col w-72 p-5 bg-base-100 rounded-lg">
	<span class="">Pixel size</span>
	<input type="range" class="range range-sm" min="1" max="16" bind:value={pixelSize} />
	<span class="">{pixelSize === 1 ? 'original' : pixelSize + 'x'}</span>
	<div class="flex gap-3" class:hidden={pixelSize === 1}>
		<span>Rescale back</span>
		<input type="checkbox" class="checkbox" bind:checked={rescaleBack} />
	</div>
	<div class="divider" />
	<div class="flex gap-3">
		<span>Lab comparison</span>
		<input type="checkbox" class="checkbox" bind:checked={labComparison} />
	</div>
	<span class="text-xs text-warning">{labComparison ? 'Note: very slow to process' : ''}</span>
	<div class="divider" />
	<div class="flex gap-3">
		<span>Apply dithering</span>
		<input type="checkbox" class="checkbox" bind:checked={to_dither} />
	</div>
	{#if to_dither}
		<span class="">Matrix Size</span>
		<input type="range" class="range range-sm" min="0" max="10" bind:value={bayerLevel} />
		<span class="font-bold">{bayerLevel}</span>
		<span class="">Noise level</span>
		<input type="range" class="range range-sm" min="2" max="256" bind:value={noiseLevel} />
		<span class="font-bold">{noiseLevel}</span>
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
