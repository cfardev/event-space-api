/*
  Warnings:

  - Added the required column `card_number` to the `payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `full_name` to the `payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payment" ADD COLUMN     "card_number" TEXT NOT NULL,
ADD COLUMN     "full_name" TEXT NOT NULL;
