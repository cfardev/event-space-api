/*
  Warnings:

  - Added the required column `id_place` to the `place_photo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "place_photo" ADD COLUMN     "id_place" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "place_photo" ADD CONSTRAINT "place_photo_id_place_fkey" FOREIGN KEY ("id_place") REFERENCES "place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
