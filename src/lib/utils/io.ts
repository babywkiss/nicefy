import { colorize, dither, scale } from './filters';
import { bayerMatrix } from './helpers';
import { CATPPUCCIN } from './palettes';

export type ImageInfo = {
	width: number;
	height: number;
	channels: number;
};

export type Config = {
	pixelSize: number;
	palette: keyof typeof CATPPUCCIN;
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
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext('2d');
	ctx?.drawImage(image, 0, 0);
	const data = ctx?.getImageData(0, 0, width, height).data;
	return { data, info: { width, height, channels: 4 } };
};

export const process_image = (data: Uint8ClampedArray, info: ImageInfo, config: Config) => {
	const { pixelSize, palette, toDither, bayerLevel, noiseLevel, labComparison, rescaleBack } =
		config;
	if (pixelSize > 1) {
		({ data, info } = scale(data, info, 1 / pixelSize));
	}
	if (toDither) {
		dither(data, info, bayerMatrix(bayerLevel), noiseLevel);
	}
	colorize(data, info, CATPPUCCIN[palette], labComparison);
	if (pixelSize > 1 && rescaleBack) {
		({ data, info } = scale(data, info, pixelSize));
	}
	const imageData = new ImageData(data, info.width, info.height);
	return imageData;
};

export const getResUrl = (imageData: ImageData) => {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	canvas.width = imageData.width;
	canvas.height = imageData.height;
	ctx?.putImageData(imageData, 0, 0);
	return canvas.toDataURL();
};
