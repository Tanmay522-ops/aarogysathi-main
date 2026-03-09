/*
  Warnings:

  - A unique constraint covering the columns `[clerkId]` on the table `doctors` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerkId` to the `doctors` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "doctors_name_key";

-- AlterTable
ALTER TABLE "doctors" ADD COLUMN     "clerkId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "doctors_clerkId_key" ON "doctors"("clerkId");
