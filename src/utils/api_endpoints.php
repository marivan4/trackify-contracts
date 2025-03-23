
<?php
/**
 * API Endpoints for Vehicle Tracking System
 * 
 * This file defines the RESTful API endpoints for the tracking system
 * 
 * @author Vehicle Tracking System
 * @version 1.0
 * @date 2025-03-23
 */

// Include the database connection file
require_once 'db_connection.php';

// Set headers for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get the request endpoint from the URL
$request_uri = $_SERVER['REQUEST_URI'];
$endpoint = trim(parse_url($request_uri, PHP_URL_PATH), '/');
$endpoint_parts = explode('/', $endpoint);

// Get the request method
$method = $_SERVER['REQUEST_METHOD'];

// Get the request body for POST and PUT requests
$input = json_decode(file_get_contents('php://input'), true);

// API response array
$response = [
    'success' => false,
    'data' => null,
    'message' => ''
];

// Authenticate API request (simplified for example)
function authenticate_request() {
    $headers = getallheaders();
    
    // Check for API key in headers
    if (isset($headers['X-API-Key'])) {
        $api_key = $headers['X-API-Key'];
        
        // In a real implementation, you would validate the API key against a database
        // For now, we'll use a hardcoded key for example purposes
        $valid_key = 'TrackifySecretKey2025';
        
        return $api_key === $valid_key;
    }
    
    return false;
}

// Helper function to respond with an error
function respond_error($message, $code = 400) {
    global $response;
    $response['success'] = false;
    $response['message'] = $message;
    http_response_code($code);
    echo json_encode($response);
    exit;
}

// Check authentication for all endpoints except login
if ($endpoint_parts[0] !== 'login') {
    if (!authenticate_request()) {
        respond_error('Unauthorized access', 401);
    }
}

// Handle API requests based on endpoint and method
switch ($endpoint_parts[0]) {
    // User authentication endpoint
    case 'login':
        if ($method !== 'POST') {
            respond_error('Method not allowed', 405);
        }
        
        if (!isset($input['email']) || !isset($input['password'])) {
            respond_error('Email and password are required');
        }
        
        $email = $input['email'];
        $password = $input['password'];
        
        // Query the database for the user
        $sql = "SELECT id, name, email, password, role FROM users WHERE email = ? LIMIT 1";
        $user = db_query($sql, [$email]);
        
        if (!$user || empty($user)) {
            respond_error('Invalid credentials', 401);
        }
        
        $user = $user[0];
        
        // Verify password
        if (!password_verify($password, $user['password'])) {
            respond_error('Invalid credentials', 401);
        }
        
        // Remove password from response
        unset($user['password']);
        
        // Generate a simple token (in a real app, use JWT)
        $token = bin2hex(random_bytes(32));
        
        $response = [
            'success' => true,
            'data' => [
                'user' => $user,
                'token' => $token
            ],
            'message' => 'Login successful'
        ];
        break;
        
    // Users endpoints
    case 'users':
        // Get all users
        if ($method === 'GET' && !isset($endpoint_parts[1])) {
            $sql = "SELECT id, name, email, phone, role, created_at FROM users";
            $users = db_query($sql);
            
            $response = [
                'success' => true,
                'data' => $users,
                'message' => 'Users retrieved successfully'
            ];
        }
        // Get a specific user
        elseif ($method === 'GET' && isset($endpoint_parts[1])) {
            $userId = (int) $endpoint_parts[1];
            $user = db_get_by_id('users', $userId);
            
            if (!$user) {
                respond_error('User not found', 404);
            }
            
            // Remove password from response
            unset($user['password']);
            
            $response = [
                'success' => true,
                'data' => $user,
                'message' => 'User retrieved successfully'
            ];
        }
        // Create a new user
        elseif ($method === 'POST') {
            // Validate required fields
            if (!isset($input['name']) || !isset($input['email']) || !isset($input['password'])) {
                respond_error('Name, email, and password are required');
            }
            
            // Check if email already exists
            $sql = "SELECT id FROM users WHERE email = ? LIMIT 1";
            $existingUser = db_query($sql, [$input['email']]);
            
            if ($existingUser && !empty($existingUser)) {
                respond_error('Email already exists');
            }
            
            // Hash the password
            $input['password'] = password_hash($input['password'], PASSWORD_DEFAULT);
            
            // Insert the new user
            $userId = db_insert('users', $input);
            
            if (!$userId) {
                respond_error('Failed to create user');
            }
            
            $response = [
                'success' => true,
                'data' => ['id' => $userId],
                'message' => 'User created successfully'
            ];
        }
        // Update a user
        elseif ($method === 'PUT' && isset($endpoint_parts[1])) {
            $userId = (int) $endpoint_parts[1];
            
            // Check if user exists
            $user = db_get_by_id('users', $userId);
            
            if (!$user) {
                respond_error('User not found', 404);
            }
            
            // Hash the password if provided
            if (isset($input['password']) && !empty($input['password'])) {
                $input['password'] = password_hash($input['password'], PASSWORD_DEFAULT);
            } else {
                unset($input['password']);
            }
            
            // Update the user
            $result = db_update('users', $input, ['id' => $userId]);
            
            if ($result === false) {
                respond_error('Failed to update user');
            }
            
            $response = [
                'success' => true,
                'data' => null,
                'message' => 'User updated successfully'
            ];
        }
        // Delete a user
        elseif ($method === 'DELETE' && isset($endpoint_parts[1])) {
            $userId = (int) $endpoint_parts[1];
            
            // Check if user exists
            $user = db_get_by_id('users', $userId);
            
            if (!$user) {
                respond_error('User not found', 404);
            }
            
            // Delete the user
            $result = db_delete('users', ['id' => $userId]);
            
            if ($result === false) {
                respond_error('Failed to delete user');
            }
            
            $response = [
                'success' => true,
                'data' => null,
                'message' => 'User deleted successfully'
            ];
        }
        else {
            respond_error('Method not allowed', 405);
        }
        break;
        
    // Clients endpoints
    case 'clients':
        // Implementation similar to users
        if ($method === 'GET' && !isset($endpoint_parts[1])) {
            $sql = "SELECT * FROM clients";
            $clients = db_query($sql);
            
            $response = [
                'success' => true,
                'data' => $clients,
                'message' => 'Clients retrieved successfully'
            ];
        }
        elseif ($method === 'GET' && isset($endpoint_parts[1])) {
            $clientId = (int) $endpoint_parts[1];
            $client = db_get_by_id('clients', $clientId);
            
            if (!$client) {
                respond_error('Client not found', 404);
            }
            
            $response = [
                'success' => true,
                'data' => $client,
                'message' => 'Client retrieved successfully'
            ];
        }
        elseif ($method === 'POST') {
            // Validate required fields
            if (!isset($input['document']) || !isset($input['name']) || !isset($input['email'])) {
                respond_error('Document, name, and email are required');
            }
            
            // Check if document already exists
            $sql = "SELECT id FROM clients WHERE document = ? LIMIT 1";
            $existingClient = db_query($sql, [$input['document']]);
            
            if ($existingClient && !empty($existingClient)) {
                respond_error('Document already exists');
            }
            
            // Insert the new client
            $clientId = db_insert('clients', $input);
            
            if (!$clientId) {
                respond_error('Failed to create client');
            }
            
            $response = [
                'success' => true,
                'data' => ['id' => $clientId],
                'message' => 'Client created successfully'
            ];
        }
        // More endpoints for update and delete would be similar
        else {
            respond_error('Method not allowed', 405);
        }
        break;
        
    // Contract endpoints
    case 'contracts':
        // Implementation for contracts
        if ($method === 'GET' && !isset($endpoint_parts[1])) {
            $sql = "SELECT c.*, cl.name as client_name, v.license_plate, t.model as tracker_model, t.imei 
                    FROM contracts c
                    JOIN clients cl ON c.client_id = cl.id
                    JOIN vehicles v ON c.vehicle_id = v.id
                    JOIN trackers t ON c.tracker_id = t.id";
            $contracts = db_query($sql);
            
            $response = [
                'success' => true,
                'data' => $contracts,
                'message' => 'Contracts retrieved successfully'
            ];
        }
        elseif ($method === 'GET' && isset($endpoint_parts[1])) {
            $contractId = (int) $endpoint_parts[1];
            
            $sql = "SELECT c.*, cl.*, v.*, t.*
                    FROM contracts c
                    JOIN clients cl ON c.client_id = cl.id
                    JOIN vehicles v ON c.vehicle_id = v.id
                    JOIN trackers t ON c.tracker_id = t.id
                    WHERE c.id = ?";
            $contracts = db_query($sql, [$contractId]);
            
            if (!$contracts || empty($contracts)) {
                respond_error('Contract not found', 404);
            }
            
            $response = [
                'success' => true,
                'data' => $contracts[0],
                'message' => 'Contract retrieved successfully'
            ];
        }
        elseif ($method === 'POST') {
            // Complex contract creation would involve creating client, vehicle, tracker, and contract records
            // This would typically use a transaction
            
            // For simplicity, we'll assume the client, vehicle, and tracker already exist
            if (!isset($input['client_id']) || !isset($input['vehicle_id']) || !isset($input['tracker_id'])) {
                respond_error('Client ID, vehicle ID, and tracker ID are required');
            }
            
            // Generate a contract number
            $input['contract_number'] = 'CT' . date('YmdHis');
            
            // Insert the contract
            $contractId = db_insert('contracts', $input);
            
            if (!$contractId) {
                respond_error('Failed to create contract');
            }
            
            $response = [
                'success' => true,
                'data' => [
                    'id' => $contractId,
                    'contract_number' => $input['contract_number']
                ],
                'message' => 'Contract created successfully'
            ];
        }
        // More endpoints for update and delete would be similar
        else {
            respond_error('Method not allowed', 405);
        }
        break;
        
    // Tracker location endpoints
    case 'locations':
        if ($method === 'GET' && isset($endpoint_parts[1])) {
            // Get locations for a specific tracker
            $trackerId = (int) $endpoint_parts[1];
            
            // Optional time range
            $hours = isset($_GET['hours']) ? (int) $_GET['hours'] : 24;
            
            $sql = "SELECT * FROM locations 
                    WHERE tracker_id = ? 
                    AND timestamp >= DATE_SUB(NOW(), INTERVAL ? HOUR)
                    ORDER BY timestamp DESC";
            $locations = db_query($sql, [$trackerId, $hours]);
            
            $response = [
                'success' => true,
                'data' => $locations,
                'message' => 'Locations retrieved successfully'
            ];
        }
        elseif ($method === 'POST') {
            // Add a new location
            if (!isset($input['tracker_id']) || !isset($input['latitude']) || !isset($input['longitude'])) {
                respond_error('Tracker ID, latitude, and longitude are required');
            }
            
            // Insert the location
            $locationId = db_insert('locations', $input);
            
            if (!$locationId) {
                respond_error('Failed to record location');
            }
            
            $response = [
                'success' => true,
                'data' => ['id' => $locationId],
                'message' => 'Location recorded successfully'
            ];
        }
        else {
            respond_error('Method not allowed', 405);
        }
        break;
        
    // Default case for unknown endpoints
    default:
        respond_error('Endpoint not found', 404);
        break;
}

// Output the JSON response
echo json_encode($response);
