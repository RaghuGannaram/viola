import type { Cookies } from "@sveltejs/kit";

function parseSetCookieString(setCookieStr: string) {
	const parts = setCookieStr.split(";").map((p) => p.trim());
	const [nameValue, ...attrs] = parts;

	const [name = "", value = ""] = nameValue?.split("=") ?? [];
	const options: Record<string, any> = {};

	for (const attr of attrs) {
		const [rawKey = "", rawVal = ""] = attr.split("=") ?? [];
		const key = rawKey.toLowerCase();
		const val = rawVal.trim();

		switch (key) {
			case "path":
				options["path"] = val || "/";
				break;
			case "httponly":
				options["httpOnly"] = true;
				break;
			case "secure":
				options["secure"] = true;
				break;
			case "samesite":
				options["sameSite"] = val.toLowerCase();
				break;
			case "expires":
				options["expires"] = new Date(val);
				break;
			case "max-age":
				options["maxAge"] = parseInt(val, 10);
				break;
			case "domain":
				options["domain"] = val;
				break;
			default:
				break;
		}
	}

	return { name, value, options };
}

function setParsedCookieFromBackend(rawCookie: string, cookies: Cookies) {
	const { name, value, options } = parseSetCookieString(rawCookie);
	cookies.set(name, value, {
		...options,
		path: "/",
	});
}

export { setParsedCookieFromBackend };
