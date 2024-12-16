import chroma from 'chroma-js';
import type { RGB } from './colorize';
import type { Filter } from './types';

type Gradient = {
	targetColor: RGB;
	stops: RGB[];
	direction: 'vertical' | 'horizontal';
};

const isSameColor = (a: RGB, b: RGB) => a.r === b.r && a.g === b.g && a.b === b.b;

export const gradient: Filter<{ gradient: Gradient }> = (imageData, { gradient }) => {
	const scale = chroma.scale(gradient.stops.map((c) => chroma([c.r, c.g, c.b]))).mode('lab');
	for (let y = 0; y < imageData.height; y++) {
		for (let x = 0; x < imageData.width; x++) {
			const step = x / imageData.width;
			const pos = 4 * (y * imageData.width + x);
			const r = imageData.data[pos];
			const g = imageData.data[pos + 1];
			const b = imageData.data[pos + 2];
			if (isSameColor({ r, g, b }, gradient.targetColor)) {
				const color = scale(step);
				imageData.data[pos] = color.get('rgb.r');
				imageData.data[pos + 1] = color.get('rgb.g');
				imageData.data[pos + 2] = color.get('rgb.b');
			}
		}
	}
	return imageData;
};
