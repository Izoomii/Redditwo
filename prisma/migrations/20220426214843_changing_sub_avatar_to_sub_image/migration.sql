/*
  Warnings:

  - You are about to drop the column `avatar` on the `Sub` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Sub" DROP COLUMN "avatar",
ADD COLUMN     "image" TEXT;
