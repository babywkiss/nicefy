import type { Action } from 'svelte/action';

export const clickOutside: Action<HTMLElement, (e: MouseEvent) => void | Promise<void>> = (
	node,
	callback
) => {
	let listener = async (e: MouseEvent) => {
		if (!node.contains(e.target as Node)) await callback?.(e);
	};
	document.addEventListener('click', listener);

	return {
		update(parameter) {
			document.removeEventListener('click', listener);
			listener = async (e: MouseEvent) => {
				if (e.currentTarget !== node) await parameter?.(e);
			};
			document.addEventListener('click', listener);
		},
		destroy() {
			document.removeEventListener('click', listener);
		}
	};
};
