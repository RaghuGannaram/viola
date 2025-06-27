import type { RequestEvent } from "@sveltejs/kit";
import { createBackendClient } from "$lib/services/http/backend/client";
import { BACKEND_ENDPOINTS } from "$lib/services/http/shared/endpoints";
import type { ILoginRequest, IRegisterRequest, ILogoutResponse, IAuthResponse, IRefreshResponse } from "$lib/types";

function createAuthService(event: RequestEvent) {
	const client = createBackendClient(event);

	return {
		async register(data: IRegisterRequest): Promise<IAuthResponse> {
			const res = await client.post(BACKEND_ENDPOINTS.AUTH.REGISTER, data);
			return {
				...res.data,
				cookies: res.headers["set-cookie"] ?? [],
			};
		},

		async login(data: ILoginRequest): Promise<IAuthResponse> {
			const res = await client.post(BACKEND_ENDPOINTS.AUTH.LOGIN, data);
			return {
				...res.data,
				cookies: res.headers["set-cookie"] ?? [],
			};
		},

		async refresh(): Promise<IRefreshResponse> {
			const res = await client.post(BACKEND_ENDPOINTS.AUTH.REFRESH, {});

			return {
				...res.data,
				cookies: res.headers["set-cookie"] ?? [],
			};
		},

		async logout(): Promise<ILogoutResponse> {
			const res = await client.delete(BACKEND_ENDPOINTS.AUTH.LOGOUT);
			return res.data;
		},
	};
}

export { createAuthService };
