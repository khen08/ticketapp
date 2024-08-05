-- AlterTable
ALTER TABLE `user` ADD COLUMN `failedAttempts` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `lockoutUntil` DATETIME(3) NULL;
