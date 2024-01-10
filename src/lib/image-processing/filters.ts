import { getDeltaE00, getDeltaE76, getDeltaE94 } from "delta-e";
import { rgb2lab } from "./utils";

export const scale = (image: ImageData, newHeight: number) => {
	if (newHeight === image.height) return image;
	const newWidth = image.width * (newHeight / image.height);
	const original = new OffscreenCanvas(image.width, image.height);
	original
		.getContext("2d")
		?.putImageData(image, 0, 0, 0, 0, image.width, image.height);
	const ctx = new OffscreenCanvas(newWidth, newHeight).getContext("2d");
	if (!ctx) return image;
	ctx.imageSmoothingEnabled = false;
	ctx.drawImage(original, 0, 0, newWidth, newHeight);
	return ctx.getImageData(0, 0, newWidth, newHeight);
};

const getThreeshold = (level: number): number[] => {
	if (level === 0) return [0, 2, 3, 1];
	const prev = getThreeshold(level - 1);
	const prevSide = prev.length ** 0.5;
	const size = 4 ** (level + 1);
	const side = size ** 0.5;
	return Array.from({ length: size }, (_, i) => {
		const x = i % side;
		const y = Math.floor(i / side);
		const fx = x < side / 2;
		const fy = y < side / 2;
		const inc = fx ? (fy ? 0 : 3) : fy ? 2 : 1;
		return prev[(y % prevSide) * prevSide + (x % prevSide)] * 4 + inc;
	});
};

const bayerMatrix = (level: number) =>
	getThreeshold(level).map((v) => v / 4 ** (level + 1) - 0.5);

export const dither = (
	{ data, width, height }: ImageData,
	bayerLevel: number,
	noisePercent: number,
) => {
	const matrix = bayerMatrix(bayerLevel);
	const matrixWidth = matrix.length ** 0.5;
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const pos = 4 * (y * width + x);
			const matrixPos = (y % matrixWidth) * matrixWidth + (x % matrixWidth);
			const noise = noiseLevel * matrix[matrixPos];
			for (let colorOff = 0; colorOff < 3; colorOff++) {
				const value = data[pos + colorOff] + noise;
				data[pos + colorOff] = value <= 255 ? (value >= 0 ? value : 0) : 255;
			}
		}
	}
};

type ColorComparator = (
	r1: number,
	g1: number,
	b1: number,
	r2: number,
	g2: number,
	b2: number,
) => number;

export const squareComparator: ColorComparator = (r1, g1, b1, r2, g2, b2) =>
	Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);

export const deltaE2000Comparator: ColorComparator = (r1, g1, b1, r2, g2, b2) =>
	getDeltaE00(rgb2lab(r1, g1, b1), rgb2lab(r2, g2, b2));

export const deltaE1976Comparator: ColorComparator = (r1, g1, b1, r2, g2, b2) =>
	getDeltaE76(rgb2lab(r1, g1, b1), rgb2lab(r2, g2, b2));

export const deltaE1994Comparator: ColorComparator = (r1, g1, b1, r2, g2, b2) =>
	getDeltaE94(rgb2lab(r1, g1, b1), rgb2lab(r2, g2, b2));

export const colorize = (
	{ width, height, data }: ImageData,
	palette: number[][],
	comparator: ColorComparator,
) => {
	const paletteSize = palette.length;
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const pos = 4 * (y * width + x);
			let minDiff = Infinity;
			let paletteIndex = 0;
			for (let p = 0; p < paletteSize; p++) {
				const pC = palette[p];
				const diff = comparator(
					data[pos],
					data[pos + 1],
					data[pos + 2],
					pC[0],
					pC[1],
					pC[2],
				);
				if (diff < minDiff) {
					minDiff = diff;
					paletteIndex = p;
				}
			}
			data[pos] = palette[paletteIndex][0];
			data[pos + 1] = palette[paletteIndex][1];
			data[pos + 2] = palette[paletteIndex][2];
		}
	}
};
