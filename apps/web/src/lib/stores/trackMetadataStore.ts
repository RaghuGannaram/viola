import proxyClient from "$lib/services/http/proxy/client";
import { PROXY_ENDPOINTS } from "$lib/services/http/shared/endpoints";
import { cacheStore } from "$lib/stores/cacheStore";
import { CACHE_COLLECTION } from "$lib/types";

export const trackMetadataList = cacheStore(CACHE_COLLECTION.TRACK_METADATA, async () => {
	const response = await proxyClient.get(PROXY_ENDPOINTS.AUDIO.LIST);

	return response.data;
});
