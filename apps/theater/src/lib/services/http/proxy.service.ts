import type { RequestEvent } from "@sveltejs/kit";
import FormData from "form-data";
import { createBackendClient } from "$lib/services/http/backend/client";

function createProxyService(event: RequestEvent) {
	const client = createBackendClient(event);

	return {
		async forward(method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE", path: string, data?: any) {
			let headers: Record<string, string> = {};
			let body = data;

			if (data instanceof FormData) {
				headers = data.getHeaders();
			} else if (data && typeof data === "object") {
				headers = { "Content-Type": "application/json" };

				body = JSON.stringify(data);
			}

			const res = await client.request({
				method,
				url: path,
				data: body,
				headers,
				maxBodyLength: Infinity,
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
