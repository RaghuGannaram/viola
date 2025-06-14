import logger from "@src/configs/logger.config";
import { AUDIO_CONSTANTS } from "@src/constants";
import { v4 as uuid } from "uuid";

function buildNoiseRegex(): RegExp {
	const parts = AUDIO_CONSTANTS.filenameContaminants.map((keyword) => `${keyword}(\\.\\w{2,5})?`);
	const combinedPattern = parts.join("|");
	return new RegExp(combinedPattern, "ig");
}

function extractCleanAudioName(rawFileName: string): string {
	const fileNameWithoutExt = rawFileName.replace(/\.[^/.]+$/, "");

	let cleaned = fileNameWithoutExt;

	// Remove any content inside square brackets [ ... ] inclusive (often site names, tags)
	cleaned = cleaned.replace(/\[.*?\]/g, "");

	// Remove any content inside parentheses ( ... ) inclusive (often year, movie names, etc.)
	cleaned = cleaned.replace(/\(.*?\)/g, "");

	const filenameNoiseRegex = buildNoiseRegex();
	// Remove known junk website sources (iSongs, Pagalworld, etc.)
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
		logger.warn(`Audio name extraction failed for: "${rawFileName}". Using fallback name.`);
		cleaned = generateFallbackAudioName();
	}

	return cleaned;
}

function generateStorageSafeKey(cleanAudioName: string): string {
	return cleanAudioName
		.toLowerCase()
		.replace(/\s+/g, "_")
		.replace(/[^a-z0-9_]/g, "");
}

function generateFallbackAudioName(): string {
	const now = new Date();
	const day = String(now.getDate()).padStart(2, "0");
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const year = now.getFullYear();

	const formattedDate = `${day}_${month}_${year}`;
	const uniqueSuffix = uuid().slice(0, 8);

	return `Viola Untitled Audio ${formattedDate} ${uniqueSuffix}`;
}

function getExtensionFromMimeType(contentType: string): string {
	return AUDIO_CONSTANTS.mimeToExtension[contentType] ?? "bin";
}

console.log(extractCleanAudioName(" [iSongs] track 01 - (2023).mp3")); // "My Song"

export default {
	extractCleanAudioName,
	generateStorageSafeKey,
	getExtensionFromMimeType,
};
