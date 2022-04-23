-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorName_fkey";

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "authorName" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorName_fkey" FOREIGN KEY ("authorName") REFERENCES "User"("nickname") ON DELETE SET NULL ON UPDATE CASCADE;
