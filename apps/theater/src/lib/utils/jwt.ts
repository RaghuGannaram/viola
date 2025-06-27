function decodeJwt(token: string): Record<string, any> | null {
	try {
		const base64Url = token.split(".")[1] ?? "";
		const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split("")
				.map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
				.join(""),
		);
		return JSON.parse(jsonPayload);
	} catch {
		return null;
	}
}

function isValidJwt(token: string): boolean {
	const decoded = decodeJwt(token);

	if (!decoded) return false;

	const currentTime = Math.floor(Date.now() / 1000);

	return decoded["exp"] && decoded["exp"] > currentTime;
}

export { isValidJwt, decodeJwt };
