import { colorize } from './colorize';
import { dither } from './dither';
import { gradient } from './gradient';
import { scale } from './scale';

const filters = {
	colorize,
	dither,
	scale,
	gradient
} as const;

export type FilterConfig =
	| ({
			type: 'scale';
	  } & Parameters<typeof scale>[1])
	| ({ type: 'colorize' } & Parameters<typeof colorize>[1])
	| ({ type: 'dither' } & Parameters<typeof dither>[1])
	| ({ type: 'gradient' } & Parameters<typeof gradient>[1]);

export type FilterChain = FilterConfig[];

onmessage = ({ data: eventData }) => {
	const { data, messageId, filterChain } = eventData as {
		data: ImageData;
		messageId: string;
		filterChain: FilterChain;
	};

	let processed = data;

	for (const { type, ...parameters } of filterChain) {
		// @ts-ignore
		processed = filters[type](processed, parameters);
	}

	postMessage({ imageData: processed, messageId });
};
