/*
  Warnings:

  - Added the required column `birth_day` to the `user_info` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_info" ADD COLUMN     "birth_day" TIMESTAMP(3) NOT NULL;
