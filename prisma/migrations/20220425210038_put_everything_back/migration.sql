-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_subName_fkey";

-- CreateTable
CREATE TABLE "Subscription" (
    "userId" TEXT NOT NULL,
    "subId" TEXT NOT NULL,
    "subscribed" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("userId","subId")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_subName_fkey" FOREIGN KEY ("subName") REFERENCES "Sub"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_subId_fkey" FOREIGN KEY ("subId") REFERENCES "Sub"("id") ON DELETE CASCADE ON UPDATE CASCADE;
