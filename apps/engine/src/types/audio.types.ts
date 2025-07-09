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

export interface IPresign {
	fileName: string;
	artworkContentType: string;
	musicContentType: string;
}

export interface IUpload {
	title: string;
	artist: string;
	album: string;
	lyrics: string;
	artworkUrl: string;
	musicUrl: string;
}
