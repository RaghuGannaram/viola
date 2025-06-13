export interface ITrack {
	id: string;
	name: string;
	blob: Blob;
	url: string;
	title?: string;
	artist?: string;
	album?: string;
	artwork?: Blob;
	lyrics?: string;
}

export interface ITrackMetadata {
	title: string;
	artist: string;
	album: string;
	lyrics: string;
	artworkBlob: Blob | null;
	artworkPreviewUrl: string | null;
}

export * from "./auth.types";
