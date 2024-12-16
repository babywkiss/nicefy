<script generics="T" lang="ts">
	import type { Snippet } from 'svelte';
	import type { Action } from 'svelte/action';
	import type { HTMLAttributes } from 'svelte/elements';
	import { SvelteMap } from 'svelte/reactivity';
	import { slide } from 'svelte/transition';

	const noneSelectStyle = document.createElement('style');
	noneSelectStyle.textContent = `*{user-select:none;-webkit-user-select:none}`;

	type Props = {
		items?: T[];
		children?: Snippet<[T, number]>;
		triggerSelector?: string;
		onReorder?: (from: number, into: number) => void | Promise<void>;
		keyFn?: (item: T) => any;
	} & Omit<HTMLAttributes<HTMLUListElement>, 'children'>;

	const { children, items, triggerSelector, onReorder, keyFn, ...props }: Props = $props();

	let listElement = $state<HTMLUListElement>();
	let draggingNode = $state<HTMLLIElement>();
	let draggingNodeRect = $state<DOMRect>();
	let draggingFromIndex = $state<number>();
	let draggingToIndex = $state<number>();
	let draggingPos: { x: number; y: number };
	let mouse: { x: number; y: number };
	let childrensElements = new SvelteMap<number, HTMLElement>();
	let draggingToElement = $state<HTMLElement>();

	const move: Action<HTMLElement, (e: MouseEvent, node: HTMLElement) => void | Promise<void>> = (
		node,
		handler
	) => {
		$effect(() => {
			items?.length;
			console.log('rerun');
			if (!triggerSelector) return;
			const triggerElement = node.querySelector(triggerSelector);
			if (!triggerElement) return;
			// @ts-ignore
			triggerElement.addEventListener('mousedown', (e) => handler(e, node));
			return () => {
				// @ts-ignore
				triggerElement.removeEventListener('mousedown', (e) => handler(e, node));
			};
		});
	};

	const gap: Action<HTMLElement, number> = (node, index) => {
		childrensElements.set(index, node);
		return {
			update(value) {
				index = value;
				childrensElements.set(index, node);
			},
			destroy() {
				childrensElements.delete(index);
			}
		};
	};
</script>

{#snippet gapBlock(index: number)}
	{#if index === draggingToIndex}
		<div
			transition:slide={{ duration: 230, axis: 'y' }}
			bind:this={draggingToElement}
			style:height={`${draggingNodeRect?.height}px`}
			class:mb-3={items && index !== items.length}
			class="w-full rounded-box border border-base-content/50 bg-base-content/10 transition-all"
		></div>
	{/if}
{/snippet}

<ul style:position="relative" bind:this={listElement} {...props}>
	{#if draggingFromIndex !== undefined}
		{@render gapBlock(0)}
	{/if}
	{#each items ?? [] as item, i (keyFn ? keyFn(item) : i)}
		<li
			class="mb-3"
			style:transition-property="scale"
			style:transition-duration="230ms"
			use:gap={i}
			use:move={(e, node) => {
				if (!listElement) return;
				document.body.appendChild(noneSelectStyle);
				const listRect = listElement.getBoundingClientRect();
				const rect = node.getBoundingClientRect();
				draggingNodeRect = rect;
				mouse = { x: e.clientX, y: e.clientY };
				draggingPos = { x: rect.left - listRect.left, y: rect.top - listRect.top };
				node.style.scale = '0.9';
				node.style.zIndex = '9999';
				node.style.width = `${rect.width}px`;
				node.style.translate = `0 ${draggingPos.y}px`;
				node.style.position = 'absolute';
				draggingFromIndex = i;
				draggingToIndex = i;
				draggingNode = node as HTMLLIElement;
			}}
		>
			{@render children?.(item, i)}
		</li>
		{#if draggingFromIndex !== undefined && i !== draggingFromIndex}
			{@render gapBlock(i < draggingFromIndex ? i + 1 : i)}
		{/if}
	{/each}
</ul>

<svelte:document
	onmousemove={(e) => {
		if (!draggingNode || !draggingPos || !mouse || draggingFromIndex === undefined) return;
		const deltaX = e.clientX - mouse.x;
		const deltaY = e.clientY - mouse.y;
		mouse = { x: e.clientX, y: e.clientY };
		draggingPos.x += deltaX;
		draggingPos.y += deltaY;
		draggingNode.style.translate = `0 ${draggingPos.y}px`;
		const rect = draggingNode.getBoundingClientRect();
		for (const [index, node] of childrensElements.entries()) {
			const childrenRect = node.getBoundingClientRect();
			const isAbove = rect.bottom > childrenRect.top && rect.top < childrenRect.top;
			const isUnder = rect.bottom > childrenRect.bottom && childrenRect.bottom > rect.top;
			if (isAbove) {
				draggingToIndex = index < draggingFromIndex ? index : index - 1;
			}
			if (isUnder) {
				draggingToIndex = index < draggingFromIndex ? index + 1 : index;
			}
		}
	}}
	onmouseupcapture={async () => {
		document.body.removeChild(noneSelectStyle);
		if (draggingFromIndex !== undefined && draggingToIndex !== undefined) {
			// animate
			if (draggingNode) {
				const gapRect = draggingToElement?.getBoundingClientRect();
				const listRect = listElement?.getBoundingClientRect();
				if (gapRect && listRect) {
					await new Promise<void>((res) => {
						const animation = draggingNode?.animate(
							[{ translate: `${gapRect.left - listRect.left}px ${gapRect.top - listRect.top}px` }],
							{ duration: 230 }
						);
						animation?.addEventListener('finish', () => res());
					});
				}
			}
			// animate
			await onReorder?.(draggingFromIndex, draggingToIndex);
			console.log(draggingFromIndex, draggingToIndex);
			draggingFromIndex = undefined;
			draggingToIndex = undefined;
		}
		if (draggingNode !== undefined) {
			draggingNode.style.zIndex = '';
			draggingNode.style.width = '';
			draggingNode.style.position = '';
			draggingNode.style.translate = '';
			draggingNode.style.scale = '';
			draggingNode = undefined;
		}
	}}
/>
