import type { RequestEvent } from "@sveltejs/kit";
import axios from "axios";
import { BACKEND_API_URL } from "$env/static/private";

function createBackendClient(event: RequestEvent) {
	const token = event.locals.accessToken;

	const client = axios.create({
		baseURL: BACKEND_API_URL,
		withCredentials: true,
		headers: token ? { Authorization: `Bearer ${token}` } : {},
	});

	return client;
}

export { createBackendClient };
