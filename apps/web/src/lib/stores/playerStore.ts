import { writable } from "svelte/store";
import { type ITrack } from "$lib/types";

export const currentTrack = writable<ITrack | null>(null);
