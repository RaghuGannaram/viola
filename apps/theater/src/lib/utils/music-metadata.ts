import { parseBlob } from "music-metadata";

export async function extractMetadata(file: Blob): Promise<any> {
	let title = "Unknown Title";
	let artist = "Unknown Artist";
	let album = "Unknown Album";
	let lyrics = "";
	let artworkBlob: Blob | null = null;
	let artworkPreviewUrl: string | null = null;

	try {
		const metadata = await parseBlob(file);
		const common = metadata.common;

		title = common.title || title;
		artist = common.artist || artist;
		album = common.album || album;
		lyrics = Array.isArray(common.lyrics) ? common.lyrics.map((tag) => tag.text).join("\n") : (common.lyrics ?? lyrics);

		const picture = common.picture?.[0];
		if (picture) {
			artworkBlob = new Blob([picture.data], { type: picture.format });
			artworkPreviewUrl = URL.createObjectURL(artworkBlob);
		}
	} catch (error) {
		console.error("Metadata extraction failed:", error);
	}

	return { title, artist, album, lyrics, artworkBlob, artworkPreviewUrl };
}
