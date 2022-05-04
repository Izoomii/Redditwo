-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_ownerName_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "Sub" DROP CONSTRAINT "Sub_ownerName_fkey";

-- AddForeignKey
ALTER TABLE "Sub" ADD CONSTRAINT "Sub_ownerName_fkey" FOREIGN KEY ("ownerName") REFERENCES "User"("nickname") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_ownerName_fkey" FOREIGN KEY ("ownerName") REFERENCES "User"("nickname") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
