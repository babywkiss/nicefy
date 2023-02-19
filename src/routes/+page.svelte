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
			const imageData = data.data;
			processedUrl = getResUrl(imageData);
			loading = false;
		};
	});

	let originalUrl = '';
	let processedUrl = '';
	let pixelSize = 1;
	let to_dither = true;
	let bayerLevel = 3;
	let noiseLevel = 32;
	let palette: 'mocha' | 'frappe' | 'latte' | 'macchiato' = 'mocha';

	let dropping = false;
	let loading = false;

	const process = async () => {
		loading = true;
		let { data, info } = read_image(originalUrl);
		procWorker.postMessage({
			data,
			info,
			config: {
				pixelSize,
				to_dither,
				bayer_level: bayerLevel,
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

<div class="drawer">
	<input id="my-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col items-center">
		<div class="fixed navbar bg-base-100 top-0 flex flex-col z-10">
			<div class="w-full flex flex-row gap-3 justify-between md:justify-start">
				<label for="my-drawer" class="btn btn-square btn-ghost">
					<IconMenu class="text-lg" />
				</label>
				{#if processedUrl}
					<a class="btn btn-info btn-square" href={processedUrl} download="result.png">
						<IconDownload />
					</a>
				{/if}
				{#if originalUrl}
					<button class="btn btn-warning" on:click={() => ((originalUrl = ''), (processedUrl = ''))}
						><IconRefresh /></button
					>
				{/if}
			</div>
		</div>
		{#if processedUrl || true}
			<ColorBar class="fixed bottom-0 z-10" {palette} />
		{/if}
		<!-- <img -->
		<!-- class:hidden={!originalUrl && !processedUrl} -->
		<!-- alt="result" -->
		<!-- src={processedUrl || originalUrl} -->
		<!-- /> -->
		<ImageSlider
			class={'w-full h-full' + (!originalUrl && !processedUrl ? ' hidden' : '')}
			beforeUrl={originalUrl}
			afterUrl={processedUrl}
		/>
		<div
			class:hidden={originalUrl}
			class="border-4 w-96 h-96 flex flex-col text-xl items-center justify-center rounded-xl m-auto"
			class:border-green-300={dropping}
			on:dragenter|preventDefault={(_) => (dropping = true)}
			on:dragleave|preventDefault={(_) => (dropping = false)}
			on:dragover|preventDefault
			on:drop|preventDefault={onDrop}
		>
			<input
				class="file-input file-input-bordered file-input-success file-input-sm"
				type="file"
				on:change={onUpload}
			/>
			<div class="divider">or</div>
			<span class="text-xl font-bold">Drop here</span>
		</div>
	</div>
	<div class="drawer-side">
		<label for="my-drawer" class="drawer-overlay" />
		<ul class="menu p-4 w-80 bg-base-100 text-base-content">
			<Config bind:pixelSize bind:palette bind:bayerLevel bind:to_dither bind:noiseLevel />
			{#if originalUrl}
				<button
					class="btn btn-success"
					class:btn-disabled={loading}
					class:loading
					on:click={process}>Process</button
				>
			{/if}
		</ul>
	</div>
</div>
