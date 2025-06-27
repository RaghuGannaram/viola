/*
  Warnings:

  - Made the column `lyrics` on table `Song` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Song" ALTER COLUMN "lyrics" SET NOT NULL,
ALTER COLUMN "lyrics" SET DEFAULT '';
