import logger from "@src/configs/logger.config";
import acrService from "@src/services/acr.service";
import audioDataService from "@src/services/audio.data";
import audioService from "@src/services/audio.service";
import awsDataService from "@src/services/aws.data";
import { type IAuthUser, type Imetadata, AssetCategory } from "@src/types";
import { catchAsyncBusinessError, BusinessError, BusinessErrors } from "@src/utils/application-errors";

const stream = catchAsyncBusinessError(async function (trackId: string) {
	logger.info(`audio.business: streaming track ID: %s`, trackId);

	const audioUrl = await audioDataService.getStreamUrl(trackId);

	if (!audioUrl) {
		logger.error(`audio.business: audio URL not found for track ID: %s`, trackId);

		throw new Error("Audio URL not found");
	}

	const streamUrl = awsDataService.getFile(audioUrl);

	return streamUrl;
});

const identify = catchAsyncBusinessError(async function (authUser: IAuthUser, fileName: string, fileBuffer: Buffer) {
	logger.info(`audio.business: identifying audio for user: %s`, authUser.id);

	const result = await acrService.identifyAudio(fileName, fileBuffer);

	logger.info(`audio.business: successfully identified audio %s for user: %s`, fileName, authUser.id);

	return result;
});

const intake = catchAsyncBusinessError(async function (authUser: IAuthUser, extractedMetadata: Imetadata, fileBuffer: Buffer) {
	logger.info(`audio.business: uploading audio title: %s for user: %s`, extractedMetadata.title, authUser.email);
	console.log(extractedMetadata);
	const [artworkFileName, musicFileName] = audioService.buildFileNames(extractedMetadata);
	extractedMetadata.title = audioService.sanitizeTitle(extractedMetadata.title);
	extractedMetadata.album = audioService.sanitizeAlbum(extractedMetadata.album);
	extractedMetadata.artists = audioService.sanitizeArtists(extractedMetadata.artists).join(", ");

	const [artworkPresign, musicPresign, identificationResponse] = await Promise.all([
		awsDataService.presignPutUrl(AssetCategory.IMAGE, artworkFileName, extractedMetadata.artworkContentType),
		awsDataService.presignPutUrl(AssetCategory.AUDIO, musicFileName, extractedMetadata.musicContentType),
		acrService.identifyAudio(extractedMetadata.title, fileBuffer),
	]);

	logger.debug(`audio.business: retrieved ACR data : %s`, JSON.stringify(identificationResponse, null, 2));
	const identifiedMetadata = acrService.processAcrResponse(identificationResponse);

	const existingTrack = await audioDataService.getTrackRecordByACRId(identifiedMetadata.acrid, authUser.id);
	if (existingTrack) {
		logger.info(`audio.business: track with acrid ${identifiedMetadata.acrid} already exists for user: %s`, authUser.id);

		return {
			duplicate: true,
			...existingTrack,
		};
	}

	const track = await audioDataService.createTrackRecord(authUser.id, {
		title: extractedMetadata.title ?? identifiedMetadata.title,
		duration: identifiedMetadata.duration,
		albumName: extractedMetadata.album ?? identifiedMetadata.album,
		artistNames: extractedMetadata.artists.split(",").map((name) => name.trim()) ?? identifiedMetadata.artists,
		genres: identifiedMetadata.genres,
		label: identifiedMetadata.label,
		musicUrl: musicPresign.s3Key,
		artworkUrl: artworkPresign.s3Key,
		acrid: identifiedMetadata.acrid,
	});

	logger.info(`audio.business: successfully uploaded audio of track ID: %s for user: %s`, track.id, authUser.email);

	return {
		duplicate: false,
		trackId: track.id,
		presignedArtworkUrl: artworkPresign.presignedUrl,
		presignedMusicUrl: musicPresign.presignedUrl,
	};
});

const listTracks = catchAsyncBusinessError(async function () {
	logger.info(`audio.business: retrieving all tracks`);

	const tracks = await audioDataService.getAllTrackRecords();

	for (const track of tracks) {
		track.artworkUrl = awsDataService.generateCloudFrontUrl(track.artworkUrl);
	}

	return tracks;
});

const showTrack = catchAsyncBusinessError(async function (trackId: string) {
	logger.info(`audio.business: retrieving information for track ID: %s`, trackId);

	const track = await audioDataService.getTrackRecordById(trackId);

	if (!track) {
		logger.error(`audio.business: track not found for ID: %s`, trackId);

		throw new BusinessError(BusinessErrors.ENTITY_NOT_FOUND, `Track not found for ID: ${trackId}`);
	}

	return track;
});

const listAlbums = catchAsyncBusinessError(async function () {
	logger.info(`audio.business: retrieving all albums`);

	const albums = await audioDataService.getAllAlbumRecords();

	for (const album of albums) {
		album.coverUrl = awsDataService.generateCloudFrontUrl((album as any).tracks[0]?.artworkUrl || "");
	}

	return albums;
});

const showAlbum = catchAsyncBusinessError(async function (albumId: string) {
	logger.info(`audio.business: retrieving information for album ID: %s`, albumId);

	const album = await audioDataService.getAlbumRecordById(albumId);

	if (!album) {
		logger.error(`audio.business: album not found for ID: %s`, albumId);

		throw new BusinessError(BusinessErrors.ENTITY_NOT_FOUND, `Album not found for ID: ${albumId}`);
	}

	for (const track of (album as any).tracks) {
		track.artworkUrl = awsDataService.generateCloudFrontUrl(track.artworkUrl);
	}
	album.coverUrl = awsDataService.generateCloudFrontUrl((album as any).coverUrl);

	return album;
});

const listArtists = catchAsyncBusinessError(async function () {
	logger.info(`audio.business: retrieving all artists`);

	const artists = await audioDataService.getAllArtistRecords();

	return artists;
});

const showArtist = catchAsyncBusinessError(async function (artistId: string) {
	logger.info(`audio.business: retrieving information for artist ID: %s`, artistId);

	const artist = await audioDataService.getArtistRecordById(artistId);

	if (!artist) {
		logger.error(`audio.business: artist not found for ID: %s`, artistId);

		throw new BusinessError(BusinessErrors.ENTITY_NOT_FOUND, `Artist not found for ID: ${artistId}`);
	}

	return artist;
});

export default { stream, identify, intake, listTracks, showTrack, listAlbums, showAlbum, listArtists, showArtist };
