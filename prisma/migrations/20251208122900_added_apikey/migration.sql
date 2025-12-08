/*
  Warnings:

  - Added the required column `expiresAt` to the `ApiKey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceName` to the `ApiKey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ApiKey" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "revoked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "serviceName" TEXT NOT NULL;
