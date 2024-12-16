<script lang="ts">
	import { portal } from '$lib/actions/portal';
	import type { Snippet } from 'svelte';
	import { scale } from 'svelte/transition';

	type Props = {
		open?: boolean;
		onClose?: () => void;
		children?: Snippet;
		dropdown?: Snippet;
	};

	const { children, dropdown, open = false, onClose }: Props = $props();

	let ref = $state<HTMLDivElement>();
	let childrenRef = $state<HTMLDivElement>();

	$effect(() => {
		if (!ref) return;
		const rect = ref.getBoundingClientRect();
		const left = parseFloat(ref.style.left);
		const top = parseFloat(ref.style.top);
		const bodyRect = document.body.getBoundingClientRect();
		const overflowY = Math.max(top + rect.height - bodyRect.height, 0);
		const overflowX = Math.max(left + rect.width - bodyRect.width, 0);
		ref.style.translate = `-${overflowX}px -${overflowY}px`;
	});

	const targetPosition = $derived.by(() => {
		open;
		const rect = childrenRef?.getBoundingClientRect();
		if (!rect) return { x: 0, y: 0 };
		return {
			x: rect.x,
			y: rect.y + rect.height + 12
		};
	});

	const listener = (e: Event) => {
		e.preventDefault();
	};

	$effect(() => {
		if (open) {
			document.body.addEventListener('wheel', listener, {
				passive: false,
				capture: true
			});
		} else {
			document.body.removeEventListener('wheel', listener, { capture: true });
		}
		return () => {
			document.body.removeEventListener('wheel', listener, { capture: true });
		};
	});
</script>

<div class="flex" bind:this={childrenRef}>
	{@render children?.()}
</div>

{#if open && targetPosition}
	<div
		transition:scale={{ duration: 230 }}
		use:portal={document.body}
		bind:this={ref}
		style:left={`${targetPosition.x}px`}
		style:top={`${targetPosition.y}px`}
		class="themed-scrollbar pointer-events-auto absolute z-10 flex h-fit max-h-96 flex-col flex-nowrap gap-2 overflow-auto rounded-box border border-base-content/20 bg-base-300/80 p-2 shadow backdrop-blur-xl"
	>
		{@render dropdown?.()}
	</div>
{/if}

<svelte:document
	oncontextmenucapture={(e) => {
		// @ts-ignore
		if (!open || ref?.contains(e.target) || childrenRef?.contains(e.target)) return;
		onClose?.();
	}}
	onclick={(e) => {
		// @ts-ignore
		if (!open || ref?.contains(e.target) || childrenRef?.contains(e.target)) return;
		onClose?.();
	}}
/>
