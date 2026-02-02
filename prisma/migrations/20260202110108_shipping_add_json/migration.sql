/*
  Warnings:

  - Added the required column `shippingAddress` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order" ADD COLUMN     "shippingAddress" JSONB NOT NULL;
