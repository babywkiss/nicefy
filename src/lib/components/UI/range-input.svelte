<script lang="ts">
	import { createSlider, createTooltip, melt } from '@melt-ui/svelte';
	import { fade } from 'svelte/transition';

	export let label = '';
	export let min = 0;
	export let max = 10;
	export let step = 1;
	export let defaultValue = min + (max - min) / 2;
	export let value = defaultValue;
	export let units = '';
	export let ticked = false;
	let open = false;

	const {
		elements: { trigger, content, arrow }
	} = createTooltip({
		positioning: {
			placement: 'top'
		},
		openDelay: 0,
		closeDelay: 0,
		closeOnPointerDown: false,
		forceVisible: true
	});

	$: ({
		elements: { root, range, thumb, tick },
		states: { value: sliderValue, ticks }
	} = createSlider({
		defaultValue: [defaultValue],
		min,
		max,
		step
	}));

	$: value = $sliderValue[0];
</script>

<span use:melt={$root} class="relative flex h-[20px] w-[200px] items-center">
	<!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
	<label class="absolute text-sm left-0 -top-[calc(50%+5px)]">{label}</label>
	<span class="h-[3px] w-full bg-highlighthigh rounded-lg">
		<span use:melt={$range} class="h-[3px] bg-foam rounded-lg" />
	</span>

	{#if ticked}
		{#each { length: $ticks } as _, i}
			{#if i > 0 && i !== $ticks - 1}
				<span use:melt={$tick()} class="h-[3px] w-[3px] bg-foam/50 data-[bounded]:bg-basec/75" />
			{/if}
		{/each}
	{/if}

	<span
		use:melt={$trigger}
		use:melt={$thumb()}
		on:focus={() => (open = true)}
		on:blur={() => (open = false)}
		class="h-5 w-5 rounded-full bg-subtle focus:outline-none focus:ring-4 focus:!ring-foam/40"
	/>
</span>

{#if open}
	<div
		use:melt={$content}
		transition:fade={{ duration: 100 }}
		class="z-10 rounded-lg bg-surface shadow-text"
	>
		<div use:melt={$arrow} />
		<p class="px-4 py-1 text-sm">
			{value}
			<span class="text-subtle">
				{units}
			</span>
		</p>
	</div>
{/if}
