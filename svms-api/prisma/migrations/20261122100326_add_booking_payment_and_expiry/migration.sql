-- AlterTable
ALTER TABLE `bookings` ADD COLUMN `expires_at` DATETIME(3) NULL,
    ADD COLUMN `payment_method` ENUM('QRIS', 'VIRTUAL_ACCOUNT', 'E_WALLET') NULL;

-- CreateIndex
CREATE INDEX `bookings_user_id_status_idx` ON `bookings`(`user_id`, `status`);
