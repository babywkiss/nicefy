import { process_image } from "$lib/utils/io";

onmessage = ({ data }) => {
	const start = Date.now();
	const imageData = process_image(data.image, data.config);
	postMessage({ imageData, tookMS: Date.now() - start });
};
