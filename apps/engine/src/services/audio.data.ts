import { PrismaClient, type Song } from "@prisma/client";

import logger from "@src/configs/logger.config";
import type { IUpload } from "@src/types";
import { catchAsyncDataError, processPrismaError } from "@src/utils/application-errors";

const prisma = new PrismaClient();

const createSongRecord = catchAsyncDataError(async function (
	userId: string,
	uploadData: Omit<IUpload, "album" | "artist"> & { albumName: string; artistNames: string[] },
): Promise<Song> {
	logger.debug(`audio.data: creating song record for user: %s, title: %s`, userId, uploadData.title);

	let result: Song;

	try {
		result = await prisma.$transaction(async (tx) => {
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

			const song = await tx.song.create({
				data: {
					userId: userId,
					title: uploadData.title,
					lyrics: uploadData.lyrics,
					musicUrl: uploadData.musicUrl,
					artworkUrl: uploadData.artworkUrl,
					albumId: album.id,
				},
			});

			await Promise.all(
				artists.map((artist) =>
					tx.credit.create({
						data: { songId: song.id, artistId: artist.id },
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

			return song;
		});
	} catch (error) {
		processPrismaError(error);
	}

	return result;
});

const listAllSongRecords = catchAsyncDataError(async function (): Promise<Song[]> {
	logger.debug(`audio.data: listing all song records`);

	let result: Song[];

	try {
		result = await prisma.song.findMany({
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

const getSongRecord = catchAsyncDataError(async function (songId: string): Promise<Song | null> {
	logger.debug(`audio.data: retrieving song record for ID: %s`, songId);

	let result: Song | null;

	try {
		result = await prisma.song.findUnique({
			where: { id: songId },
			include: {
				album: true,
				artists: {
					include: {
						artist: true,
					},
				},
				user: {
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

const getStreamUrl = catchAsyncDataError(async function (songId: string): Promise<string> {
	logger.debug(`audio.data: retrieving stream URL for song ID: %s`, songId);

	let result: string;

	try {
		const song = await prisma.song.findUnique({
			where: { id: songId },
			select: { musicUrl: true },
		});
		result = song?.musicUrl ?? "";
	} catch (error) {
		processPrismaError(error);
	}
	return result;
});

export default {
	listAllSongRecords,
	createSongRecord,
	getSongRecord,
	getStreamUrl,
};
