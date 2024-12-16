import type { Action } from 'svelte/action';

const bounded = (n: number, min: number, max: number) => Math.min(Math.max(min, n), max);

const noneSelectStyle = document.createElement('style');
noneSelectStyle.textContent = `*{user-select:none;-webkit-user-select:none}`;

export const move: Action<
	HTMLElement,
	{
		parent?: HTMLElement;
		trigger?: HTMLElement | string;
		onMove?: (node: HTMLElement, overflowX: number, overflowY: number) => void;
		onMoveEnd?: (node: HTMLElement) => void | Promise<void>;
	}
> = (node, { trigger, parent, onMove, onMoveEnd }) => {
	$effect(() => {
		let triggerElement =
			(typeof trigger === 'string' ? node.querySelector(trigger) : trigger) ?? node;

		let deltaX: number;
		let deltaY: number;
		let translateX: number;
		let translateY: number;
		let rect: DOMRect | null = null;
		let parentRect: DOMRect | null = null;
		let mousePosition: { x: number; y: number } | null = null;
		let moving = false;

		const onPointerDown = (e: MouseEvent) => {
			if (e.currentTarget !== e.target) return;
			moving = true;
			rect = node.getBoundingClientRect();
			parentRect = (parent ?? node.parentElement)?.getBoundingClientRect() ?? null;
			mousePosition = { x: e.pageX, y: e.pageY };
			deltaX = 0;
			deltaY = 0;
			translateX = 0;
			translateY = 0;
			document.body.appendChild(noneSelectStyle);
		};

		const onPointerUp = async () => {
			if (!moving) return;
			moving = false;
			if (mousePosition && rect && parentRect) {
				node.style.translate = '';
			}
			rect = null;
			parentRect = null;
			mousePosition = null;
			if (onMoveEnd) setTimeout(() => onMoveEnd(node));
			document.body.removeChild(noneSelectStyle);
		};

		const onPointerMove = (e: PointerEvent) => {
			if (!moving) return;
			if (rect && parentRect && mousePosition) {
				const ox = Math.min(
					e.pageX - parentRect.left,
					Math.max(e.pageX - parentRect.left - parentRect.width, 0)
				);
				const oy = Math.min(
					e.pageY - parentRect.top,
					Math.max(e.pageY - parentRect.top - parentRect.height, 0)
				);
				onMove?.(node, ox, oy);

				deltaX = e.pageX - mousePosition.x;
				deltaY = e.pageY - mousePosition.y;
				translateX = bounded(deltaX, parentRect.left - rect.left, parentRect.right - rect.right);
				translateY = bounded(deltaY, parentRect.top - rect.top, parentRect.bottom - rect.bottom);
				node.style.translate = `${translateX}px ${translateY}px`;
			}
		};

		// @ts-ignore
		triggerElement.addEventListener('pointerdown', onPointerDown);
		document.addEventListener('pointermove', onPointerMove);
		document.addEventListener('pointerup', onPointerUp);

		return () => {
			// @ts-ignore
			triggerElement.removeEventListener('pointerdown', onPointerDown);
			document.removeEventListener('pointermove', onPointerMove);
			document.removeEventListener('pointerup', onPointerUp);
		};
	});
};
