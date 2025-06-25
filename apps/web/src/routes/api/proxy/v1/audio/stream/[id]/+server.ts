import type { RequestHandler } from "@sveltejs/kit";
import { createProxyService } from "$lib/services/http/proxy.service";
import { PROXY_ENDPOINTS } from "$lib/services/http/shared/endpoints";

export const GET: RequestHandler = async (event) => {
	const proxy = createProxyService(event);

	const id = event.params["id"];

	if (!id) {
		return new Response("Missing audio id", { status: 400 });
	}

	const { status, body, cookies } = await proxy.forward("GET", `${PROXY_ENDPOINTS.AUDIO.STREAM}/${id}`);

	const headers = new Headers();

	for (const cookie of cookies) {
		headers.append("set-cookie", cookie.replace("Path=/api/v1/audio/", "Path=/"));
	}

	return new Response(JSON.stringify(body), {
		status,
		headers,
	});
};
