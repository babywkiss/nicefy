<script lang="ts">
	import { createSelect, melt } from '@melt-ui/svelte';
	import { fade } from 'svelte/transition';

	export let options = [
		{ value: 'fuck', label: 'fuck' },
		{ value: 'shit', label: 'shit' },
		{ value: 'wow', label: 'wow' }
	];
	export let label: string = '';

	export let value = options[0].value;

	const {
		elements: { trigger, menu, option, label: labelM },
		states: { selectedLabel, open, selected },
		helpers: { isSelected }
	} = createSelect({
		defaultSelected: options[0],
		forceVisible: true,
		positioning: {
			placement: 'bottom',
			fitViewport: true,
			sameWidth: true
		}
	});

	$: if ($selected?.value) value = $selected.value;
</script>

<div class="flex flex-col gap-1">
	<!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
	<label class="block text-sm" use:melt={$labelM}>{label}</label>
	<button
		class="flex h-10 min-w-[220px] items-center justify-between rounded-lg bg-highlightlow px-3 py-2
   shadow shadow-basec transition-opacity hover:opacity-90"
		use:melt={$trigger}
		aria-label="Food"
	>
		{$selectedLabel}
		<iconify-icon
			class="transition-transform"
			class:rotate-180={$open}
			icon="majesticons:chevron-down"
		/>
	</button>
	{#if $open}
		<div
			class="z-10 flex max-h-[300px] flex-col
    overflow-y-auto rounded-lg bg-surface p-1
    shadow focus:!ring-0"
			use:melt={$menu}
			transition:fade={{ duration: 150 }}
		>
			{#each options as { value, label }}
				<div
					class="relative cursor-pointer rounded-lg py-1 pl-8 pr-4 text-text/90
              hover:bg-highlightlow focus:z-10
              focus:text-magnum-700
              data-[highlighted]:bg-highlightmed data-[highlighted]:text-text
              data-[disabled]:opacity-50"
					class:font-bold={$isSelected(value)}
					use:melt={$option({ value, label })}
				>
					<iconify-icon
						class="absolute left-2 top-1/2 align-text-bottom -translate-y-1/2"
						class:block={$isSelected(value)}
						class:hidden={!$isSelected(value)}
						icon="majesticons:chevron-right"
					/>
					<span>
						{label}
					</span>
				</div>
			{/each}
		</div>
	{/if}
</div>
