-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_subId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_subId_fkey" FOREIGN KEY ("subId") REFERENCES "Sub"("id") ON DELETE CASCADE ON UPDATE CASCADE;
