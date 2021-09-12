/*
  Warnings:

  - Made the column `street` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `postcode` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Client` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `Client` required. This step will fail if there are existing NULL values in that column.
  - Made the column `projectDescription` on table `Invoice` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Item` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "street" SET NOT NULL,
ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "country" SET NOT NULL,
ALTER COLUMN "postcode" SET NOT NULL;

-- AlterTable
ALTER TABLE "Client" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL;

-- AlterTable
ALTER TABLE "Invoice" ALTER COLUMN "projectDescription" SET NOT NULL;

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "name" SET NOT NULL;
