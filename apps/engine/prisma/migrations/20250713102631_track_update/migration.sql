-- AlterTable
ALTER TABLE "Track" ADD COLUMN     "acrid" TEXT,
ADD COLUMN     "genres" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "label" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "releaseDate" TIMESTAMP(3);
