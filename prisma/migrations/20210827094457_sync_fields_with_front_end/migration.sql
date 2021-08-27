/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `paymentTerm` on the `Invoice` table. All the data in the column will be lost.
  - Added the required column `issuedAt` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentTerms` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectDescription` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Invoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL,
    "issuedAt" DATETIME NOT NULL,
    "projectDescription" TEXT NOT NULL,
    "paymentTerms" INTEGER NOT NULL,
    "senderId" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,
    FOREIGN KEY ("senderId") REFERENCES "Sender" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Invoice" ("clientId", "id", "senderId", "status") SELECT "clientId", "id", "senderId", "status" FROM "Invoice";
DROP TABLE "Invoice";
ALTER TABLE "new_Invoice" RENAME TO "Invoice";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
