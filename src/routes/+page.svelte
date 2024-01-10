<script lang="ts">
	import { fly } from 'svelte/transition';
	import DropZone from '$lib/components/drop-zone.svelte';
	import image from '$lib/stores/image';
	import Config from '$lib/components/config.svelte';
	// export let data;
	// console.log(data.palettes[0]);
</script>

<div class="flex h-full w-full">
	{#if $image.originalURL}
		<div transition:fly={{ x: '-100%', opacity: 1 }}>
			<Config />
		</div>
	{/if}
	<div class="grid grid-cols-1 grid-rows-1 h-full w-full">
		{#if $image.originalURL}
			<div
				style="grid-area: 1 / 1;"
				transition:fly={{ y: '100%', opacity: 1 }}
				class="w-full h-full flex justify-center items-center"
			>
				<img class="object-contain h-full" src={$image.originalURL ?? $image.processedURL} alt="" />
			</div>
		{:else}
			<div
				style="grid-area: 1 / 1;"
				transition:fly={{ y: '-100%', opacity: 1 }}
				class="w-full h-full flex justify-center items-center flex-col gap-3"
			>
				<DropZone bind:url={$image.originalURL} />
			</div>
		{/if}
	</div>
</div>
