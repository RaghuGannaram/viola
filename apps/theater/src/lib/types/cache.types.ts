import type { ITrackMetadata, ITrackDetail, IAlbum, IArtist, IPlaylist } from "$lib/types";

export enum CosmicCache {
	TRACK_SPARK = "trackSpark",
	TRACK_NOVA = "trackNova",
	ALBUM_SPARK = "albumSpark",
	ALBUM_NOVA = "albumNova",
	ARTIST_SPARK = "artistSpark",
	ARTIST_NOVA = "artistNova",
	PLAYLIST = "playlist",
}

export interface ICosmicRegistry {
	[CosmicCache.TRACK_SPARK]: ITrackMetadata[];
	[CosmicCache.ALBUM_SPARK]: IAlbum[];
	[CosmicCache.ARTIST_SPARK]: IArtist[];
	[CosmicCache.TRACK_NOVA]: ITrackDetail[];
	[CosmicCache.ALBUM_NOVA]: IAlbum[];
	[CosmicCache.ARTIST_NOVA]: IArtist[];
	[CosmicCache.PLAYLIST]: IPlaylist[];
}

export const STELLAR_DECAY_MAP: Record<CosmicCache, number> = {
	[CosmicCache.TRACK_SPARK]: 1000 * 60 * 60 * 72, // 72 hours
	[CosmicCache.ALBUM_SPARK]: 1000 * 60 * 60 * 72, // 72 hours
	[CosmicCache.ARTIST_SPARK]: 1000 * 60 * 60 * 72, // 72 hours
	[CosmicCache.TRACK_NOVA]: 1000 * 60 * 60 * 72, // 72 hours
	[CosmicCache.ALBUM_NOVA]: 1000 * 60 * 60 * 72, // 72 hours
	[CosmicCache.ARTIST_NOVA]: 1000 * 60 * 60 * 72, // 72 hours
	[CosmicCache.PLAYLIST]: 1000 * 60 * 60 * 24, // 24 hours
};
