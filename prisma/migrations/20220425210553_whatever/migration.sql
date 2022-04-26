/*
  Warnings:

  - Made the column `ownerName` on table `Sub` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Sub" DROP CONSTRAINT "Sub_ownerName_fkey";

-- AlterTable
ALTER TABLE "Sub" ALTER COLUMN "ownerName" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Sub" ADD CONSTRAINT "Sub_ownerName_fkey" FOREIGN KEY ("ownerName") REFERENCES "User"("nickname") ON DELETE RESTRICT ON UPDATE CASCADE;
