-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorName_fkey";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorName_fkey" FOREIGN KEY ("authorName") REFERENCES "User"("nickname") ON DELETE RESTRICT ON UPDATE CASCADE;
