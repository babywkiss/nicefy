<script lang="ts">
	import { Accordion, AccordionItem, RangeSlider, SlideToggle } from '@skeletonlabs/skeleton';
	import VirtualScroll from 'svelte-virtual-scroll-list';
	import type { Config } from '$lib/utils/io';
	import palettes from '$lib/utils/palettes';
	import { rgbToHex } from '$lib/utils/helpers';

	export let config: Config;

	let query = '';
</script>

<Accordion autocollapse>
	<AccordionItem>
		<svelte:fragment slot="summary">Pixelization</svelte:fragment>
		<svelte:fragment slot="content">
			<RangeSlider
				name="range-slider"
				bind:value={config.pixelSize}
				min={1}
				max={16}
				step={1}
				ticked
			>
				<div class="flex justify-between items-center">
					<div class="font-bold">Scale</div>
					<div class="text-xs">1 / {config.pixelSize}</div>
				</div>
			</RangeSlider>
			<SlideToggle name="slider-label" bind:checked={config.rescaleBack}
				>keep original size</SlideToggle
			>
		</svelte:fragment>
	</AccordionItem>
	<AccordionItem>
		<svelte:fragment slot="summary">Dithering</svelte:fragment>
		<svelte:fragment slot="content">
			<SlideToggle name="slider-label" bind:checked={config.toDither}>Apply dithering</SlideToggle>
			<RangeSlider
				name="range-slider"
				bind:value={config.bayerLevel}
				min={0}
				max={5}
				step={1}
				ticked
			>
				<div class="flex justify-between items-center">
					<div class="font-bold">Matrix detalization</div>
					<div class="text-xs">{config.bayerLevel}</div>
				</div>
			</RangeSlider>
			<RangeSlider name="range-slider" bind:value={config.noiseLevel} min={0} max={255} step={1}>
				<div class="flex justify-between items-center">
					<div class="font-bold">Noise coefficient</div>
					<div class="text-xs">{config.noiseLevel}</div>
				</div>
			</RangeSlider>
		</svelte:fragment>
	</AccordionItem>
	<AccordionItem>
		<svelte:fragment slot="summary">Colorizing</svelte:fragment>
		<svelte:fragment slot="content">
			<SlideToggle name="slider-label" bind:checked={config.labComparison}
				>Lab Comparison</SlideToggle
			>
			<h5>Palette</h5>
			<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
				<div class="input-group-shim">
					<iconify-icon icon="ri:search-line" />
				</div>
				<input type="search" placeholder="Search..." bind:value={query} />
			</div>
			<h6>Selected: {config.palette.title}</h6>
			<ul class="list h-64">
				<VirtualScroll
					data={query ? palettes.filter((p) => p.title.includes(query)) : palettes}
					key="id"
					let:data
				>
					<button
						class="btn w-full flex-col"
						class:variant-filled-primary={config.palette.id === data.id}
						on:click={() => (config.palette = data)}
					>
						<span>{data.title}</span>
						<div class="flex flex-row w-full">
							{#each data.colors as color}
								<div class="flex h-3 w-full rounded-xl -mx-1" style:background={rgbToHex(color)} />
							{/each}
						</div>
					</button>
				</VirtualScroll>
			</ul>
		</svelte:fragment>
	</AccordionItem>
</Accordion>
