import { type ITrack } from "$lib/types";

async function openLocalCache(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open("viola-db", 1);

		request.onupgradeneeded = () => {
			const db = request.result;
			if (!db.objectStoreNames.contains("tracks")) {
				const store = db.createObjectStore("tracks", { keyPath: "id" });
				store.createIndex("name", "name", { unique: false });
				store.createIndex("title", "title", { unique: false });
				store.createIndex("artist", "artist", { unique: false });
				store.createIndex("album", "album", { unique: false });
			}
		};
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

async function fetchAllCachedTracks(): Promise<ITrack[]> {
	const db = await openLocalCache();

	return new Promise((resolve, reject) => {
		const transaction = db.transaction("tracks", "readonly");
		const store = transaction.objectStore("tracks");
		const request = store.getAll();

		request.onsuccess = () => {
			const records = request.result as ITrack[];
			const tracks = records.map((record) => ({
				...record,
				url: URL.createObjectURL(record.blob),
			}));
			resolve(tracks);
		};
		request.onerror = () => reject(request.error);
	});
}

async function searchCachedTracks(query: string): Promise<ITrack[]> {
	const db = await openLocalCache();

	return new Promise(async (resolve, reject) => {
		try {
			const transaction = db.transaction("tracks", "readonly");
			const store = transaction.objectStore("tracks");
			const results: ITrack[] = [];
			const cursorRequest = store.openCursor();

			cursorRequest.onsuccess = (event) => {
				const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>).result;
				if (cursor) {
					const track = cursor.value as ITrack;
					const fields = [track.name, track.title, track.artist, track.album];
					if (fields.filter(Boolean).some((field) => field!.toLowerCase().includes(query.toLowerCase()))) {
						results.push({ ...track, url: URL.createObjectURL(track.blob) });
					}
					cursor.continue();
				} else {
					resolve(results);
				}
			};
			cursorRequest.onerror = () => reject(cursorRequest.error);
		} catch (error) {
			reject(error);
		}
	});
}

async function addTrackToCache(track: ITrack): Promise<void> {
	const db = await openLocalCache();

	return new Promise((resolve, reject) => {
		const transaction = db.transaction("tracks", "readwrite");
		const store = transaction.objectStore("tracks");
		const request = store.add(track);

		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}

async function deleteTrackFromCache(id: string): Promise<void> {
	const db = await openLocalCache();

	return new Promise((resolve, reject) => {
		const transaction = db.transaction("tracks", "readwrite");
		const store = transaction.objectStore("tracks");
		const request = store.delete(id);

		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}

async function clearAllCachedTracks(): Promise<void> {
	const db = await openLocalCache();

	return new Promise((resolve, reject) => {
		const transaction = db.transaction("tracks", "readwrite");
		const store = transaction.objectStore("tracks");
		const request = store.clear();

		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}

export { fetchAllCachedTracks, searchCachedTracks, addTrackToCache, deleteTrackFromCache, clearAllCachedTracks };
