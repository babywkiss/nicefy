import { createThemes } from 'tw-colors';

/** @type {import('tailwindcss').Config} */
export default {
	future: {
		hoverOnlyWhenSupported: true
	},
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		fontFamily: {
			sans: ['Fira Code Variable']
		},
		extend: {}
	},
	plugins: [
		createThemes({
			light: {
				basec: '#faf4ed',
				surface: '#fffaf3',
				overlay: '#f2e9e1',
				muted: '#9893a5',
				subtle: '#797593',
				text: '#575279',
				love: '#b4637a',
				gold: '#ea9d34',
				rose: '#d7827e',
				pine: '#286983',
				foam: '#56949f',
				iris: '#907aa9',
				highlightlow: '#f4ede8',
				highlightmed: '#dfdad9',
				highlighthigh: '#cecacd'
			},
			dark: {
				basec: '#191724',
				surface: '#1f1d2e',
				overlay: '#26233a',
				muted: '#6e6a86',
				subtle: '#908caa',
				text: '#e0def4',
				love: '#eb6f92',
				gold: '#f6c177',
				rose: '#ebbcba',
				pine: '#31748f',
				foam: '#9ccfd8',
				iris: '#c4a7e7',
				highlightlow: '#21202e',
				highlightmed: '#403d52',
				highlighthigh: '#524f67'
			}
		})
	]
};
