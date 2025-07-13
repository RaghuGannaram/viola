import { parseBlob } from "music-metadata";

export async function extractMetadata(file: Blob): Promise<any> {
	let title = "";
	let album = "";
	let artists = "";
	let artworkBlob: Blob | null = null;
	let artworkPreviewUrl: string | null = null;

	try {
		const metadata = await parseBlob(file);
		const common = metadata.common;

		title = common.title ?? title;
		artists =
			common.artist
				?.split(",")
				.map((artist) => artist.trim())
				.join(", ") ?? artists;
		album = common.album ?? album;

		const picture = common.picture?.[0];

		if (picture) {
			artworkBlob = new Blob([picture.data], { type: picture.format });
			artworkPreviewUrl = URL.createObjectURL(artworkBlob);
		}
	} catch (error) {
		console.error("Metadata extraction failed:", error);
	}

	return { title, artists, album, artworkBlob, artworkPreviewUrl };
}
