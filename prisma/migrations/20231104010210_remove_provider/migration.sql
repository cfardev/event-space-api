/*
  Warnings:

  - You are about to drop the column `provider_id` on the `place_service` table. All the data in the column will be lost.
  - You are about to drop the `provider` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `provider_email` to the `place_service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider_name` to the `place_service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider_phone` to the `place_service` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "place_service" DROP CONSTRAINT "place_service_provider_id_fkey";

-- AlterTable
ALTER TABLE "place_service" DROP COLUMN "provider_id",
ADD COLUMN     "provider_email" TEXT NOT NULL,
ADD COLUMN     "provider_name" TEXT NOT NULL,
ADD COLUMN     "provider_phone" TEXT NOT NULL;

-- DropTable
DROP TABLE "provider";
