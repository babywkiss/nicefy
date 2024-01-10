import { preprocessMeltUI, sequence } from "@melt-ui/pp";
import preprocess from "svelte-preprocess";
import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
const dev = process.argv.includes("dev");

/** @type {import('@sveltejs/kit').Config}*/
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: sequence([
		vitePreprocess(),
		preprocess({
			postcss: true,
		}),
		preprocessMeltUI(),
	]),
	kit: {
		adapter: adapter(),
	},
};
export default config;
