import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
	return {
		accessToken: event.locals.accessToken,
		profile: event.locals.profile,
	};
};
