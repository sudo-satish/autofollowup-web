/*
  Warnings:

  - The `channel` column on the `Message` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Channel" AS ENUM ('WHATSAPP', 'TELEGRAM', 'SMS', 'EMAIL', 'OTHER');

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "channel",
ADD COLUMN     "channel" "Channel" NOT NULL DEFAULT 'WHATSAPP';

-- DropEnum
DROP TYPE "MessageChannel";
