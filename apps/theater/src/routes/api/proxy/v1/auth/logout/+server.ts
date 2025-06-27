import type { RequestHandler } from "@sveltejs/kit";
import { createProxyService } from "$lib/services/http/proxy.service";
import { BACKEND_ENDPOINTS } from "$lib/services/http/shared/endpoints";

export const DELETE: RequestHandler = async (event) => {
	const proxy = createProxyService(event);

	const { status, body, cookies } = await proxy.forward("DELETE", BACKEND_ENDPOINTS.AUTH.LOGOUT);

	const headers = new Headers();

	headers.append("set-cookie", "accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict; Secure");
	headers.append("set-cookie", "refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict; Secure");

	return new Response(JSON.stringify(body), {
		status,
		headers,
	});
};
