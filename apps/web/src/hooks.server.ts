import { createAuthService } from "$lib/services/http";
import { type IProfile } from "$lib/types";
import { setParsedCookieFromBackend } from "$lib/utils";
import { isValidJwt, decodeJwt } from "$lib/utils/jwt";

export async function handle({ event, resolve }) {
	if (event.url.pathname.startsWith("/.well-known/")) {
		return new Response(null, { status: 204 });
	}
	const accessToken = event.cookies.get("accessToken");

	if (accessToken && isValidJwt(accessToken)) {
		const decoded = decodeJwt(accessToken);

		event.locals.accessToken = accessToken;
		event.locals.profile = decoded?.["profile"] as IProfile;
		return resolve(event);
	}

	const refreshToken = event.cookies.get("refreshToken");

	if (refreshToken) {
		try {
			const authService = createAuthService(event);
			const session = await authService.refresh(refreshToken);

			event.locals.accessToken = session.accessToken;

			event.cookies.set("accessToken", session.accessToken, {
				httpOnly: true,
				secure: true,
				sameSite: "Strict",
				path: "/",
				maxAge: 60 * 60 * 2,
			});

			const rawRefreshToken = session.cookies.find((c) => c.startsWith("refreshToken="));

			if (rawRefreshToken) setParsedCookieFromBackend(rawRefreshToken, event.cookies);
		} catch (err) {
			event.cookies.delete("refreshToken", { path: "/" });
			event.cookies.delete("accessToken", { path: "/" });
		}
	}

	return resolve(event);
}
