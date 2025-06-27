import axios from "axios";
import { get } from "svelte/store";
import { setupInterceptors } from "./interceptors";
import { PUBLIC_API_PROXY_BASE } from "$env/static/public";
import { accessToken } from "$lib/stores/authStore";

const proxyClient = axios.create({
	baseURL: PUBLIC_API_PROXY_BASE,
	withCredentials: true,
});

proxyClient.interceptors.request.use((config) => {
	const token = get(accessToken);
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

setupInterceptors(proxyClient);

export default proxyClient;
