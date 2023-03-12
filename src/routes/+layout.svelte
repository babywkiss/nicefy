<script lang="ts">
	import '../theme.postcss';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';
	import 'iconify-icon';
	import { onMount } from 'svelte';
	import { getResUrl, read_image } from '$lib/utils/io';
	import { config, originalUrl, processedUrl } from './store';
	import { AppShell, AppBar, Drawer, drawerStore } from '@skeletonlabs/skeleton';
	import Config from '$lib/Config.svelte';
	import ProcWorker from './processing.worker?worker';

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

<Drawer width="w-3/4 md:w-1/4">
	<AppBar>
		<svelte:fragment slot="lead">
			<iconify-icon icon="material-symbols:settings" />
		</svelte:fragment>
		Settings
		<svelte:fragment slot="trail">
			<button class="btn-icon" on:click={drawerStore.close}>
				<iconify-icon icon="material-symbols:close" />
			</button>
		</svelte:fragment>
	</AppBar>

	<Config bind:config={$config} />
</Drawer>
<AppShell ...>
	<svelte:fragment slot="header">
		<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
			<svelte:fragment slot="lead">
				<button class="btn-icon" on:click={() => drawerStore.open()}>
					<iconify-icon icon="charm:menu-hamburger" />
				</button>
			</svelte:fragment>
			Nicefy
			<svelte:fragment slot="trail">
				{#if lastTookMS}
					<span class="hidden md:block">Took {(lastTookMS / 1000).toFixed(2)} sec.</span>
				{/if}
				{#if $originalUrl}
					<button class="btn variant-filled-success" on:click={process} class:disabled={loading}>
						{#if !loading}
							<iconify-icon icon="material-symbols:play-arrow-rounded" />
						{:else}
							<iconify-icon icon="line-md:loading-loop" />
						{/if}
					</button>
					<button
						class="btn variant-filled-warning"
						on:click={() => (($originalUrl = ''), ($processedUrl = ''), (lastTookMS = 0))}
					>
						<iconify-icon icon="ion:reload-circle" />
					</button>
				{/if}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<slot />
</AppShell>slot />
