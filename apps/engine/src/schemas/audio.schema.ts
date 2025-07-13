import type { Imetadata } from "@src/types";
import Joi, { type ObjectSchema } from "joi";

const allowedArtworkContentTypes = ["image/jpeg", "image/png", "image/webp"];
const allowedMusicContentTypes = ["audio/mpeg", "audio/wav", "audio/flac", "audio/alac", "audio/aac", "audio/ogg", "audio/x-aiff", "audio/x-m4a"];

export const metadataSchema: ObjectSchema<Imetadata> = Joi.object({
	title: Joi.string().min(1).max(200).required().messages({
		"string.base": "fileName should be a string",
		"string.empty": "fileName should not be empty",
		"string.min": "fileName must be at least {#limit} characters long",
		"string.max": "fileName must be at most {#limit} characters long",
		"any.required": "fileName is required",
	}),
	album: Joi.string().max(200).allow("").messages({
		"string.base": "album should be a string",
		"string.max": "album must be at most {#limit} characters long",
	}),
	artists: Joi.string().max(200).allow("").messages({
		"string.base": "artists should be a string",
		"string.max": "artists must be at most {#limit} characters long",
	}),
	artworkContentType: Joi.string()
		.valid(...allowedArtworkContentTypes)
		.required()
		.messages({
			"any.only": "Invalid artwork content type provided",
			"string.base": "artworkContentType should be a string",
			"any.required": "artworkContentType is required",
		}),

	musicContentType: Joi.string()
		.valid(...allowedMusicContentTypes)
		.required()
		.messages({
			"any.only": "Invalid music content type provided",
			"string.base": "musicContentType should be a string",
			"any.required": "musicContentType is required",
		}),
});
