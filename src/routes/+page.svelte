<script lang="ts">
	import ColorizeConfig from '$lib/components/colorize-config.svelte';
	import DitherConfig from '$lib/components/dither-config.svelte';
	import GradientConfig from '$lib/components/gradient-config.svelte';
	import ScaleConfig from '$lib/components/scale-config.svelte';
	import SortableList from '$lib/components/ui/sortable-list.svelte';
	import type { RGB } from '$lib/filters/colorize';
	import type { FilterChain } from '$lib/filters/processing.worker';
	import { imageDataFromUrl, processInWorker, urlFromImageData } from '$lib/utils';
	import { IconDownload, IconLivePhoto, IconLivePhotoOff } from '@tabler/icons-svelte';
	import { slide } from 'svelte/transition';

	let url = $state('https://i.imgur.com/sDKeQnb.jpeg');
	let resultUrl = $state<string>();
	let loading = $state(false);
	let liveMode = $state(false);
	let originalHeight = $state<number>();

	let filterChain = $state<(FilterChain[number] & { id: string })[]>([
		{ id: crypto.randomUUID(), type: 'scale', targetHeight: 0 },
		{ id: crypto.randomUUID(), type: 'dither', noiseFactor: 0.5, bayerLevel: 3 },
		{
			id: crypto.randomUUID(),
			type: 'colorize',
			palette: [
				{ r: 25, g: 23, b: 36 },
				{ r: 38, g: 35, b: 58 },
				{ r: 224, g: 222, b: 244 }
			],
			comparator: 'squaredDistance'
		},
		{
			id: crypto.randomUUID(),
			type: 'gradient',
			gradient: {
				targetColor: { r: 25, g: 23, b: 36 },
				stops: [
					{ r: 156, g: 207, b: 216 },
					{ r: 235, g: 111, b: 146 }
				],
				direction: 'horizontal'
			}
		},
		{
			id: crypto.randomUUID(),
			type: 'gradient',
			gradient: {
				targetColor: { r: 25, g: 23, b: 36 },
				stops: [
					{ r: 156, g: 207, b: 216 },
					{ r: 235, g: 111, b: 146 }
				],
				direction: 'horizontal'
			}
		},
		{
			id: crypto.randomUUID(),
			type: 'gradient',
			gradient: {
				targetColor: { r: 25, g: 23, b: 36 },
				stops: [
					{ r: 156, g: 207, b: 216 },
					{ r: 235, g: 111, b: 146 }
				],
				direction: 'horizontal'
			}
		},
		{ id: crypto.randomUUID(), type: 'scale', targetHeight: 0 }
	]);

	const process = async (filterChain: FilterChain) => {
		loading = true;
		const imageData = await imageDataFromUrl(url);
		const response = await processInWorker({
			data: imageData,
			filterChain
		});
		resultUrl = urlFromImageData(response);
		URL.revokeObjectURL(resultUrl);
		loading = false;
	};

	$effect(() => {
		if (!liveMode) return;
		process($state.snapshot(filterChain));
	});
</script>

<div class="relative flex h-full w-full gap-5 p-5">
	<a
		download="dithered.png"
		href={resultUrl}
		class="btn btn-square btn-ghost btn-lg absolute right-4 top-4"
	>
		<IconDownload size={40} />
	</a>
	<div class="relative flex h-full w-80 shrink-0 flex-col gap-3 rounded-box bg-base-200 p-3">
		<input bind:value={url} placeholder="Image url" class="input" />
		<div class="no-scrollbar h-full overflow-auto">
			<SortableList
				keyFn={(filter) => filter.id}
				onReorder={(from, to) => {
					const filter = filterChain[from];
					const spliced = filterChain.toSpliced(from, 1);
					const inserted = spliced.toSpliced(to, 0, filter);
					filterChain = inserted;
				}}
				triggerSelector=".filter-drag"
				items={filterChain}
				class="relative flex flex-col"
			>
				<!-- <div class="absolute left-8 w-0.5 h-full bg-primary"></div> -->
				{#snippet children(filter, i)}
					{#if filter.type === 'scale'}
						{@const prevScaleFilter = filterChain.findLast(
							(f, index) => index < i && f.type === 'scale'
						)}
						{@const currentHeight =
							prevScaleFilter?.type === 'scale' ? prevScaleFilter.targetHeight : originalHeight}
						<ScaleConfig
							onRemove={() => (filterChain = filterChain.filter((f) => f.id !== filter.id))}
							currentHeight={currentHeight ?? 0}
							originalHeight={7000}
							targetHeight={filter.targetHeight}
							setTargetHeight={(value) => {
								filter.targetHeight = value;
							}}
						/>
					{:else if filter.type === 'dither'}
						<DitherConfig
							onRemove={() => (filterChain = filterChain.filter((f) => f.id !== filter.id))}
							noiseFactor={filter.noiseFactor}
							bayerLevel={filter.bayerLevel}
							setNoiseFactor={(v) => {
								filter.noiseFactor = v;
							}}
							setBayerLevel={(v) => {
								filter.bayerLevel = v;
							}}
						/>
					{:else if filter.type === 'colorize'}
						<ColorizeConfig
							onRemove={() => (filterChain = filterChain.filter((f) => f.id !== filter.id))}
							palette={filter.palette}
							comparator={filter.comparator}
							setComparator={(v) => {
								filter.comparator = v;
							}}
							setPalette={(v) => {
								filter.palette = v;
							}}
						/>
					{:else if filter.type === 'gradient'}
						{@const palette = filterChain.reduce((acc, filter) => {
							if (filter.type === 'colorize') {
								acc.push(...filter.palette);
							}
							return acc;
						}, [] as RGB[])}
						<GradientConfig
							onRemove={() => (filterChain = filterChain.filter((f) => f.id !== filter.id))}
							{palette}
							targetColor={filter.gradient.targetColor}
							stops={filter.gradient.stops}
							setTargetColor={(value) => {
								filter.gradient.targetColor = value;
							}}
							setStops={(value) => {
								filter.gradient.stops = value;
							}}
						/>
					{/if}
				{/snippet}
			</SortableList>
		</div>
		<div class="flex w-full items-center gap-1.5">
			{#if !liveMode}
				<button
					disabled={loading}
					onclick={async () => {
						await process($state.snapshot(filterChain));
					}}
					class="btn btn-info btn-sm flex-1"
					>RUN
					{#if loading}
						<div transition:slide={{ duration: 230, axis: 'x' }} class="loading"></div>
					{/if}
				</button>
			{:else}
				<span class="flex-1 font-bold text-info">Running in Live Mode</span>
			{/if}
			<div class="flex flex-col items-center">
				<button
					onclick={() => (liveMode = !liveMode)}
					class:text-info={liveMode}
					class="btn btn-circle btn-ghost btn-xs"
				>
					{#if liveMode}
						<IconLivePhoto class={`${loading ? 'animate-spin' : ''}`} />
					{:else}
						<IconLivePhotoOff class={`${loading ? 'animate-spin' : ''}`} />
					{/if}
				</button>
				<span class="text-xs text-base-content/70">Live</span>
			</div>
		</div>
	</div>
	<div class="flex h-full w-full items-center justify-center">
		<img
			onload={(e) => {
				if (!resultUrl) {
					originalHeight = (e.currentTarget as HTMLImageElement).naturalHeight;
					for (const filter of filterChain)
						if (filter.type === 'scale') filter.targetHeight = originalHeight;
				}
			}}
			alt="original"
			class="h-full w-full rounded-box object-contain"
			style:image-rendering="pixelated"
			src={resultUrl ?? url}
		/>
	</div>
</div>
