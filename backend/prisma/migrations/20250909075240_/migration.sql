/*
  Warnings:

  - A unique constraint covering the columns `[conversationId]` on the table `conversations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `conversationId` to the `conversations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."conversations" ADD COLUMN     "conversationId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "conversations_conversationId_key" ON "public"."conversations"("conversationId");
