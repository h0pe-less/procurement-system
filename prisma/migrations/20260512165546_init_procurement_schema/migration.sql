-- CreateTable
CREATE TABLE `vendors` (
    `id` VARCHAR(191) NOT NULL,
    `name` TEXT NOT NULL,
    `idno` VARCHAR(13) NULL,
    `address` TEXT NULL,
    `email` VARCHAR(255) NULL,
    `phone` VARCHAR(100) NULL,
    `registrationDate` DATETIME(3) NULL,
    `rating` DECIMAL(4, 2) NULL,

    UNIQUE INDEX `vendors_idno_key`(`idno`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contracts` (
    `id` VARCHAR(191) NOT NULL,
    `work_offer_id` VARCHAR(255) NOT NULL,
    `work_offer_title` TEXT NULL,
    `vendor_id` VARCHAR(191) NOT NULL,
    `completed_at` DATETIME(3) NULL,
    `total_value` DECIMAL(15, 2) NULL,
    `currency` VARCHAR(10) NULL,
    `status` VARCHAR(50) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `contracts` ADD CONSTRAINT `contracts_vendor_id_fkey` FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
