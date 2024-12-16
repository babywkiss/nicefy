<script lang="ts" generics="T">
	import { scale } from 'svelte/transition';
	import { clickOutside } from '$lib/actions/click-outside';
	import { IconChevronDown } from '@tabler/icons-svelte';
	import type { Snippet } from 'svelte';

	type SelectOption<T> = {
		value: T;
		title?: string;
		disabled?: boolean;
	};

	let closed = $state(true);
	type Props = {
		children?: Snippet<[SelectOption<T>, () => void | Promise<void>]>;
		disabled?: boolean;
		placeholder?: string;
		options?: SelectOption<T>[];
		value?: T;
		onSelect?: (value: T) => any | Promise<any>;
	};
	const { options, onSelect, placeholder, disabled, value, children }: Props = $props();

	let list = $state<HTMLUListElement>();
	let lastScroll = 0;

	$effect(() => {
		if (!closed && list) list.scrollTop = lastScroll;
	});
</script>

<div
	use:clickOutside={() => {
		closed = true;
	}}
	class="relative h-fit w-fit"
>
	<!-- svelte-ignore  a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events  -->
	<button
		{disabled}
		class="w-42 btn btn-xs justify-between border-base-content/10 hover:border-base-content/10"
		onclick={() => {
			if (!disabled) closed = !closed;
		}}
	>
		<span>{options?.find((o) => o.value === value)?.title ?? placeholder}</span>
		<div class="transition-transform" class:-rotate-180={!closed}>
			<IconChevronDown />
		</div>
	</button>
	{#if !closed}
		<ul
			bind:this={list}
			transition:scale={{ duration: 230 }}
			onscroll={(e) => {
				lastScroll = e.currentTarget.scrollTop;
			}}
			tabindex="-1"
			class="themed-scrollbar menu absolute z-10 flex h-fit max-h-96 w-full translate-y-3 flex-col flex-nowrap gap-2 overflow-auto rounded-box border border-base-content/20 bg-base-300/80 p-2 shadow backdrop-blur-xl"
		>
			{#each options ?? [] as option}
				{#if children}
					{@render children(option, () => {
						closed = true;
					})}
				{:else}
					<button
						class="btn btn-xs flex h-fit w-full p-0"
						disabled={option.disabled}
						onclick={async () => {
							await onSelect?.(option.value);
							closed = true;
						}}
					>
						<span class="text-full">
							{option.title}
						</span>
					</button>
				{/if}
			{/each}
		</ul>
	{/if}
</div>
