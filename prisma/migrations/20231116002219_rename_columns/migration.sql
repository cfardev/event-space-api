/*
  Warnings:

  - You are about to drop the column `cheaper_price` on the `place` table. All the data in the column will be lost.
  - You are about to drop the column `min_capacity` on the `place` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "place" DROP COLUMN "cheaper_price",
DROP COLUMN "min_capacity",
ADD COLUMN     "capacity" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "price_per_hour" DOUBLE PRECISION NOT NULL DEFAULT 300;
