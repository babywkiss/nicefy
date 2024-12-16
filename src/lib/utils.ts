import ProcessingWorker from '$lib/filters/processing.worker?worker';
import type { FilterChain } from './filters/processing.worker';

export const imageDataFromUrl = (url: string) => {
	return new Promise<ImageData>((res, rej) => {
		const image = new Image();
		image.onload = () => {
			try {
				const canvas = document.createElement('canvas');
				[canvas.width, canvas.height] = [image.width, image.height];
				const ctx = canvas.getContext('2d');
				if (!ctx) return rej();
				ctx?.drawImage(image, 0, 0);
				res(ctx?.getImageData(0, 0, canvas.width, canvas.height));
			} catch (err) {
				rej(err);
			}
		};
		image.crossOrigin = 'Anonymous';
		image.src = url;
	});
};

export const urlFromImageData = (imageData: ImageData) => {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	[canvas.width, canvas.height] = [imageData.width, imageData.height];
	ctx?.putImageData(imageData, 0, 0);
	return canvas.toDataURL();
};

const worker = new ProcessingWorker();

export const processInWorker = ({
	filterChain,
	data
}: {
	filterChain: FilterChain;
	data: ImageData;
}) => {
	return new Promise<ImageData>((res) => {
		const messageId = crypto.randomUUID();

		const listener = (e: { data: { messageId: string; imageData: ImageData } }) => {
			if (e.data.messageId === messageId) {
				worker.removeEventListener('message', listener);
				res(e.data.imageData);
			}
		};

		worker.addEventListener('message', listener);
		worker.postMessage({ filterChain, data, messageId });
	});
};
