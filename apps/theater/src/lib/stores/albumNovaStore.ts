import proxyClient from "$lib/services/http/proxy/client";
import { PROXY_ENDPOINTS } from "$lib/services/http/shared/endpoints";
import { ViolaHttpError } from "$lib/services/http/shared/errors";
import { stellarStore } from "$lib/stores/stellarStore";
import { CosmicCache } from "$lib/types";
import { logError } from "$lib/utils/logger";

export const albumNova = stellarStore(CosmicCache.ALBUM_NOVA, async ({ params }) => {
	try {
		const response = await proxyClient.get(PROXY_ENDPOINTS.AUDIO.SHOW_ALBUM.replace(":id", params?.["id"] ?? ""));

		const { success } = response.data;

		if (!success) {
			const { status, type, cause } = response.data;

			throw new ViolaHttpError(status, "Retrieving Album list failed", type, cause);
		}

		const { data } = response.data;

		return data.album;
	} catch (err: any) {
		logError("viola:error:albumNova", err);

		if (err instanceof ViolaHttpError) {
			throw err;
		}

		throw new ViolaHttpError(500, "Unexpected error in albumNova", "INTERNAL_ERROR", err);
	}
});
