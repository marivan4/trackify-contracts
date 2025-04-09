
<?php
/**
 * Database Optimization Utility for Vehicle Tracking System
 * 
 * This script provides optimization tasks for the MySQL database
 * 
 * @author Vehicle Tracking System
 * @version 1.0
 * @date 2025-04-09
 */

require_once 'db_connection.php';

/**
 * Class to handle database optimizations
 */
class DatabaseOptimizer {
    private $pdo;
    
    /**
     * Constructor
     */
    public function __construct() {
        $this->pdo = db_connect();
        
        if (!$this->pdo) {
            die("Database connection failed.");
        }
    }
    
    /**
     * Optimizes all tables in the database
     * 
     * @return array Optimization results
     */
    public function optimizeTables(): array {
        try {
            $results = [];
            
            // Get all tables
            $stmt = $this->pdo->query("SHOW TABLES");
            $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
            
            foreach ($tables as $table) {
                echo "Optimizing table: $table\n";
                
                // Analyze table to update statistics
                $this->pdo->query("ANALYZE TABLE `$table`");
                
                // Optimize table
                $optimizeResult = $this->pdo->query("OPTIMIZE TABLE `$table`");
                $optimizeInfo = $optimizeResult->fetch(PDO::FETCH_ASSOC);
                
                $results[$table] = $optimizeInfo['Msg_text'] ?? 'OK';
            }
            
            return [
                'status' => 'success',
                'message' => count($tables) . ' tables optimized.',
                'details' => $results
            ];
        } catch (PDOException $e) {
            return [
                'status' => 'error',
                'message' => 'Optimization failed: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Adds partition to the locations table for the next month
     * 
     * @return array Result of the partition operation
     */
    public function addNextMonthPartition(): array {
        try {
            // Get the next month
            $nextMonth = date('n', strtotime('+1 month'));
            $nextYear = date('Y', strtotime('+1 month'));
            
            // Call the stored procedure to add the partition
            $stmt = $this->pdo->prepare("CALL add_month_partition(?, ?)");
            $stmt->execute([$nextYear, $nextMonth]);
            
            return [
                'status' => 'success',
                'message' => "Added partition for $nextYear-$nextMonth"
            ];
        } catch (PDOException $e) {
            return [
                'status' => 'error',
                'message' => 'Failed to add partition: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Cleans up old location data
     * 
     * @param int $days Number of days to keep
     * @return array Result of the cleanup operation
     */
    public function cleanupOldLocationData(int $days): array {
        try {
            $stmt = $this->pdo->prepare("CALL cleanup_old_location_data(?)");
            $stmt->execute([$days]);
            
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            return [
                'status' => 'success',
                'message' => "Cleaned up location data older than $days days",
                'deleted_rows' => $result['deleted_rows'] ?? 0
            ];
        } catch (PDOException $e) {
            return [
                'status' => 'error',
                'message' => 'Failed to cleanup location data: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Runs maintenance tasks for optimizing database performance
     * 
     * @return array Results of maintenance tasks
     */
    public function runMaintenance(): array {
        $results = [];
        
        // Get system settings for retention period
        try {
            $stmt = $this->pdo->query("SELECT setting_value FROM system_settings WHERE setting_key = 'location_retention_days'");
            $retentionDays = (int)$stmt->fetchColumn() ?: 90; // Default to 90 days if not set
        } catch (PDOException $e) {
            $retentionDays = 90;
        }
        
        // 1. Clean up old location data
        $results['cleanup'] = $this->cleanupOldLocationData($retentionDays);
        
        // 2. Add next month partition
        $results['partition'] = $this->addNextMonthPartition();
        
        // 3. Optimize tables
        $results['optimize'] = $this->optimizeTables();
        
        // 4. Analyze database to update statistics
        try {
            $this->pdo->query("CALL analyze_database_tables()");
            $results['analyze'] = [
                'status' => 'success',
                'message' => 'Database statistics updated'
            ];
        } catch (PDOException $e) {
            $results['analyze'] = [
                'status' => 'error',
                'message' => 'Failed to update statistics: ' . $e->getMessage()
            ];
        }
        
        return $results;
    }
}

// Example usage as a CLI script
if (php_sapi_name() === 'cli') {
    if ($argc < 2) {
        echo "Usage: php optimize_database.php [command] [options]\n";
        echo "Commands:\n";
        echo "  optimize         Optimize all database tables\n";
        echo "  partition        Add partition for the next month\n";
        echo "  cleanup [days]   Clean up location data older than specified days\n";
        echo "  maintenance      Run all maintenance tasks\n";
        exit(1);
    }
    
    $command = $argv[1];
    $optimizer = new DatabaseOptimizer();
    
    switch ($command) {
        case 'optimize':
            $result = $optimizer->optimizeTables();
            echo json_encode($result, JSON_PRETTY_PRINT) . "\n";
            break;
            
        case 'partition':
            $result = $optimizer->addNextMonthPartition();
            echo json_encode($result, JSON_PRETTY_PRINT) . "\n";
            break;
            
        case 'cleanup':
            $days = $argc >= 3 ? (int)$argv[2] : 90;
            $result = $optimizer->cleanupOldLocationData($days);
            echo json_encode($result, JSON_PRETTY_PRINT) . "\n";
            break;
            
        case 'maintenance':
            $result = $optimizer->runMaintenance();
            echo json_encode($result, JSON_PRETTY_PRINT) . "\n";
            break;
            
        default:
            echo "Unknown command: $command\n";
            exit(1);
    }
}
