/*
  Warnings:

  - You are about to drop the column `registerEventsId` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the `Register_Events` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `eventLogId` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_registerEventsId_fkey";

-- DropForeignKey
ALTER TABLE "Register_Events" DROP CONSTRAINT "Register_Events_eventId_fkey";

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "registerEventsId",
ADD COLUMN     "eventLogId" UUID NOT NULL;

-- DropTable
DROP TABLE "Register_Events";

-- CreateTable
CREATE TABLE "Event_Log" (
    "id" UUID NOT NULL,
    "eventId" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3),

    CONSTRAINT "Event_Log_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Event_Log" ADD CONSTRAINT "Event_Log_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_eventLogId_fkey" FOREIGN KEY ("eventLogId") REFERENCES "Event_Log"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
