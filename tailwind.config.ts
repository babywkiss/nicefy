import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},

	daisyui: {
		themes: [
			{
				rosepine: {
					primary: '#c4a7e7',
					secondary: '#ebbcba',
					accent: '#f6c177',
					neutral: '#26233a',
					'base-100': '#26233a',
					'base-200': '#1f1d2e',
					'base-300': '#191724',
					'base-content': '#e0def4',
					info: '#31748f',
					success: '#9ccfd8',
					warning: '#f6c177',
					error: '#eb6f92',

					'--rounded-box': '1.2rem',
					'--rounded-btn': '0.8rem',
					'--rounded-badge': '0.4rem',
					'--tab-radius': '0.7rem',

					'--animation-btn': `230ms`, // duration of animation when you click on button
					'--animation-input': `230ms`, // duration of animation for inputs like checkbox, toggle, radio, etc
					'--btn-focus-scale': '0.95', // scale transform of button when you focus on it
					'--border-btn': '1px', // border width of buttons
					'--tab-border': '1px' // border width of tabs
				}
			}
		]
	},

	plugins: [daisyui]
} satisfies Config;
