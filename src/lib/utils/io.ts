import { colorize, dither, scale } from "./filters";
import { bayerMatrix } from "./helpers";

export type ImageInfo = {
	width: number;
	height: number;
	channels: number;
};

export type Config = {
	newHeight: number;
	palette: { id: number; title: string; colors: number[][] };
	toDither: boolean;
	bayerLevel: number;
	labComparison: boolean;
	noiseLevel: number;
	rescaleBack: boolean;
};

export const read_image = (url: string) => {
	const image = new Image();
	image.src = url;
	const width = image.width;
	const height = image.height;
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d");
	ctx?.drawImage(image, 0, 0);
	const data = ctx?.getImageData(0, 0, width, height);
	return data;
};

export const process_image = (
	image: ImageData,
	{
		newHeight,
		palette,
		toDither,
		bayerLevel,
		noiseLevel,
		labComparison,
	}: Config,
) => {
	const height = image.height;
	const processed = scale(image, newHeight);
	if (toDither) {
		dither(processed, bayerMatrix(bayerLevel), noiseLevel);
	}
	colorize(processed, palette.colors, labComparison);
	return scale(processed, height);
};

export const getResUrl = (imageData: ImageData) => {
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");
	canvas.width = imageData.width;
	canvas.height = imageData.height;
	ctx?.putImageData(imageData, 0, 0);
	return canvas.toDataURL();
};
