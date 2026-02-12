/*
  Warnings:

  - You are about to drop the column `eventId` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Ticket` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ticketTypeId,seatNumber,row,section]` on the table `Ticket` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ticketTypeId` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('RESERVED', 'PAID', 'CANCELLED', 'REFUNDED', 'SCANNED');

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_userId_fkey";

-- DropIndex
DROP INDEX "Ticket_eventId_idx";

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "eventId",
DROP COLUMN "price",
ADD COLUMN     "row" TEXT,
ADD COLUMN     "seatNumber" TEXT,
ADD COLUMN     "section" TEXT,
ADD COLUMN     "status" "TicketStatus" NOT NULL DEFAULT 'RESERVED',
ADD COLUMN     "ticketTypeId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "TicketType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "eventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TicketType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TicketType_eventId_idx" ON "TicketType"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "TicketType_eventId_name_key" ON "TicketType"("eventId", "name");

-- CreateIndex
CREATE INDEX "Ticket_ticketTypeId_idx" ON "Ticket"("ticketTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_ticketTypeId_seatNumber_row_section_key" ON "Ticket"("ticketTypeId", "seatNumber", "row", "section");

-- AddForeignKey
ALTER TABLE "TicketType" ADD CONSTRAINT "TicketType_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_ticketTypeId_fkey" FOREIGN KEY ("ticketTypeId") REFERENCES "TicketType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
