/*
  Warnings:

  - Added the required column `createdBy` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ticket` ADD COLUMN `createdBy` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `Ticket_assignedToUserId_idx` ON `Ticket`(`assignedToUserId`);
