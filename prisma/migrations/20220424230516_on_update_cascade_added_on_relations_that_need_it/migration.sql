-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_subName_fkey";

-- DropForeignKey
ALTER TABLE "Sub" DROP CONSTRAINT "Sub_ownerName_fkey";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_subName_fkey" FOREIGN KEY ("subName") REFERENCES "Sub"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sub" ADD CONSTRAINT "Sub_ownerName_fkey" FOREIGN KEY ("ownerName") REFERENCES "User"("nickname") ON DELETE SET NULL ON UPDATE CASCADE;
