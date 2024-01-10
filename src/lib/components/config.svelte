<script lang="ts">
	import config from '$lib/stores/config';
	import RangeInput from '$lib/components/UI/range-input.svelte';
	import Switch from '$lib/components/UI/switch.svelte';
	import Select from '$lib/components/UI/select.svelte';

	import image from '$lib/stores/image';

	let height = 4;

	$: {
		if ($image.originalURL) {
			let t = new Image();
			console.log($image.originalURL);
			t.onload = () => (height = t.height);
			t.src = $image.originalURL;
		}
	}
</script>

<div class="flex flex-col gap-5 p-5">
	<RangeInput
		label="Height"
		min={1}
		max={height}
		defaultValue={height / 2}
		units="px"
		bind:value={$config.height}
	/>
	<Switch label="Apply Dithering" bind:value={$config.applyDithering} />
	{#if $config.applyDithering}
		<RangeInput label="Bayer Level" max={5} units="lvl" ticked bind:value={$config.bayerLevel} />
		<RangeInput label="Noise" units="%" min={0} max={255} bind:value={$config.noisePercent} />
	{/if}
	<Select
		label="Color Comparison"
		options={[
			{ value: 'square', label: 'Square Distance' },
			{ value: 'delta76', label: 'DeltaE 1976' },
			{ value: 'delta94', label: 'DeltaE 1994' },
			{ value: 'delta2000', label: 'DeltaE 2000' }
		]}
		bind:value={$config.comparisonFn}
	/>
</div>
<!-- <script lang="ts"> -->
<!-- 	import { twMerge } from 'tailwind-merge'; -->
<!-- 	import VirtualScroll from 'svelte-virtual-scroll-list'; -->
<!-- 	import palettes from '$lib/utils/palettes'; -->
<!-- 	import { rgbToHex } from '$lib/utils/helpers'; -->
<!-- 	import { maxHeight } from '../routes/store'; -->
<!---->
<!-- 	export let config: Config; -->
<!---->
<!-- 	let query = ''; -->
<!-- 	const colorQuantityOptions = ['2', '3', '4', '5', '5+', 'All'] as const; -->
<!-- 	let colorQuantityOption: (typeof colorQuantityOptions)[number] = 'All'; -->
<!---->
<!-- 	$: filtered = -->
<!-- 		query || colorQuantityOption !== 'All' -->
<!-- 			? palettes.filter((p) => { -->
<!-- 					const titleMatch = p.title.toLowerCase().trim().includes(query.toLowerCase().trim()); -->
<!-- 					const quantityMatch = -->
<!-- 						colorQuantityOption === 'All' -->
<!-- 							? true -->
<!-- 							: colorQuantityOption === '5+' -->
<!-- 							  ? p.colors.length >= 5 -->
<!-- 							  : p.colors.length === Number(colorQuantityOption); -->
<!-- 					return titleMatch && quantityMatch; -->
<!-- 			  }) -->
<!-- 			: palettes; -->
<!-- </script> -->
<!---->
<!-- <div class="flex flex-col gap-3 h-full overflow-auto"> -->
<!-- 	<div class="flex flex-col gap-2"> -->
<!-- 		<span class="font-bold">Height</span> -->
<!-- 		<div class="flex items-center gap-2 w-full"> -->
<!-- 			<input -->
<!-- 				class="w-full range" -->
<!-- 				type="range" -->
<!-- 				bind:value={config.newHeight} -->
<!-- 				min={4} -->
<!-- 				max={$maxHeight} -->
<!-- 				step={1} -->
<!-- 			/> -->
<!-- 			<span -->
<!-- 				class="font-bold w-12 flex justify-center items-center shrink-0 bg-highlightmed rounded-lg px-2 py-1 text-xs" -->
<!-- 				>{config.newHeight} px</span -->
<!-- 			> -->
<!-- 		</div> -->
<!-- 	</div> -->
<!-- 	<div class="flex flex-col"> -->
<!-- 		<span class="font-bold">Bayer Level</span> -->
<!-- 		<div class="flex items-center gap-2 w-full"> -->
<!-- 			<input -->
<!-- 				class="w-full range" -->
<!-- 				type="range" -->
<!-- 				bind:value={config.bayerLevel} -->
<!-- 				min={0} -->
<!-- 				max={5} -->
<!-- 				step={1} -->
<!-- 			/> -->
<!-- 			<span -->
<!-- 				class="font-bold w-12 flex justify-center items-center shrink-0 bg-highlightmed rounded-lg px-2 py-1 text-xs" -->
<!-- 				>{config.bayerLevel}</span -->
<!-- 			> -->
<!-- 		</div> -->
<!-- 	</div> -->
<!-- 	<div class="flex flex-col"> -->
<!-- 		<span class="font-bold">Noise Level</span> -->
<!-- 		<div class="flex items-center gap-2 w-full"> -->
<!-- 			<input -->
<!-- 				class="w-full range" -->
<!-- 				type="range" -->
<!-- 				bind:value={config.noiseLevel} -->
<!-- 				min={0} -->
<!-- 				max={255} -->
<!-- 				step={1} -->
<!-- 			/> -->
<!-- 			<span -->
<!-- 				class="font-bold w-12 flex justify-center items-center shrink-0 bg-highlightmed rounded-lg px-2 py-1 text-xs" -->
<!-- 				>{config.noiseLevel}</span -->
<!-- 			> -->
<!-- 		</div> -->
<!-- 	</div> -->
<!-- 	<div class="flex flex-col gap-1"> -->
<!-- 		<span class="font-bold">Options</span> -->
<!-- 		<div class="flex flex-wrap gap-2 items-center"> -->
<!-- 			<button -->
<!-- 				on:click={() => (config.toDither = !config.toDither)} -->
<!-- 				class={twMerge('chip', config.toDither && 'chip-active')}>Dithering</button -->
<!-- 			> -->
<!-- 			<button -->
<!-- 				on:click={() => (config.labComparison = !config.labComparison)} -->
<!-- 				class={twMerge('chip', config.labComparison && 'chip-active')}>Lab Comparison</button -->
<!-- 			> -->
<!-- 		</div> -->
<!-- 	</div> -->
<!-- 	<div class="flex flex-col overflow-auto gap-2"> -->
<!-- 		<span class="font-bold">Palette</span> -->
<!-- 		<input class="input" placeholder="🔎 Search by title" type="search" bind:value={query} /> -->
<!-- 		<div class="flex gap-1"> -->
<!-- 			{#each colorQuantityOptions as option} -->
<!-- 				<button -->
<!-- 					on:click={() => (colorQuantityOption = option)} -->
<!-- 					class={twMerge('chip', option === colorQuantityOption && 'chip-active')}>{option}</button -->
<!-- 				> -->
<!-- 			{/each} -->
<!-- 		</div> -->
<!-- 		<ul class="flex flex-col overflow-auto rounded-lg"> -->
<!-- 			<VirtualScroll data={filtered} key="id" let:data> -->
<!-- 				<button -->
<!-- 					class={twMerge( -->
<!-- 						'border border-highlightlow transition-all flex flex-col w-full bg-highlightlow rounded-lg pt-3 gap-1 mb-3 hover:bg-highlightmed', -->
<!-- 						data.title === config.palette.title && -->
<!-- 							'bg-foam text-basec font-bold hover:bg-foam/80 border-foam' -->
<!-- 					)} -->
<!-- 					on:click={() => (config.palette = data)} -->
<!-- 				> -->
<!-- 					<span class="px-3">{data.title}</span> -->
<!-- 					<div class="flex w-full h-5"> -->
<!-- 						{#each data.colors as color} -->
<!-- 							<div -->
<!-- 								class="flex h-full w-full last:rounded-br-lg first:rounded-bl-lg" -->
<!-- 								style:background={rgbToHex(color)} -->
<!-- 							/> -->
<!-- 						{/each} -->
<!-- 					</div> -->
<!-- 				</button> -->
<!-- 			</VirtualScroll> -->
<!-- 		</ul> -->
<!-- 	</div> -->
<!-- </div> -->
