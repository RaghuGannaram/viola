import { localStore } from "$lib/stores/localStore";

export const theme = localStore<string | null>("data-mode", "dark");
