import proxyClient from "$lib/services/http/proxy/client";
import { PROXY_ENDPOINTS } from "$lib/services/http/shared/endpoints";
import { ViolaHttpError } from "$lib/services/http/shared/errors";
import { stellarStore } from "$lib/stores/stellarStore";
import { CosmicCache } from "$lib/types";
import { logError } from "$lib/utils/logger";

export const artistSpark = stellarStore(CosmicCache.ARTIST_SPARK, async () => {
	try {
		const response = await proxyClient.get(PROXY_ENDPOINTS.AUDIO.LIST_ARTISTS);

		const { success } = response.data;

		if (!success) {
			const { status, type, cause } = response.data;

			throw new ViolaHttpError(status, "Retrieving Artist failed", type, cause);
		}

		const { data } = response.data;

		return data.artists;
	} catch (err: any) {
		logError("viola:error:artistSpark", err);

		if (err instanceof ViolaHttpError) {
			throw err;
		}

		throw new ViolaHttpError(500, "Unexpected error in artistSpark", "INTERNAL_ERROR", err);
	}
});
