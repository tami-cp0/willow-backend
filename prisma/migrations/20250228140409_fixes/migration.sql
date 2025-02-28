/*
  Warnings:

  - The values [GUEST] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `username` on the `sellers` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_tokens` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[business_name]` on the table `sellers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `business_name` to the `sellers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('CUSTOMER', 'SELLER', 'ADMIN');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- AlterTable
ALTER TABLE "customers" ALTER COLUMN "address" DROP NOT NULL;

-- AlterTable
ALTER TABLE "sellers" DROP COLUMN "username",
ADD COLUMN     "business_name" VARCHAR(20) NOT NULL,
ALTER COLUMN "bio" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "refresh_tokens",
ADD COLUMN     "last_known_ip" TEXT,
ADD COLUMN     "refresh_token" TEXT,
ALTER COLUMN "role" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "sellers_business_name_key" ON "sellers"("business_name");
