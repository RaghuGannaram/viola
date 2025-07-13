export interface ITrackMetadata {
	id: string;
	title: string;
	duration: number | null;
	trackNumber: number | null;
	lyrics: string;
	musicUrl: string;
	artworkUrl: string;
	albumId: string | null;
	userId: string;
	createdAt: string;
}

export interface ITrackDetail {
	id: string;
	title: string;
	artist: IArtist[];
	album: IAlbum;
	musicUrl: string;
	artworkUrl: string;
	lyrics?: string;
	duration?: number;
	releaseDate?: string;
	createdAt: string;
	userId?: string;
}

export interface IAlbum {
	id: string;
	title: string;
	description?: string;
	releaseDate?: string;
	coverUrl?: string;
	createdAt: string;
}

export interface IArtist {
	id: string;
	name: string;
	bio?: string;
	imageUrl?: string;
	externalLinks: Record<string, unknown>;
	createdAt: string;
	userId?: string;
}

export interface IPlaylist {
	id: string;
	userId: string;
	name: string;
	isPublic: boolean;
	createdAt: string;
}

export enum UPLOAD {
	IDLE = "idle",
	PREPARING = "preparing",
	ANALYZING = "analyzing",
	UPLOADING_MUSIC = "uploading-music",
	UPLOADING_ARTWORK = "uploading-artwork",
	SUCCESS = "success",
	DUPLICATE = "duplicate",
	ERROR = "error",
}
