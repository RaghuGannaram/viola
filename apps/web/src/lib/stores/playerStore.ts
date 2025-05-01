import { writable } from "svelte/store";
import { browser } from "$app/environment";
import type { ITrack } from "$lib/types";

function loadInitialTrack(): ITrack | null {
	if (!browser) return null;
	const stored = localStorage.getItem("currentTrack");
	return stored ? JSON.parse(stored) : null;
}

export const currentTrack = writable<ITrack | null>(loadInitialTrack());

if (browser) {
	currentTrack.subscribe((track) => {
		if (track) {
			const { blob, ...rest } = track;
			localStorage.setItem("currentTrack", JSON.stringify(rest));
		} else {
			localStorage.removeItem("currentTrack");
		}
	});
}
