import type { RequestEvent } from "@sveltejs/kit";
import axios from "axios";

import { BACKEND_API_URL } from "$env/static/private";

function createBackendClient(event: RequestEvent) {
	const bearerToken = event.request.headers.get("authorization");
	const cookies = event.request.headers.get("cookie");

	const headers: Record<string, string> = {};

	if (bearerToken) {
		headers["Authorization"] = bearerToken;
	}
	if (cookies) {
		headers["Cookie"] = cookies;
	}

	const client = axios.create({
		baseURL: BACKEND_API_URL,
		withCredentials: true,
		headers,
		validateStatus: () => true,
	});

	return client;
}

export { createBackendClient };
