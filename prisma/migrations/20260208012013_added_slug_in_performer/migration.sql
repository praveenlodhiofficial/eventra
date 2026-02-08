/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Performer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `EventCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Performer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventCategory" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Performer" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Performer_slug_key" ON "Performer"("slug");
