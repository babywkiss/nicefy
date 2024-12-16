import type { Filter } from './types';

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

const bayerMatrix = (level: number) => getThreeshold(level).map((v) => v / 4 ** (level + 1) - 0.5);

export const dither: Filter<{ bayerLevel: number; noiseFactor: number }> = (
	imageData,
	{ bayerLevel, noiseFactor }
) => {
	const matrix = bayerMatrix(Math.min(Math.max(0, bayerLevel), 7));
	const noiseMultiplier = Math.min(Math.max(noiseFactor, 0), 1) * 255;
	const matrixWidth = matrix.length ** 0.5;
	for (let y = 0; y < imageData.height; y++) {
		for (let x = 0; x < imageData.width; x++) {
			const pos = 4 * (y * imageData.width + x);
			const matrixPos = (y % matrixWidth) * matrixWidth + (x % matrixWidth);
			const noise = noiseMultiplier * matrix[matrixPos];
			for (let colorOff = 0; colorOff < 3; colorOff++) {
				const value = imageData.data[pos + colorOff] + noise;
				imageData.data[pos + colorOff] = value <= 255 ? (value >= 0 ? value : 0) : 255;
			}
		}
	}
	return imageData;
};
