<script lang="ts">
	import { IconArrowRight, IconSelector } from '@tabler/icons-svelte';
	import Range from './ui/range.svelte';
	import FilterCard from './filter-card.svelte';

	type Props = {
		currentHeight: number;
		targetHeight: number;
		originalHeight: number;
		setTargetHeight: (targetHeight: number) => void;
		onRemove?: () => any;
	};

	const { onRemove, targetHeight, setTargetHeight, originalHeight, currentHeight }: Props =
		$props();
</script>

{#snippet icon()}
	<IconSelector size={16} />
{/snippet}
<FilterCard {onRemove} {icon} title="Scale">
	<div class="flex w-fit items-center">
		<div class="flex items-center gap-1.5 font-semibold">
			<div class="rounded-lg border border-base-content/30 bg-base-100 px-1.5 py-0.5">
				<span class="flex gap-0.5 text-sm font-normal opacity-70">
					{currentHeight}
					<span class="text-xs"> px </span>
				</span>
			</div>
			<IconArrowRight />
			<div
				class="flex gap-0.5 rounded-lg border border-primary/40 bg-base-100 px-1.5 py-0.5 focus-within:border-primary"
			>
				<input
					oninput={(e) => {
						const current = parseFloat(e.currentTarget.value || '0');
						if (!isNaN(current) && current <= originalHeight) {
							setTargetHeight(current);
						}
						e.currentTarget.value = targetHeight.toString();
					}}
					style:width={`${Math.max(originalHeight.toString().length, targetHeight.toString().length)}ch`}
					value={targetHeight}
					class="bg-transparent text-end text-sm font-normal caret-primary focus:outline-none"
					contenteditable
				/>
				<span class="text-xs font-normal"> px </span>
			</div>
		</div>
	</div>
	<Range
		hideThumb
		step={4}
		min={4}
		formatter={(v) => `${v.toFixed(0)}px`}
		max={originalHeight}
		value={targetHeight}
		oninput={(value) => {
			setTargetHeight(value);
		}}
	/>
</FilterCard>
