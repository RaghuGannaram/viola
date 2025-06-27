import { AccessLevel } from "$lib/types/auth.types.js";
import { enforceAccess } from "$lib/utils/auth.js";

export const load = async (event) => {
	const profile = event.locals.profile;

	enforceAccess({
		profile,
		requiredAccessLevel: AccessLevel.PRIVATE,
		redirectPath: "/settings",
	});
};
