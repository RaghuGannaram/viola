
import catchAsyncError from "@src/middlewares/catch-async-error.middleware";
import { metadataSchema } from "@src/schemas/audio.schema";
import audioBusinessService from "@src/services/audio.business";
import type { IVerifiedRequest, IController, Imetadata } from "@src/types";
import { HttpError, HttpErrors, processValidationError } from "@src/utils/application-errors";
import type { Request, Response } from "express";

const stream: IController = catchAsyncError(async function (req: Request, res: Response) {
	const trackId = req.params["id"];

	if (!trackId) throw new HttpError(400, HttpErrors.BAD_REQUEST, "Track ID is required");

	if (!trackId.match(/^[a-zA-Z0-9-]+$/)) throw new HttpError(400, HttpErrors.BAD_REQUEST, "Invalid track ID format");

	const streamUrl = await audioBusinessService.stream(trackId);

	res.json({
		success: true,
		message: "Track stream URL retrieved successfully",
		data: {
			streamUrl,
		},
	});
});

const identify: IController = catchAsyncError(async function (req: Request, res: Response) {
	const authUser = (req as IVerifiedRequest).user;

	if (!req.file) {
		throw new HttpError(400, HttpErrors.BAD_REQUEST, "Audio file is required for identification");
	}

	const fileBuffer = req.file.buffer;
	const fileName = req.file.originalname;

	const result = await audioBusinessService.identify(authUser, fileName, fileBuffer);

	res.status(200).json({
		success: true,
		message: "Audio identified successfully",
		data: {
			result,
		},
	});
});

const intake: IController = catchAsyncError(async function (req: Request, res: Response) {
	const authUser = (req as IVerifiedRequest).user;

	if (!req.file) {
		throw new HttpError(400, HttpErrors.BAD_REQUEST, "Audio file is required for identification");
	}

	const fileBuffer = req.file.buffer;

	let metadata: Imetadata | null = null;

	try {
		metadata = await metadataSchema.validateAsync(req.body);
	} catch (error) {
		processValidationError(error);
	}

	const response = await audioBusinessService.intake(authUser, metadata, fileBuffer);

	res.status(201).json({
		success: true,
		message: "Track uploaded successfully",
		data: {
			...response,
		},
	});
});

const listTracks = catchAsyncError(async function (_req: Request, res: Response) {
	const tracks = await audioBusinessService.listTracks();

	res.status(200).json({
		success: true,
		message: "Tracks retrieved successfully",
		data: {
			tracks,
		},
	});
});

const showTrack = catchAsyncError(async (req, res) => {
	const trackId = req.params["id"];

	if (!trackId) throw new HttpError(400, HttpErrors.BAD_REQUEST, "Track ID is required");

	if (!trackId.match(/^[a-zA-Z0-9-]+$/)) throw new HttpError(400, HttpErrors.BAD_REQUEST, "Invalid track ID format");

	const track = await audioBusinessService.showTrack(trackId);

	res.json({
		success: true,
		message: "Track details retrieved successfully",
		data: {
			track,
		},
	});
});

const listAlbums = catchAsyncError(async function (_req: Request, res: Response) {
	const albums = await audioBusinessService.listAlbums();

	res.status(200).json({
		success: true,
		message: "Albums retrieved successfully",
		data: {
			albums,
		},
	});
});

const showAlbum = catchAsyncError(async (req: Request, res: Response) => {
	const albumId = req.params["id"];

	if (!albumId) throw new HttpError(400, HttpErrors.BAD_REQUEST, "Album ID is required");

	if (!albumId.match(/^[a-zA-Z0-9-]+$/)) throw new HttpError(400, HttpErrors.BAD_REQUEST, "Invalid album ID format");

	const album = await audioBusinessService.showAlbum(albumId);

	res.status(200).json({
		success: true,
		message: "Album details retrieved successfully",
		data: {
			album,
		},
	});
});

const listArtists = catchAsyncError(async function (_req: Request, res: Response) {
	const artists = await audioBusinessService.listArtists();

	res.status(200).json({
		success: true,
		message: "Artists retrieved successfully",
		data: {
			artists,
		},
	});
});

const showArtist = catchAsyncError(async (req: Request, res: Response) => {
	const artistId = req.params["id"];

	if (!artistId) throw new HttpError(400, HttpErrors.BAD_REQUEST, "Artist ID is required");

	if (!artistId.match(/^[a-zA-Z0-9-]+$/)) throw new HttpError(400, HttpErrors.BAD_REQUEST, "Invalid artist ID format");

	const artist = await audioBusinessService.showArtist(artistId);

	res.status(200).json({
		success: true,
		message: "Artist details retrieved successfully",
		data: {
			artist,
		},
	});
});

export default { stream, identify, intake, listTracks, showTrack, listAlbums, showAlbum, listArtists, showArtist };
