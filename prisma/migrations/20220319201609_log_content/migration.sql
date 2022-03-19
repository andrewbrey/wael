/*
  Warnings:

  - Added the required column `cardio` to the `LogEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lift` to the `LogEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `LogEntry` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LogEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weight" REAL NOT NULL,
    "cardio" BOOLEAN NOT NULL,
    "lift" BOOLEAN NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_LogEntry" ("createdAt", "id", "updatedAt") SELECT "createdAt", "id", "updatedAt" FROM "LogEntry";
DROP TABLE "LogEntry";
ALTER TABLE "new_LogEntry" RENAME TO "LogEntry";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
