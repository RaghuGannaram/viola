import type { IPresign, IUpload } from "@src/types";
import Joi, { type ObjectSchema } from "joi";

const allowedArtworkContentTypes = ["image/jpeg", "image/png", "image/webp"];
const allowedMusicContentTypes = ["audio/mpeg", "audio/wav", "audio/flac", "audio/alac", "audio/aac", "audio/ogg", "audio/x-aiff", "audio/x-m4a"];

const artworkUrlPattern = /^artwork\/[a-z0-9-_]+\.(jpe?g|png|webp)$/;
const musicUrlPattern = /^music\/[a-z0-9-_]+\.(mp3|wav|flac|aac|ogg|aiff|m4a)$/;

export const presignSchema: ObjectSchema<IPresign> = Joi.object({
	fileName: Joi.string().min(1).max(200).required().messages({
		"string.base": "fileName should be a string",
		"string.empty": "fileName should not be empty",
		"string.min": "fileName must be at least {#limit} characters long",
		"string.max": "fileName must be at most {#limit} characters long",
		"any.required": "fileName is required",
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

export const uploadSchema: ObjectSchema<IUpload> = Joi.object({
	title: Joi.string().min(1).max(100).required().messages({
		"string.base": "title should be a string",
		"string.empty": "title should not be empty",
		"string.min": "title must be at least {#limit} characters long",
		"string.max": "title must be at most {#limit} characters long",
		"any.required": "title is required",
	}),
	artist: Joi.string().min(1).max(100).required().messages({
		"string.base": "artist should be a string",
		"string.empty": "artist should not be empty",
		"string.min": "artist must be at least {#limit} characters long",
		"string.max": "artist must be at most {#limit} characters long",
		"any.required": "artist is required",
	}),
	album: Joi.string().min(1).max(100).required().messages({
		"string.base": "album should be a string",
		"string.empty": "album should not be empty",
		"string.min": "album must be at least {#limit} characters long",
		"string.max": "album must be at most {#limit} characters long",
		"any.required": "album is required",
	}),
	lyrics: Joi.string().allow("").max(10000).messages({
		"string.base": "lyrics should be a string",
		"string.max": "lyrics must be at most {#limit} characters long",
	}),
	artworkUrl: Joi.string().pattern(artworkUrlPattern).required().messages({
		"string.base": "artworkUrl should be a string",
		"string.empty": "artworkUrl should not be empty",
		"any.required": "artworkUrl is required",
	}),
	musicUrl: Joi.string().pattern(musicUrlPattern).required().messages({
		"string.base": "musicUrl should be a string",
		"string.empty": "musicUrl should not be empty",
		"any.required": "musicUrl is required",
	}),
});
