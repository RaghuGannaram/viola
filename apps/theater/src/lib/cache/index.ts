import { CACHE_COLLECTION, CACHE_TTL_MAP, type ICollectionSchema } from "$lib/types";

const DB_NAME = "viola-local-cache";
const DB_VERSION = 1;

async function openLocalCache(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onupgradeneeded = () => {
			const db = request.result;

			Object.values(CACHE_COLLECTION).forEach((collectionKey) => {
				if (!db.objectStoreNames.contains(collectionKey)) {
					const store = db.createObjectStore(collectionKey, { keyPath: "id" });

					if (collectionKey === CACHE_COLLECTION.TRACK_METADATA || collectionKey === CACHE_COLLECTION.TRACK_DETAIL) {
						store.createIndex("title", "title", { unique: false });
						store.createIndex("artist", "artist", { unique: false });
						store.createIndex("album", "album", { unique: false });
					}
				}
			});
		};
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

async function sync<K extends CACHE_COLLECTION>(collectionKey: K, data: ICollectionSchema[K]): Promise<void> {
	const db = await openLocalCache();

	return new Promise((resolve, reject) => {
		const transaction = db.transaction(collectionKey, "readwrite");
		const store = transaction.objectStore(collectionKey);

		for (const item of data) {
			store.put({ ...item, cachedAt: Date.now() });
		}

		transaction.oncomplete = () => resolve();
		transaction.onerror = () => reject(transaction.error);
	});
}

async function retrieve<K extends CACHE_COLLECTION>(collectionKey: K): Promise<ICollectionSchema[K]> {
	const db = await openLocalCache();

	return new Promise((resolve, reject) => {
		const transaction = db.transaction(collectionKey, "readonly");
		const store = transaction.objectStore(collectionKey);

		const request = store.getAll();

		request.onsuccess = () => {
			const sorted = request.result.sort((a, b) => {
				const titleA = a.title?.toLowerCase() || "";
				const titleB = b.title?.toLowerCase() || "";
				return titleA.localeCompare(titleB);
			});

			resolve(sorted);
		};
		request.onerror = () => reject(request.error);
	});
}

async function remove<K extends CACHE_COLLECTION>(collectionKey: K, id: string): Promise<void> {
	const db = await openLocalCache();

	return new Promise((resolve, reject) => {
		const transaction = db.transaction(collectionKey, "readwrite");
		const store = transaction.objectStore(collectionKey);
		const request = store.delete(id);

		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}

async function purge(collectionKey: CACHE_COLLECTION): Promise<void> {
	const db = await openLocalCache();

	return new Promise((resolve, reject) => {
		const transaction = db.transaction(collectionKey, "readwrite");
		const store = transaction.objectStore(collectionKey);
		const request = store.clear();

		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}

async function validate<K extends CACHE_COLLECTION>(collectionKey: K): Promise<void> {
	const db = await openLocalCache();

	return new Promise((resolve, reject) => {
		const transaction = db.transaction(collectionKey, "readwrite");
		const store = transaction.objectStore(collectionKey);
		const request = store.getAll();

		request.onsuccess = () => {
			const now = Date.now();
			const itemsToDelete: string[] = [];
			const ttl = CACHE_TTL_MAP[collectionKey] || 0;

			for (const item of request.result) {
				if (now - item.cachedAt > ttl) {
					itemsToDelete.push(item.id);
				}
			}

			itemsToDelete.forEach((id) => store.delete(id));
			resolve();
		};

		request.onerror = () => reject(request.error);
	});
}

export default {
	sync,
	retrieve,
	remove,
	purge,
	validate,
};
