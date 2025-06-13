import type { RequestHandler } from "@sveltejs/kit";
import { createProxyService } from "$lib/services/http/proxy.service";
import { PROXY_ENDPOINTS } from "$lib/services/http/shared/endpoints";

export const POST: RequestHandler = async (event) => {
	const proxy = createProxyService(event);

	const { artworkContentType, artworkFileName, musicContentType, musicFileName } = await event.request.json();

	if (!artworkFileName || !artworkContentType || !musicFileName || !musicContentType) {
		return new Response(JSON.stringify({ error: "Missing fileName or contentType" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}

	const { status, body, cookies } = await proxy.forward("POST", PROXY_ENDPOINTS.AUDIO.PRESIGN, {
		artworkFileName,
		artworkContentType,
		musicFileName,
		musicContentType,
	});

	const headers = new Headers();

	for (const cookie of cookies) {
		headers.append("set-cookie", cookie.replace("Path=/api/v1/audio/", "Path=/"));
	}

	return new Response(JSON.stringify(body), {
		status,
		headers,
	});
};
