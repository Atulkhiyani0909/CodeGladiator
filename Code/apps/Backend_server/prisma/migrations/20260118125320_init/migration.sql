/*
  Warnings:

  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `thirdPartyAuthenticated` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."User_username_key";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "password",
DROP COLUMN "refreshToken",
DROP COLUMN "thirdPartyAuthenticated",
DROP COLUMN "username",
ADD COLUMN     "name" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "public"."User"("name");
