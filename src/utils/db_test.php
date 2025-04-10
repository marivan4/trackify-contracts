
<?php
/**
 * Database Test Page
 * 
 * This page tests the database connection and provides diagnostic information.
 */

// Include the database functions
require_once 'db_connection.php';

// Set the content type to HTML
header('Content-Type: text/html; charset=utf-8');

// Function to check if a table exists
function table_exists($table) {
    $pdo = db_connect();
    
    if (!$pdo) {
        return false;
    }
    
    try {
        $stmt = $pdo->query("SHOW TABLES LIKE '$table'");
        return $stmt->rowCount() > 0;
    } catch (PDOException $e) {
        return false;
    }
}

// Function to get table row count
function get_row_count($table) {
    $pdo = db_connect();
    
    if (!$pdo) {
        return 0;
    }
    
    try {
        $stmt = $pdo->query("SELECT COUNT(*) AS count FROM $table");
        $result = $stmt->fetch();
        return $result['count'];
    } catch (PDOException $e) {
        return 0;
    }
}

// Test database connection
$connection_test = db_test_connection();

// Check specific tables
$tables = ['users', 'clients', 'vehicles', 'trackers', 'contracts', 'locations'];
$table_status = [];

if ($connection_test['status']) {
    foreach ($tables as $table) {
        $exists = table_exists($table);
        $row_count = $exists ? get_row_count($table) : 0;
        
        $table_status[$table] = [
            'exists' => $exists,
            'rows' => $row_count
        ];
    }
}

// Try a test insert if connection is OK
$insert_test = ['success' => false, 'message' => 'Não testado'];

if ($connection_test['status'] && isset($table_status['users']) && $table_status['users']['exists']) {
    try {
        // Start transaction to prevent actual changes
        $pdo = db_connect();
        $pdo->beginTransaction();
        
        // Try to insert a test record
        $test_data = [
            'name' => 'Test User ' . date('YmdHis'),
            'email' => 'test_' . uniqid() . '@example.com',
            'password' => password_hash('test123', PASSWORD_DEFAULT),
            'role' => 'user'
        ];
        
        $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
        $insert_result = $stmt->execute(array_values($test_data));
        
        if ($insert_result) {
            $insert_test = ['success' => true, 'message' => 'Inserção de teste bem-sucedida'];
        } else {
            $insert_test = ['success' => false, 'message' => 'Falha na inserção: ' . implode(', ', $stmt->errorInfo())];
        }
        
        // Roll back to prevent actual insertion
        $pdo->rollBack();
    } catch (PDOException $e) {
        $insert_test = ['success' => false, 'message' => 'Erro na inserção: ' . $e->getMessage()];
    }
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Teste de Conexão ao Banco de Dados</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }
        .status {
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .warning {
            background-color: #fff3cd;
            color: #856404;
            border: 1px solid #ffeeba;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 12px 15px;
            border: 1px solid #ddd;
            text-align: left;
        }
        th {
            background-color: #f8f9fa;
        }
        tr.missing td {
            background-color: #fff3cd;
        }
        .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
        }
        .badge-success {
            background-color: #28a745;
            color: white;
        }
        .badge-danger {
            background-color: #dc3545;
            color: white;
        }
        .actions {
            margin-top: 30px;
        }
        .btn {
            display: inline-block;
            font-weight: 400;
            text-align: center;
            white-space: nowrap;
            vertical-align: middle;
            user-select: none;
            border: 1px solid transparent;
            padding: 0.375rem 0.75rem;
            font-size: 1rem;
            line-height: 1.5;
            border-radius: 0.25rem;
            text-decoration: none;
            cursor: pointer;
            transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
        }
        .btn-primary {
            color: #fff;
            background-color: #007bff;
            border-color: #007bff;
        }
        .btn-primary:hover {
            background-color: #0069d9;
            border-color: #0062cc;
        }
        pre {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <h1>Teste de Conexão ao Banco de Dados</h1>
    
    <div class="status <?php echo $connection_test['status'] ? 'success' : 'error'; ?>">
        <h2>Status da Conexão</h2>
        <p><?php echo $connection_test['message']; ?></p>
    </div>
    
    <?php if ($connection_test['status']): ?>
        <div class="status <?php echo $insert_test['success'] ? 'success' : 'error'; ?>">
            <h2>Teste de Inserção</h2>
            <p><?php echo $insert_test['message']; ?></p>
        </div>
        
        <h2>Status das Tabelas</h2>
        <table>
            <tr>
                <th>Tabela</th>
                <th>Status</th>
                <th>Registros</th>
            </tr>
            <?php foreach ($table_status as $table => $status): ?>
            <tr class="<?php echo $status['exists'] ? '' : 'missing'; ?>">
                <td><?php echo $table; ?></td>
                <td>
                    <?php if ($status['exists']): ?>
                    <span class="badge badge-success">Encontrada</span>
                    <?php else: ?>
                    <span class="badge badge-danger">Ausente</span>
                    <?php endif; ?>
                </td>
                <td><?php echo $status['rows']; ?></td>
            </tr>
            <?php endforeach; ?>
        </table>
    <?php endif; ?>
    
    <div class="actions">
        <a href="/" class="btn btn-primary">Voltar para o Início</a>
        
        <?php if (!$connection_test['status']): ?>
        <h2>Informações de Sistema</h2>
        <pre>
PHP Version: <?php echo phpversion(); ?>

PDO Drivers: <?php echo implode(', ', PDO::getAvailableDrivers()); ?>

Database Configuration:
Host: <?php echo $GLOBALS['db_config']['host']; ?>
Database: <?php echo $GLOBALS['db_config']['database']; ?>
Username: <?php echo $GLOBALS['db_config']['username']; ?>
        </pre>
        <?php endif; ?>
    </div>
</body>
</html>
