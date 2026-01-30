/*
  Warnings:

  - You are about to alter the column `totalAmount` on the `order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "order" ALTER COLUMN "totalAmount" SET DATA TYPE INTEGER;
