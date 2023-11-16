-- AddForeignKey
ALTER TABLE "place_service_reservation" ADD CONSTRAINT "place_service_reservation_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "place_service_reservation" ADD CONSTRAINT "place_service_reservation_place_service_id_fkey" FOREIGN KEY ("place_service_id") REFERENCES "place_service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
