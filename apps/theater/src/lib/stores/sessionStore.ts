import { writable } from "svelte/store";
import { browser } from "$app/environment";

export function sessionStore<T>(key: string, initialValue: T) {
	const storedValue = browser ? sessionStorage.getItem(`viola:${key}`) : null;
	const parsed = storedValue ? (JSON.parse(storedValue) as T) : initialValue;

	const store = writable<T>(parsed);

	if (browser) {
		store.subscribe((value) => {
			sessionStorage.setItem(`viola:${key}`, JSON.stringify(value));
		});
	}

	return store;
}
