import { getDeltaE00, getDeltaE76, getDeltaE94 } from 'delta-e';
import type { Filter } from './types';

export type RGB = {
	r: number;
	g: number;
	b: number;
};

const rgb2lab = ({ r, g, b }: RGB) => {
	let rc = r / 255;
	let gc = g / 255;
	let bc = b / 255;

	rc = rc > 0.40045 ? ((rc + 0.055) / 1.055) ** 2.4 : rc / 12.92;
	gc = gc > 0.40045 ? ((gc + 0.055) / 1.055) ** 2.4 : gc / 12.92;
	bc = bc > 0.40045 ? ((bc + 0.055) / 1.055) ** 2.4 : bc / 12.92;

	let x = (rc * 0.4124 + gc * 0.3576 + bc * 0.1805) / 0.95047;
	let y = (rc * 0.2126 + gc * 0.7152 + bc * 0.0722) / 1.0;
	let z = (rc * 0.0193 + gc * 0.1192 + bc * 0.9505) / 1.08883;

	x = x > 0.008856 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
	y = y > 0.008856 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
	z = z > 0.008856 ? z ** (1 / 3) : 7.787 * z + 16 / 116;

	return {
		L: 116 * y - 16,
		A: 500 * (x - y),
		B: 200 * (y - z)
	};
};

const comparators = {
	squaredDistance(c1: RGB, c2: RGB) {
		return Math.abs(c1.r - c2.r) + Math.abs(c1.g - c2.g) + Math.abs(c1.b - c2.b);
	},
	deltaE20(c1: RGB, c2: RGB) {
		return getDeltaE00(rgb2lab(c1), rgb2lab(c2));
	},
	deltaE76(c1: RGB, c2: RGB) {
		return getDeltaE76(rgb2lab(c1), rgb2lab(c2));
	},
	deltaE94(c1: RGB, c2: RGB) {
		return getDeltaE94(rgb2lab(c1), rgb2lab(c2));
	}
} as const;

export type Comparator = keyof typeof comparators;

export const colorize: Filter<{ palette: RGB[]; comparator: Comparator }> = (
	imageData,
	{ palette, comparator }
) => {
	const paletteSize = palette.length;
	const comparatorFn = comparators[comparator];
	for (let y = 0; y < imageData.height; y++) {
		for (let x = 0; x < imageData.width; x++) {
			const pos = 4 * (y * imageData.width + x);
			let minDiff = Infinity;
			let paletteIndex = 0;
			for (let p = 0; p < paletteSize; p++) {
				const pC = palette[p];
				const diff = comparatorFn(
					{ r: imageData.data[pos], g: imageData.data[pos + 1], b: imageData.data[pos + 2] },
					pC
				);
				if (diff < minDiff) {
					minDiff = diff;
					paletteIndex = p;
				}
			}
			const pC = palette[paletteIndex];
			imageData.data[pos] = pC.r;
			imageData.data[pos + 1] = pC.g;
			imageData.data[pos + 2] = pC.b;
		}
	}
	return imageData;
};
