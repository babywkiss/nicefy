<script lang="ts">
	import { IconDropletFilled } from '@tabler/icons-svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Props = {
		min: number;
		max: number;
		value: number;
		hideThumb?: boolean;
		oninput?: (value: number) => void | Promise<void>;
		oninputend?: () => void | Promise<void>;
		oninputstart?: () => void | Promise<void>;
		formatter?: (value: number) => string;
		trackStyle?: string;
		step?: number;
	} & Omit<HTMLButtonAttributes, 'oninput'>;

	const {
		oninput,
		oninputstart,
		oninputend,
		value,
		formatter,
		max,
		min,
		step,
		hideThumb,
		trackStyle,
		...attrs
	}: Props = $props();

	const percent = $derived((value - min) / (max - min));
	let moving = $state(false);
	let pressed = $state(false);
	let ref: HTMLButtonElement;

	const handle = async (e: MouseEvent) => {
		const { left } = ref.getBoundingClientRect();
		const x = e.pageX - left;
		const width = ref.clientWidth;
		const percent = Math.min(Math.max(0, x / width), 1);
		let value = min + (max - min) * percent;
		if (step) value = Math.floor(value / step) * step;
		await oninput?.(value);
	};
</script>

<button
	bind:this={ref}
	onmousedown={async (e) => {
		await oninputstart?.();
		await handle(e);
		pressed = true;
	}}
	{...attrs}
	class="group relative h-2.5 w-full rounded-btn bg-base-100 text-primary"
>
	<div
		style:width={`${percent * 100}%`}
		class:transition-[width]={!moving}
		class="absolute left-0 top-0 h-full rounded-btn bg-current"
		style={trackStyle}
	></div>
	<IconDropletFilled
		size={18}
		style={`left:${percent * 100}%;translate:-50% calc(-100% - 4px)`}
		class={`absolute top-1/2 rotate-180 text-current ${moving ? '' : 'transition-[left]'}`}
	/>
	{#if !hideThumb}
		<div
			style:transition-property={`transform${!moving ? ',left' : ''}`}
			style:left={`${percent * 100}%`}
			style:box-shadow="0 0 1rem oklch(var(--b1))"
			class:scale-100={moving}
			class="absolute -top-2 aspect-square h-5 -translate-x-1/2 -translate-y-full scale-0 rounded-btn border border-base-content/10 bg-base-100 p-0.5 text-xs text-base-content transition-transform group-hover:scale-100"
		>
			{formatter ? formatter(value) : value.toFixed(2)}
		</div>
	{/if}
</button>

<svelte:document
	onmousemove={async (e) => {
		if (!pressed) return;
		moving = true;
		await handle(e);
	}}
	onmouseupcapture={async () => {
		if (moving) await oninputend?.();
		pressed = false;
		moving = false;
	}}
/>
