/*
  Warnings:

  - You are about to drop the column `sub` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "sub" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "sub";
