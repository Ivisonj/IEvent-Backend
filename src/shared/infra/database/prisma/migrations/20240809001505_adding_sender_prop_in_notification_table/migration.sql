-- CreateEnum
CREATE TYPE "SenderType" AS ENUM ('user', 'event');

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "sender" "SenderType" NOT NULL DEFAULT 'event';
