/*
  Warnings:

  - Added the required column `content` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('TEXT', 'IMAGE', 'AUDIO', 'VIDEO', 'FILE', 'LINK', 'OTHER');

-- CreateEnum
CREATE TYPE "MessageRole" AS ENUM ('USER', 'AGENT');

-- CreateEnum
CREATE TYPE "MessageChannel" AS ENUM ('WHATSAPP', 'TELEGRAM', 'SMS', 'EMAIL', 'OTHER');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "channel" "MessageChannel" NOT NULL DEFAULT 'WHATSAPP',
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "contentType" "ContentType" NOT NULL DEFAULT 'TEXT',
ADD COLUMN     "role" "MessageRole" NOT NULL DEFAULT 'USER';
