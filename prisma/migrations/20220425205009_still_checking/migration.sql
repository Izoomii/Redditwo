-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_subName_fkey";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_subName_fkey" FOREIGN KEY ("subName") REFERENCES "Sub"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
