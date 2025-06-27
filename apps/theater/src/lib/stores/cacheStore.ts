import { writable } from "svelte/store";
import { browser } from "$app/environment";
import CacheLayer from "$lib/cache";
import { CACHE_COLLECTION, type ICollectionSchema } from "$lib/types/cache.types";

export function cacheStore<K extends CACHE_COLLECTION>(collectionKey: K, fetchCollection: () => Promise<ICollectionSchema[K]>) {
	const { subscribe, set } = writable<ICollectionSchema[K]>([]);

	async function hydrate() {
		if (!browser) return;

		await CacheLayer.validate(collectionKey);

		const cached = await CacheLayer.retrieve(collectionKey);
		set(cached);

		// if (cached.length === 0) {
		const backendData = await fetchCollection();

		await CacheLayer.sync(collectionKey, backendData);

		set(backendData);
		// }
	}

	async function refresh() {
		const backendData = await fetchCollection();

		await CacheLayer.sync(collectionKey, backendData);

		set(backendData);
	}

	async function purge() {
		await CacheLayer.purge(collectionKey);

		set([]);
	}

	return { subscribe, hydrate, refresh, purge };
}
