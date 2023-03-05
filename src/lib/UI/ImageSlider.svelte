<script lang="ts">
	export let beforeUrl: string;
	export let afterUrl: string;

	let showTip = true;
	let afterImg: HTMLImageElement;
	let pressed = false;
	let m = { x: 0, y: 0 };

	const handleMouseMove = (e: MouseEvent | TouchEvent) => {
		if (e instanceof MouseEvent) {
			m.x = e.pageX - (e.currentTarget as HTMLDivElement).offsetLeft;
			m.y = e.pageY - (e.currentTarget as HTMLDivElement).offsetTop;
		} else {
			m.x = e.touches[0].pageX - (e.currentTarget as HTMLDivElement).offsetLeft;
			m.y = e.touches[0].pageY - (e.currentTarget as HTMLDivElement).offsetLeft;
		}
		if (afterImg && (pressed || e instanceof TouchEvent) && afterUrl) showTip = false;
		afterImg.style.clipPath = `inset(0 0 0 ${m.x}px)`;
	};

	$: height = afterUrl && afterImg ? afterImg.height : '';
	$: width = afterUrl && afterImg ? afterImg.width : '';
</script>

<div
	class={'grid ' + $$props.class || ''}
	style="grid-template-columns: 1fr; grid-template-rows: 1fr;"
	on:mousemove={handleMouseMove}
	on:touchmove|preventDefault={handleMouseMove}
	on:mousedown={() => (pressed = true)}
	on:mouseup={() => (pressed = false)}
	on:mouseleave={() => (pressed = false)}
>
	<img
		class="select-none w-full"
		on:dragstart|preventDefault
		src={beforeUrl}
		alt="before"
		{height}
		{width}
		style="grid-column: 1 / 2; grid-row: 1 / 2; z-index: 1;"
	/>
	{#if afterUrl}
		<img
			class="select-none w-full"
			on:dragstart|preventDefault
			bind:this={afterImg}
			src={afterUrl}
			alt="after"
			style="grid-column: 1 / 2; grid-row: 1 / 2; z-index: 1;"
		/>
		<div
			style="grid-column: 1 / 2; grid-row: 1 / 2; z-index: 1;"
			class="flex flex-col p-10"
			class:hidden={!showTip}
		>
			<div class="bg-base-100 p-5 rounded-lg font-bold inline-block">
				<span class="text-warning"> ? Note: </span>
				Drag over the image to compare with original
			</div>
		</div>
	{/if}
</div>
