const PROXY_ENDPOINTS = {
	AUTH: {
		REGISTER: "/auth/register",
		LOGIN: "/auth/login",
		REFRESH: "/auth/refresh-token",
		LOGOUT: "/auth/logout",
	},
	AUDIO: {
		PRESIGN: "/audio/presign",
		UPLOAD: "/audio/upload",
	},
};

const BACKEND_ENDPOINTS = {
	AUTH: {
		REGISTER: "/auth/register",
		LOGIN: "/auth/login",
		REFRESH: "/auth/refresh-token",
		LOGOUT: "/auth/logout",
	},
	AUDIO: {
		PRESIGN: "/audio/presign",
		UPLOAD: "/audio/upload",
	},
};

export { PROXY_ENDPOINTS, BACKEND_ENDPOINTS };
