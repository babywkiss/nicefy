import type { Filter } from './types';

export const scale: Filter<{ targetHeight: number }> = (image, { targetHeight: passedHeight }) => {
	const targetHeight = Math.max(4, passedHeight);
	if (targetHeight === image.height) return image;
	const newWidth = image.width * (targetHeight / image.height);
	const original = new OffscreenCanvas(image.width, image.height);
	original.getContext('2d')?.putImageData(image, 0, 0, 0, 0, image.width, image.height);
	const ctx = new OffscreenCanvas(newWidth, targetHeight).getContext('2d');
	if (!ctx) throw new Error('Error Initializing OffscreenCanvas');
	ctx.imageSmoothingEnabled = false;
	ctx.drawImage(original, 0, 0, newWidth, targetHeight);
	return ctx.getImageData(0, 0, newWidth, targetHeight);
};
