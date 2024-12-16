<script>
	import SortableList from '$lib/components/ui/sortable-list.svelte';

	const items = $state(['red', 'orange', 'blue', 'green']);
</script>

<SortableList
	onReorder={(from, to) => {
		const item = items[from];
		items.splice(from, 1);
		items.splice(to, 0, item);
	}}
	triggerSelector=".dragger"
	class="flex w-fit flex-col"
	{items}
>
	{#snippet children(item)}
		<div
			style:background={item}
			class="my-3 flex h-32 w-96 flex-col items-center justify-center gap-3 rounded-box bg-primary p-10 text-xl font-bold text-base-300"
		>
			{item}
			<button class="dragger btn btn-xs w-24">Drag me</button>
		</div>
	{/snippet}
</SortableList>
