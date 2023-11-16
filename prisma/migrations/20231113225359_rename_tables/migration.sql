/*
  Warnings:

  - You are about to drop the `PlaceServiceReservation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reservation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_bill_id_fkey";

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_place_id_fkey";

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_user_id_fkey";

-- DropTable
DROP TABLE "PlaceServiceReservation";

-- DropTable
DROP TABLE "Reservation";

-- CreateTable
CREATE TABLE "reservation" (
    "id" SERIAL NOT NULL,
    "reservation_date" TIMESTAMP(3) NOT NULL,
    "is_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "place_id" INTEGER NOT NULL,
    "room_id" INTEGER NOT NULL,
    "bill_id" INTEGER NOT NULL,

    CONSTRAINT "reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "place_service_reservation" (
    "id" SERIAL NOT NULL,
    "reservation_id" INTEGER NOT NULL,
    "place_service_id" INTEGER NOT NULL,

    CONSTRAINT "place_service_reservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reservation_bill_id_key" ON "reservation"("bill_id");

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_bill_id_fkey" FOREIGN KEY ("bill_id") REFERENCES "bill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
