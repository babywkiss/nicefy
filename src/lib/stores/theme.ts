import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const defaultValue = browser ? localStorage.getItem('theme') ?? 'light' : 'light';
const themeStore = writable<string>(defaultValue);

themeStore.subscribe(async (value) => {
	if (browser) {
		localStorage.setItem('theme', value);
		document.documentElement.classList.remove(value === 'dark' ? 'light' : 'dark');
		document.documentElement.classList.add(value);
	}
});

export default themeStore;
