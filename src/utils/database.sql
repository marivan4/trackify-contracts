
-- MySQL 8.0+ Database Structure for Vehicle Tracking System
-- Created on: 23/03/2025

-- Enable strict mode
SET sql_mode = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Table `users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `clients`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clients` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `document` VARCHAR(20) NOT NULL COMMENT 'CPF or CNPJ',
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `street` VARCHAR(100) NOT NULL,
  `number` VARCHAR(20) NOT NULL,
  `neighborhood` VARCHAR(100) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(2) NOT NULL,
  `zip_code` VARCHAR(10) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `document_UNIQUE` (`document` ASC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `vehicles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `vehicles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `client_id` INT NOT NULL,
  `model` VARCHAR(100) NOT NULL,
  `license_plate` VARCHAR(20) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `license_plate_UNIQUE` (`license_plate` ASC),
  INDEX `fk_vehicles_clients_idx` (`client_id` ASC),
  CONSTRAINT `fk_vehicles_clients`
    FOREIGN KEY (`client_id`)
    REFERENCES `clients` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `trackers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `trackers` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `vehicle_id` INT NOT NULL,
  `model` VARCHAR(100) NOT NULL,
  `imei` VARCHAR(20) NOT NULL,
  `installation_location` VARCHAR(100) NULL,
  `installation_date` DATE NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `imei_UNIQUE` (`imei` ASC),
  INDEX `fk_trackers_vehicles_idx` (`vehicle_id` ASC),
  CONSTRAINT `fk_trackers_vehicles`
    FOREIGN KEY (`vehicle_id`)
    REFERENCES `vehicles` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `contracts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contracts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `contract_number` VARCHAR(20) NOT NULL,
  `client_id` INT NOT NULL,
  `vehicle_id` INT NOT NULL,
  `tracker_id` INT NOT NULL,
  `signature_date` DATE NULL,
  `signature_ip` VARCHAR(45) NULL,
  `signature_geolocation` VARCHAR(255) NULL,
  `status` ENUM('active', 'inactive', 'pending', 'cancelled') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `contract_number_UNIQUE` (`contract_number` ASC),
  INDEX `fk_contracts_clients_idx` (`client_id` ASC),
  INDEX `fk_contracts_vehicles_idx` (`vehicle_id` ASC),
  INDEX `fk_contracts_trackers_idx` (`tracker_id` ASC),
  CONSTRAINT `fk_contracts_clients`
    FOREIGN KEY (`client_id`)
    REFERENCES `clients` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_contracts_vehicles`
    FOREIGN KEY (`vehicle_id`)
    REFERENCES `vehicles` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_contracts_trackers`
    FOREIGN KEY (`tracker_id`)
    REFERENCES `trackers` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `locations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `locations` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `tracker_id` INT NOT NULL,
  `latitude` DECIMAL(10,8) NOT NULL,
  `longitude` DECIMAL(11,8) NOT NULL,
  `speed` DECIMAL(5,2) NULL COMMENT 'Speed in km/h',
  `direction` DECIMAL(5,2) NULL COMMENT 'Direction in degrees',
  `battery_level` DECIMAL(5,2) NULL COMMENT 'Battery level in percentage',
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_locations_trackers_idx` (`tracker_id` ASC),
  INDEX `idx_locations_timestamp` (`timestamp` ASC),
  CONSTRAINT `fk_locations_trackers`
    FOREIGN KEY (`tracker_id`)
    REFERENCES `trackers` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `notifications`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `client_id` INT NOT NULL,
  `vehicle_id` INT NULL,
  `tracker_id` INT NULL,
  `type` ENUM('contract', 'alarm', 'battery', 'maintenance', 'other') NOT NULL,
  `message` TEXT NOT NULL,
  `is_read` TINYINT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_notifications_clients_idx` (`client_id` ASC),
  INDEX `fk_notifications_vehicles_idx` (`vehicle_id` ASC),
  INDEX `fk_notifications_trackers_idx` (`tracker_id` ASC),
  CONSTRAINT `fk_notifications_clients`
    FOREIGN KEY (`client_id`)
    REFERENCES `clients` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_notifications_vehicles`
    FOREIGN KEY (`vehicle_id`)
    REFERENCES `vehicles` (`id`)
    ON DELETE SET NULL
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_notifications_trackers`
    FOREIGN KEY (`tracker_id`)
    REFERENCES `trackers` (`id`)
    ON DELETE SET NULL
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `installation_checklists`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `installation_checklists` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `tracker_id` INT NOT NULL,
  `installer_user_id` INT NOT NULL,
  `installation_date` DATE NOT NULL,
  `device_installed` TINYINT NOT NULL DEFAULT 0,
  `connections_verified` TINYINT NOT NULL DEFAULT 0,
  `gps_signal_tested` TINYINT NOT NULL DEFAULT 0,
  `client_notified` TINYINT NOT NULL DEFAULT 0,
  `notes` TEXT NULL,
  `status` ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_checklists_trackers_idx` (`tracker_id` ASC),
  INDEX `fk_checklists_users_idx` (`installer_user_id` ASC),
  CONSTRAINT `fk_checklists_trackers`
    FOREIGN KEY (`tracker_id`)
    REFERENCES `trackers` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_checklists_users`
    FOREIGN KEY (`installer_user_id`)
    REFERENCES `users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Default Admin User
-- -----------------------------------------------------
INSERT INTO `users` (`name`, `email`, `phone`, `password`, `role`) VALUES
('Admin', 'admin@sistema-rastreamento.com.br', '(11) 98765-4321', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
-- Default password is 'password'

-- -----------------------------------------------------
-- Example Triggers
-- -----------------------------------------------------

-- Trigger to create a notification when a new contract is created
DELIMITER $$
CREATE TRIGGER `after_contract_insert` 
AFTER INSERT ON `contracts` 
FOR EACH ROW 
BEGIN
    INSERT INTO `notifications` (`client_id`, `vehicle_id`, `tracker_id`, `type`, `message`)
    VALUES (
        NEW.client_id, 
        NEW.vehicle_id, 
        NEW.tracker_id, 
        'contract', 
        CONCAT('Novo contrato criado: ', NEW.contract_number)
    );
END$$
DELIMITER ;

-- Trigger to create a notification when a tracker's location indicates low battery
DELIMITER $$
CREATE TRIGGER `after_location_insert` 
AFTER INSERT ON `locations` 
FOR EACH ROW 
BEGIN
    DECLARE client_id INT;
    
    IF NEW.battery_level < 20 THEN
        -- Get the client ID associated with this tracker
        SELECT c.id INTO client_id
        FROM clients c
        INNER JOIN vehicles v ON v.client_id = c.id
        INNER JOIN trackers t ON t.vehicle_id = v.id
        WHERE t.id = NEW.tracker_id
        LIMIT 1;
        
        -- Create a battery warning notification
        IF client_id IS NOT NULL THEN
            INSERT INTO `notifications` (`client_id`, `tracker_id`, `type`, `message`)
            VALUES (
                client_id, 
                NEW.tracker_id, 
                'battery', 
                CONCAT('Alerta: Bateria baixa (', NEW.battery_level, '%) no rastreador')
            );
        END IF;
    END IF;
END$$
DELIMITER ;
