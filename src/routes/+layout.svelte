<script lang="ts">
	import '@fontsource-variable/fira-code';
	import '../app.css';
	import 'iconify-icon';
	import { onMount } from 'svelte';
	import { getResUrl, read_image } from '$lib/utils/io';
	import { config, originalUrl, processedUrl } from './store';
	import Config from '$lib/Config.svelte';
	import ProcWorker from './processing.worker?worker';
	import themeStore from '$lib/stores/theme';
	import { scale } from 'svelte/transition';

	let procWorker: Worker;
	let lastTookMS: number;
	let loading = false;

	onMount(() => {
		procWorker = new ProcWorker();
		procWorker.onmessage = (data) => {
			const { imageData, tookMS } = data.data;
			lastTookMS = tookMS;
			$processedUrl = getResUrl(imageData);
			loading = false;
		};
	});

	const process = async () => {
		loading = true;
		let { data, info } = read_image($originalUrl);
		procWorker.postMessage({ data, info, config: $config });
	};
</script>

<div class="h-full w-full bg-surface flex select-none overflow-hidden transition-all">
	<div class="bg-basec w-80 p-5 flex flex-col gap-5">
		<div class="flex w-full items-center justify-between">
			<button
				on:click={() => ($themeStore = $themeStore === 'dark' ? 'light' : 'dark')}
				class="text-xl font-bold">✨ Nicefy</button
			>
			<div class="flex items-center gap-1">
				{#if $originalUrl}
					<button
						class="hover:scale-125 transition-all"
						transition:scale
						on:click={() => (($originalUrl = ''), ($processedUrl = ''), (lastTookMS = 0))}
					>
						<iconify-icon class="text-2xl flex text-gold" icon="majesticons:reload-circle" />
					</button>
				{/if}
				{#if $processedUrl}
					<a
						class="hover:scale-125 transition-all"
						transition:scale
						href={$processedUrl}
						download={'niced.png'}
					>
						<iconify-icon
							class="text-3xl flex rotate-180 text-text"
							icon="majesticons:arrow-down-circle"
						/>
					</a>
				{/if}
				{#if $originalUrl}
					<button
						class="hover:scale-125 transition-all"
						transition:scale
						on:click={process}
						disabled={loading}
					>
						<iconify-icon
							class:text-foam={!loading}
							class="text-2xl flex transition-all"
							class:text-gold={loading}
							class:animate-spin={loading}
							icon={loading ? 'majesticons:repeat-circle' : 'majesticons:play-circle'}
						/>
					</button>
				{/if}
			</div>
		</div>
		<Config bind:config={$config} />
	</div>
	<slot />
</div>
<!-- {#if lastTookMS} -->
<!-- 	<span class="hidden md:block">Took {(lastTookMS / 1000).toFixed(2)} sec.</span> -->
<!-- {/if} -->
<!-- 	<button -->
<!-- 		class="btn variant-filled-warning" -->
<!-- 		on:click={} -->
<!-- 	> -->
<!-- 		<iconify-icon icon="ion:reload-circle" /> -->
<!-- 	</button> -->
<!-- {/if} -->
<!-- <slot /> -->
