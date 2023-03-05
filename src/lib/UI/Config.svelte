<script lang="ts">
	import IconSettings from '~icons/ri/settings-5-fill';
	import type { Config } from '$lib/utils/io';
	const variants = ['mocha', 'macchiato', 'frappe', 'latte'];
	export let config: Config;
	let applyScalling = true;
	$: !applyScalling ? (config.pixelSize = 1) : config.pixelSize < 2 ? (config.pixelSize = 2) : 0;
</script>

<div class="flex flex-col p-5 rounded-lg gap-1 select-none w-72">
	<div class="divider text-2xl font-bold">Config<IconSettings class="w-32" /></div>
	<div class="flex gap-3 items-center">
		<span class="text-lg font-bold">Downscalling</span>
		<input type="checkbox" class="checkbox" bind:checked={applyScalling} />
	</div>
	{#if applyScalling}
		<div class="flex flex-col w-full gap-2 py-5">
			<div class="input-group">
				<input type="range" class="range range-sm" min="2" max="16" bind:value={config.pixelSize} />
				<span>{config.pixelSize + 'x'}</span>
			</div>
			<div class="flex gap-3 w-full" class:hidden={config.pixelSize === 1}>
				<span class="text-sm">Rescale back</span>
				<input type="checkbox" class="checkbox checkbox-sm" bind:checked={config.rescaleBack} />
			</div>
		</div>
	{/if}
	<div class="flex gap-3 items-center">
		<span class="text-lg font-bold">Dithering</span>
		<input type="checkbox" class="checkbox" bind:checked={config.toDither} />
	</div>
	{#if config.toDither}
		<div class="flex flex-col w-full gap-2 py-5">
			<span class="">Matrix Size</span>
			<div class="input-group">
				<input type="range" class="range range-sm" min="0" max="5" bind:value={config.bayerLevel} />
				<span>{config.bayerLevel}</span>
			</div>
			<span class="">Noise level</span>
			<div class="input-group">
				<input
					type="range"
					class="range range-sm"
					min="2"
					max="256"
					bind:value={config.noiseLevel}
				/>
				<span>{config.noiseLevel}</span>
			</div>
		</div>
	{/if}
	<span class="text-lg font-bold">Colorizing</span>
	<div class="flex flex-col w-full gap-2 py-5">
		<div class="flex gap-3 w-full">
			<span class="text-sm">Lab comparison</span>
			<input type="checkbox" class="checkbox checkbox-sm" bind:checked={config.labComparison} />
		</div>
		<span class="text-xs text-warning"
			>{config.labComparison ? 'Note: very slow to process' : ''}</span
		>
		<div class="input-group">
			<span>Palette</span>
			<select
				bind:value={config.palette}
				class="select select-sm select-bordered outline-none focus:outline-none"
			>
				{#each variants as variant}
					<option value={variant}>{variant}</option>
				{/each}
			</select>
		</div>
	</div>
</div>
