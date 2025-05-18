import { writable } from "svelte/store";
import { browser } from "$app/environment";
import type { IProfile } from "$lib/types";

export const accessToken = writable<string | null>(null);
export const profile = writable<IProfile | null>(null);

if (browser) {
	const storedProfile = localStorage.getItem("profile");

	if (storedProfile) {
		profile.set(JSON.parse(storedProfile));
	}
}
