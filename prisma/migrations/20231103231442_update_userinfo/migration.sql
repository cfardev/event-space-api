/*
  Warnings:

  - You are about to drop the column `city` on the `user_info` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `user_info` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `user_info` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_info" DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "state";
