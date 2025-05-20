console.log("+layout.server.ts loaded");

export const load = async (event) => {
	return {
		profile: event.locals.profile,
	};
};
