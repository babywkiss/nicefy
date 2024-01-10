import { writable } from "svelte/store";

type ImageStoreData = {
	originalURL: null | string;
	processedURL: null | string;
};

const image = writable<ImageStoreData>({
	originalURL: null,
	processedURL: null,
});
export default image;
