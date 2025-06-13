import logger from "@src/configs/logger.config";
import audioDataService from "@src/services/audio.data";
import awsDataService from "@src/services/aws.data";
import { type IAuthUser, type IPresign, type IUpload, AssetCategory } from "@src/types";
import { sanitizeFilename } from "@src/utils";
import { catchAsyncBusinessError } from "@src/utils/application-errors";

const presign = catchAsyncBusinessError(async function (authUser: IAuthUser, presignData: IPresign) {
	logger.info(`audio.business: generating dual presign for user: %s, audio: %s, artwork: %s`, authUser.email, presignData.musicFileName, presignData.artworkFileName);

	const sanitizedMusicFilename = sanitizeFilename(presignData.musicFileName);
	const sanitizedArtworkFilename = sanitizeFilename(presignData.artworkFileName);

	const [musicPresign, artworkPresign] = await Promise.all([
		awsDataService.presignPutUrl(AssetCategory.AUDIO, sanitizedMusicFilename, presignData.musicContentType),
		awsDataService.presignPutUrl(AssetCategory.IMAGE, sanitizedArtworkFilename, presignData.artworkContentType),
	]);

	return {
		music: musicPresign,
		artwork: artworkPresign,
	};
});

const upload = catchAsyncBusinessError(async function (authUser: IAuthUser, uploadData: IUpload) {
	logger.info(`audio.business: uploading audio for user: %s, title: %s, artist: %s`, authUser.email, uploadData.title, uploadData.artist);

	const song = await audioDataService.createSongRecord(authUser.id, uploadData);
	logger.info(`audio.business: successfully uploaded audio for user: %s, song ID: %s`, authUser.email, song.id);

	return song;
});

export default { presign, upload };
