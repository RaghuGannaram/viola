import catchAsyncError from "@src/middlewares/catch-async-error.middleware";
import { presignSchema, uploadSchema } from "@src/schemas/audio.schema";
import audioBusinessService from "@src/services/audio.business";
import type { IVerifiedRequest, IController, IPresign, IUpload } from "@src/types";
import { HttpError, HttpErrors, processValidationError } from "@src/utils/application-errors";
import type { Request, Response } from "express";

const presign: IController = catchAsyncError(async function (req: Request, res: Response) {
	const authUser = (req as IVerifiedRequest).user;

	let presignData: IPresign | null = null;

	try {
		presignData = await presignSchema.validateAsync(req.body);
	} catch (error) {
		processValidationError(error);
	}

	const { title, music, artwork } = await audioBusinessService.presign(authUser, presignData);

	res.status(200).json({ title, music, artwork });
});

const upload = catchAsyncError(async function (req: Request, res: Response) {
	const authUser = (req as IVerifiedRequest).user;

	let musicData: IUpload | null = null;

	try {
		musicData = await uploadSchema.validateAsync(req.body);
	} catch (error) {
		processValidationError(error);
	}

	console.log("zetex-musicData", musicData);

	const song = await audioBusinessService.upload(authUser, musicData);

	res.status(201).json({ message: "audio uploaded successfully", song });
});

const list = catchAsyncError(async function (_req: Request, res: Response) {
	const songs = await audioBusinessService.list();

	res.status(200).json(songs);
});

const info = catchAsyncError(async (req, res) => {
	const songId = req.params["audioId"];

	if (!songId) {
		throw new HttpError(400, HttpErrors.BAD_REQUEST, "Song ID is required");
	}

	if (!songId.match(/^[a-zA-Z0-9-]+$/)) {
		throw new HttpError(400, HttpErrors.BAD_REQUEST, "Invalid song ID format");
	}

	const song = await audioBusinessService.info(songId);

	res.json({ message: "song retrieved successfully", song });
});

const stream = catchAsyncError(async (req, res) => {
	const songId = req.params["audioId"];

	if (!songId) {
		throw new HttpError(400, HttpErrors.BAD_REQUEST, "Song ID is required");
	}
	if (!songId.match(/^[a-zA-Z0-9-]+$/)) {
		throw new HttpError(400, HttpErrors.BAD_REQUEST, "Invalid song ID format");
	}

	const url = await audioBusinessService.stream(songId);

	res.json({ message: "stream URL retrieved successfully", streamUrl: url });
});

export default { presign, upload, list, info, stream };
