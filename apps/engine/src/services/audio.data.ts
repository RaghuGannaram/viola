import { PrismaClient, type Track, type Album, type Artist } from "@prisma/client";

import logger from "@src/configs/logger.config";
import { catchAsyncDataError, processPrismaError } from "@src/utils/application-errors";

const prisma = new PrismaClient();

const getStreamUrl = catchAsyncDataError(async function (trackId: string): Promise<string> {
	logger.debug(`audio.data: retrieving stream URL for track ID: %s`, trackId);

	let result: string;

	try {
		const track = await prisma.track.findUnique({
			where: { id: trackId },
			select: { musicUrl: true },
		});
		result = track?.musicUrl ?? "";
	} catch (error) {
		processPrismaError(error);
	}
	return result;
});

const createTrackRecord = catchAsyncDataError(async function (
	userId: string,
	uploadData: {
		title: string;
		duration: number;
		albumName: string;
		artistNames: string[];
		genres?: string[];
		label?: string;
		releaseDate?: Date;
		musicUrl: string;
		artworkUrl: string;
		acrid: string;
	},
): Promise<Track> {
	logger.debug(`audio.data: creating track record for user: %s, title: %s`, userId, uploadData.title);

	let result: Track;

	try {
		result = await prisma.$transaction(
			async (tx) => {
				const artists = await Promise.all(
					uploadData.artistNames.map((name) =>
						tx.artist.upsert({
							where: { name },
							update: {},
							create: { name },
						}),
					),
				);

				const album = await tx.album.upsert({
					where: { title: uploadData.albumName },
					update: {},
					create: { title: uploadData.albumName },
				});

				const track = await tx.track.create({
					data: {
						uploaderId: userId,
						title: uploadData.title,
						musicUrl: uploadData.musicUrl,
						artworkUrl: uploadData.artworkUrl,
						albumId: album.id,
						acrid: uploadData.acrid,
					},
				});

				await Promise.all(
					artists.map((artist) =>
						tx.credit.create({
							data: { trackId: track.id, artistId: artist.id },
						}),
					),
				);

				await Promise.all(
					artists.map((artist) =>
						tx.contribution.upsert({
							where: { albumId_artistId: { albumId: album.id, artistId: artist.id } },
							update: {},
							create: { albumId: album.id, artistId: artist.id },
						}),
					),
				);

				return track;
			},
			{
				timeout: 10000, // 10 seconds
				maxWait: 20000, // 20 seconds
			},
		);
	} catch (error) {
		processPrismaError(error);
	}

	return result;
});

const getAllTrackRecords = catchAsyncDataError(async function (): Promise<Track[]> {
	logger.debug(`audio.data: listing all track records`);

	let result: Track[];

	try {
		result = await prisma.track.findMany({
			include: {
				album: {
					select: {
						id: true,
						title: true,
						coverUrl: true,
						releaseDate: true,
					},
				},
				artists: {
					select: {
						artist: {
							select: {
								id: true,
								name: true,
								imageUrl: true,
							},
						},
					},
				},
				reactions: {
					select: {
						emoji: true,
						userId: true,
						reactedAt: true,
						user: {
							select: {
								id: true,
								username: true,
								avatarUrl: true,
							},
						},
					},
				},
			},
			orderBy: {
				title: "asc",
			},
		});
	} catch (error) {
		processPrismaError(error);
	}

	return result;
});

const getTrackRecordById = catchAsyncDataError(async function (trackId: string): Promise<Track | null> {
	logger.debug(`audio.data: retrieving track record for ID: %s`, trackId);

	let result: Track | null;

	try {
		result = await prisma.track.findUnique({
			where: { id: trackId },
			include: {
				album: true,
				artists: {
					include: {
						artist: true,
					},
				},
				uploader: {
					select: {
						id: true,
						username: true,
						avatarUrl: true,
					},
				},
			},
		});
	} catch (error) {
		processPrismaError(error);
	}

	return result;
});

const getTrackRecordByACRId = catchAsyncDataError(async function (acrid: string, userId: string): Promise<Track | null> {
	logger.debug(`audio.data: retrieving track record for ACR ID: %s`, acrid);

	let result: Track | null;

	try {
		result = await prisma.track.findFirst({
			where: { acrid, uploaderId: userId },
			include: {
				album: true,
				artists: {
					include: {
						artist: true,
					},
				},
				uploader: {
					select: {
						id: true,
						username: true,
						avatarUrl: true,
					},
				},
			},
		});
	} catch (error) {
		processPrismaError(error);
	}

	return result;
});

const getAllAlbumRecords = catchAsyncDataError(async function (): Promise<Album[]> {
	logger.debug(`audio.data: listing all album records`);

	let result: Album[];

	try {
		result = await prisma.album.findMany({
			include: {
				tracks: {
					select: {
						id: true,
						title: true,
						musicUrl: true,
						artworkUrl: true,
					},
				},
				artists: {
					select: {
						artist: {
							select: {
								id: true,
								name: true,
								imageUrl: true,
							},
						},
					},
				},
			},
			orderBy: {
				title: "asc",
			},
		});
	} catch (error) {
		processPrismaError(error);
	}

	return result;
});

const getAlbumRecordById = catchAsyncDataError(async function (albumId: string): Promise<Album | null> {
	logger.debug(`audio.data: retrieving album record for ID: %s`, albumId);

	let result: Album | null;

	try {
		result = await prisma.album.findUnique({
			where: { id: albumId },
			include: {
				tracks: {
					select: {
						id: true,
						title: true,
						musicUrl: true,
						artworkUrl: true,
					},
				},
				artists: {
					include: {
						artist: true,
					},
				},
			},
		});
	} catch (error) {
		processPrismaError(error);
	}
	return result;
});

const getAllArtistRecords = catchAsyncDataError(async function (): Promise<Artist[]> {
	logger.debug(`audio.data: listing all artist records`);

	let result: Artist[];

	try {
		result = await prisma.artist.findMany({
			include: {
				contributedAlbums: {
					select: {
						album: {
							select: {
								id: true,
								title: true,
								coverUrl: true,
								releaseDate: true,
							},
						},
					},
				},
			},
			orderBy: {
				name: "asc",
			},
		});
	} catch (error) {
		processPrismaError(error);
	}
	return result;
});

const getArtistRecordById = catchAsyncDataError(async function (artistId: string): Promise<Artist | null> {
	logger.debug(`audio.data: retrieving artist record for ID: %s`, artistId);
	let result: Artist | null;

	try {
		result = await prisma.artist.findUnique({
			where: { id: artistId },
			include: {
				contributedAlbums: {
					include: {
						album: true,
					},
				},
			},
		});
	} catch (error) {
		processPrismaError(error);
	}

	return result;
});

export default {
	getStreamUrl,
	createTrackRecord,
	getAllTrackRecords,
	getTrackRecordById,
	getTrackRecordByACRId,
	getAllAlbumRecords,
	getAlbumRecordById,
	getAllArtistRecords,
	getArtistRecordById,
};
