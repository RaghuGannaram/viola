import { parseBlob } from "music-metadata";
import { type ITrack } from "$lib/types";

function toDataUrl(buffer: ArrayBuffer, format: string): string {
	let binary = "";
	const bytes = new Uint8Array(buffer);
	for (let i = 0; i < bytes.byteLength; i++) {
		binary += String.fromCharCode(bytes[i] ?? 0);
	}
	const base64 = window.btoa(binary);
	return `data:${format};base64,${base64}`;
}

async function extractMetadata(file: Blob): Promise<Partial<ITrack>> {
	try {
		const metadata = await parseBlob(file);
		const { title = "Unknown Title", artist = "Unknown Artist", album = "Unknown Album", lyrics = "", picture = [] } = metadata.common;

		const coverImage = picture[0] ? toDataUrl(picture[0].data.buffer as ArrayBuffer, picture[0].format) : "";

		return {
			title,
			artist,
			album,
			coverImage,
			lyrics: Array.isArray(lyrics) ? lyrics.map((tag) => tag.text).join("\n") : lyrics,
		};
	} catch (error) {
		console.error("Metadata extraction failed:", error);
		return {
			title: "Unknown Title",
			artist: "Unknown Artist",
			album: "Unknown Album",
			coverImage: "",
			lyrics: "",
		};
	}
}

export { extractMetadata };
