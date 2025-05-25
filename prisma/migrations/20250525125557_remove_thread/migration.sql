/*
  Warnings:

  - You are about to drop the column `threadId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `Thread` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `followupId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_threadId_fkey";

-- DropForeignKey
ALTER TABLE "Thread" DROP CONSTRAINT "Thread_followupId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "threadId",
ADD COLUMN     "followupId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Thread";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_followupId_fkey" FOREIGN KEY ("followupId") REFERENCES "Followup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
