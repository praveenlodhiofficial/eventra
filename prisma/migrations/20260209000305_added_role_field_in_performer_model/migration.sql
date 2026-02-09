/*
  Warnings:

  - Added the required column `role` to the `Performer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Performer" ADD COLUMN     "role" TEXT NOT NULL;
