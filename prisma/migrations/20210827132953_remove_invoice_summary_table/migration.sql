/*
  Warnings:

  - You are about to drop the `InvoiceSummary` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "InvoiceSummary";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Sender" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "addressId" INTEGER NOT NULL,
    FOREIGN KEY ("addressId") REFERENCES "Address" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Sender" ("addressId", "id") SELECT "addressId", "id" FROM "Sender";
DROP TABLE "Sender";
ALTER TABLE "new_Sender" RENAME TO "Sender";
CREATE UNIQUE INDEX "Sender_addressId_unique" ON "Sender"("addressId");
CREATE TABLE "new_Invoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL,
    "issuedAt" DATETIME NOT NULL,
    "projectDescription" TEXT NOT NULL,
    "paymentTerms" INTEGER NOT NULL,
    "senderId" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,
    FOREIGN KEY ("senderId") REFERENCES "Sender" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Invoice" ("clientId", "id", "issuedAt", "paymentTerms", "projectDescription", "senderId", "status") SELECT "clientId", "id", "issuedAt", "paymentTerms", "projectDescription", "senderId", "status" FROM "Invoice";
DROP TABLE "Invoice";
ALTER TABLE "new_Invoice" RENAME TO "Invoice";
CREATE TABLE "new_Client" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "addressId" INTEGER NOT NULL,
    FOREIGN KEY ("addressId") REFERENCES "Address" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Client" ("addressId", "email", "id", "name") SELECT "addressId", "email", "id", "name" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
CREATE UNIQUE INDEX "Client_addressId_unique" ON "Client"("addressId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
