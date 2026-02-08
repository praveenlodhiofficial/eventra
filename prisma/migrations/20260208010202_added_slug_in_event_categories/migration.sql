/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `EventCategory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `EventCategory` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "performers_name_trgm";

-- AlterTable
ALTER TABLE "EventCategory" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "EventCategory_slug_key" ON "EventCategory"("slug");
