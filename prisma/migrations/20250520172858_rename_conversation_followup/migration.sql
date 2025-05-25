/*
  Warnings:

  - You are about to drop the `Conversation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ConversationAuditTrail` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "FollowupStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'COMPLETED', 'FAILED');

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_agentId_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_userClientId_fkey";

-- DropForeignKey
ALTER TABLE "ConversationAuditTrail" DROP CONSTRAINT "ConversationAuditTrail_agentId_fkey";

-- DropForeignKey
ALTER TABLE "ConversationAuditTrail" DROP CONSTRAINT "ConversationAuditTrail_userClientId_fkey";

-- DropForeignKey
ALTER TABLE "Thread" DROP CONSTRAINT "Thread_conversationId_fkey";

-- DropTable
DROP TABLE "Conversation";

-- DropTable
DROP TABLE "ConversationAuditTrail";

-- DropEnum
DROP TYPE "ConversationStatus";

-- CreateTable
CREATE TABLE "Followup" (
    "id" SERIAL NOT NULL,
    "userClientId" INTEGER NOT NULL,
    "agentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "followupDate" TIMESTAMP(3),
    "status" "FollowupStatus" NOT NULL DEFAULT 'DRAFT',
    "context" TEXT,
    "summary" TEXT,

    CONSTRAINT "Followup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FollowupAuditTrail" (
    "id" SERIAL NOT NULL,
    "userClientId" INTEGER NOT NULL,
    "agentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "followupDate" TIMESTAMP(3),
    "status" "FollowupStatus" NOT NULL DEFAULT 'DRAFT',
    "context" TEXT,
    "summary" TEXT,

    CONSTRAINT "FollowupAuditTrail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Followup" ADD CONSTRAINT "Followup_userClientId_fkey" FOREIGN KEY ("userClientId") REFERENCES "UserClient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Followup" ADD CONSTRAINT "Followup_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowupAuditTrail" ADD CONSTRAINT "FollowupAuditTrail_userClientId_fkey" FOREIGN KEY ("userClientId") REFERENCES "UserClient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowupAuditTrail" ADD CONSTRAINT "FollowupAuditTrail_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Followup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
