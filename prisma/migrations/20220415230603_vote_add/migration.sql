-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('UP', 'DOWN');

-- AlterTable
ALTER TABLE "User" ADD CONSTRAINT "User_pkey" PRIMARY KEY ("nickname");

-- CreateTable
CREATE TABLE "Vote" (
    "userNickname" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,
    "voteType" "VoteType" NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("userNickname","postId")
);

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userNickname_fkey" FOREIGN KEY ("userNickname") REFERENCES "User"("nickname") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
