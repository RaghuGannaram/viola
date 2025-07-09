import { CosmicCache, STELLAR_DECAY_MAP, type ICosmicRegistry } from "$lib/types";

const DB_NAME = "viola-cosmic-cache";
const DB_VERSION = 3;

async function openCosmicCache(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onupgradeneeded = () => {
			const db = request.result;

			Object.values(CosmicCache).forEach((cosmicKey) => {
				if (!db.objectStoreNames.contains(cosmicKey)) {
					const store = db.createObjectStore(cosmicKey, { keyPath: "id" });

					// if (cosmicKey === CosmicCache.TRACK_SPARK || cosmicKey === CosmicCache.TRACK_NOVA) {
					// 	store.createIndex("title", "title", { unique: false });
					// 	store.createIndex("artist", "artist", { unique: false });
					// 	store.createIndex("album", "album", { unique: false });
					// }
				}
			});
		};

		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

async function sync<K extends CosmicCache>(cosmicKey: K, data: ICosmicRegistry[K], id?: string): Promise<void> {
	const db = await openCosmicCache();
	const transaction = db.transaction(cosmicKey, "readwrite");
	const store = transaction.objectStore(cosmicKey);

	if (id) {
		const record = Array.isArray(data) ? data[0] : data;
		store.put({ ...record, id, cachedAt: Date.now() });
	} else {
		for (const item of data) {
			store.put({ ...item, cachedAt: Date.now() });
		}
	}

	return new Promise((resolve, reject) => {
		transaction.oncomplete = () => resolve();
		transaction.onerror = () => reject(transaction.error);
	});
}

async function retrieve<K extends CosmicCache>(cosmicKey: K, id?: string): Promise<ICosmicRegistry[K] | null> {
	const db = await openCosmicCache();
	const transaction = db.transaction(cosmicKey, "readonly");
	const store = transaction.objectStore(cosmicKey);

	if (id) {
		return new Promise((resolve, reject) => {
			const request = store.get(id);
			request.onsuccess = () => resolve(request.result ? request.result : null);
			request.onerror = () => reject(request.error);
		});
	}

	return new Promise((resolve, reject) => {
		const request = store.getAll();

		request.onsuccess = () => {
			const sorted = request.result.sort((a, b) => {
				const titleA = a.title?.toLowerCase() || "";
				const titleB = b.title?.toLowerCase() || "";
				return titleA.localeCompare(titleB);
			});

			if (!sorted.length) {
				resolve(null);
			}

			resolve(sorted);
		};
		request.onerror = () => reject(request.error);
	});
}

async function remove<K extends CosmicCache>(cosmicKey: K, id: string): Promise<void> {
	const db = await openCosmicCache();

	return new Promise((resolve, reject) => {
		const transaction = db.transaction(cosmicKey, "readwrite");
		const store = transaction.objectStore(cosmicKey);
		const request = store.delete(id);

		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}

async function purge<K extends CosmicCache>(cosmicKey: K, id?: string): Promise<void> {
	const db = await openCosmicCache();
	const transaction = db.transaction(cosmicKey, "readwrite");
	const store = transaction.objectStore(cosmicKey);

	if (id) {
		store.delete(id);
	} else {
		store.clear();
	}

	return new Promise((resolve, reject) => {
		transaction.oncomplete = () => resolve();
		transaction.onerror = () => reject(transaction.error);
	});
}

async function validate<K extends CosmicCache>(cosmicKey: K, id?: string): Promise<void> {
	const db = await openCosmicCache();
	const transaction = db.transaction(cosmicKey, "readwrite");
	const store = transaction.objectStore(cosmicKey);

	if (id) {
		return new Promise((resolve, reject) => {
			const request = store.get(id);

			request.onsuccess = () => {
				const now = Date.now();
				const ttl = STELLAR_DECAY_MAP[cosmicKey] || 0;

				const item = request.result;
				if (item && now - item.cachedAt > ttl) store.delete(id);

				resolve();
			};
			request.onerror = () => reject(request.error);
		});
	}

	return new Promise((resolve, reject) => {
		const request = store.getAll();

		request.onsuccess = () => {
			const now = Date.now();
			const ttl = STELLAR_DECAY_MAP[cosmicKey] || 0;

			const itemsToDelete = request.result.filter((item) => now - item.cachedAt > ttl).map((item) => item.id);
			itemsToDelete.forEach((expiredId) => store.delete(expiredId));

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
