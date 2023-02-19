import { rgba2lab, deltaE00 } from '$lib/utils/colour';

type ImageMeta = { width: number; height: number; channels: number };
type ColorTuple = [number, number, number, number];

export const pixelate = (data: Uint8ClampedArray, info: ImageMeta, pixelSize: number) => {
	const new_height = Math.floor(info.height / pixelSize);
	const new_width = Math.floor(info.width / pixelSize);
	const channels = info.channels;
	const new_info = { ...info, width: new_width, height: new_height };
	const pixelated = new Uint8ClampedArray(new_width * new_height * channels);
	const divisor = pixelSize >= 1 ? pixelSize ** 2 : 1;
	for (let y = 0; y < new_height; y++) {
		for (let x = 0; x < new_width; x++) {
			const avg = Array(channels).fill(0);
			for (let yOff = 0; yOff < pixelSize; yOff++) {
				for (let xOff = 0; xOff < pixelSize; xOff++) {
					const pos =
						channels *
						((Math.floor(y * pixelSize) + yOff) * info.width + Math.floor(x * pixelSize) + xOff);
					for (let colorOff = 0; colorOff < channels; colorOff++) {
						avg[colorOff] += data[pos + colorOff] / divisor;
					}
				}
			}
			for (let colorOff = 0; colorOff < info.channels; colorOff++) {
				pixelated[info.channels * (y * new_width + x) + colorOff] = avg[colorOff];
			}
		}
	}
	return { data: pixelated, info: new_info };
};

export const dither = (
	data: Uint8ClampedArray,
	info: ImageMeta,
	bayerMatrix: number[],
	noiseLevel: number
) => {
	const bayer_width = bayerMatrix.length ** 0.5;
	const { width, height, channels } = info;
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const pos = channels * (y * width + x);
			const noise = noiseLevel * bayerMatrix[(y % bayer_width) * bayer_width + (x % bayer_width)];
			for (let c = 0; c < channels; c++) {
				const offPos = pos + c;
				const value = data[offPos];
				const new_val = value + noise;
				data[offPos] = new_val <= 255 ? (new_val >= 0 ? new_val : 0) : 255;
			}
		}
	}
};

export const colorize = (data: Uint8ClampedArray, info: ImageMeta, palette: number[][]) => {
	const palette_lab = palette.map((rgba) => rgba2lab(...(rgba as ColorTuple)));
	const { width, height, channels } = info;
	const p_size = palette.length;
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const pos = channels * (y * width + x);
			let minDiff = Infinity;
			let pIndex = 0;
			for (let p = 0; p < p_size; p++) {
				const color = Array(channels);
				for (let c = 0; c < channels; c++) {
					color[c] = data[pos + c];
				}
				const lab_color = rgba2lab(color[0], color[1], color[2]);
				const diff = deltaE00(
					lab_color[0],
					lab_color[1],
					lab_color[2],
					palette_lab[p][0],
					palette_lab[p][1],
					palette_lab[p][2]
				);
				if (diff < minDiff) {
					minDiff = diff;
					pIndex = p;
				}
			}
			for (let c = 0; c < channels; c++) {
				data[pos + c] = palette[pIndex][c];
			}
		}
	}
};
