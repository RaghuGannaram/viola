export interface ITrackMetadata {
	title: string;
	artist: string;
	album: string;
	artworkUrl: string | null;
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
