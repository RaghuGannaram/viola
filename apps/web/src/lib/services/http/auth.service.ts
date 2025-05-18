import type { RequestEvent } from "@sveltejs/kit";
import { createBackendClient } from "./backend/client";
import { BACKEND_ENDPOINTS } from "./shared/endpoints";
import type { ILoginRequest, IRegisterRequest, ILogoutResponse, IAuthResponse, IRefreshResponse } from "$lib/types";

function createAuthService(event: RequestEvent) {
	const client = createBackendClient(event);

	return {
		async login(data: ILoginRequest): Promise<IAuthResponse> {
			const res = await client.post(BACKEND_ENDPOINTS.AUTH.LOGIN, data);
			return {
				...res.data,
				cookies: res.headers["set-cookie"] ?? [],
			};
		},

		async register(data: IRegisterRequest): Promise<IAuthResponse> {
			const res = await client.post(BACKEND_ENDPOINTS.AUTH.REGISTER, data);
			return res.data;
		},

		async refresh(refreshToken: string): Promise<IRefreshResponse> {
			const res = await client.post(BACKEND_ENDPOINTS.AUTH.REFRESH, {}, { headers: { Cookie: `refreshToken=${refreshToken}` } });

			return {
				...res.data,
				cookies: res.headers["set-cookie"] ?? [],
			};
		},

		async logout(): Promise<ILogoutResponse> {
			const res = await client.post(BACKEND_ENDPOINTS.AUTH.LOGOUT);
			return res.data;
		},
	};
}

export { createAuthService };
