import {
	colorize,
	deltaE1976Comparator,
	deltaE1994Comparator,
	deltaE2000Comparator,
	dither,
	scale,
	squareComparator,
} from "./filters";

const comparators = {
	square: squareComparator,
	delta76: deltaE1976Comparator,
	delta94: deltaE1994Comparator,
	delta2000: deltaE2000Comparator,
} as const;

export type Config = {
	comparisonFn: keyof typeof comparators;
	applyDithering: boolean;
	bayerLevel: number;
	noisePercent: number;
	palette: number[][];
	height: number;
};

const process = (
	image: ImageData,
	{
		height,
		applyDithering,
		bayerLevel,
		noisePercent,
		palette,
		comparisonFn,
	}: Config,
) => {
	const imageHeight = image.height;
	const processed = scale(image, height);
	if (applyDithering) {
		dither(processed, bayerLevel, noisePercent);
	}
	colorize(processed, palette, comparators[comparisonFn]);
	return scale(processed, imageHeight);
};

export default process;
