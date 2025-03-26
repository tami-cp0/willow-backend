/*
  Warnings:

  - The values [PENDING,RETURNED,REFUNDED] on the enum `CustomerOrderItemStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [REUSABLE,COMPOSTABLE,MINIMAL,GLASS,METAL,PLASTIC,ECO_FRIENDLY_FOAMS,ALUMINUM,BAMBOO,CORRUGATED_CARDBOARD,PAPERBOARD] on the enum `Packaging` will be removed. If these variants are still used in the database, this will fail.
  - The values [PROCESSING,CANCELLED,REFUNDED] on the enum `SellerOrderItemStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [LOCALLY_SOURCED] on the enum `SustainabilityFeature` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `updated_at` on the `carts` table. All the data in the column will be lost.
  - You are about to drop the column `isFlagged` on the `conversations` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `liked_products` table. All the data in the column will be lost.
  - You are about to drop the column `conversationId` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `isReported` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the `chat_messages` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[customer_id]` on the table `ai_chats` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `created_at` to the `liked_products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `conversation_id` to the `messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `delivery_fee` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `service_fee` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `sourcing` on the `products` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updated_at` to the `recommendations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Sourcing" AS ENUM ('LOCALLY_SOURCED', 'INTERNATIONALLY_SOURCED');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('FAILED', 'SUCCESS');

-- AlterEnum
BEGIN;
CREATE TYPE "CustomerOrderItemStatus_new" AS ENUM ('ORDERED', 'SHIPPED', 'DELIVERED');
ALTER TABLE "order_items" ALTER COLUMN "customer_status" DROP DEFAULT;
ALTER TABLE "order_items" ALTER COLUMN "customer_status" TYPE "CustomerOrderItemStatus_new" USING ("customer_status"::text::"CustomerOrderItemStatus_new");
ALTER TYPE "CustomerOrderItemStatus" RENAME TO "CustomerOrderItemStatus_old";
ALTER TYPE "CustomerOrderItemStatus_new" RENAME TO "CustomerOrderItemStatus";
DROP TYPE "CustomerOrderItemStatus_old";
ALTER TABLE "order_items" ALTER COLUMN "customer_status" SET DEFAULT 'ORDERED';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Packaging_new" AS ENUM ('PLASTIC_FREE', 'BIODEGRADABLE', 'RECYCLED_PAPER', 'RECYCLED_CARDBOARD', 'REUSABLE_PACKAGING', 'COMPOSTABLE_PACKAGING', 'MINIMAL_PACKAGING', 'GLASS_CONTAINER', 'METAL_CONTAINER', 'RECYCLED_PLASTIC', 'PLASTIC_CONTAINER', 'PAPERBOARD_BOX', 'BAMBOO_PACKAGING', 'ALUMINUM_CONTAINER', 'OTHER_ECO_FRIENDLY', 'UNKNOWN_PACKAGING');
ALTER TABLE "products" ALTER COLUMN "packaging" TYPE "Packaging_new" USING ("packaging"::text::"Packaging_new");
ALTER TYPE "Packaging" RENAME TO "Packaging_old";
ALTER TYPE "Packaging_new" RENAME TO "Packaging";
DROP TYPE "Packaging_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "SellerOrderItemStatus_new" AS ENUM ('NEW', 'SHIPPED', 'DELIVERED');
ALTER TABLE "order_items" ALTER COLUMN "seller_status" DROP DEFAULT;
ALTER TABLE "order_items" ALTER COLUMN "seller_status" TYPE "SellerOrderItemStatus_new" USING ("seller_status"::text::"SellerOrderItemStatus_new");
ALTER TYPE "SellerOrderItemStatus" RENAME TO "SellerOrderItemStatus_old";
ALTER TYPE "SellerOrderItemStatus_new" RENAME TO "SellerOrderItemStatus";
DROP TYPE "SellerOrderItemStatus_old";
ALTER TABLE "order_items" ALTER COLUMN "seller_status" SET DEFAULT 'NEW';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "SustainabilityFeature_new" AS ENUM ('BIODEGRADABLE', 'COMPOSTABLE', 'REUSABLE', 'RECYCLED_MATERIALS', 'WATER_EFFICIENT', 'SOLAR_POWERED', 'MINIMAL_CARBON_FOOTPRINT', 'ENERGY_EFFICIENT', 'ZERO_WASTE', 'PLASTIC_FREE', 'REPAIRABLE_DESIGN', 'UPCYCLED', 'CARBON_OFFSET', 'ORGANIC_MATERIALS', 'FAIR_TRADE', 'VEGAN', 'NON_TOXIC', 'REGENERATIVE_AGRICULTURE', 'SLOW_PRODUCTION', 'WASTE_REDUCING_DESIGN', 'CIRCULAR_DESIGN', 'WILDLIFE_FRIENDLY', 'DURABLE_DESIGN', 'LOW_EMISSION_PRODUCTION', 'CHEMICAL_FREE', 'CRUELTY_FREE', 'TREE_FREE', 'ETHICALLY_SOURCED', 'RENEWABLE_ENERGY_USED', 'SOCIALLY_RESPONSIBLE');
ALTER TABLE "products" ALTER COLUMN "sustainabilityFeatures" DROP DEFAULT;
ALTER TABLE "products" ALTER COLUMN "sustainabilityFeatures" TYPE "SustainabilityFeature_new"[] USING ("sustainabilityFeatures"::text::"SustainabilityFeature_new"[]);
ALTER TYPE "SustainabilityFeature" RENAME TO "SustainabilityFeature_old";
ALTER TYPE "SustainabilityFeature_new" RENAME TO "SustainabilityFeature";
DROP TYPE "SustainabilityFeature_old";
ALTER TABLE "products" ALTER COLUMN "sustainabilityFeatures" SET DEFAULT ARRAY[]::"SustainabilityFeature"[];
COMMIT;

-- DropForeignKey
ALTER TABLE "ai_chats" DROP CONSTRAINT "ai_chats_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "chat_messages" DROP CONSTRAINT "chat_messages_ai_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_conversationId_fkey";

-- AlterTable
ALTER TABLE "ai_chats" ADD COLUMN     "history" JSONB[] DEFAULT ARRAY[]::JSONB[],
ADD COLUMN     "is_flagged" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "cart_items" ADD COLUMN     "weight" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "carts" DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "conversations" DROP COLUMN "isFlagged",
ADD COLUMN     "is_flagged" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "last_viewed" ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL DEFAULT 3;

-- AlterTable
ALTER TABLE "liked_products" DROP COLUMN "updated_at",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL DEFAULT 6;

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "conversationId",
DROP COLUMN "isReported",
ADD COLUMN     "conversation_id" TEXT NOT NULL,
ADD COLUMN     "is_reported" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "customer_status" SET DEFAULT 'ORDERED';

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "address" JSONB NOT NULL,
ADD COLUMN     "delivery_fee" INTEGER NOT NULL,
ADD COLUMN     "service_fee" INTEGER NOT NULL,
ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL DEFAULT 8;

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "description" SET DATA TYPE VARCHAR(1000),
DROP COLUMN "sourcing",
ADD COLUMN     "sourcing" "Sourcing" NOT NULL;

-- AlterTable
ALTER TABLE "recommendations" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "sellers" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "subscribed" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL;

-- DropTable
DROP TABLE "chat_messages";

-- DropEnum
DROP TYPE "sourcing";

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "paystack_response" JSONB,
    "status" "TransactionStatus" NOT NULL DEFAULT 'FAILED',
    "total_amount" INTEGER NOT NULL,
    "order_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transactions_reference_key" ON "transactions"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_order_id_key" ON "transactions"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "ai_chats_customer_id_key" ON "ai_chats"("customer_id");

-- AddForeignKey
ALTER TABLE "ai_chats" ADD CONSTRAINT "ai_chats_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
