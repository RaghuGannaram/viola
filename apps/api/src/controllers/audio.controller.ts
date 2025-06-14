import catchAsyncError from "@src/middlewares/catch-async-error.middleware";
import { presignSchema, uploadSchema } from "@src/schemas/audio.schema";
import audioBusinessService from "@src/services/audio.business";
import type { IVerifiedRequest, IController, IPresign, IUpload } from "@src/types";
import { processValidationError } from "@src/utils/application-errors";
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

	res.status(201).json({ message: "Audio uploaded successfully", song });
});

export default { presign, upload };
