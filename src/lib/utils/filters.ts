import { deltaE } from "color-delta-e";

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

export const dither = (
	{ data, width, height }: ImageData,
	bayerMatrix: number[],
	noiseLevel: number,
) => {
	const matrixWidth = bayerMatrix.length ** 0.5;
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const pos = 4 * (y * width + x);
			const matrixPos = (y % matrixWidth) * matrixWidth + (x % matrixWidth);
			const noise = noiseLevel * bayerMatrix[matrixPos];
			for (let colorOff = 0; colorOff < 3; colorOff++) {
				const value = data[pos + colorOff] + noise;
				data[pos + colorOff] = value <= 255 ? (value >= 0 ? value : 0) : 255;
			}
		}
	}
};

export const colorize = (
	{ width, height, data }: ImageData,
	palette: number[][],
	labComparison: boolean,
) => {
	const paletteSize = palette.length;
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const pos = 4 * (y * width + x);
			let minDiff = Infinity;
			let paletteIndex = 0;
			for (let p = 0; p < paletteSize; p++) {
				const pC = palette[p];
				const diff = labComparison
					? deltaE(
							[data[pos], data[pos + 1], data[pos + 2]],
							pC as [number, number, number],
							"rgb",
					  )
					: Math.abs(data[pos] - pC[0]) +
					  Math.abs(data[pos + 1] - pC[1]) +
					  Math.abs(data[pos + 2] - pC[2]);
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
