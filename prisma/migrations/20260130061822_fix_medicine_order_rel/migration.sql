/*
  Warnings:

  - You are about to drop the `order_item` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `medicineId` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "order_item" DROP CONSTRAINT "order_item_medicineId_fkey";

-- DropForeignKey
ALTER TABLE "order_item" DROP CONSTRAINT "order_item_orderId_fkey";

-- AlterTable
ALTER TABLE "order" ADD COLUMN     "medicineId" UUID NOT NULL;

-- DropTable
DROP TABLE "order_item";

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "medicine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
