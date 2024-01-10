import type { Config } from "$lib/image-processing";
import { writable } from "svelte/store";

const config = writable<Config>({
	height: 0,
	applyDithering: true,
	comparisonFn: "square",
	bayerLevel: 3,
	noisePercent: 77,
	palette: [],
});

export default config;
