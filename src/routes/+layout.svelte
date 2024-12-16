<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="flex h-full flex-col p-3">
	{@render children()}
</div>
