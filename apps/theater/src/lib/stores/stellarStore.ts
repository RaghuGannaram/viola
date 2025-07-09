import { writable } from "svelte/store";
import { browser } from "$app/environment";
import cosmicCache from "$lib/cache/cosmic.cache";
import { CosmicCache, type ICosmicRegistry } from "$lib/types/cache.types";

export function stellarStore<K extends CosmicCache>(cosmicKey: K, fetchCosmos: (opts: { params?: Record<string, any> }) => Promise<ICosmicRegistry[K]>) {
	const { subscribe, set } = writable<ICosmicRegistry[K]>([]);

	async function hydrate(params?: Record<string, any>) {
		if (!browser) return;

		await cosmicCache.validate(cosmicKey, params?.["id"]);

		const cached = await cosmicCache.retrieve(cosmicKey, params?.["id"]);

		if (!cached) {
			const backendData = await fetchCosmos({ params: params ?? {} });

			await cosmicCache.sync(cosmicKey, backendData, params?.["id"]);

			set(backendData);
		} else {
			set(cached);
		}
	}

	async function refresh(params?: Record<string, any>) {
		const backendData = await fetchCosmos({ params: params ?? {} });

		await cosmicCache.sync(cosmicKey, backendData, params?.["id"]);

		set(backendData);
	}

	async function purge(params?: Record<string, any>) {
		await cosmicCache.purge(cosmicKey, params?.["id"]);

		set([]);
	}

	return { subscribe, hydrate, refresh, purge };
}
