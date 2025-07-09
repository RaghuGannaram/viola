import { AccessLevel } from "$lib/types/auth.types.js";
import { enforceAccess } from "$lib/utils/auth.js";

export const load = async (event) => {
	const profile = event.locals.profile;
	const { id } = event.params;

	enforceAccess({
		profile,
		requiredAccessLevel: AccessLevel.PUBLIC,
	});

	return { id };
};
