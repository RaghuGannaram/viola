import type { ITrackMetadata, ITrackDetail, IAlbum, IArtist, IPlaylist } from "$lib/types";

export enum CACHE_COLLECTION {
	TRACK_METADATA = "trackMetadata",
	TRACK_DETAIL = "trackDetail",
	ALBUM = "album",
	ARTIST = "artist",
	PLAYLIST = "playlist",
}

export interface ICollectionSchema {
	[CACHE_COLLECTION.TRACK_METADATA]: ITrackMetadata[];
	[CACHE_COLLECTION.TRACK_DETAIL]: ITrackDetail[];
	[CACHE_COLLECTION.ALBUM]: IAlbum[];
	[CACHE_COLLECTION.ARTIST]: IArtist[];
	[CACHE_COLLECTION.PLAYLIST]: IPlaylist[];
}

export const CACHE_TTL_MAP: Record<CACHE_COLLECTION, number> = {
	[CACHE_COLLECTION.TRACK_METADATA]: 1000 * 60 * 60 * 72, // 72 hours
	[CACHE_COLLECTION.TRACK_DETAIL]: 1000 * 60 * 60 * 72, // 72 hours
	[CACHE_COLLECTION.ALBUM]: 1000 * 60 * 60 * 72, // 72 hours
	[CACHE_COLLECTION.ARTIST]: 1000 * 60 * 60 * 72, // 72 hours
	[CACHE_COLLECTION.PLAYLIST]: 1000 * 60 * 60 * 24, // 24 hours
};
