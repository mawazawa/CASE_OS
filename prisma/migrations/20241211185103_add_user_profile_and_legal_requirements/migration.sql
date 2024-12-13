-- AlterTable
ALTER TABLE "Document" ADD COLUMN "analysis" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "caseNumber" TEXT;
ALTER TABLE "User" ADD COLUMN "courtName" TEXT;
ALTER TABLE "User" ADD COLUMN "filingDate" DATETIME;
ALTER TABLE "User" ADD COLUMN "state" TEXT;

-- CreateTable
CREATE TABLE "LegalRequirement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "state" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "LegalRequirement_state_category_title_key" ON "LegalRequirement"("state", "category", "title");
