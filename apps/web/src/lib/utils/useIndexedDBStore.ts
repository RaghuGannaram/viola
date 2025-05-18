import { writable, type Writable } from "svelte/store";

type StoreConfig<T> = {
	dbName: string;
	storeName: string;
	key: IDBValidKey;
	initialValue: T;
	persist?: boolean;
};

export function useIndexedDBStore<T>(config: StoreConfig<T>): Writable<T> {
	const { dbName, storeName, key, initialValue, persist = true } = config;

	const store = writable<T>(initialValue);

	async function openDB(): Promise<IDBDatabase> {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(dbName, 1);

			request.onupgradeneeded = () => {
				request.result.createObjectStore(storeName);
			};
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	}

	async function readFromIndexedDB() {
		const db = await openDB();
		return new Promise<T | null>((resolve, reject) => {
			const tx = db.transaction(storeName, "readonly");
			const objStore = tx.objectStore(storeName);
			const request = objStore.get(key);

			request.onsuccess = () => resolve(request.result ?? null);
			request.onerror = () => reject(request.error);
		});
	}

	async function writeToIndexedDB(value: T) {
		const db = await openDB();
		const tx = db.transaction(storeName, "readwrite");
		const objStore = tx.objectStore(storeName);
		objStore.put(value, key);
	}

	// Client-side hydration
	if (typeof window !== "undefined") {
		readFromIndexedDB().then((value) => {
			if (value !== null) {
				store.set(value);
			}
		});

		if (persist) {
			store.subscribe((value) => {
				writeToIndexedDB(value).catch(console.error);
			});
		}
	}

	return store;
}
