import { PrismaClient, type Song } from "@prisma/client";

import logger from "@src/configs/logger.config";
import type { IUpload } from "@src/types";
import { catchAsyncDataError, processPrismaError } from "@src/utils/application-errors";

const prisma = new PrismaClient();

const createSongRecord = catchAsyncDataError(async function (userId: string, uploadData: IUpload): Promise<Song> {
	logger.debug(`audio.data: inserting song metadata into database for user: %s`, userId);

	// 1️⃣ Normalize artist names (upsert artists)
	const artistNames = uploadData.artist.split(",").map((a) => a.trim());
	const artistIds: string[] = [];

	for (const name of artistNames) {
		const artist = await prisma.artist.upsert({
			where: { name },
			update: {},
			create: { name },
		});
		artistIds.push(artist.id);
	}

	// 2️⃣ Upsert album directly on title uniqueness
	const album = await prisma.album.upsert({
		where: { title: uploadData.album },
		update: {},
		create: { title: uploadData.album },
	});

	// 3️⃣ Insert song record
	let song;
	try {
		song = await prisma.song.create({
			data: {
				userId,
				title: uploadData.title,
				lyrics: uploadData.lyrics,
				audioUrl: uploadData.musicUrl,
				coverUrl: uploadData.artworkUrl,
				albumId: album.id,
			},
		});
	} catch (error) {
		processPrismaError(error);
	}

	// 4️⃣ Insert artist credits (Song ⇔ Artist mapping)
	const creditInserts = artistIds.map((artistId) =>
		prisma.credit.create({
			data: {
				songId: song.id,
				artistId,
			},
		}),
	);

	await prisma.$transaction(creditInserts);

	return song;
});

export default {
	createSongRecord,
};
