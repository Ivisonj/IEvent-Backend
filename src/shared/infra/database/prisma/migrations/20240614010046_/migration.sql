-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL,
    "once" BOOLEAN NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "custom_rules" BOOLEAN NOT NULL,
    "absences_limit" BOOLEAN NOT NULL,
    "max_absences" INTEGER NOT NULL,
    "delays_limit" BOOLEAN NOT NULL,
    "max_delays" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recurrence" (
    "id" UUID NOT NULL,
    "eventId" UUID NOT NULL,
    "day" INTEGER NOT NULL,
    "recurrence" BOOLEAN NOT NULL,

    CONSTRAINT "Recurrence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recurrence" ADD CONSTRAINT "Recurrence_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
