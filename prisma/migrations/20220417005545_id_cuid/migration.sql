/*
  Warnings:

  - Made the column `id` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" SET NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
