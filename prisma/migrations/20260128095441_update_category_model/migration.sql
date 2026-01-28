/*
  Warnings:

  - You are about to drop the column `isActive` on the `medicine` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `medicine` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit` to the `medicine` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Unit" AS ENUM ('MG', 'ML', 'G', 'IU', 'MCG');

-- CreateEnum
CREATE TYPE "MedicineStatus" AS ENUM ('AVAILABLE', 'OUT_OF_STOCK', 'DISCONTINUED');

-- DropIndex
DROP INDEX "medicine_sellerId_idx";

-- AlterTable
ALTER TABLE "category" ADD COLUMN     "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedAt" TIMESTAMPTZ(6) NOT NULL;

-- AlterTable
ALTER TABLE "medicine" DROP COLUMN "isActive",
ADD COLUMN     "status" "MedicineStatus" NOT NULL DEFAULT 'AVAILABLE',
ADD COLUMN     "unit" "Unit" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "category_slug_key" ON "category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "medicine_slug_key" ON "medicine"("slug");

-- CreateIndex
CREATE INDEX "medicine_sellerId_categoryId_idx" ON "medicine"("sellerId", "categoryId");
