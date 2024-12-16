<script lang="ts">
	import { IconCircleXFilled } from '@tabler/icons-svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		title?: string;
		icon?: Snippet;
		children?: Snippet;
		onRemove?: () => any;
	};

	const { title, icon, children, onRemove }: Props = $props();
	$effect(() => {
		console.log('rerender ', title);
	});
</script>

<div class="rounded-box bg-gradient-to-r from-primary to-base-content/10 p-[0.05rem]">
	<div class="relative flex flex-col items-end gap-3 rounded-box bg-base-200 p-3">
		<div
			class="filter-drag group absolute left-0 top-0 flex cursor-pointer items-center gap-1 rounded-br-btn rounded-tl-btn bg-primary py-1 pl-2 pr-3 text-sm text-base-300"
		>
			<button
				onclick={() => onRemove?.()}
				class="w-0 overflow-hidden opacity-0 transition-all group-hover:w-4 group-hover:opacity-100"
			>
				<IconCircleXFilled size={17} />
			</button>
			{@render icon?.()}
			<span class="font-semibold">{title}</span>
		</div>
		{@render children?.()}
	</div>
</div>
