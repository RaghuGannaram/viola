import { AccessLevel } from "$lib/types";

const navigationItems = [
	{
		name: "Dashboard",
		icon: "mdi:home",
		path: "dashboard",
		href: "/",
		accessLevel: AccessLevel.PUBLIC,
	},
	{
		name: "Library",
		icon: "mdi:library-music",
		path: "library",
		href: "/library",
		accessLevel: AccessLevel.PUBLIC,
	},
	{
		name: "Playlists",
		path: "playlists",
		icon: "mdi:playlist-music",
		href: "/playlists",
		accessLevel: AccessLevel.PRIVATE,
	},
	{
		name: "Player",
		icon: "mdi:play-circle",
		path: "player",
		href: "/player",
		accessLevel: AccessLevel.PUBLIC,
	},
	{
		name: "Upload",
		icon: "mdi:cloud-upload",
		path: "upload",
		href: "/upload",
		accessLevel: AccessLevel.PRIVATE,
	},
];

export { navigationItems };
