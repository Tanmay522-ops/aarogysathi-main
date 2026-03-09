/*
  Warnings:

  - You are about to alter the column `consultationFee` on the `doctors` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - A unique constraint covering the columns `[email]` on the table `doctors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[licenseNumber]` on the table `doctors` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `doctors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `doctors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emergencyContactName` to the `doctors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emergencyContactNumber` to the `doctors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `licenseNumber` to the `doctors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `doctors` table without a default value. This is not possible if the table is not empty.
  - Made the column `specialization` on table `doctors` required. This step will fail if there are existing NULL values in that column.
  - Made the column `qualification` on table `doctors` required. This step will fail if there are existing NULL values in that column.
  - Made the column `experience` on table `doctors` required. This step will fail if there are existing NULL values in that column.
  - Made the column `consultationFee` on table `doctors` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `availability` to the `doctors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AppointmentStatus" ADD VALUE 'CONFIRMED';
ALTER TYPE "AppointmentStatus" ADD VALUE 'NO_SHOW';

-- AlterTable
ALTER TABLE "doctors" ADD COLUMN     "about" TEXT,
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "emergencyContactName" TEXT NOT NULL,
ADD COLUMN     "emergencyContactNumber" VARCHAR(15) NOT NULL,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "licenseDocumentUrl" TEXT,
ADD COLUMN     "licenseNumber" TEXT NOT NULL,
ADD COLUMN     "phone" VARCHAR(15) NOT NULL,
ALTER COLUMN "specialization" SET NOT NULL,
ALTER COLUMN "qualification" SET NOT NULL,
ALTER COLUMN "experience" SET NOT NULL,
ALTER COLUMN "consultationFee" SET NOT NULL,
ALTER COLUMN "consultationFee" SET DATA TYPE DECIMAL(10,2),
DROP COLUMN "availability",
ADD COLUMN     "availability" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "isActive" SET DEFAULT false;

-- CreateIndex
CREATE INDEX "appointments_createdAt_idx" ON "appointments"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_email_key" ON "doctors"("email");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_licenseNumber_key" ON "doctors"("licenseNumber");

-- CreateIndex
CREATE INDEX "doctors_specialization_idx" ON "doctors"("specialization");

-- CreateIndex
CREATE INDEX "doctors_isActive_isVerified_idx" ON "doctors"("isActive", "isVerified");
