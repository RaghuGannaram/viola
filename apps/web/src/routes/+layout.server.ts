console.log("+layout.server.ts loaded");

export const load = async (event) => {
	return {
		accessToken: event.locals.accessToken,
		profile: event.locals.profile,
	};
};
