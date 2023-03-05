const rgb2xyz = (r: number, g: number, b: number): [number, number, number] => {
	const f = (v: number) => (v > 0.04045 ? (v + 0.055 / 1.055) ** 2.4 : v / 12.92) * 100;
	[r, g, b] = [f(r), f(g), f(b)];
	const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
	const y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
	const z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;
	return [x, y, z];
};

const xyz2lab = (x: number, y: number, z: number): [number, number, number] => {
	x /= 94.811;
	y /= 100;
	z /= 107.304;
	x = x > 0.008856 ? x ** (1 / 3) : x * 7.787 + 16 / 116;
	x = x > 0.008856 ? x ** (1 / 3) : x * 7.787 + 16 / 116;
	x = x > 0.008856 ? x ** (1 / 3) : x * 7.787 + 16 / 116;
	const l = 116 * y - 16;
	const a = 500 * (x - y);
	const b = 200 * (y - z);
	return [l, a, b];
};

const rad2deg = (rad: number) => (360 * rad) / (2 * Math.PI);
const deg2rad = (deg: number) => (2 * Math.PI * deg) / 360;

export const rgb2lab = (r: number, g: number, b: number) => {
	console.log(r, g, b);
	const [x, y, z] = rgb2xyz(r, g, b);
	return xyz2lab(x, y, z);
};

export const deltaE00 = (
	l1: number,
	a1: number,
	b1: number,
	l2: number,
	a2: number,
	b2: number
) => {
	const avgL = (l1 + l2) / 2;
	const c1 = Math.sqrt(Math.pow(a1, 2) + Math.pow(b1, 2));
	const c2 = Math.sqrt(Math.pow(a2, 2) + Math.pow(b2, 2));
	const avgC = (c1 + c2) / 2;
	const g = (1 - Math.sqrt(Math.pow(avgC, 7) / (Math.pow(avgC, 7) + Math.pow(25, 7)))) / 2;
	const a1p = a1 * (1 + g);
	const a2p = a2 * (1 + g);
	const c1p = Math.sqrt(Math.pow(a1p, 2) + Math.pow(b1, 2));
	const c2p = Math.sqrt(Math.pow(a2p, 2) + Math.pow(b2, 2));
	const avgCp = (c1p + c2p) / 2;
	let h1p = rad2deg(Math.atan2(b1, a1p));
	if (h1p < 0) {
		h1p = h1p + 360;
	}
	let h2p = rad2deg(Math.atan2(b2, a2p));
	if (h2p < 0) {
		h2p = h2p + 360;
	}
	const avghp = Math.abs(h1p - h2p) > 180 ? (h1p + h2p + 360) / 2 : (h1p + h2p) / 2;
	const t =
		1 -
		0.17 * Math.cos(deg2rad(avghp - 30)) +
		0.24 * Math.cos(deg2rad(2 * avghp)) +
		0.32 * Math.cos(deg2rad(3 * avghp + 6)) -
		0.2 * Math.cos(deg2rad(4 * avghp - 63));
	let deltahp = h2p - h1p;
	if (Math.abs(deltahp) > 180) {
		if (h2p <= h1p) {
			deltahp += 360;
		} else {
			deltahp -= 360;
		}
	}
	const deltalp = l2 - l1;
	const deltacp = c2p - c1p;
	deltahp = 2 * Math.sqrt(c1p * c2p) * Math.sin(deg2rad(deltahp) / 2);
	const sl = 1 + (0.015 * Math.pow(avgL - 50, 2)) / Math.sqrt(20 + Math.pow(avgL - 50, 2));
	const sc = 1 + 0.045 * avgCp;
	const sh = 1 + 0.015 * avgCp * t;
	const deltaro = 30 * Math.exp(-Math.pow((avghp - 275) / 25, 2));
	const rc = 2 * Math.sqrt(Math.pow(avgCp, 7) / (Math.pow(avgCp, 7) + Math.pow(25, 7)));
	const rt = -rc * Math.sin(2 * deg2rad(deltaro));
	const kl = 1;
	const kc = 1;
	const kh = 1;
	const deltaE = Math.sqrt(
		Math.pow(deltalp / (kl * sl), 2) +
			Math.pow(deltacp / (kc * sc), 2) +
			Math.pow(deltahp / (kh * sh), 2) +
			rt * (deltacp / (kc * sc)) * (deltahp / (kh * sh))
	);
	return deltaE;
};

export const labDiff = (r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) =>
	deltaE00(...rgb2lab(r1, g1, b1), ...rgb2lab(r2, g2, b2));

export const rgbDiff = (r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) =>
	Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
