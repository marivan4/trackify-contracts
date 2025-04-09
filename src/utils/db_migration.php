
<?php
/**
 * Database Migration Utility for Vehicle Tracking System
 * 
 * This script handles database migrations for version updates
 * 
 * @author Vehicle Tracking System
 * @version 1.0
 * @date 2025-04-09
 */

require_once 'db_connection.php';

/**
 * Migration class to handle database updates
 */
class DatabaseMigration {
    private $pdo;
    private $migrationsDir;
    private $appliedMigrations = [];
    
    /**
     * Constructor
     * 
     * @param string $migrationsDir Directory containing migration files
     */
    public function __construct(string $migrationsDir) {
        $this->pdo = db_connect();
        $this->migrationsDir = $migrationsDir;
        
        if (!$this->pdo) {
            die("Database connection failed.");
        }
        
        $this->createMigrationsTableIfNotExists();
        $this->loadAppliedMigrations();
    }
    
    /**
     * Creates the migrations table if it doesn't exist
     */
    private function createMigrationsTableIfNotExists(): void {
        $sql = "
            CREATE TABLE IF NOT EXISTS `system_migrations` (
              `id` INT NOT NULL AUTO_INCREMENT,
              `migration_name` VARCHAR(100) NOT NULL,
              `batch` INT NOT NULL,
              `executed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
              PRIMARY KEY (`id`),
              UNIQUE INDEX `migration_name_UNIQUE` (`migration_name` ASC)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ";
        
        try {
            $this->pdo->exec($sql);
        } catch (PDOException $e) {
            die("Error creating migrations table: " . $e->getMessage());
        }
    }
    
    /**
     * Loads the list of applied migrations from the database
     */
    private function loadAppliedMigrations(): void {
        try {
            $stmt = $this->pdo->query("SELECT migration_name FROM system_migrations");
            $this->appliedMigrations = $stmt->fetchAll(PDO::FETCH_COLUMN);
        } catch (PDOException $e) {
            die("Error loading applied migrations: " . $e->getMessage());
        }
    }
    
    /**
     * Gets the current migration batch number
     * 
     * @return int Current batch number
     */
    private function getCurrentBatch(): int {
        try {
            $stmt = $this->pdo->query("SELECT MAX(batch) FROM system_migrations");
            $batch = $stmt->fetchColumn();
            return $batch ? (int)$batch : 0;
        } catch (PDOException $e) {
            die("Error getting current batch: " . $e->getMessage());
        }
    }
    
    /**
     * Runs pending migrations
     * 
     * @return array List of executed migrations
     */
    public function runMigrations(): array {
        $migrationFiles = scandir($this->migrationsDir);
        $pendingMigrations = array_filter($migrationFiles, function($file) {
            return preg_match('/^\d+_.*\.sql$/', $file) && !in_array($file, $this->appliedMigrations);
        });
        
        if (empty($pendingMigrations)) {
            return ['message' => 'No pending migrations.'];
        }
        
        sort($pendingMigrations);
        $newBatch = $this->getCurrentBatch() + 1;
        $executed = [];
        
        $this->pdo->beginTransaction();
        
        try {
            foreach ($pendingMigrations as $migration) {
                $migrationPath = $this->migrationsDir . '/' . $migration;
                $migrationSql = file_get_contents($migrationPath);
                
                echo "Applying migration: $migration\n";
                
                // Execute each statement separately
                $statements = $this->splitSqlStatements($migrationSql);
                foreach ($statements as $statement) {
                    if (trim($statement)) {
                        $this->pdo->exec($statement);
                    }
                }
                
                // Record the migration
                $stmt = $this->pdo->prepare("INSERT INTO system_migrations (migration_name, batch) VALUES (?, ?)");
                $stmt->execute([$migration, $newBatch]);
                
                $executed[] = $migration;
            }
            
            $this->pdo->commit();
            return [
                'status' => 'success',
                'message' => count($executed) . ' migrations applied.',
                'migrations' => $executed
            ];
        } catch (PDOException $e) {
            $this->pdo->rollBack();
            return [
                'status' => 'error',
                'message' => 'Migration failed: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Rolls back the last batch of migrations
     * 
     * @return array Result of the rollback operation
     */
    public function rollback(): array {
        $currentBatch = $this->getCurrentBatch();
        
        if ($currentBatch === 0) {
            return ['message' => 'No migrations to rollback.'];
        }
        
        try {
            $stmt = $this->pdo->prepare("SELECT migration_name FROM system_migrations WHERE batch = ? ORDER BY id DESC");
            $stmt->execute([$currentBatch]);
            $migrations = $stmt->fetchAll(PDO::FETCH_COLUMN);
            
            if (empty($migrations)) {
                return ['message' => 'No migrations to rollback.'];
            }
            
            $this->pdo->beginTransaction();
            $rolledBack = [];
            
            foreach ($migrations as $migration) {
                $rollbackSql = $this->generateRollbackSql($migration);
                echo "Rolling back migration: $migration\n";
                
                if ($rollbackSql) {
                    $statements = $this->splitSqlStatements($rollbackSql);
                    foreach ($statements as $statement) {
                        if (trim($statement)) {
                            $this->pdo->exec($statement);
                        }
                    }
                }
                
                // Remove the migration record
                $stmt = $this->pdo->prepare("DELETE FROM system_migrations WHERE migration_name = ?");
                $stmt->execute([$migration]);
                
                $rolledBack[] = $migration;
            }
            
            $this->pdo->commit();
            return [
                'status' => 'success',
                'message' => count($rolledBack) . ' migrations rolled back.',
                'migrations' => $rolledBack
            ];
        } catch (PDOException $e) {
            $this->pdo->rollBack();
            return [
                'status' => 'error',
                'message' => 'Rollback failed: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Generates rollback SQL for a given migration
     * 
     * @param string $migration Migration filename
     * @return string|null Rollback SQL or null if not available
     */
    private function generateRollbackSql(string $migration): ?string {
        $rollbackPath = $this->migrationsDir . '/rollbacks/' . $migration;
        
        if (file_exists($rollbackPath)) {
            return file_get_contents($rollbackPath);
        }
        
        return null;
    }
    
    /**
     * Splits SQL statements at semicolons
     * 
     * @param string $sql SQL string with multiple statements
     * @return array Array of individual SQL statements
     */
    private function splitSqlStatements(string $sql): array {
        // Handle DELIMITER statements for stored procedures, triggers, etc.
        $pattern = '/DELIMITER\s+(\S+)\s+(.+?)\s+\1\s+DELIMITER\s+;/s';
        $sql = preg_replace_callback($pattern, function($matches) {
            // Replace semicolons inside the DELIMITER block to prevent splitting
            $block = str_replace(';', '{{SEMICOLON}}', $matches[2]);
            return $block;
        }, $sql);
        
        // Split on semicolons
        $statements = explode(';', $sql);
        
        // Restore semicolons inside DELIMITER blocks
        return array_map(function($stmt) {
            return str_replace('{{SEMICOLON}}', ';', $stmt);
        }, $statements);
    }
    
    /**
     * Creates a new migration file
     * 
     * @param string $name Migration name
     * @return string Path to the created migration file
     */
    public function createMigration(string $name): string {
        $timestamp = date('YmdHis');
        $filename = $timestamp . '_' . str_replace(' ', '_', strtolower($name)) . '.sql';
        $path = $this->migrationsDir . '/' . $filename;
        
        $template = "-- Migration: $name\n-- Created at: " . date('Y-m-d H:i:s') . "\n\n-- Your SQL statements here\n\n";
        
        file_put_contents($path, $template);
        
        // Create rollback directory if it doesn't exist
        $rollbackDir = $this->migrationsDir . '/rollbacks';
        if (!file_exists($rollbackDir)) {
            mkdir($rollbackDir, 0755, true);
        }
        
        // Create empty rollback file
        $rollbackPath = $rollbackDir . '/' . $filename;
        file_put_contents($rollbackPath, "-- Rollback for: $name\n-- Created at: " . date('Y-m-d H:i:s') . "\n\n-- Your rollback SQL statements here\n\n");
        
        return $path;
    }
}

// Example usage as a CLI script
if (php_sapi_name() === 'cli') {
    if ($argc < 2) {
        echo "Usage: php db_migration.php [command] [options]\n";
        echo "Commands:\n";
        echo "  migrate           Run pending migrations\n";
        echo "  rollback          Rollback the last batch of migrations\n";
        echo "  create [name]     Create a new migration\n";
        exit(1);
    }
    
    $command = $argv[1];
    $migrationsDir = __DIR__ . '/migrations';
    
    // Create migrations directory if it doesn't exist
    if (!file_exists($migrationsDir)) {
        mkdir($migrationsDir, 0755, true);
    }
    
    $migration = new DatabaseMigration($migrationsDir);
    
    switch ($command) {
        case 'migrate':
            $result = $migration->runMigrations();
            echo json_encode($result, JSON_PRETTY_PRINT) . "\n";
            break;
            
        case 'rollback':
            $result = $migration->rollback();
            echo json_encode($result, JSON_PRETTY_PRINT) . "\n";
            break;
            
        case 'create':
            if ($argc < 3) {
                echo "Error: Migration name required\n";
                exit(1);
            }
            $name = $argv[2];
            $path = $migration->createMigration($name);
            echo "Migration created: $path\n";
            break;
            
        default:
            echo "Unknown command: $command\n";
            exit(1);
    }
}
