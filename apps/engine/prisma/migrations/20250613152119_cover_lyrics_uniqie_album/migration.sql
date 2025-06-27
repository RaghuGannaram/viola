/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Album` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Artist` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "coverUrl" TEXT NOT NULL DEFAULT 'defaultCover.png',
ADD COLUMN     "lyrics" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Album_title_key" ON "Album"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_name_key" ON "Artist"("name");
