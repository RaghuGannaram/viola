import type { RequestHandler } from "@sveltejs/kit";
import { createProxyService } from "$lib/services/http/proxy.service";
import { BACKEND_ENDPOINTS } from "$lib/services/http/shared/endpoints";

export const GET: RequestHandler = async (event) => {
	const proxy = createProxyService(event);

	const { status, body, cookies } = await proxy.forward("GET", BACKEND_ENDPOINTS.AUDIO.LIST_ARTISTS);

	const headers = new Headers();

	for (const cookie of cookies) {
		headers.append("set-cookie", cookie.replace("Path=/api/v1/audio/", "Path=/"));
	}

	return new Response(JSON.stringify(body), {
		status,
		headers,
	});
};
