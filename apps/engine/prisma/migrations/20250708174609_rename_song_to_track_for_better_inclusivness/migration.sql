/*
  Warnings:

  - The primary key for the `Credit` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `songId` on the `Credit` table. All the data in the column will be lost.
  - The primary key for the `Curation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `songId` on the `Curation` table. All the data in the column will be lost.
  - You are about to drop the column `songId` on the `PlaybackLog` table. All the data in the column will be lost.
  - The primary key for the `Reaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `songId` on the `Reaction` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Song` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `trackId` to the `Credit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trackId` to the `Curation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trackId` to the `PlaybackLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trackId` to the `Reaction` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `emoji` on the `Reaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ReactionSymbol" AS ENUM ('LIKE', 'FIRE', 'HEART', 'CLAP');

-- DropForeignKey
ALTER TABLE "Credit" DROP CONSTRAINT "Credit_songId_fkey";

-- DropForeignKey
ALTER TABLE "Curation" DROP CONSTRAINT "Curation_songId_fkey";

-- DropForeignKey
ALTER TABLE "PlaybackLog" DROP CONSTRAINT "PlaybackLog_songId_fkey";

-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_songId_fkey";

-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_albumId_fkey";

-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_userId_fkey";

-- AlterTable
ALTER TABLE "Credit" DROP CONSTRAINT "Credit_pkey",
DROP COLUMN "songId",
ADD COLUMN     "trackId" UUID NOT NULL,
ADD CONSTRAINT "Credit_pkey" PRIMARY KEY ("trackId", "artistId");

-- AlterTable
ALTER TABLE "Curation" DROP CONSTRAINT "Curation_pkey",
DROP COLUMN "songId",
ADD COLUMN     "trackId" UUID NOT NULL,
ADD CONSTRAINT "Curation_pkey" PRIMARY KEY ("playlistId", "trackId");

-- AlterTable
ALTER TABLE "PlaybackLog" DROP COLUMN "songId",
ADD COLUMN     "trackId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_pkey",
DROP COLUMN "songId",
ADD COLUMN     "trackId" UUID NOT NULL,
DROP COLUMN "emoji",
ADD COLUMN     "emoji" "ReactionSymbol" NOT NULL,
ADD CONSTRAINT "Reaction_pkey" PRIMARY KEY ("userId", "trackId", "emoji");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "providerId",
ADD COLUMN     "authProviderId" TEXT,
ALTER COLUMN "avatarUrl" SET DEFAULT '';

-- DropTable
DROP TABLE "Song";

-- DropEnum
DROP TYPE "ReactionEmoji";

-- CreateTable
CREATE TABLE "Track" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "duration" INTEGER,
    "trackNumber" INTEGER,
    "lyrics" TEXT NOT NULL DEFAULT '',
    "musicUrl" TEXT NOT NULL,
    "artworkUrl" TEXT NOT NULL DEFAULT 'defaultCover.png',
    "albumId" UUID,
    "uploaderId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit" ADD CONSTRAINT "Credit_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curation" ADD CONSTRAINT "Curation_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaybackLog" ADD CONSTRAINT "PlaybackLog_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;
