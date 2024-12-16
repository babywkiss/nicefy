<script lang="ts">
	import type { RGB } from '$lib/filters/colorize';
	import { IconArrowRight, IconGrain, IconPlus, IconTrash } from '@tabler/icons-svelte';
	import ColorPicker, { type LCH } from './ui/color-picker.svelte';
	import FilterCard from './filter-card.svelte';
	import Dropdown from './dropdown.svelte';
	import chroma from 'chroma-js';

	type Props = {
		palette: RGB[];
		targetColor: RGB;
		setTargetColor: (value: RGB) => void;
		stops: RGB[];
		setStops: (value: RGB[]) => void;
		onRemove?: () => any;
	};
	const { onRemove, targetColor, stops, setStops, palette, setTargetColor }: Props = $props();

	let pickedColorIndex = $state<number>();
	let pickerColor = $state<LCH>();
</script>

{#snippet icon()}
	<IconGrain size={16} />
{/snippet}
<FilterCard {onRemove} {icon} title="Gradient">
	<div class="flex w-full flex-col gap-2">
		<div class="flex w-full items-center justify-around pt-8">
			<div class="flex gap-3">
				<ul class="grid h-fit grid-cols-2 flex-wrap gap-1.5">
					{#each palette as { r, g, b }}
						<button
							aria-label="color"
							onclick={() => {
								setTargetColor({ r, g, b });
							}}
							class="group btn btn-circle btn-xs relative overflow-hidden border border-base-content/50 after:absolute after:h-full after:w-full after:bg-base-300 after:opacity-0 hover:after:opacity-50"
							style:background={`rgb(${r},${g},${b})`}
						>
						</button>
					{/each}
				</ul>
				<div
					class="aspect-square w-20 rounded-lg outline outline-1 outline-base-content/50"
					style:background={`rgba(${targetColor.r},${targetColor.g},${targetColor.b},1)`}
				></div>
			</div>
			<IconArrowRight size={30} />
			<div
				class="aspect-square w-20 rounded-lg outline outline-1 outline-base-content/50"
				style={`background:linear-gradient(to right, ${stops
					.map((s) => {
						return `rgba(${s.r},${s.g},${s.b})`;
					})
					.join(',')})`}
			></div>
		</div>
		<span class="text-sm font-bold">Stops</span>
		<ul class="flex gap-1.5">
			{#each stops as { r, g, b }, i}
				{#snippet dropdown()}
					{#if pickerColor}
						<ColorPicker
							onInput={(color) => {
								pickerColor = color;
								setStops(
									stops.map((pC, i) => {
										if (i !== pickedColorIndex) return pC;
										const [r, g, b] = chroma.oklch(color.l, color.c, color.h).rgb();
										return { r, g, b };
									})
								);
							}}
							value={pickerColor}
						/>
					{/if}
				{/snippet}
				<Dropdown
					onClose={() => (pickedColorIndex = undefined)}
					open={i === pickedColorIndex}
					{dropdown}
				>
					<button
						aria-label="color"
						onclick={() => {
							if (pickedColorIndex === i) {
								pickedColorIndex = undefined;
								setStops(stops.filter((_, index) => index !== i));
								return;
							}
							const [l, c, h] = chroma.rgb(r, g, b).oklch();
							pickerColor = { l, c, h };
							pickedColorIndex = i;
						}}
						class:scale-150={i === pickedColorIndex}
						class:mx-1={i === pickedColorIndex}
						class="group btn btn-circle btn-xs relative border border-base-content/50 transition-all after:absolute after:h-full after:w-full after:bg-base-300 after:opacity-0 hover:after:opacity-50"
						style:background={`rgb(${r},${g},${b})`}
					>
						{#if pickedColorIndex === i}
							<IconTrash size={18} class="z-10 opacity-0 group-hover:opacity-100" />
						{/if}
					</button>
				</Dropdown>
			{/each}
			<button
				onclick={() => {
					const rgb: RGB = {
						r: 255,
						g: 255,
						b: 255
					};
					setStops([...stops, rgb]);
					const [l, c, h] = chroma.rgb(rgb.r, rgb.g, rgb.b).oklch();
					pickerColor = { l, c, h };
					setTimeout(() => {
						pickedColorIndex = stops.length - 1;
					});
				}}
				class="btn btn-square btn-primary btn-xs"
			>
				<IconPlus size={14} />
			</button>
		</ul>
	</div>
</FilterCard>
