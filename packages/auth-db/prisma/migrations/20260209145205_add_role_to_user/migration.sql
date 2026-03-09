/*
  Warnings:

  - You are about to alter the column `phone` on the `patients` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(15)`.
  - You are about to alter the column `emergencyContactNumber` on the `patients` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(15)`.
  - You are about to drop the column `abhaId` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[abhaId]` on the table `patients` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `abhaId` to the `patients` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PATIENT', 'DOCTOR', 'ADMIN');

-- DropIndex
DROP INDEX "users_abhaId_key";

-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "abhaId" VARCHAR(14) NOT NULL,
ALTER COLUMN "phone" SET DATA TYPE VARCHAR(15),
ALTER COLUMN "emergencyContactNumber" SET DATA TYPE VARCHAR(15);

-- AlterTable
ALTER TABLE "users" DROP COLUMN "abhaId",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'PATIENT';

-- CreateIndex
CREATE UNIQUE INDEX "patients_abhaId_key" ON "patients"("abhaId");
