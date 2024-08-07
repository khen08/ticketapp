-- CreateTable
CREATE TABLE `Ticket` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `status` ENUM('OPEN', 'PENDING', 'SOLVED') NOT NULL DEFAULT 'OPEN',
    `priority` ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL DEFAULT 'MEDIUM',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `assignedToUserId` INTEGER NULL,
    `createdBy` VARCHAR(191) NOT NULL,

    INDEX `Ticket_assignedToUserId_idx`(`assignedToUserId`),
    PRIMARY KEY (`id`)
) 
ALTER TABLE Ticket AUTO_INCREMENT = 1001; 

DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `failedAttempts` INTEGER NOT NULL DEFAULT 0,
    `lockoutUntil` DATETIME(3) NULL,
    `role` ENUM('ADMIN', 'TECHNICIAN', 'USER') NOT NULL DEFAULT 'USER',

    UNIQUE INDEX `User_username_key`(`username`),
    INDEX `User_username_idx`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reply` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ticketId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    INDEX `Reply_userId_idx`(`userId`),
    INDEX `Reply_ticketId_idx`(`ticketId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
