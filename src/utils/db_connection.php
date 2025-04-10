
<?php
/**
 * Database connection file for Vehicle Tracking System
 * 
 * This file establishes a connection to the MySQL database
 * and provides utility functions for database operations.
 * 
 * @author Vehicle Tracking System
 * @version 1.2
 * @date 2025-04-10
 */

// Database configuration
$db_config = [
    'host'     => 'localhost',
    'username' => 'tracking_user',
    'password' => 'senha_segura',
    'database' => 'tracking_system',
    'charset'  => 'utf8mb4',
    'options'  => [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]
];

// Global connection variable to reuse connection
$global_db_connection = null;

/**
 * Establishes a connection to the database
 * 
 * @param bool $force_new Whether to force a new connection
 * @return PDO|null PDO connection object or null on failure
 */
function db_connect(bool $force_new = false): ?PDO {
    global $db_config, $global_db_connection;
    
    // Return existing connection if available and not forcing new
    if ($global_db_connection !== null && !$force_new) {
        return $global_db_connection;
    }
    
    try {
        $dsn = "mysql:host={$db_config['host']};dbname={$db_config['database']};charset={$db_config['charset']}";
        $pdo = new PDO($dsn, $db_config['username'], $db_config['password'], $db_config['options']);
        
        // Store connection globally for reuse
        if (!$force_new) {
            $global_db_connection = $pdo;
        }
        
        return $pdo;
    } catch (PDOException $e) {
        // Log the error message with more details
        error_log("Database connection failed: " . $e->getMessage());
        error_log("Connection details (excl. password): host={$db_config['host']}, user={$db_config['username']}, db={$db_config['database']}");
        return null;
    }
}

/**
 * Tests the database connection
 * 
 * @return array Connection test results with status and message
 */
function db_test_connection(): array {
    try {
        $pdo = db_connect();
        
        if (!$pdo) {
            return [
                'status' => false,
                'message' => 'Não foi possível estabelecer conexão com o banco de dados.'
            ];
        }
        
        // Try a simple query to verify the connection is working properly
        $stmt = $pdo->query('SELECT 1');
        $stmt->fetch();
        
        // Check if tables exist
        try {
            $tables = ['users', 'clients', 'vehicles', 'trackers', 'contracts', 'locations'];
            $missing_tables = [];
            
            foreach ($tables as $table) {
                $check = $pdo->query("SHOW TABLES LIKE '$table'");
                if ($check->rowCount() == 0) {
                    $missing_tables[] = $table;
                }
            }
            
            if (!empty($missing_tables)) {
                return [
                    'status' => false,
                    'message' => 'Conexão estabelecida, mas faltam tabelas: ' . implode(', ', $missing_tables)
                ];
            }
        } catch (PDOException $e) {
            // Table check failed, but connection works
            error_log("Table check failed: " . $e->getMessage());
        }
        
        return [
            'status' => true,
            'message' => 'Conexão com o banco de dados estabelecida com sucesso.'
        ];
    } catch (PDOException $e) {
        return [
            'status' => false,
            'message' => 'Erro ao conectar ao banco de dados: ' . $e->getMessage()
        ];
    }
}

/**
 * Executes a query and returns the result
 * 
 * @param string $sql The SQL query
 * @param array $params The parameters for the prepared statement
 * @return array|false The result set as an array or false on failure
 */
function db_query(string $sql, array $params = []): array|false {
    $pdo = db_connect();
    
    if (!$pdo) {
        error_log("Database connection failed in db_query");
        return false;
    }
    
    try {
        $stmt = $pdo->prepare($sql);
        $success = $stmt->execute($params);
        
        if (!$success) {
            error_log("Query execution failed: " . implode(', ', $stmt->errorInfo()));
            return false;
        }
        
        return $stmt->fetchAll();
    } catch (PDOException $e) {
        error_log("Query execution failed: " . $e->getMessage());
        error_log("SQL: $sql");
        error_log("Parameters: " . json_encode($params));
        return false;
    }
}

/**
 * Executes an update query and returns the number of affected rows
 * 
 * @param string $sql The SQL query
 * @param array $params The parameters for the prepared statement
 * @return int|false The number of rows affected or false on failure
 */
function db_execute(string $sql, array $params = []): int|false {
    $pdo = db_connect();
    
    if (!$pdo) {
        error_log("Database connection failed in db_execute");
        return false;
    }
    
    try {
        $stmt = $pdo->prepare($sql);
        $success = $stmt->execute($params);
        
        if (!$success) {
            error_log("Query execution failed: " . implode(', ', $stmt->errorInfo()));
            return false;
        }
        
        return $stmt->rowCount();
    } catch (PDOException $e) {
        error_log("Query execution failed: " . $e->getMessage());
        error_log("SQL: $sql");
        error_log("Parameters: " . json_encode($params));
        return false;
    }
}

/**
 * Inserts a record and returns the last insert ID
 * 
 * @param string $table The table name
 * @param array $data Associative array of column => value pairs
 * @return int|false The last insert ID or false on failure
 */
function db_insert(string $table, array $data): int|false {
    $pdo = db_connect();
    
    if (!$pdo) {
        error_log("Database connection failed in db_insert");
        return false;
    }
    
    try {
        // Begin transaction for data integrity
        $pdo->beginTransaction();
        
        $columns = implode(', ', array_keys($data));
        $placeholders = implode(', ', array_fill(0, count($data), '?'));
        
        $sql = "INSERT INTO {$table} ({$columns}) VALUES ({$placeholders})";
        
        $stmt = $pdo->prepare($sql);
        $success = $stmt->execute(array_values($data));
        
        if (!$success) {
            $pdo->rollBack();
            error_log("Insert failed: " . implode(', ', $stmt->errorInfo()));
            return false;
        }
        
        $lastId = (int) $pdo->lastInsertId();
        
        // Commit the transaction
        $pdo->commit();
        
        return $lastId;
    } catch (PDOException $e) {
        // Roll back the transaction on error
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        
        error_log("Insert failed: " . $e->getMessage());
        error_log("Table: $table");
        error_log("Data: " . json_encode($data));
        return false;
    }
}

/**
 * Updates a record and returns the number of affected rows
 * 
 * @param string $table The table name
 * @param array $data Associative array of column => value pairs to update
 * @param array $where Associative array of column => value pairs for the WHERE clause
 * @return int|false The number of rows affected or false on failure
 */
function db_update(string $table, array $data, array $where): int|false {
    $pdo = db_connect();
    
    if (!$pdo) {
        error_log("Database connection failed in db_update");
        return false;
    }
    
    try {
        // Begin transaction for data integrity
        $pdo->beginTransaction();
        
        $set = [];
        foreach (array_keys($data) as $column) {
            $set[] = "{$column} = ?";
        }
        
        $whereConditions = [];
        foreach (array_keys($where) as $column) {
            $whereConditions[] = "{$column} = ?";
        }
        
        $sql = "UPDATE {$table} SET " . implode(', ', $set) . " WHERE " . implode(' AND ', $whereConditions);
        
        $stmt = $pdo->prepare($sql);
        $success = $stmt->execute(array_merge(array_values($data), array_values($where)));
        
        if (!$success) {
            $pdo->rollBack();
            error_log("Update failed: " . implode(', ', $stmt->errorInfo()));
            return false;
        }
        
        $rowCount = $stmt->rowCount();
        
        // Commit the transaction
        $pdo->commit();
        
        return $rowCount;
    } catch (PDOException $e) {
        // Roll back the transaction on error
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        
        error_log("Update failed: " . $e->getMessage());
        error_log("Table: $table");
        error_log("Data: " . json_encode($data));
        error_log("Where: " . json_encode($where));
        return false;
    }
}

/**
 * Deletes a record and returns the number of affected rows
 * 
 * @param string $table The table name
 * @param array $where Associative array of column => value pairs for the WHERE clause
 * @return int|false The number of rows affected or false on failure
 */
function db_delete(string $table, array $where): int|false {
    $pdo = db_connect();
    
    if (!$pdo) {
        error_log("Database connection failed in db_delete");
        return false;
    }
    
    try {
        // Begin transaction for data integrity
        $pdo->beginTransaction();
        
        $whereConditions = [];
        foreach (array_keys($where) as $column) {
            $whereConditions[] = "{$column} = ?";
        }
        
        $sql = "DELETE FROM {$table} WHERE " . implode(' AND ', $whereConditions);
        
        $stmt = $pdo->prepare($sql);
        $success = $stmt->execute(array_values($where));
        
        if (!$success) {
            $pdo->rollBack();
            error_log("Delete failed: " . implode(', ', $stmt->errorInfo()));
            return false;
        }
        
        $rowCount = $stmt->rowCount();
        
        // Commit the transaction
        $pdo->commit();
        
        return $rowCount;
    } catch (PDOException $e) {
        // Roll back the transaction on error
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        
        error_log("Delete failed: " . $e->getMessage());
        error_log("Table: $table");
        error_log("Where: " . json_encode($where));
        return false;
    }
}

/**
 * Gets a single record by ID
 * 
 * @param string $table The table name
 * @param int $id The ID of the record
 * @param string $idColumn The name of the ID column (default: 'id')
 * @return array|false The record or false if not found or on error
 */
function db_get_by_id(string $table, int $id, string $idColumn = 'id'): array|false {
    $pdo = db_connect();
    
    if (!$pdo) {
        error_log("Database connection failed in db_get_by_id");
        return false;
    }
    
    try {
        $sql = "SELECT * FROM {$table} WHERE {$idColumn} = ? LIMIT 1";
        
        $stmt = $pdo->prepare($sql);
        $success = $stmt->execute([$id]);
        
        if (!$success) {
            error_log("Get by ID failed: " . implode(', ', $stmt->errorInfo()));
            return false;
        }
        
        $result = $stmt->fetch();
        
        return $result !== false ? $result : false;
    } catch (PDOException $e) {
        error_log("Get by ID failed: " . $e->getMessage());
        error_log("Table: $table, ID: $id");
        return false;
    }
}

/**
 * Creates a standalone database connection test file
 * 
 * @return string Path to the generated file
 */
function create_db_test_file(): string {
    global $db_config;
    
    $test_file_path = __DIR__ . '/db_connection_test.php';
    
    $test_file_content = '<?php
/**
 * Database Connection Test Script
 * 
 * This standalone script tests the database connection and reports issues.
 */

// Database configuration (copied from main config)
$db_config = ' . var_export($db_config, true) . ';

try {
    echo "Testing database connection...\n\n";
    
    // Try to connect
    $dsn = "mysql:host={$db_config[\'host\']};dbname={$db_config[\'database\']};charset={$db_config[\'charset\']}";
    $pdo = new PDO($dsn, $db_config[\'username\'], $db_config[\'password\'], $db_config[\'options\']);
    
    echo "✅ Connection successful!\n";
    
    // Test table access
    $tables = [\'users\', \'clients\', \'vehicles\', \'trackers\', \'contracts\', \'locations\'];
    $missing_tables = [];
    
    echo "\nChecking tables:\n";
    
    foreach ($tables as $table) {
        echo "  - {$table}: ";
        $check = $pdo->query("SHOW TABLES LIKE \'{$table}\'");
        
        if ($check->rowCount() == 0) {
            echo "❌ Missing\n";
            $missing_tables[] = $table;
        } else {
            echo "✅ Found\n";
            
            // Count rows
            $count = $pdo->query("SELECT COUNT(*) as count FROM {$table}")->fetch();
            echo "    Records: {$count[\'count\']}\n";
            
            // Show structure
            echo "    Structure:\n";
            $structure = $pdo->query("DESCRIBE {$table}");
            while ($column = $structure->fetch()) {
                echo "      - {$column[\'Field\']} ({$column[\'Type\']})\n";
            }
            echo "\n";
        }
    }
    
    // Test write permission
    echo "\nTesting write permissions:\n";
    try {
        $pdo->exec("CREATE TEMPORARY TABLE test_write (id INT)");
        echo "✅ Write permission OK\n";
    } catch (PDOException $e) {
        echo "❌ Write permission failed: {$e->getMessage()}\n";
    }
    
} catch (PDOException $e) {
    echo "❌ Connection failed: {$e->getMessage()}\n";
    
    // Check each part of the connection
    echo "\nDiagnostics:\n";
    
    // Check host
    echo "  - Host ({$db_config[\'host\']}): ";
    $socket = @fsockopen($db_config[\'host\'], 3306, $errno, $errstr, 5);
    if ($socket) {
        echo "✅ Accessible\n";
        fclose($socket);
    } else {
        echo "❌ Not accessible ({$errstr})\n";
    }
    
    // Check database existence (try to connect without specific database)
    echo "  - Database exists: ";
    try {
        $dsn = "mysql:host={$db_config[\'host\']};charset={$db_config[\'charset\']}";
        $temp_pdo = new PDO($dsn, $db_config[\'username\'], $db_config[\'password\']);
        $db_exists = $temp_pdo->query("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = \'{$db_config[\'database\']}\'")->rowCount() > 0;
        
        if ($db_exists) {
            echo "✅ Yes\n";
        } else {
            echo "❌ No - Database does not exist\n";
        }
    } catch (PDOException $inner_e) {
        echo "❓ Cannot check (credentials may be incorrect)\n";
    }
    
    // User permissions
    echo "  - User permissions: Cannot check directly\n";
}

echo "\n--- End of Database Test ---\n";
';

    file_put_contents($test_file_path, $test_file_content);
    
    return $test_file_path;
}

// Create the test file if it doesn't exist
if (!file_exists(__DIR__ . '/db_connection_test.php')) {
    create_db_test_file();
}
