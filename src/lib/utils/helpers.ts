const get_threshold = (level: number): number[] => {
	if (level === 0) return [0, 2, 3, 1];
	const prev = get_threshold(level - 1);
	const prev_side = prev.length ** 0.5;
	const size = 4 ** (level + 1);
	const side = size ** 0.5;
	return Array.from({ length: size }, (_, i) => {
		const x = i % side;
		const y = Math.floor(i / side);
		const fx = x < side / 2;
		const fy = y < side / 2;
		const inc = fx ? (fy ? 0 : 3) : fy ? 2 : 1;
		return prev[(y % prev_side) * prev_side + (x % prev_side)] * 4 + inc;
	});
};

export const bayerMatrix = (level: number) =>
	get_threshold(level).map((v) => v / 4 ** (level + 1) - 0.5);
