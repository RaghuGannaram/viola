/*
  Warnings:

  - You are about to drop the column `isPremium` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `avatarUrl` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isPremium",
DROP COLUMN "isVerified",
DROP COLUMN "passwordHash",
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "premium" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'member',
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "authProvider" SET DEFAULT 'viola',
ALTER COLUMN "avatarUrl" SET NOT NULL;
