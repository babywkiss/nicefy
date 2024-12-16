<script module lang="ts">
	export type LCH = {
		l: number;
		c: number;
		h: number;
	};
</script>

<script lang="ts">
	import Range from './range.svelte';

	type Props = {
		value: LCH;
		onInput?: (lch: LCH) => void | Promise<void>;
	};

	const { value, onInput }: Props = $props();
</script>

<div class="flex w-48 items-center gap-2 pt-3">
	<div class="flex w-full flex-col gap-2">
		<div class="flex items-center gap-2">
			<div
				class="flex aspect-square w-6 items-center justify-center rounded-lg bg-primary p-1 text-xs text-base-300"
			>
				H
			</div>
			<Range
				trackStyle="opacity:0"
				style={`background:linear-gradient(to right, ${Array.from(
					{ length: 10 },
					(_, i) => (i + 1) * 36
				)
					.map((step) => `oklch(${value.l} ${value.c} ${step})`)
					.join(',')})`}
				oninput={(h) => {
					onInput?.({ ...value, h });
				}}
				value={value.h}
				min={0}
				max={360}
			/>
		</div>
		<div class="flex items-center gap-3">
			<div
				class="flex aspect-square w-6 items-center justify-center rounded-lg bg-primary p-1 text-xs text-base-300"
			>
				L
			</div>
			<Range
				style={`background:linear-gradient(to right, oklch(0 ${value.c} ${value.h}) 0%, oklch(1 ${value.c} ${value.h}) 100%)`}
				trackStyle="opacity:0"
				oninput={(l) => {
					onInput?.({ ...value, l });
				}}
				value={value.l}
				min={0}
				max={1}
			/>
		</div>
		<div class="flex items-center gap-3">
			<div
				class="flex aspect-square w-6 items-center justify-center rounded-lg bg-primary p-1 text-xs text-base-300"
			>
				C
			</div>
			<Range
				style={`background:linear-gradient(to right, oklch(${value.l} 0 ${value.h}) 0%, oklch(${value.l} 0.37 ${value.h}) 100%)`}
				trackStyle="opacity:0"
				oninput={(c) => {
					onInput?.({ ...value, c });
				}}
				value={value.c}
				min={0}
				max={0.4}
			/>
		</div>
	</div>
</div>
