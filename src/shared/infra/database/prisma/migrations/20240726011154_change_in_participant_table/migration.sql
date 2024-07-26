/*
  Warnings:

  - Made the column `message` on table `Notification` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Notification" ALTER COLUMN "message" SET NOT NULL;

-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "absenceCount" INTEGER,
ADD COLUMN     "lateCount" INTEGER,
ADD COLUMN     "presenceCount" INTEGER;
