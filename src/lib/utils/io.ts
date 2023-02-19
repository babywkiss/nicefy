import { colorize, dither, pixelate } from './filters';
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
	to_dither: boolean;
	bayer_level: number;
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
	const { pixelSize, palette, to_dither, bayer_level } = config;
	if (pixelSize > 1) {
		({ data, info } = pixelate(data, info, pixelSize));
	}
	if (to_dither) {
		dither(data, info, bayerMatrix(bayer_level));
	}
	if (pixelSize > 1) {
		({ data, info } = pixelate(data, info, 1 / pixelSize));
	}
	colorize(data, info, CATPPUCCIN[palette]);
	const imageData = new ImageData(data, info.width, info.height);
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	canvas.width = imageData.width;
	canvas.height = imageData.height;
	ctx?.putImageData(imageData, 0, 0);
	return canvas.toDataURL();
};
