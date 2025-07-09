import proxyClient from "$lib/services/http/proxy/client";
import { PROXY_ENDPOINTS } from "$lib/services/http/shared/endpoints";
import { ViolaHttpError } from "$lib/services/http/shared/errors";
import { stellarStore } from "$lib/stores/stellarStore";
import { CosmicCache } from "$lib/types";
import { logError } from "$lib/utils/logger";

export const trackSpark = stellarStore(CosmicCache.TRACK_SPARK, async ({ params }) => {
	try {
		const response = await proxyClient.get(PROXY_ENDPOINTS.AUDIO.LIST_TRACKS.replace(":id", params?.["id"] ?? ""));

		const { success } = response.data;

		if (!success) {
			const { status, type, cause } = response.data;

			throw new ViolaHttpError(status, "Retrieving Track list failed", type, cause);
		}

		const { data } = response.data;

		return data.tracks;
	} catch (err: any) {
		logError("viola:error:trackSpark", err);

		if (err instanceof ViolaHttpError) {
			throw err;
		}

		throw new ViolaHttpError(500, "Unexpected error in trackSpark", "INTERNAL_ERROR", err);
	}
});
