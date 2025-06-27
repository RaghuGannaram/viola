import { writable } from "svelte/store";
import { localStore } from "$lib/stores/localStore";
import type { IProfile } from "$lib/types";

export const accessToken = writable<string | null>(null);
export const profile = localStore<IProfile | null>("profile", null);
