import proxyClient from "$lib/services/http/proxy/client";
import { PROXY_ENDPOINTS } from "$lib/services/http/shared/endpoints";
import { ViolaHttpError } from "$lib/services/http/shared/errors";
import { stellarStore } from "$lib/stores/stellarStore";
import { CosmicCache } from "$lib/types";
import { logError } from "$lib/utils/logger";

export const artistNova = stellarStore(CosmicCache.ARTIST_NOVA, async ({ params }) => {
	try {
		const response = await proxyClient.get(PROXY_ENDPOINTS.AUDIO.SHOW_ARTIST.replace(":id", params?.["id"] ?? ""));

		const { success } = response.data;

		if (!success) {
			const { status, type, cause } = response.data;

			throw new ViolaHttpError(status, "Retrieving Artist list failed", type, cause);
		}

		const { data } = response.data;

		return data.artist;
	} catch (err: any) {
		logError("viola:error:artistNova", err);

		if (err instanceof ViolaHttpError) {
			throw err;
		}

		throw new ViolaHttpError(500, "Unexpected error in artistNova", "INTERNAL_ERROR", err);
	}
});
