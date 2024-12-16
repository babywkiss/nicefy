import chroma from 'chroma-js';
import type { RGB } from './colorize';
import type { Filter } from './types';

type Glow = {
  opacity: number;
  blur: number;
};

const isSameColor = (a: RGB, b: RGB) => a.r === b.r && a.g === b.g && a.b === b.b;

export const gradient: Filter<{ glow: Glow }> = (imageData, { glow }) => {
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
