/*
  Warnings:

  - You are about to drop the column `sub` on the `Post` table. All the data in the column will be lost.
  - Added the required column `subName` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "sub",
ADD COLUMN     "subName" CITEXT NOT NULL;

-- CreateTable
CREATE TABLE "Sub" (
    "id" TEXT NOT NULL,
    "name" CITEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Sub_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sub_name_key" ON "Sub"("name");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_subName_fkey" FOREIGN KEY ("subName") REFERENCES "Sub"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
