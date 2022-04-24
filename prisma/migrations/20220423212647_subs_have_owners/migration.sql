/*
  Warnings:

  - A unique constraint covering the columns `[ownerName]` on the table `Sub` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownerName` to the `Sub` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sub" ADD COLUMN     "ownerName" CITEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Sub_ownerName_key" ON "Sub"("ownerName");

-- AddForeignKey
ALTER TABLE "Sub" ADD CONSTRAINT "Sub_ownerName_fkey" FOREIGN KEY ("ownerName") REFERENCES "User"("nickname") ON DELETE RESTRICT ON UPDATE CASCADE;
