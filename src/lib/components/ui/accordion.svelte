<script lang="ts">
	import { IconChevronDown } from '@tabler/icons-svelte';
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';

	type Props = {
		children?: Snippet;
		header?: string | Snippet;
		open?: boolean;
		onToggle?: () => void | Promise<void>;
	};

	const { children, header, open = false, onToggle }: Props = $props();
</script>

<div class="flex flex-col rounded-box bg-base-200">
	<button class="flex w-full gap-3 px-5 py-3" onclick={() => onToggle?.()}>
		{#if typeof header === 'string'}
			<span class="font-semibold">
				{header}
			</span>
		{:else}
			{@render header?.()}
		{/if}
		<IconChevronDown class={`transition-transform ${open ? 'rotate-180' : ''}`} />
	</button>
	{#if open}
		<div
			onintrostart={(e) => {
				e.currentTarget.style.overflow = 'hidden';
			}}
			onoutrostart={(e) => {
				e.currentTarget.style.overflow = 'hidden';
			}}
			onintroend={(e) => {
				e.currentTarget.style.overflow = '';
			}}
			onoutroend={(e) => {
				e.currentTarget.style.overflow = '';
			}}
			class="flex px-5 py-3"
			transition:slide={{ axis: 'y', duration: 230 }}
		>
			{@render children?.()}
		</div>
	{/if}
</div>
