/*
  Warnings:

  - You are about to drop the column `userClientId` on the `Followup` table. All the data in the column will be lost.
  - You are about to drop the column `userClientId` on the `FollowupAuditTrail` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `UserClient` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[clerkId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clientId` to the `Followup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientId` to the `FollowupAuditTrail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clerkId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Followup" DROP CONSTRAINT "Followup_userClientId_fkey";

-- DropForeignKey
ALTER TABLE "FollowupAuditTrail" DROP CONSTRAINT "FollowupAuditTrail_userClientId_fkey";

-- DropForeignKey
ALTER TABLE "UserClient" DROP CONSTRAINT "UserClient_userId_fkey";

-- AlterTable
ALTER TABLE "Followup" DROP COLUMN "userClientId",
ADD COLUMN     "clientId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "FollowupAuditTrail" DROP COLUMN "userClientId",
ADD COLUMN     "clientId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "clerkId" TEXT NOT NULL,
ADD COLUMN     "companyId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "UserClient";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "email" TEXT,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Followup" ADD CONSTRAINT "Followup_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowupAuditTrail" ADD CONSTRAINT "FollowupAuditTrail_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
