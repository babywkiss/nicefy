<script lang="ts">
	import IconMenu from '~icons/ri/menu-fill';
	import IconDownload from '~icons/ri/download-fill';
	import IconRefresh from '~icons/ri/refresh-line';
	import Config from '$lib/UI/Config.svelte';
	import { process_image, read_image } from '$lib/utils/io';

	let url = '';
	let downloadUrl = '';
	let pixelSize = 1;
	let to_dither = true;
	let bayerLevel = 7;
	let palette: 'mocha' | 'frappe' | 'latte' | 'macchiato' = 'mocha';

	let image: HTMLImageElement;
	let dropping = false;

	const process = async () => {
		let { data, info } = read_image(url);
		const resUrl = process_image(data as Uint8ClampedArray, info, {
			pixelSize,
			to_dither,
			bayer_level: bayerLevel,
			palette
		});
		image.src = resUrl;
		downloadUrl = resUrl;
	};

	const handleFile = (file: File) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onloadend = () => {
			if (!(typeof reader.result === 'string')) return;
			url = reader.result;
			image.src = url;
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
		<div class="navbar bg-base-100 sticky top-0">
			<div class="w-full flex flex-row gap-3 justify-between md:justify-start">
				<label for="my-drawer" class="btn btn-square btn-ghost">
					<IconMenu class="text-lg" />
				</label>
				{#if downloadUrl}
					<a class="btn btn-info btn-square" href={downloadUrl} download="result.png">
						<IconDownload />
					</a>
				{/if}
				{#if url}
					<button class="btn btn-warning" on:click={() => ((url = ''), (downloadUrl = ''))}
						><IconRefresh /></button
					>
				{/if}
			</div>
		</div>
		<img class:hidden={!url} alt="result" bind:this={image} />
		<div
			class:hidden={url}
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
			<Config bind:pixelSize bind:palette bind:bayerLevel bind:to_dither />
			{#if url || true}
				<button class="btn btn-success" on:click={process}>Process</button>
			{/if}
		</ul>
	</div>
</div>
