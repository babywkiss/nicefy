export const rgba2lab = (r: number, g: number, b: number, a = 1) => {
	const [x, y, z] = rgb2xyz(r, g, b, a);
	return xyz2lab(x, y, z); // [l, a, b]
};

const rgb2xyz = (r: number, g: number, b: number, a = 1) => {
	if (r > 255) {
		r = 255;
	} else if (r < 0) {
		r = 0;
	}
	if (g > 255) {
		g = 255;
	} else if (g < 0) {
		g = 0;
	}
	if (b > 255) {
		b = 255;
	} else if (b < 0) {
		b = 0;
	}
	if (a > 1) {
		a = 1;
	} else if (a < 0) {
		a = 0;
	}
	r = r / 255;
	g = g / 255;
	b = b / 255;
	if (r > 0.04045) {
		r = Math.pow((r + 0.055) / 1.055, 2.4);
	} else {
		r = r / 12.92;
	}
	if (g > 0.04045) {
		g = Math.pow((g + 0.055) / 1.055, 2.4);
	} else {
		g = g / 12.92;
	}
	if (b > 0.04045) {
		b = Math.pow((b + 0.055) / 1.055, 2.4);
	} else {
		b = b / 12.92;
	}
	r = r * 100;
	g = g * 100;
	b = b * 100;
	const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
	const y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
	const z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;
	return [x, y, z];
};

export const xyz2lab = (x: number, y: number, z: number) => {
	const referenceX = 94.811;
	const referenceY = 100;
	const referenceZ = 107.304;
	x = x / referenceX;
	y = y / referenceY;
	z = z / referenceZ;
	if (x > 0.008856) {
		x = Math.pow(x, 1 / 3);
	} else {
		x = 7.787 * x + 16 / 116;
	}
	if (y > 0.008856) {
		y = Math.pow(y, 1 / 3);
	} else {
		y = 7.787 * y + 16 / 116;
	}
	if (z > 0.008856) {
		z = Math.pow(z, 1 / 3);
	} else {
		z = 7.787 * z + 16 / 116;
	}
	const l = 116 * y - 16;
	const a = 500 * (x - y);
	const b = 200 * (y - z);
	return [l, a, b];
};

const rad2deg = (rad: number) => (360 * rad) / (2 * Math.PI);
const deg2rad = (deg: number) => (2 * Math.PI * deg) / 360;

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
