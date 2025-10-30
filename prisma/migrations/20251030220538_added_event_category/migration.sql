/*
  Warnings:

  - Added the required column `category` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TicketCategory" AS ENUM ('REGULAR', 'FANPIT', 'VIP', 'PLATINUM', 'GOLD', 'SILVER', 'LOUNGE', 'VIRTUAL', 'STUDENT');

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "category" "TicketCategory" NOT NULL,
ADD COLUMN     "guidelines" TEXT;
