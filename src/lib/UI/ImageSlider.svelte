<script lang="ts">
	export let beforeUrl: string;
	export let afterUrl: string;

	let afterImg: HTMLImageElement;
	let pressed = false;
	let m = { x: 0, y: 0 };

	const handleMouseMove = (e: MouseEvent) => {
		m.x = e.pageX - (e.currentTarget as HTMLDivElement).offsetLeft;
		m.y = e.pageY - (e.currentTarget as HTMLDivElement).offsetTop;
		if (afterImg && pressed && afterUrl) afterImg.style.clipPath = `inset(0 0 0 ${m.x}px)`;
	};
</script>

<div
	class={`${$$restProps.class}`}
	on:mousemove={handleMouseMove}
	on:mousedown={() => (pressed = true)}
	on:mouseup={() => (pressed = false)}
>
	<img on:dragstart|preventDefault class="absolute" src={beforeUrl} alt="before" />
	{#if afterUrl}
		<img
			on:dragstart|preventDefault
			class="absolute"
			bind:this={afterImg}
			src={afterUrl}
			alt="after"
		/>
	{/if}
</div>
