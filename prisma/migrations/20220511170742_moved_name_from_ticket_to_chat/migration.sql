/*
  Warnings:

  - You are about to drop the column `name` on the `Ticket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "name" CITEXT;

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "name";
