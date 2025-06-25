import { localStore } from "$lib/stores/localStore";
import type { ITrack } from "$lib/types";

export const playback = localStore<ITrack | null>("playback", null);
