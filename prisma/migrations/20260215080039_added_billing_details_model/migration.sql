-- CreateEnum
CREATE TYPE "Nationality" AS ENUM ('INDIAN', 'INTERNATIONAL');

-- CreateTable
CREATE TABLE "BillingDetails" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nationality" "Nationality" NOT NULL DEFAULT 'INDIAN',
    "state" TEXT NOT NULL,
    "acceptedTerms" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BillingDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BillingDetails_bookingId_key" ON "BillingDetails"("bookingId");

-- AddForeignKey
ALTER TABLE "BillingDetails" ADD CONSTRAINT "BillingDetails_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
