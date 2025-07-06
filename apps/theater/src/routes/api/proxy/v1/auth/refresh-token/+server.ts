import type { RequestHandler } from "@sveltejs/kit";
import { createProxyService } from "$lib/services/http/proxy.service";
import { BACKEND_ENDPOINTS } from "$lib/services/http/shared/endpoints";

export const POST: RequestHandler = async (event) => {
	const proxy = createProxyService(event);

	const { body, status, cookies } = await proxy.forward("POST", BACKEND_ENDPOINTS.AUTH.REFRESH);

	const headers = new Headers();

	for (const cookie of cookies) {
		headers.append("set-cookie", cookie.replace("Path=/api/v1/auth/", "Path=/"));
	}

	return new Response(JSON.stringify(body), {
		status,
		headers,
	});
};
