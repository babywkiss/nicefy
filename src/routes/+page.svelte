<script lang="ts">
	import IconTime from '~icons/ri/time-line';
	import IconPlay from '~icons/ri/play-line';
	import ProcWorker from './processing.worker?worker';

	import IconMenu from '~icons/ri/menu-fill';
	import IconDownload from '~icons/ri/download-fill';
	import IconRefresh from '~icons/ri/refresh-line';
	import Config from '$lib/UI/Config.svelte';
	import ColorBar from '$lib/UI/ColorBar.svelte';
	import ImageSlider from '$lib/UI/ImageSlider.svelte';
	import { getResUrl, read_image } from '$lib/utils/io';
	import { onMount } from 'svelte';
	import type { CATPPUCCIN } from '$lib/utils/palettes';

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

	let config = {
		pixelSize: 1,
		palette: 'mocha' as keyof typeof CATPPUCCIN,
		toDither: true,
		bayerLevel: 3,
		labComparison: false,
		noiseLevel: 27,
		rescaleBack: true
	};

	let menuOpen = false;
	let lastTookMS: number;
	let originalUrl = '';
	let processedUrl = '';

	let dropping = false;
	let loading = false;

	const process = async () => {
		loading = true;
		menuOpen = false;
		let { data, info } = read_image(originalUrl);
		procWorker.postMessage({ data, info, config });
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
		<div class="w-full flex flex-row gap-3 justify-start p-3 items-center flex-wrap">
			<label for="my-drawer" class="btn btn-square btn-ghost md:hidden">
				<IconMenu class="text-lg" />
			</label>
			{#if processedUrl}
				<a class="btn btn-info" href={processedUrl} download="result.png">
					Download
					<IconDownload />
				</a>
			{/if}
			{#if originalUrl}
				<button
					class="btn btn-success"
					class:btn-disabled={loading}
					class:loading
					on:click={process}
				>
					{loading ? 'processing' : 'run'}
					{#if !loading}<IconPlay />{/if}
				</button>
				<button
					class="btn btn-warning"
					on:click={() => ((originalUrl = ''), (processedUrl = ''), (lastTookMS = 0))}
					>Reset<IconRefresh /></button
				>
			{/if}
			{#if lastTookMS}
				<span class="ml-auto">
					<IconTime class="inline" />
					{'Processed in: ' + lastTookMS / 1000 + ' sec.'}
				</span>
			{/if}
		</div>
		<div class={!originalUrl && !processedUrl ? 'hidden' : 'flex flex-1 overflow-scroll'}>
			<ImageSlider beforeUrl={originalUrl} afterUrl={processedUrl} class="w-full" />
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
		<ColorBar palette={config.palette} />
	</div>

	<div class="drawer-side bg-base-100">
		<label for="my-drawer" class="drawer-overlay" />
		<Config bind:config />
	</div>
</div>
