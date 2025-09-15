
import logger from "@src/configs/logger.config";
import { AUDIO_CONSTANTS } from "@src/constants";
import type { Imetadata } from "@src/types";
import { v4 as uuid } from "uuid";

const { FILE_NAME_CONTAMINANTS, ALBUM_NAME_CONTAMINANTS, MIME_TO_EXTENSION } = AUDIO_CONSTANTS;

function buildAudioNoiseRegex(): RegExp {
	const parts = FILE_NAME_CONTAMINANTS.map((keyword) => `${keyword}(\\.\\w{2,5})?`);
	const combinedPattern = parts.join("|");
	return new RegExp(combinedPattern, "ig");
}

function buildAlbumNoiseRegex(): RegExp {
	const pattern = `\\b(${ALBUM_NAME_CONTAMINANTS.join("|")})\\b`;
	return new RegExp(pattern, "gi");
}

function generateFallbackAudioName(): string {
	const now = new Date();
	const formattedDate = now.toISOString().split("T")[0]?.replace(/-/g, "_");
	const uniqueSuffix = uuid().slice(0, 8);

	return `Viola Untitled Audio ${formattedDate} ${uniqueSuffix}`;
}

function generateFallbackAlbumName(): string {
	const now = new Date();
	const formattedDate = now.toISOString().split("T")[0]?.replace(/-/g, "_");
	const uniqueSuffix = uuid().slice(0, 8);

	return `Viola Untitled Album ${formattedDate} ${uniqueSuffix}`;
}
function sanitizeTitle(rawTitle: string): string {
	let cleaned = rawTitle;

	// Remove any content inside square brackets [ ... ] inclusive (often site names, tags)
	cleaned = cleaned.replace(/\[.*?\]/g, "");

	// Remove any content inside parentheses ( ... ) inclusive (often year, movie names, etc.)
	cleaned = cleaned.replace(/\(.*?\)/g, "");

	// Remove known junk website sources (iSongs, Pagalworld, etc.)
	const filenameNoiseRegex = buildAudioNoiseRegex();
	cleaned = cleaned.replace(filenameNoiseRegex, "");

	// Remove patterns like "track 01", "track02", "track-3", "track_4" etc.
	cleaned = cleaned.replace(/track\s*[-_.]?\s*\d+/gi, "");

	// Remove leading track numbers like: "01 - ", "1. ", "02_" etc.
	cleaned = cleaned.trim();
	cleaned = cleaned.replace(/^\d+\s*[-_.]\s*/g, "");

	// Remove all remaining non-alphanumeric characters (special symbols etc.)
	cleaned = cleaned.replace(/[^a-zA-Z0-9\s]/g, "");

	//  Collapse multiple spaces into single space, and trim surrounding spaces
	cleaned = cleaned.replace(/\s+/g, " ").trim();

	//  Title-case normalization: First letter capitalized, rest lowercase (for UI friendliness)
	cleaned = cleaned
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");

	if (!cleaned) {
		logger.warn(`Audio name extraction failed for: "${rawTitle}". Using fallback name.`);
		cleaned = generateFallbackAudioName();
	}

	return cleaned;
}

function sanitizeAlbum(rawAlbumName: string): string {
	let cleaned = rawAlbumName;

	// Remove any content inside square brackets [ ... ] inclusive (often years, tags)
	cleaned = cleaned.replace(/\[.*?\]/g, "");

	// Remove any content inside parentheses ( ... ) inclusive (often editions, years etc.)
	cleaned = cleaned.replace(/\(.*?\)/g, "");

	// Remove known junk website sources (iTunes, Pagalworld, etc.)
	const albumNoiseRegex = buildAlbumNoiseRegex();
	cleaned = cleaned.replace(albumNoiseRegex, "");

	// Remove all remaining non-alphanumeric characters (preserving spaces)
	cleaned = cleaned.replace(/[^a-zA-Z0-9\s]/g, "");

	// Collapse multiple spaces into one
	cleaned = cleaned.replace(/\s+/g, " ").trim();

	// Title-casing for UI
	cleaned = cleaned
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");

	//  Fallback handling
	if (!cleaned) {
		logger.warn(`Album name extraction failed for: "${rawAlbumName}". Using fallback name.`);
		cleaned = generateFallbackAlbumName();
	}

	return cleaned;
}

function sanitizeArtists(raw: string): string[] {
	return raw
		.split(/[,;&/]+/)
		.map((str) => str.replace(/feat\.?.*/i, "").trim())
		.filter(Boolean)
		.map((str) => {
			const words = str.toLowerCase().split(/\s+/);
			return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
		});
}

function generateStorageSafeKey(cleanAudioName: string): string {
	return cleanAudioName
		.toLowerCase()
		.replace(/\s+/g, "_")
		.replace(/[^a-z0-9_]/g, "");
}

function mimeToExt(contentType: string): string {
	return MIME_TO_EXTENSION[contentType] ?? "bin";
}

function buildFileNames(metadata: Imetadata): [string, string] {
	const storageSafeName = generateStorageSafeKey(sanitizeTitle(metadata.title));

	const artworkFileName = `${storageSafeName}_cover.${mimeToExt(metadata.artworkContentType)}`;
	const musicFileName = `${storageSafeName}.${mimeToExt(metadata.musicContentType)}`;

	return [artworkFileName, musicFileName];
}

export default {
	buildFileNames,
	sanitizeTitle,
	sanitizeAlbum,
	sanitizeArtists,
	generateStorageSafeKey,
	mimeToExt,
};
