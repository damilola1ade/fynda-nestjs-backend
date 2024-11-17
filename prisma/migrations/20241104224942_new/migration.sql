/*
  Warnings:

  - You are about to drop the column `seenByUser` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `senderName` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "seenByUser",
ADD COLUMN     "seenByReceiver" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "senderName" TEXT NOT NULL;
