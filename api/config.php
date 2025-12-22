<?php
// Configuration de la base de données CVAC
// Production - Hébergement mutualisé
define('DB_HOST', 'localhost');
define('DB_NAME', 'u281164575_cvac');
define('DB_USER', 'u281164575_admin');
define('DB_PASS', 'Elodie14061990@'); // ⚠️ À configurer avec le mot de passe MySQL

// Configuration pour développement local (décommenter si nécessaire)
// define('DB_HOST', 'localhost');
// define('DB_NAME', 'cvac_db');
// define('DB_USER', 'root');
// define('DB_PASS', '');

// Configuration CORS pour hébergement mutualisé
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// Gérer les requêtes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Fonction de connexion à la base de données
function getDB() {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erreur de connexion à la base de données']);
        exit();
    }
}

// Fonction pour sécuriser les données
function sanitize($data) {
    if ($data === null || $data === '') {
        return null;
    }
    return htmlspecialchars(strip_tags(trim($data)));
}

?>

