
-- Migration: Add vehicle insurance table
-- Created at: 2025-04-09 00:00:00

-- Create a new table for vehicle insurance information
CREATE TABLE IF NOT EXISTS `vehicle_insurance` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `vehicle_id` INT NOT NULL,
  `insurance_company` VARCHAR(100) NOT NULL,
  `policy_number` VARCHAR(50) NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `coverage_type` VARCHAR(100) NOT NULL,
  `coverage_value` DECIMAL(10,2) NOT NULL,
  `monthly_payment` DECIMAL(10,2) NULL,
  `notes` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_vehicle_insurance_vehicles_idx` (`vehicle_id` ASC),
  CONSTRAINT `fk_vehicle_insurance_vehicles`
    FOREIGN KEY (`vehicle_id`)
    REFERENCES `vehicles` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add index for faster querying by policy number
CREATE INDEX `idx_insurance_policy_number` ON `vehicle_insurance` (`policy_number`);

-- Add index for expiring insurance reports
CREATE INDEX `idx_insurance_end_date` ON `vehicle_insurance` (`end_date`);
