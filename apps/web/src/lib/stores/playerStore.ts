import { writable } from "svelte/store";
import type { ITrack } from "$lib/types";
import { browser } from "$app/environment";

let savedTrack;

if (browser) {
	savedTrack = localStorage.getItem("currentTrack");
}
const initialTrack: ITrack | null = savedTrack ? JSON.parse(savedTrack) : null;

export const currentTrack = writable<ITrack | null>(initialTrack);

currentTrack.subscribe((track) => {
	if (browser) {
		if (track) {
			localStorage.setItem("currentTrack", JSON.stringify(track));
		} else {
			localStorage.removeItem("currentTrack");
		}
	}
});
