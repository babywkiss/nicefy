<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import VirtualScroll from 'svelte-virtual-scroll-list';
	import type { Config } from '$lib/utils/io';
	import palettes from '$lib/utils/palettes';
	import { rgbToHex } from '$lib/utils/helpers';

	export let config: Config;

	let query = '';
</script>

<div class="flex flex-col gap-3 h-full overflow-auto">
	<div class="flex flex-col gap-2">
		<span class="font-bold">Scalling</span>
		<div class="flex items-center gap-2 w-full">
			<input
				class="w-full range"
				type="range"
				bind:value={config.pixelSize}
				min={1}
				max={16}
				step={1}
			/>
			<span
				class="font-bold w-12 flex justify-center items-center shrink-0 bg-highlightmed rounded-lg px-2 py-1 text-xs"
				>1/{config.pixelSize}</span
			>
		</div>
	</div>
	<div class="flex flex-col">
		<span class="font-bold">Bayer Level</span>
		<div class="flex items-center gap-2 w-full">
			<input
				class="w-full range"
				type="range"
				bind:value={config.bayerLevel}
				min={0}
				max={5}
				step={1}
			/>
			<span
				class="font-bold w-12 flex justify-center items-center shrink-0 bg-highlightmed rounded-lg px-2 py-1 text-xs"
				>{config.bayerLevel}</span
			>
		</div>
	</div>
	<div class="flex flex-col">
		<span class="font-bold">Noise Level</span>
		<div class="flex items-center gap-2 w-full">
			<input
				class="w-full range"
				type="range"
				bind:value={config.noiseLevel}
				min={0}
				max={255}
				step={1}
			/>
			<span
				class="font-bold w-12 flex justify-center items-center shrink-0 bg-highlightmed rounded-lg px-2 py-1 text-xs"
				>{config.noiseLevel}</span
			>
		</div>
	</div>
	<div class="flex flex-col gap-1">
		<span class="font-bold">Options</span>
		<div class="flex flex-wrap gap-2 items-center">
			<button
				on:click={() => (config.rescaleBack = !config.rescaleBack)}
				class={twMerge(
					'transition-all rounded-lg bg-highlightmed hover:bg-highlightlow px-3 py-1 text-xs',
					config.rescaleBack && 'bg-foam hover:bg-foam/80 text-basec'
				)}>Rescale Back</button
			>
			<button
				on:click={() => (config.toDither = !config.toDither)}
				class={twMerge(
					'transition-all rounded-lg bg-highlightmed hover:bg-highlightlow px-3 py-1 text-xs',
					config.toDither && 'bg-foam hover:bg-foam/80 text-basec'
				)}>Apply Dithering</button
			>
			<button
				on:click={() => (config.labComparison = !config.labComparison)}
				class={twMerge(
					'transition-all rounded-lg bg-highlightmed hover:bg-highlightlow px-3 py-1 text-xs',
					config.labComparison && 'bg-foam hover:bg-foam/80 text-basec'
				)}>Lab Comparison</button
			>
		</div>
	</div>
	<div class="flex flex-col overflow-auto gap-2">
		<span class="font-bold">Palette</span>
		<input class="input" placeholder="🔎 Search by title" type="search" bind:value={query} />
		<ul class="flex flex-col overflow-auto rounded-lg">
			<VirtualScroll
				data={query
					? palettes.filter((p) =>
							p.title.toLowerCase().trim().includes(query.toLowerCase().trim())
					  )
					: palettes}
				key="id"
				let:data
			>
				<button
					class={twMerge(
						'border border-highlightlow transition-all flex flex-col w-full bg-highlightlow rounded-lg pt-3 gap-1 mb-3 hover:bg-highlightmed',
						data.title === config.palette.title &&
							'bg-foam text-basec font-bold hover:bg-foam/80 border-foam'
					)}
					on:click={() => (config.palette = data)}
				>
					<span class="px-3">{data.title}</span>
					<div class="flex w-full h-5">
						{#each data.colors as color}
							<div
								class="flex h-full w-full last:rounded-br-lg first:rounded-bl-lg"
								style:background={rgbToHex(color)}
							/>
						{/each}
					</div>
				</button>
			</VirtualScroll>
		</ul>
	</div>
</div>
