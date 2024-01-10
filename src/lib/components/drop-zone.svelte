<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	let files: FileList;
	export let url: string | null = null;

	let dragging = false;

	const handleFile = (file: File) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onloadend = () => {
			if (!(typeof reader.result === 'string')) return;
			url = reader.result;
		};
	};

	const handleDrop = (e: DragEvent) => {
		dragging = false;
		const file = e.dataTransfer?.files?.[0];
		if (file) handleFile(file);
	};

	$: if (files?.[0]) handleFile(files[0]);
</script>

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
