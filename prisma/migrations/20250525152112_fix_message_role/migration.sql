/*
  Warnings:

  - The values [USER,AGENT,SYSTEM] on the enum `MessageRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MessageRole_new" AS ENUM ('user', 'data', 'system', 'assistant');
ALTER TABLE "Message" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "Message" ALTER COLUMN "role" TYPE "MessageRole_new" USING ("role"::text::"MessageRole_new");
ALTER TYPE "MessageRole" RENAME TO "MessageRole_old";
ALTER TYPE "MessageRole_new" RENAME TO "MessageRole";
DROP TYPE "MessageRole_old";
ALTER TABLE "Message" ALTER COLUMN "role" SET DEFAULT 'user';
COMMIT;

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "role" SET DEFAULT 'user';
