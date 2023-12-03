<script lang="ts">
	// import Imageslider from '$lib/ImageSlider.svelte';
	import { twMerge } from 'tailwind-merge';
	import { originalUrl, processedUrl } from './store';
	import { slide } from 'svelte/transition';

	let files: FileList;

	const handleFile = (file: File) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onloadend = () => {
			if (!(typeof reader.result === 'string')) return;
			$originalUrl = reader.result;
		};
	};

	$: if (files?.[0]) handleFile(files[0]);

	let dragging = false;
	const handleDrop = (e: DragEvent) => {
		dragging = false;
		if (e.dataTransfer?.items) {
			for (const item of e.dataTransfer.items) {
				if (item.kind === 'file') {
					const file = item.getAsFile();
					if (file) {
						handleFile(file);
						break;
					}
				}
			}
		} else if (e.dataTransfer?.files) {
			for (const file of e.dataTransfer.files) {
				handleFile(file);
				break;
			}
		}
	};
</script>

<div class="grid grid-cols-1 grid-rows-1 h-full w-full">
	{#if $originalUrl}
		<div
			style="grid-area: 1 / 1;"
			transition:slide
			class="w-full h-full flex justify-center items-center"
		>
			<img class="object-contain h-full" src={$processedUrl || $originalUrl} alt="" />
		</div>
	{:else}
		<div
			style="grid-area: 1 / 1;"
			transition:slide
			class="w-full h-full flex justify-center items-center"
		>
			<label style="grid-area: 1 / 1">
				<div
					role="button"
					tabindex="0"
					on:dragenter={() => (dragging = true)}
					on:drop|preventDefault={handleDrop}
					on:dragleave={() => (dragging = false)}
					on:dragover|preventDefault={() => (dragging = true)}
					class={twMerge(
						'transition-all text-subtle hover:text-foam hover:bg-basec hover:border-foam p-5 gap-5 flex flex-col justify-center items-center h-96 bg-highlightlow aspect-square rounded-lg cursor-pointer border-2 border-dashed border-highlighthigh',
						dragging && 'text-foam border-foam'
					)}
				>
					<iconify-icon class="text-7xl" icon="majesticons:image-plus" />
					<span class="text-center text-2xl font-bold">Press this button or drop image here</span>
				</div>
				<input class="hidden" accept="image/*" type="file" bind:files />
			</label>
		</div>
	{/if}
</div>
