export interface ITrack {
	id: string;
	name: string;
	blob: Blob;
	url: string;
	title?: string;
	artist?: string;
	album?: string;
	coverImage?: string;
	lyrics?: string;
}

export * from "./auth.types";
