/*
  Warnings:

  - You are about to drop the column `conversationId` on the `Thread` table. All the data in the column will be lost.
  - Added the required column `followupId` to the `Thread` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Thread" DROP CONSTRAINT "Thread_conversationId_fkey";

-- AlterTable
ALTER TABLE "Thread" DROP COLUMN "conversationId",
ADD COLUMN     "followupId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_followupId_fkey" FOREIGN KEY ("followupId") REFERENCES "Followup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
