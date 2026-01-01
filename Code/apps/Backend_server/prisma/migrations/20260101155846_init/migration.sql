-- AlterTable
ALTER TABLE "User" ADD COLUMN     "thirdPartyAuthenticated" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "password" DROP NOT NULL;
