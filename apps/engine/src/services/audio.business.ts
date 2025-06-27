import logger from "@src/configs/logger.config";
import audioDataService from "@src/services/audio.data";
import audioService from "@src/services/audio.service";
import awsDataService from "@src/services/aws.data";
import { type IAuthUser, type IPresign, type IUpload, AssetCategory } from "@src/types";
import { catchAsyncBusinessError } from "@src/utils/application-errors";

const presign = catchAsyncBusinessError(async function (authUser: IAuthUser, presignData: IPresign) {
	logger.info(`audio.business: generating dual presign for user: %s, audio: %s`, authUser.id, presignData.fileName);

	const cleanAudioName = audioService.extractCleanAudioName(presignData.fileName);

	const storageSafeName = audioService.generateStorageSafeKey(cleanAudioName);

	const musicFileName = `${storageSafeName}.${audioService.getExtensionFromMimeType(presignData.musicContentType)}`;
	const artworkFileName = `${storageSafeName}_cover.${audioService.getExtensionFromMimeType(presignData.artworkContentType)}`;

	const [musicPresign, artworkPresign] = await Promise.all([
		awsDataService.presignPutUrl(AssetCategory.AUDIO, musicFileName, presignData.musicContentType),
		awsDataService.presignPutUrl(AssetCategory.IMAGE, artworkFileName, presignData.artworkContentType),
	]);

	return {
		title: cleanAudioName,
		music: musicPresign,
		artwork: artworkPresign,
	};
});

const upload = catchAsyncBusinessError(async function (authUser: IAuthUser, uploadData: IUpload) {
	logger.info(`audio.business: uploading audio for user: %s, title: %s, artist: %s`, authUser.email, uploadData.title, uploadData.artist);

	const artistNames = audioService.extractArtistNames(uploadData.artist);
	const albumName = audioService.extractCleanAlbumName(uploadData.album);

	const song = await audioDataService.createSongRecord(authUser.id, {
		title: uploadData.title,
		lyrics: uploadData.lyrics,
		musicUrl: uploadData.musicUrl,
		artworkUrl: uploadData.artworkUrl,
		albumName: albumName,
		artistNames: artistNames,
	});

	logger.info(`audio.business: successfully uploaded audio for user: %s, song ID: %s`, authUser.email, song.id);
	return song;
});

const list = catchAsyncBusinessError(async function () {
	logger.info(`audio.business: listing all songs`);

	const songs = await audioDataService.listAllSongRecords();

	for (const song of songs) {
		song.artworkUrl = awsDataService.generateCloudFrontUrl(song.artworkUrl);
	}

	return songs;
});

const info = catchAsyncBusinessError(async function (songId: string) {
	logger.info(`audio.business: retrieving info for song ID: %s`, songId);

	const song = await audioDataService.getSongRecord(songId);

	return song;
});

const stream = catchAsyncBusinessError(async function (songId: string) {
	logger.info(`audio.business: streaming song ID: %s`, songId);

	const audioUrl = await audioDataService.getStreamUrl(songId);

	if (!audioUrl) {
		logger.error(`audio.business: audio URL not found for song ID: %s`, songId);
		throw new Error("Audio URL not found");
	}

	const streamUrl = awsDataService.getFile(audioUrl);

	return streamUrl;
});

export default { presign, upload, list, info, stream };
