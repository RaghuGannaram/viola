/*
  Warnings:

  - You are about to drop the column `audioUrl` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `coverUrl` on the `Song` table. All the data in the column will be lost.
  - Added the required column `musicUrl` to the `Song` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Song" DROP COLUMN "audioUrl",
DROP COLUMN "coverUrl",
ADD COLUMN     "artworkUrl" TEXT NOT NULL DEFAULT 'defaultCover.png',
ADD COLUMN     "musicUrl" TEXT NOT NULL;
