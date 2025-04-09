
-- MySQL 8.0+ Database Structure for Vehicle Tracking System
-- Created on: 23/03/2025
-- Updated on: 09/04/2025

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
  `last_login` TIMESTAMP NULL,
  `failed_login_attempts` INT DEFAULT 0,
  `account_locked` TINYINT(1) DEFAULT 0,
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
  `status` ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'active',
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
  `year` INT NULL,
  `color` VARCHAR(50) NULL,
  `chassis_number` VARCHAR(50) NULL,
  `status` ENUM('active', 'inactive', 'maintenance') NOT NULL DEFAULT 'active',
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
  `sim_card` VARCHAR(20) NULL,
  `firmware_version` VARCHAR(20) NULL,
  `installation_location` VARCHAR(100) NULL,
  `installation_date` DATE NULL,
  `last_maintenance_date` DATE NULL,
  `status` ENUM('active', 'inactive', 'maintenance') NOT NULL DEFAULT 'active',
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
  `start_date` DATE NOT NULL,
  `end_date` DATE NULL,
  `monthly_fee` DECIMAL(10,2) NULL,
  `payment_day` INT NULL,
  `payment_method` ENUM('credit_card', 'bank_slip', 'wire_transfer', 'pix') NULL,
  `status` ENUM('active', 'inactive', 'pending', 'cancelled') NOT NULL DEFAULT 'pending',
  `notes` TEXT NULL,
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
-- Table `whatsapp_configurations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `whatsapp_configurations` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `base_url` VARCHAR(255) NOT NULL,
  `api_key` VARCHAR(255) NOT NULL,
  `instance` VARCHAR(100) NOT NULL,
  `is_connected` TINYINT NOT NULL DEFAULT 0,
  `last_connected` TIMESTAMP NULL,
  `created_by` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_whatsapp_configurations_users_idx` (`created_by` ASC),
  CONSTRAINT `fk_whatsapp_configurations_users`
    FOREIGN KEY (`created_by`)
    REFERENCES `users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `role_privileges`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `role_privileges` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `role` ENUM('admin', 'manager', 'user') NOT NULL,
  `privilege` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `role_privilege_unique` (`role`, `privilege`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- NEW TABLES FOR OPTIMIZATION AND ADDITIONAL FEATURES
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Table `audit_logs` (NEW TABLE)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NULL,
  `action` VARCHAR(50) NOT NULL,
  `table_name` VARCHAR(50) NOT NULL,
  `record_id` INT NULL,
  `old_values` JSON NULL,
  `new_values` JSON NULL,
  `ip_address` VARCHAR(45) NULL,
  `user_agent` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_audit_logs_user` (`user_id` ASC),
  INDEX `idx_audit_logs_action` (`action` ASC),
  INDEX `idx_audit_logs_table` (`table_name` ASC),
  CONSTRAINT `fk_audit_logs_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE SET NULL
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `geofences` (NEW TABLE)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `geofences` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `vehicle_id` INT NOT NULL,
  `coordinates` JSON NOT NULL COMMENT 'Array of latitude/longitude pairs defining the geofence polygon',
  `type` ENUM('entry', 'exit', 'both') NOT NULL DEFAULT 'both',
  `is_active` TINYINT NOT NULL DEFAULT 1,
  `created_by` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_geofences_vehicles_idx` (`vehicle_id` ASC),
  INDEX `fk_geofences_users_idx` (`created_by` ASC),
  CONSTRAINT `fk_geofences_vehicles`
    FOREIGN KEY (`vehicle_id`)
    REFERENCES `vehicles` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_geofences_users`
    FOREIGN KEY (`created_by`)
    REFERENCES `users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `geofence_events` (NEW TABLE)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `geofence_events` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `geofence_id` INT NOT NULL,
  `vehicle_id` INT NOT NULL,
  `event_type` ENUM('enter', 'exit') NOT NULL,
  `latitude` DECIMAL(10,8) NOT NULL,
  `longitude` DECIMAL(11,8) NOT NULL,
  `speed` DECIMAL(5,2) NULL,
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_geofence_events_geofences_idx` (`geofence_id` ASC),
  INDEX `fk_geofence_events_vehicles_idx` (`vehicle_id` ASC),
  INDEX `idx_geofence_events_timestamp` (`timestamp` ASC),
  CONSTRAINT `fk_geofence_events_geofences`
    FOREIGN KEY (`geofence_id`)
    REFERENCES `geofences` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_geofence_events_vehicles`
    FOREIGN KEY (`vehicle_id`)
    REFERENCES `vehicles` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `alerts` (NEW TABLE)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `alerts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `vehicle_id` INT NOT NULL,
  `alert_type` ENUM('speed', 'geofence', 'battery', 'maintenance', 'custom') NOT NULL,
  `condition` JSON NOT NULL COMMENT 'JSON with alert conditions based on type',
  `notification_method` SET('email', 'sms', 'whatsapp', 'app') NOT NULL,
  `recipients` JSON NULL COMMENT 'Array of email addresses, phone numbers, etc.',
  `is_active` TINYINT NOT NULL DEFAULT 1,
  `created_by` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_alerts_vehicles_idx` (`vehicle_id` ASC),
  INDEX `fk_alerts_users_idx` (`created_by` ASC),
  CONSTRAINT `fk_alerts_vehicles`
    FOREIGN KEY (`vehicle_id`)
    REFERENCES `vehicles` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_alerts_users`
    FOREIGN KEY (`created_by`)
    REFERENCES `users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `alert_logs` (NEW TABLE)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `alert_logs` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `alert_id` INT NOT NULL,
  `vehicle_id` INT NOT NULL,
  `triggered_condition` JSON NOT NULL,
  `notification_sent` TINYINT NOT NULL DEFAULT 0,
  `notification_details` JSON NULL,
  `location_id` INT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_alert_logs_alerts_idx` (`alert_id` ASC),
  INDEX `fk_alert_logs_vehicles_idx` (`vehicle_id` ASC),
  INDEX `fk_alert_logs_locations_idx` (`location_id` ASC),
  CONSTRAINT `fk_alert_logs_alerts`
    FOREIGN KEY (`alert_id`)
    REFERENCES `alerts` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_alert_logs_vehicles`
    FOREIGN KEY (`vehicle_id`)
    REFERENCES `vehicles` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_alert_logs_locations`
    FOREIGN KEY (`location_id`)
    REFERENCES `locations` (`id`)
    ON DELETE SET NULL
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `maintenance_records` (NEW TABLE)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `maintenance_records` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `vehicle_id` INT NOT NULL,
  `tracker_id` INT NULL,
  `maintenance_type` ENUM('preventive', 'corrective', 'tracker_installation', 'tracker_replacement') NOT NULL,
  `description` TEXT NOT NULL,
  `performed_by` INT NOT NULL,
  `performed_date` DATE NOT NULL,
  `cost` DECIMAL(10,2) NULL,
  `next_maintenance_date` DATE NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_maintenance_records_vehicles_idx` (`vehicle_id` ASC),
  INDEX `fk_maintenance_records_trackers_idx` (`tracker_id` ASC),
  INDEX `fk_maintenance_records_users_idx` (`performed_by` ASC),
  CONSTRAINT `fk_maintenance_records_vehicles`
    FOREIGN KEY (`vehicle_id`)
    REFERENCES `vehicles` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_maintenance_records_trackers`
    FOREIGN KEY (`tracker_id`)
    REFERENCES `trackers` (`id`)
    ON DELETE SET NULL
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_maintenance_records_users`
    FOREIGN KEY (`performed_by`)
    REFERENCES `users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `app_sessions` (NEW TABLE FOR SECURITY)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app_sessions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `ip_address` VARCHAR(45) NULL,
  `user_agent` VARCHAR(255) NULL,
  `last_activity` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` TIMESTAMP NOT NULL,
  `is_active` TINYINT NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `token_UNIQUE` (`token` ASC),
  INDEX `fk_app_sessions_users_idx` (`user_id` ASC),
  CONSTRAINT `fk_app_sessions_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `system_settings` (NEW TABLE)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `system_settings` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `setting_key` VARCHAR(100) NOT NULL,
  `setting_value` TEXT NULL,
  `setting_type` ENUM('string', 'integer', 'float', 'boolean', 'json') NOT NULL DEFAULT 'string',
  `description` TEXT NULL,
  `updated_by` INT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `setting_key_UNIQUE` (`setting_key` ASC),
  INDEX `fk_system_settings_users_idx` (`updated_by` ASC),
  CONSTRAINT `fk_system_settings_users`
    FOREIGN KEY (`updated_by`)
    REFERENCES `users` (`id`)
    ON DELETE SET NULL
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- DATABASE OPTIMIZATION - PARTITIONING FOR LOCATIONS TABLE
-- -----------------------------------------------------

-- Partitioning the locations table by timestamp (RANGE partitioning by month)
ALTER TABLE `locations` PARTITION BY RANGE (UNIX_TIMESTAMP(timestamp)) (
    PARTITION p_2025_01 VALUES LESS THAN (UNIX_TIMESTAMP('2025-02-01')),
    PARTITION p_2025_02 VALUES LESS THAN (UNIX_TIMESTAMP('2025-03-01')),
    PARTITION p_2025_03 VALUES LESS THAN (UNIX_TIMESTAMP('2025-04-01')),
    PARTITION p_2025_04 VALUES LESS THAN (UNIX_TIMESTAMP('2025-05-01')),
    PARTITION p_2025_05 VALUES LESS THAN (UNIX_TIMESTAMP('2025-06-01')),
    PARTITION p_2025_06 VALUES LESS THAN (UNIX_TIMESTAMP('2025-07-01')),
    PARTITION p_2025_07 VALUES LESS THAN (UNIX_TIMESTAMP('2025-08-01')),
    PARTITION p_2025_08 VALUES LESS THAN (UNIX_TIMESTAMP('2025-09-01')),
    PARTITION p_2025_09 VALUES LESS THAN (UNIX_TIMESTAMP('2025-10-01')),
    PARTITION p_2025_10 VALUES LESS THAN (UNIX_TIMESTAMP('2025-11-01')),
    PARTITION p_2025_11 VALUES LESS THAN (UNIX_TIMESTAMP('2025-12-01')),
    PARTITION p_2025_12 VALUES LESS THAN (UNIX_TIMESTAMP('2026-01-01')),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);

-- -----------------------------------------------------
-- SECURITY ENHANCEMENTS - TRIGGERS FOR PASSWORD HASHING AND AUDIT LOGS
-- -----------------------------------------------------

-- Password hashing trigger for new users
DELIMITER $$
CREATE TRIGGER `before_user_insert` 
BEFORE INSERT ON `users` 
FOR EACH ROW 
BEGIN
    -- This is just a placeholder. In a real application, passwords should be hashed in the application code
    -- This is to ensure passwords are always hashed even if inserted directly to the database
    IF NEW.password IS NOT NULL AND LENGTH(NEW.password) < 60 THEN
        SET NEW.password = CONCAT('$2y$10$', MD5(CONCAT(NEW.password, RAND())));
    END IF;
END$$
DELIMITER ;

-- Add an audit log entry after any user modification
DELIMITER $$
CREATE TRIGGER `after_user_update` 
AFTER UPDATE ON `users` 
FOR EACH ROW 
BEGIN
    INSERT INTO `audit_logs` (`user_id`, `action`, `table_name`, `record_id`, `old_values`, `new_values`)
    VALUES (
        NEW.id, 
        'update', 
        'users', 
        NEW.id,
        JSON_OBJECT(
            'name', OLD.name,
            'email', OLD.email,
            'role', OLD.role,
            'updated_at', OLD.updated_at
        ),
        JSON_OBJECT(
            'name', NEW.name,
            'email', NEW.email,
            'role', NEW.role,
            'updated_at', NEW.updated_at
        )
    );
END$$
DELIMITER ;

-- Add an audit log entry for client modifications
DELIMITER $$
CREATE TRIGGER `after_client_update` 
AFTER UPDATE ON `clients` 
FOR EACH ROW 
BEGIN
    -- We use @current_user_id as it would be set in the application context
    -- In a real application, this would be set when a user logs in
    INSERT INTO `audit_logs` (`user_id`, `action`, `table_name`, `record_id`, `old_values`, `new_values`)
    VALUES (
        @current_user_id, 
        'update', 
        'clients', 
        NEW.id,
        JSON_OBJECT(
            'name', OLD.name,
            'email', OLD.email,
            'status', OLD.status,
            'updated_at', OLD.updated_at
        ),
        JSON_OBJECT(
            'name', NEW.name,
            'email', NEW.email,
            'status', NEW.status,
            'updated_at', NEW.updated_at
        )
    );
END$$
DELIMITER ;

-- -----------------------------------------------------
-- ADDITIONAL SECURITY MEASURES - STORED PROCEDURES FOR USER MANAGEMENT
-- -----------------------------------------------------

-- Stored procedure for secure user creation
DELIMITER $$
CREATE PROCEDURE `create_user`(
    IN p_name VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_phone VARCHAR(20),
    IN p_password VARCHAR(255),
    IN p_role ENUM('admin', 'user')
)
BEGIN
    -- Check if email already exists
    DECLARE user_exists INT DEFAULT 0;
    
    SELECT COUNT(*) INTO user_exists FROM users WHERE email = p_email;
    
    IF user_exists > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Email already exists';
    ELSE
        INSERT INTO users (name, email, phone, password, role)
        VALUES (p_name, p_email, p_phone, p_password, p_role);
        
        -- Return the inserted user ID
        SELECT LAST_INSERT_ID() AS user_id;
    END IF;
END$$
DELIMITER ;

-- Stored procedure for safely updating a user's password
DELIMITER $$
CREATE PROCEDURE `update_user_password`(
    IN p_user_id INT,
    IN p_current_password VARCHAR(255),
    IN p_new_password VARCHAR(255)
)
BEGIN
    DECLARE current_stored_password VARCHAR(255);
    
    -- Get the current stored password
    SELECT password INTO current_stored_password FROM users WHERE id = p_user_id;
    
    -- In a real application, you'd verify the password in application code
    -- This is just a placeholder for the concept
    IF current_stored_password = p_current_password THEN
        UPDATE users SET 
            password = p_new_password,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = p_user_id;
        
        SELECT 'Password updated successfully' AS message;
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Current password is incorrect';
    END IF;
END$$
DELIMITER ;

-- -----------------------------------------------------
-- BACKUP AND MAINTENANCE PROCEDURES
-- -----------------------------------------------------

-- Stored procedure for cleaning up old location data
DELIMITER $$
CREATE PROCEDURE `cleanup_old_location_data`(
    IN p_days INT
)
BEGIN
    DECLARE cutoff_date TIMESTAMP;
    SET cutoff_date = DATE_SUB(NOW(), INTERVAL p_days DAY);
    
    -- Delete old location data
    DELETE FROM locations WHERE timestamp < cutoff_date;
    
    -- Return the number of deleted rows
    SELECT ROW_COUNT() AS deleted_rows;
END$$
DELIMITER ;

-- Stored procedure to add new monthly partitions to the locations table
DELIMITER $$
CREATE PROCEDURE `add_month_partition`(
    IN p_year INT,
    IN p_month INT
)
BEGIN
    DECLARE partition_name VARCHAR(20);
    DECLARE partition_date_start VARCHAR(20);
    DECLARE partition_date_end VARCHAR(20);
    DECLARE alter_statement VARCHAR(1000);
    
    -- Format the partition name and dates
    SET partition_name = CONCAT('p_', p_year, '_', LPAD(p_month, 2, '0'));
    
    -- Calculate the start and end dates for the partition
    SET partition_date_start = CONCAT(p_year, '-', LPAD(p_month, 2, '0'), '-01');
    
    -- Calculate the end date (first day of next month)
    IF p_month = 12 THEN
        SET partition_date_end = CONCAT(p_year + 1, '-01-01');
    ELSE
        SET partition_date_end = CONCAT(p_year, '-', LPAD(p_month + 1, 2, '0'), '-01');
    END IF;
    
    -- Create the ALTER TABLE statement
    SET @alter_statement = CONCAT(
        'ALTER TABLE locations REORGANIZE PARTITION p_future INTO (',
        'PARTITION ', partition_name, ' VALUES LESS THAN (UNIX_TIMESTAMP(''', partition_date_end, ''')),',
        'PARTITION p_future VALUES LESS THAN MAXVALUE)'
    );
    
    -- Execute the statement
    PREPARE stmt FROM @alter_statement;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    
    SELECT CONCAT('Added partition ', partition_name, ' for dates from ', partition_date_start, ' to ', partition_date_end) AS result;
END$$
DELIMITER ;

-- Stored procedure to generate database statistics for optimization
DELIMITER $$
CREATE PROCEDURE `analyze_database_tables`()
BEGIN
    -- This procedure will analyze all tables in the database to update statistics
    -- which helps the query optimizer make better decisions
    
    -- Analyze tables with most frequent writes
    ANALYZE TABLE locations, notifications;
    
    -- Analyze other important tables
    ANALYZE TABLE users, clients, vehicles, trackers, contracts;
    
    -- Return completion message
    SELECT 'Database tables analyzed successfully' AS message;
END$$
DELIMITER ;

-- -----------------------------------------------------
-- DEFAULT DATA
-- -----------------------------------------------------

-- Default Admin User
INSERT INTO `users` (`name`, `email`, `phone`, `password`, `role`) VALUES
('Admin', 'admin@sistema-rastreamento.com.br', '(11) 98765-4321', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
-- Default password is 'password'

-- Default WhatsApp Configuration
INSERT INTO `whatsapp_configurations` (`base_url`, `api_key`, `instance`, `created_by`) VALUES
('https://evolutionapi.gpstracker-16.com.br', 'd9919cda7e370839d33b8946584dac93', 'assas', 1);

-- Default Role Privileges
-- Admin privileges
INSERT INTO `role_privileges` (`role`, `privilege`) VALUES
('admin', 'view_clients'),
('admin', 'edit_clients'),
('admin', 'create_clients'),
('admin', 'delete_clients'),
('admin', 'view_contracts'),
('admin', 'edit_contracts'),
('admin', 'create_contracts'),
('admin', 'delete_contracts'),
('admin', 'use_whatsapp'),
('admin', 'configure_whatsapp');

-- Manager privileges
INSERT INTO `role_privileges` (`role`, `privilege`) VALUES
('manager', 'view_clients'),
('manager', 'edit_clients'),
('manager', 'create_clients'),
('manager', 'view_contracts'),
('manager', 'edit_contracts'),
('manager', 'use_whatsapp');

-- User privileges
INSERT INTO `role_privileges` (`role`, `privilege`) VALUES
('user', 'view_clients'),
('user', 'view_contracts');

-- Default System Settings
INSERT INTO `system_settings` (`setting_key`, `setting_value`, `setting_type`, `description`, `updated_by`) VALUES
('company_name', 'Sistema de Rastreamento Veicular', 'string', 'Nome da empresa exibido no sistema', 1),
('company_logo', '/images/logo.png', 'string', 'Caminho para o logo da empresa', 1),
('default_language', 'pt-BR', 'string', 'Idioma padrão do sistema', 1),
('location_retention_days', '90', 'integer', 'Número de dias para reter dados de localização', 1),
('enable_maintenance_alerts', 'true', 'boolean', 'Habilitar alertas de manutenção', 1),
('notification_settings', '{"email": true, "sms": false, "whatsapp": true, "app": true}', 'json', 'Configurações de notificação padrão', 1);

-- -----------------------------------------------------
-- CREATE MIGRATION SCRIPT
-- -----------------------------------------------------

-- Create a system_migrations table to track database migrations
CREATE TABLE IF NOT EXISTS `system_migrations` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `migration_name` VARCHAR(100) NOT NULL,
  `batch` INT NOT NULL,
  `executed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `migration_name_UNIQUE` (`migration_name` ASC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert the initial migration
INSERT INTO `system_migrations` (`migration_name`, `batch`) VALUES
('initial_setup', 1),
('add_security_enhancements', 1),
('add_additional_tables', 1);
