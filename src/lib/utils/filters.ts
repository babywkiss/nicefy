import { deltaE } from 'color-delta-e';

type ImageMeta = { width: number; height: number; channels: number };

export const scale = (data: Uint8ClampedArray, info: ImageMeta, factor: number) => {
	const { width, height, channels } = info;
	const newHeight = Math.floor(height * factor);
	const newWidth = Math.floor(width * factor);
	const newInfo = { ...info, width: newWidth, height: newHeight };
	const scaled = new Uint8ClampedArray(newWidth * newHeight * channels);
	const pixelsPerBlock = factor >= 1 ? 1 : (1 / factor) ** 2;
	for (let y = 0; y < newHeight; y++) {
		for (let x = 0; x < newWidth; x++) {
			const avgPixel = Array(channels).fill(0);
			for (let yOff = 0; yOff < 1 / factor; yOff++) {
				for (let xOff = 0; xOff < 1 / factor; xOff++) {
					const yPos = Math.floor((y * 1) / factor) + yOff;
					const xPos = Math.floor((x * 1) / factor) + xOff;
					const pos = channels * (yPos * width + xPos);
					for (let colorOff = 0; colorOff < channels; colorOff++) {
						avgPixel[colorOff] += data[pos + colorOff] / pixelsPerBlock;
					}
				}
			}
			for (let colorOff = 0; colorOff < info.channels; colorOff++) {
				const pos = channels * (y * newWidth + x) + colorOff;
				scaled[pos] = avgPixel[colorOff];
			}
		}
	}
	return { data: scaled, info: newInfo };
};

export const dither = (
	data: Uint8ClampedArray,
	info: ImageMeta,
	bayerMatrix: number[],
	noiseLevel: number
) => {
	const matrixWidth = bayerMatrix.length ** 0.5;
	const { width, height, channels } = info;
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const pos = channels * (y * width + x);
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
	data: Uint8ClampedArray,
	info: ImageMeta,
	palette: number[][],
	labComparison: boolean
) => {
	const { width, height, channels } = info;
	const paletteSize = palette.length;
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const pos = channels * (y * width + x);
			let minDiff = Infinity;
			let paletteIndex = 0;
			for (let p = 0; p < paletteSize; p++) {
				const pC = palette[p];
				const diff = labComparison
					? deltaE([data[pos], data[pos + 1], data[pos + 2]], pC as [number, number, number], 'rgb')
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
