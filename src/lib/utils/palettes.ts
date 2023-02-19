import { variants } from '@catppuccin/palette';

type Catppuccin = {
	mocha: number[][];
	macchiato: number[][];
	frappe: number[][];
	latte: number[][];
};

export const CATPPUCCIN = (Object.keys(variants) as Array<keyof typeof variants>).reduce(
	(themes, theme) => (
		((themes as Catppuccin)[theme] = Object.entries(variants[theme]).map(([_, types]) => [
			...types.raw.split(', ').map((v: string) => parseInt(v)),
			255
		])),
		themes
	),
	{}
) as Catppuccin;
