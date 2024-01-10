import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => ({
	palettes: (await (await fetch("/palettes.json")).json()) as {
		id: number;
		title: string;
		colors: number[][];
	}[],
});
