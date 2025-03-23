
<?php
/**
 * Database connection file for Vehicle Tracking System
 * 
 * This file establishes a connection to the MySQL database
 * and provides utility functions for database operations.
 * 
 * @author Vehicle Tracking System
 * @version 1.0
 * @date 2025-03-23
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

/**
 * Establishes a connection to the database
 * 
 * @return PDO|null PDO connection object or null on failure
 */
function db_connect(): ?PDO {
    global $db_config;
    
    try {
        $dsn = "mysql:host={$db_config['host']};dbname={$db_config['database']};charset={$db_config['charset']}";
        $pdo = new PDO($dsn, $db_config['username'], $db_config['password'], $db_config['options']);
        return $pdo;
    } catch (PDOException $e) {
        // Log the error message
        error_log("Database connection failed: " . $e->getMessage());
        return null;
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
        return false;
    }
    
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    } catch (PDOException $e) {
        error_log("Query execution failed: " . $e->getMessage());
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
        return false;
    }
    
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->rowCount();
    } catch (PDOException $e) {
        error_log("Query execution failed: " . $e->getMessage());
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
        return false;
    }
    
    try {
        $columns = implode(', ', array_keys($data));
        $placeholders = implode(', ', array_fill(0, count($data), '?'));
        
        $sql = "INSERT INTO {$table} ({$columns}) VALUES ({$placeholders})";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute(array_values($data));
        
        return (int) $pdo->lastInsertId();
    } catch (PDOException $e) {
        error_log("Insert failed: " . $e->getMessage());
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
        return false;
    }
    
    try {
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
        $stmt->execute(array_merge(array_values($data), array_values($where)));
        
        return $stmt->rowCount();
    } catch (PDOException $e) {
        error_log("Update failed: " . $e->getMessage());
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
        return false;
    }
    
    try {
        $whereConditions = [];
        foreach (array_keys($where) as $column) {
            $whereConditions[] = "{$column} = ?";
        }
        
        $sql = "DELETE FROM {$table} WHERE " . implode(' AND ', $whereConditions);
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute(array_values($where));
        
        return $stmt->rowCount();
    } catch (PDOException $e) {
        error_log("Delete failed: " . $e->getMessage());
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
        return false;
    }
    
    try {
        $sql = "SELECT * FROM {$table} WHERE {$idColumn} = ? LIMIT 1";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id]);
        
        $result = $stmt->fetch();
        
        return $result !== false ? $result : false;
    } catch (PDOException $e) {
        error_log("Get by ID failed: " . $e->getMessage());
        return false;
    }
}
