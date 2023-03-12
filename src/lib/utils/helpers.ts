const getThreeshold = (level: number): number[] => {
	if (level === 0) return [0, 2, 3, 1];
	const prev = getThreeshold(level - 1);
	const prevSide = prev.length ** 0.5;
	const size = 4 ** (level + 1);
	const side = size ** 0.5;
	return Array.from({ length: size }, (_, i) => {
		const x = i % side;
		const y = Math.floor(i / side);
		const fx = x < side / 2;
		const fy = y < side / 2;
		const inc = fx ? (fy ? 0 : 3) : fy ? 2 : 1;
		return prev[(y % prevSide) * prevSide + (x % prevSide)] * 4 + inc;
	});
};

export const bayerMatrix = (level: number) =>
	getThreeshold(level).map((v) => v / 4 ** (level + 1) - 0.5);

export const rgbToHex = (color: number[]) =>
	'#' +
	color
		.map((x) => {
			const hex = x.toString(16);
			return hex.length === 1 ? '0' + hex : hex;
		})
		.join('');
