import type { RequestEvent } from "@sveltejs/kit";
import { createBackendClient } from "./backend/client";

function createProxyService(event: RequestEvent) {
	const client = createBackendClient(event);

	return {
		async forward(method: "GET" | "POST" | "PATCH" | "DELETE", path: string, data?: any) {
			const res = await client.request({
				method,
				url: path,
				data,
			});

			return {
				status: res.status,
				body: res.data,
				cookies: res.headers["set-cookie"] ?? [],
			};
		},
	};
}

export { createProxyService };
