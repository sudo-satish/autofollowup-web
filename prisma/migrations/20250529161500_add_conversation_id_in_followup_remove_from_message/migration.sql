/*
  Warnings:

  - You are about to drop the column `conversationSid` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Followup" ADD COLUMN     "conversationSid" TEXT;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "conversationSid";
