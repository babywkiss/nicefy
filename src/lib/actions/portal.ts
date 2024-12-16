import type { Action } from 'svelte/action';

export const portal: Action<Node, Node> = (node, to) => {
	to.appendChild(node);
	return {
		destroy() {
			node.parentNode?.removeChild(node);
		}
	};
};
