<script lang="ts">
	import ProcWorker from './processing.worker?worker';

	import IconMenu from '~icons/ri/menu-fill';
	import IconDownload from '~icons/ri/download-fill';
	import IconRefresh from '~icons/ri/refresh-line';
	import Config from '$lib/UI/Config.svelte';
	import ColorBar from '$lib/UI/ColorBar.svelte';
	import ImageSlider from '$lib/UI/ImageSlider.svelte';
	import { getResUrl, read_image } from '$lib/utils/io';
	import { onMount } from 'svelte';

	let procWorker: Worker;

	onMount(() => {
		procWorker = new ProcWorker();
		procWorker.onmessage = (data) => {
			const { imageData, tookMS } = data.data;
			lastTookMS = tookMS;
			processedUrl = getResUrl(imageData);
			loading = false;
		};
	});

	let menuOpen = false;
	let lastTookMS: number;
	let originalUrl = '';
	let processedUrl = '';
	let pixelSize = 3;
	let to_dither = true;
	let bayerLevel = 3;
	let noiseLevel = 32;
	let labComparison = false;
	let rescaleBack = true;
	let palette: 'mocha' | 'frappe' | 'latte' | 'macchiato' = 'mocha';

	let dropping = false;
	let loading = false;

	const process = async () => {
		loading = true;
		menuOpen = false;
		let { data, info } = read_image(originalUrl);
		procWorker.postMessage({
			data,
			info,
			config: {
				pixelSize,
				to_dither,
				bayer_level: bayerLevel,
				labComparison,
				rescaleBack,
				noiseLevel,
				palette
			}
		});
	};

	const handleFile = (file: File) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onloadend = () => {
			if (!(typeof reader.result === 'string')) return;
			originalUrl = reader.result;
		};
	};

	const onDrop = (e: DragEvent) => {
		dropping = false;
		const file = e.dataTransfer?.files[0];
		if (!file) return;
		handleFile(file);
	};

	const onUpload = (e: Event) => {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;
		handleFile(file);
	};
</script>

<div class="drawer drawer-mobile w-full h-full">
	<input id="my-drawer" type="checkbox" class="drawer-toggle" bind:checked={menuOpen} />
	<div class="drawer-content flex flex-col">
		<div class="w-full flex flex-row gap-3 justify-start p-1 items-center">
			<label for="my-drawer" class="btn btn-square btn-ghost md:hidden">
				<IconMenu class="text-lg" />
			</label>
			{#if processedUrl}
				<a class="btn btn-info btn-square" href={processedUrl} download="result.png">
					<IconDownload />
				</a>
			{/if}
			{#if originalUrl}
				<button
					class="btn btn-warning"
					on:click={() => ((originalUrl = ''), (processedUrl = ''), (lastTookMS = 0))}
					><IconRefresh /></button
				>
			{/if}
			{#if loading}
				<span class="loading btn">Processing image...</span>
			{/if}
			<span>{lastTookMS && !loading ? 'Processed in: ' + lastTookMS / 1000 + ' sec.' : ''}</span>
		</div>
		<div class={!originalUrl && !processedUrl ? 'hidden' : 'flex flex-1 overflow-scroll'}>
			<ImageSlider beforeUrl={originalUrl} afterUrl={processedUrl} />
		</div>
		<div
			class:hidden={originalUrl}
			class="flex flex-1 flex-col text-xl items-center justify-center"
			class:bg-success={dropping}
			on:dragenter|preventDefault={(_) => (dropping = true)}
			on:dragleave|preventDefault={(_) => (dropping = false)}
			on:dragover|preventDefault
			on:drop|preventDefault={onDrop}
		>
			<input
				class="file-input file-input-bordered file-input-success file-input-sm"
				type="file"
				class:hidden={dropping}
				on:change={onUpload}
			/>
			<div class="divider" class:hidden={dropping}>or</div>
			<span class="text-xl font-bold"
				>{dropping ? 'Leave mouse button to drop image' : 'Drop here'}</span
			>
		</div>
		<ColorBar {palette} />
	</div>

	<div class="drawer-side">
		<label for="my-drawer" class="drawer-overlay" />
		<ul class="menu p-4 w-80 bg-base-100 text-base-content">
			<Config
				bind:pixelSize
				bind:palette
				bind:rescaleBack
				bind:bayerLevel
				bind:to_dither
				bind:noiseLevel
				bind:labComparison
			/>
			{#if originalUrl}
				<button
					class="btn btn-success"
					class:btn-disabled={loading}
					class:loading
					on:click={process}>{loading ? 'processing' : 'process'}</button
				>
			{/if}
		</ul>
	</div>
</div>
