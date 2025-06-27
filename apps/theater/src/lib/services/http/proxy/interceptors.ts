import axios from "axios";
import type { AxiosInstance } from "axios";
import { accessToken } from "$lib/stores/authStore";

let refreshProgress = false;
let queue: ((token: string) => void)[] = [];

function subscribe(callback: (token: string) => void) {
	queue.push(callback);
}

function publish(newToken: string) {
	queue.forEach((cb) => cb(newToken));
	queue = [];
}

export function setupInterceptors(client: AxiosInstance) {
	client.interceptors.response.use(
		(response) => response,
		async (error) => {
			const original = error.config;

			if (error.response?.status === 401 && !original._retry) {
				original._retry = true;

				if (refreshProgress) {
					return new Promise((resolve) => {
						subscribe((token: string) => {
							original.headers.Authorization = `Bearer ${token}`;
							resolve(client(original));
						});
					});
				}

				refreshProgress = true;
				try {
					const res = await axios.post("/api/proxy/v1/auth/refresh-token", {}, { withCredentials: true });
					const newAccessToken = res.data.accessToken;

					accessToken.set(newAccessToken);
					publish(newAccessToken);

					refreshProgress = false;

					original.headers.Authorization = `Bearer ${newAccessToken}`;

					return client(original);
				} catch (err) {
					refreshProgress = false;

					accessToken.set(null);

					return Promise.reject(err);
				}
			}

			return Promise.reject(error);
		},
	);
}
