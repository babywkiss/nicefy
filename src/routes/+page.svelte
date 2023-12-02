<script lang="ts">
	// import ImageSlider from '$lib/ImageSlider.svelte';
	import { twMerge } from 'tailwind-merge';
	import { originalUrl, processedUrl } from './store';

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

<div
	class={!$originalUrl && !$processedUrl
		? 'hidden'
		: 'w-full h-full flex justify-center items-center'}
>
	<img class="h-full object-contain" src={$processedUrl || $originalUrl} alt="" />
	<!-- <ImageSlider beforeUrl={$originalUrl} afterUrl={$processedUrl} class="" /> -->
</div>

<div class="flex w-full h-full justify-center items-center" class:hidden={$originalUrl}>
	<label>
		<div
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
	<!-- <FileDropzone name="files" class="w-3/4 md:w-1/3 h-1/2" bind:files> -->
	<!-- 	<svelte:fragment slot="lead"> -->
	<!-- 		<iconify-icon icon="material-symbols:upload-file-rounded" class="text-3xl" /> -->
	<!-- 	</svelte:fragment> -->
	<!-- 	<svelte:fragment slot="message">Upload image or drop here</svelte:fragment> -->
	<!-- </FileDropzone> -->
</div>
