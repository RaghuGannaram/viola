import { fail, redirect, type Actions } from "@sveltejs/kit";
import { createAuthService } from "$lib/services/http";
import { setParsedCookieFromBackend } from "$lib/utils";

export const actions: Actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const email = data.get("email");
		const password = data.get("password");

		if (!email || !password) {
			return fail(400, { error: "Email and password are required." });
		}

		try {
			const authService = createAuthService(event);
			const result = await authService.login({
				email: email.toString(),
				password: password.toString(),
			});

			event.cookies.set("profile", JSON.stringify(result.profile), {
				httpOnly: false,
				secure: true,
				sameSite: "Strict",
				path: "/",
				maxAge: 60 * 60 * 24 * 7,
			});

			event.cookies.set("accessToken", result.accessToken, {
				httpOnly: true,
				secure: true,
				sameSite: "Strict",
				path: "/",
				maxAge: 60 * 60 * 2,
			});

			const rawRefreshToken = result.cookies?.find((cookie) => cookie.startsWith("refreshToken="));

			if (rawRefreshToken) setParsedCookieFromBackend(rawRefreshToken, event.cookies);
		} catch (err) {
			return fail(400, { error: "Invalid credentials or server error." });
		}

		const redirectTo = event.url.searchParams.get("redirect") || "/dashboard";

		throw redirect(302, redirectTo);
	},
};
