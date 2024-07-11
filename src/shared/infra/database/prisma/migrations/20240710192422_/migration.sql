/*
  Warnings:

  - You are about to drop the column `completedEventsId` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the `Completed_Events` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `registerEventsId` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_completedEventsId_fkey";

-- DropForeignKey
ALTER TABLE "Completed_Events" DROP CONSTRAINT "Completed_Events_eventId_fkey";

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "completedEventsId",
ADD COLUMN     "registerEventsId" UUID NOT NULL;

-- DropTable
DROP TABLE "Completed_Events";

-- CreateTable
CREATE TABLE "Register_Events" (
    "id" UUID NOT NULL,
    "eventId" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3),

    CONSTRAINT "Register_Events_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Register_Events" ADD CONSTRAINT "Register_Events_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_registerEventsId_fkey" FOREIGN KEY ("registerEventsId") REFERENCES "Register_Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
