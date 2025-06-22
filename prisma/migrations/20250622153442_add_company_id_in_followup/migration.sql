/*
  Warnings:

  - Added the required column `companyId` to the `Followup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Followup" ADD COLUMN     "companyId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Followup" ADD CONSTRAINT "Followup_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
