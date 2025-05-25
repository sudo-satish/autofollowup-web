/*
  Warnings:

  - Added the required column `userId` to the `UserClient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserClient" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "UserClient" ADD CONSTRAINT "UserClient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
