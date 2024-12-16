<script lang="ts">
	import { IconBrush, IconPlus, IconTrash } from '@tabler/icons-svelte';
	import type { Comparator, RGB } from '$lib/filters/colorize';
	import Select from './ui/select.svelte';
	import ColorPicker, { type LCH } from './ui/color-picker.svelte';
	import FilterCard from './filter-card.svelte';
	import Dropdown from './dropdown.svelte';
	import chroma from 'chroma-js';

	type Props = {
		palette: RGB[];
		comparator: Comparator;
		setPalette: (palette: RGB[]) => void;
		setComparator: (comparator: Comparator) => void;
		onRemove?: () => any;
	};

	const comparatorOptions: { value: Comparator; title: string }[] = [
		{ value: 'squaredDistance', title: 'squaredDistance' },
		{ value: 'deltaE76', title: 'deltaE76' },
		{ value: 'deltaE94', title: 'deltaE94' },
		{ value: 'deltaE20', title: 'deltaE20' }
	];
	const { onRemove, palette, comparator, setPalette, setComparator }: Props = $props();

	let pickedColorIndex = $state<number>();
	let pickerColor = $state<LCH>();
</script>

{#snippet icon()}
	<IconBrush size={16} />
{/snippet}
<FilterCard {onRemove} {icon} title="Colorize">
	<div class="flex w-full items-end justify-between">
		<span class="text-sm font-semibold">Palette</span>
		<div class="flex flex-col items-end gap-1">
			<span class="text-xs font-semibold">Compare Function</span>
			<Select
				onSelect={(v) => {
					setComparator(v);
				}}
				value={comparator}
				options={comparatorOptions}
			/>
		</div>
	</div>
	<ul class="flex w-full items-center gap-1.5">
		{#each palette as { r, g, b }, i}
			{#snippet dropdown()}
				{#if pickerColor}
					<ColorPicker
						onInput={(color) => {
							pickerColor = color;
							setPalette(
								palette.map((pC, i) => {
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
							setPalette(palette.filter((_, index) => index !== i));
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
				setPalette([...palette, rgb]);
				const [l, c, h] = chroma.rgb(rgb.r, rgb.g, rgb.b).oklch();
				pickerColor = { l, c, h };
				setTimeout(() => {
					pickedColorIndex = palette.length - 1;
				});
			}}
			class="btn btn-square btn-primary btn-xs"
		>
			<IconPlus size={14} />
		</button>
	</ul>
</FilterCard>
