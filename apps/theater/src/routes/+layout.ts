import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async (event) => {
	return {
		accessToken: event.data["accessToken"],
		profile: event.data["profile"],
	};
};
