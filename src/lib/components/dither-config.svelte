<script lang="ts">
	import { IconGridDots } from '@tabler/icons-svelte';
	import Range from './ui/range.svelte';
	import FilterCard from './filter-card.svelte';

	type Props = {
		bayerLevel: number;
		setBayerLevel: (bayerLevel: number) => void;
		noiseFactor: number;
		setNoiseFactor: (noiseFactor: number) => void;
		onRemove?: () => any;
	};

	const { onRemove, bayerLevel, setBayerLevel, noiseFactor, setNoiseFactor }: Props = $props();
</script>

{#snippet icon()}
	<IconGridDots size={16} />
{/snippet}
<FilterCard {onRemove} {icon} title="Dither">
	<div class="flex items-center justify-end">
		<div class="flex items-center gap-1.5 font-semibold">
			<span class="text-sm">Noise</span>
			<div
				class="flex gap-0.5 rounded-lg border border-primary/40 bg-base-100 px-1.5 py-0.5 focus-within:border-primary"
			>
				<input
					oninput={(e) => {
						const current = parseFloat(e.currentTarget.value || '0') / 100;
						if (!isNaN(current) && current >= 0 && current <= 1) {
							setNoiseFactor(current);
						}
						e.currentTarget.value = noiseFactor.toString();
					}}
					style:width="3ch"
					value={Math.floor(noiseFactor * 100)}
					class="bg-transparent text-end text-sm font-normal caret-primary focus:outline-none"
					contenteditable
				/>
				<span class="text-xs font-normal"> % </span>
			</div>
		</div>
	</div>
	<Range
		hideThumb
		step={1}
		min={0}
		formatter={(v) => `${v.toFixed(0)}%`}
		max={100}
		value={noiseFactor * 100}
		oninput={(value) => {
			setNoiseFactor(value / 100);
		}}
	/>
	<div class="flex w-full items-center gap-3">
		<span class="shrink-0 text-sm font-semibold">Bayer Level</span>
		<ul class="flex w-full items-center gap-1">
			{#each Array(4) as _, n}
				<li class="flex-1">
					<button
						onclick={() => {
							setBayerLevel(n);
						}}
						class:btn-primary={n === bayerLevel}
						class="btn btn-xs w-full">{n}</button
					>
				</li>
			{/each}
		</ul>
	</div>
</FilterCard>
