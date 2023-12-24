import { writable } from "svelte/store";
import palettes from "$lib/utils/palettes";

const defaultConfig = {
	newHeight: 1,
	palette: palettes[0],
	toDither: true,
	bayerLevel: 3,
	labComparison: false,
	noiseLevel: 27,
	rescaleBack: true,
};

export const config = writable(defaultConfig);
export const originalUrl = writable("");
export const processedUrl = writable("");
export const maxHeight = writable(1);
