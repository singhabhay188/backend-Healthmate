/*
  Warnings:

  - You are about to drop the column `saltId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Salt` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `description` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_saltId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "saltId",
ALTER COLUMN "description" SET NOT NULL;

-- DropTable
DROP TABLE "Salt";
