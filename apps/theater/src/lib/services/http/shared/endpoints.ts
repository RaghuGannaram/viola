const PROXY_ENDPOINTS = {
	AUTH: {
		REGISTER: "/auth/register",
		LOGIN: "/auth/login",
		REFRESH: "/auth/refresh-token",
		LOGOUT: "/auth/logout",
	},
	AUDIO: {
		STREAM: "/audio/stream",
		IDENTIFY: "/audio/identify",
		INTAKE: "/audio/tracks/intake",
		DISCARD: "/audio/tracks/:id/discard",
		LIST_TRACKS: "/audio/tracks",
		SHOW_TRACK: "/audio/tracks/:id",
		LIST_ALBUMS: "/audio/albums",
		SHOW_ALBUM: "/audio/albums/:id",
		LIST_ARTISTS: "/audio/artists",
		SHOW_ARTIST: "/audio/artists/:id",
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
		STREAM: "/audio/stream",
		IDENTIFY: "/audio/identify",
		INTAKE: "/audio/tracks/intake",
		DISCARD: "/audio/tracks/:id/discard",
		LIST_TRACKS: "/audio/tracks",
		SHOW_TRACK: "/audio/tracks/:id",
		LIST_ALBUMS: "/audio/albums",
		SHOW_ALBUM: "/audio/albums/:id",
		LIST_ARTISTS: "/audio/artists",
		SHOW_ARTIST: "/audio/artists/:id",
	},
};

export { PROXY_ENDPOINTS, BACKEND_ENDPOINTS };
