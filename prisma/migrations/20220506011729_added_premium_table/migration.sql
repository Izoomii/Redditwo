/*
  Warnings:

  - You are about to drop the column `premium` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "premium";

-- CreateTable
CREATE TABLE "Premium" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiration" TIMESTAMP(3) NOT NULL,
    "renew" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Premium_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Premium_userId_key" ON "Premium"("userId");

-- AddForeignKey
ALTER TABLE "Premium" ADD CONSTRAINT "Premium_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
