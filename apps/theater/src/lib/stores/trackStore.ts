// import { writable } from "svelte/store";
// import { browser } from "$app/environment";
// import { fetchAllCachedTracks, addTrackToCache, searchCachedTracks, deleteTrackFromCache, clearAllCachedTracks } from "$lib/cache/indexedDB";
// import { type ITrack } from "$lib/types";
// import { extractMetadata } from "$lib/utils";

// function createTrackStore() {
// 	const { subscribe, set, update } = writable<ITrack[]>([]);

// 	if (browser) {
// 		fetchAllCachedTracks().then((cachedTracks) => {
// 			const tracksWithUrls = cachedTracks.map((track) => ({
// 				...track,
// 				url: URL.createObjectURL(track.blob),
// 			}));
// 			set(tracksWithUrls);
// 		});
// 	}

// 	return {
// 		subscribe,
// 		add: async (files: File[]) => {
// 			if (browser) {
// 				try {
// 					const newTracks = await Promise.all(
// 						files.map(async (file) => {
// 							const id = crypto.randomUUID();
// 							const meta = await extractMetadata(file);
// 							const trackData: ITrack = { id, name: file.name, blob: file, url: "", ...meta };

// 							await addTrackToCache(trackData);

// 							const url = URL.createObjectURL(file);
// 							return { ...trackData, url };
// 						}),
// 					);
// 					update((currentTracks) => [...currentTracks, ...newTracks]);
// 				} catch (error) {
// 					console.error("Error adding tracks:", error);
// 				}
// 			}
// 		},
// 		search: async (query: string): Promise<ITrack[]> => {
// 			if (browser) {
// 				const matchedTracks = await searchCachedTracks(query);
// 				return matchedTracks.map((track) => ({
// 					...track,
// 					url: URL.createObjectURL(track.blob),
// 				}));
// 			} else {
// 				return Promise.resolve([]);
// 			}
// 		},
// 		delete: async (id: string) => {
// 			if (browser) {
// 				try {
// 					await deleteTrackFromCache(id);
// 					update((currentTracks) => currentTracks.filter((track) => track.id !== id));
// 				} catch (error) {
// 					console.error("Error deleting track:", error);
// 				}
// 			} else {
// 				update((currentTracks) => currentTracks.filter((track) => track.id !== id));
// 			}
// 		},
// 		clear: async () => {
// 			if (browser) {
// 				try {
// 					await clearAllCachedTracks();
// 					set([]);
// 				} catch (error) {
// 					console.error("Error clearing tracks:", error);
// 				}
// 			} else {
// 				set([]);
// 			}
// 		},
// 	};
// }

// export const trackList = createTrackStore();
