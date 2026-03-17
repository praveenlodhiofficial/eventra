-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_venueId_fkey";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "cityToBeAnnounced" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "performerToBeAnnounced" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "scheduleToBeAnnounced" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "venueToBeAnnounced" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "venueId" DROP NOT NULL,
ALTER COLUMN "endAt" DROP NOT NULL,
ALTER COLUMN "startAt" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE SET NULL ON UPDATE CASCADE;
