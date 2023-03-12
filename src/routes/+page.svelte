<script lang="ts">
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import ImageSlider from '$lib/ImageSlider.svelte';
	import { originalUrl, processedUrl } from './store';

	let files: FileList;

	$: if (files?.[0]) {
		const reader = new FileReader();
		reader.readAsDataURL(files[0]);
		reader.onloadend = () => {
			if (!(typeof reader.result === 'string')) return;
			$originalUrl = reader.result;
		};
	}
</script>

<div class={!$originalUrl && !$processedUrl ? 'hidden' : ''}>
	<ImageSlider beforeUrl={$originalUrl} afterUrl={$processedUrl} class="" />
</div>

<div class="flex w-full h-full justify-center items-center" class:hidden={$originalUrl}>
	<FileDropzone name="files" class="w-3/4 md:w-1/3 h-1/2" bind:files>
		<svelte:fragment slot="lead">
			<iconify-icon icon="material-symbols:upload-file-rounded" class="text-3xl" />
		</svelte:fragment>
		<svelte:fragment slot="message">Upload image or drop here</svelte:fragment>
	</FileDropzone>
</div>
