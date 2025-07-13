export enum AssetCategory {
	IMAGE = "artwork",
	AUDIO = "music",
	VIDEO = "video",
	DOCUMENT = "document",
}

export interface ISong {
	id: string;
	title: string;
	artist: string;
	album: string;
}

export interface IUploadAudio {
	file: Express.Multer.File;
}

export interface Imetadata {
	title: string;
	album: string;
	artists: string;
	artworkContentType: string;
	musicContentType: string;
}

interface AcrTrack {
	title: string;
	duration_ms: number;
	album: { name: string };
	artists: { name: string }[];
	label: string;
	release_date?: string;
	genres: { name: string }[];
	lyrics?: {
		copyrights?: string[];
	};
	score: number;
	acrid: string;
}

interface AcrMetadata {
	music?: AcrTrack[];
}

export interface AcrResponse {
	metadata?: AcrMetadata;
}
