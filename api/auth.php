<?php
require_once 'config.php';
require_once 'email_config.php';

try {
    $pdo = getDB();
    // Récupérer l'action sans la sanitizer pour préserver les tirets
    $action = isset($_GET['action']) ? trim($_GET['action']) : null;
    $method = $_SERVER['REQUEST_METHOD'];
    
    // Debug temporaire pour identifier le problème
    if ($action === 'forgot-password') {
        error_log("DEBUG: Action 'forgot-password' détectée, méthode: " . $method);
    }
    
    // Récupérer le token depuis le header Authorization
    function getAuthToken() {
        $headers = getallheaders();
        if (isset($headers['Authorization'])) {
            return str_replace('Bearer ', '', $headers['Authorization']);
        }
        return null;
    }
    
    // Générer un token simple (à remplacer par JWT si nécessaire)
    function generateToken($userId) {
        return bin2hex(random_bytes(32)) . '_' . $userId . '_' . time();
    }
    
    // Vérifier si un token est valide
    function verifyToken($token) {
        global $pdo;
        if (!$token) return null;
        
        $stmt = $pdo->prepare("SELECT * FROM users WHERE token = ? AND (token_expires_at IS NULL OR token_expires_at > NOW())");
        $stmt->execute([$token]);
        $user = $stmt->fetch();
        
        return $user ? $user : null;
    }
    
    // ============================================
    // INSCRIPTION (SIGNUP)
    // ============================================
    if ($action === 'signup' && $method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validation des données requises
        if (empty($data['email']) || empty($data['password']) || empty($data['firstname']) || empty($data['lastname'])) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Tous les champs sont requis (email, password, firstname, lastname)'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        $email = sanitize($data['email']);
        $password = $data['password'];
        $firstname = sanitize($data['firstname']);
        $lastname = sanitize($data['lastname']);
        $associationId = isset($data['associationId']) ? (int)$data['associationId'] : null;
        
        // Vérifier si l'email existe déjà
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Cet email est déjà utilisé'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        // Hashage du mot de passe
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        
        // Générer un token
        $token = generateToken(0); // L'ID sera mis à jour après insertion
        
        // Vérifier si la colonne status existe
        $hasStatusColumn = false;
        try {
            $checkStmt = $pdo->query("SHOW COLUMNS FROM users LIKE 'status'");
            $hasStatusColumn = $checkStmt->rowCount() > 0;
        } catch (Exception $e) {
            $hasStatusColumn = false;
        }
        
        // Par défaut, les nouveaux utilisateurs sont en attente de validation
        $status = 'pending';
        
        // Insérer l'utilisateur (avec ou sans status selon si la colonne existe)
        if ($hasStatusColumn) {
            $stmt = $pdo->prepare("
                INSERT INTO users (email, password, firstname, lastname, association_id, token, token_expires_at, status) 
                VALUES (?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY), ?)
            ");
            $stmt->execute([$email, $hashedPassword, $firstname, $lastname, $associationId, $token, $status]);
        } else {
            $stmt = $pdo->prepare("
                INSERT INTO users (email, password, firstname, lastname, association_id, token, token_expires_at) 
                VALUES (?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))
            ");
            $stmt->execute([$email, $hashedPassword, $firstname, $lastname, $associationId, $token]);
        }
        
        $userId = $pdo->lastInsertId();
        
        // Mettre à jour le token avec l'ID réel
        $token = generateToken($userId);
        $stmt = $pdo->prepare("UPDATE users SET token = ? WHERE id = ?");
        $stmt->execute([$token, $userId]);
        
        // Récupérer l'utilisateur créé
        if ($hasStatusColumn) {
            $stmt = $pdo->prepare("SELECT id, email, firstname, lastname, association_id as associationId, role, status FROM users WHERE id = ?");
        } else {
            $stmt = $pdo->prepare("SELECT id, email, firstname, lastname, association_id as associationId, role FROM users WHERE id = ?");
        }
        $stmt->execute([$userId]);
        $user = $stmt->fetch();
        
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Compte créé avec succès',
            'user' => $user,
            'token' => $token
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }
    
    // ============================================
    // CONNEXION (LOGIN)
    // ============================================
    if ($action === 'login' && $method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (empty($data['email']) || empty($data['password'])) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Email et mot de passe requis'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        $email = sanitize($data['email']);
        $password = $data['password'];
        
        // Récupérer l'utilisateur
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        if (!$user || !password_verify($password, $user['password'])) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Email ou mot de passe incorrect'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        // Vérifier si la colonne status existe avant de vérifier le statut
        $hasStatusColumn = false;
        try {
            $checkStmt = $pdo->query("SHOW COLUMNS FROM users LIKE 'status'");
            $hasStatusColumn = $checkStmt->rowCount() > 0;
        } catch (Exception $e) {
            $hasStatusColumn = false;
        }
        
        // Vérifier le statut de l'utilisateur (seulement si la colonne existe)
        if ($hasStatusColumn && isset($user['status'])) {
            if ($user['status'] === 'rejected') {
                http_response_code(403);
                echo json_encode([
                    'success' => false,
                    'message' => 'Votre compte a été rejeté. Contactez l\'administrateur pour plus d\'informations.'
                ], JSON_UNESCAPED_UNICODE);
                exit();
            }
            
            if ($user['status'] === 'pending') {
                http_response_code(403);
                echo json_encode([
                    'success' => false,
                    'message' => 'Votre compte est en attente de validation. Vous serez notifié une fois qu\'il sera approuvé.'
                ], JSON_UNESCAPED_UNICODE);
                exit();
            }
        }
        
        // Générer un nouveau token
        $token = generateToken($user['id']);
        $stmt = $pdo->prepare("UPDATE users SET token = ?, token_expires_at = DATE_ADD(NOW(), INTERVAL 30 DAY) WHERE id = ?");
        $stmt->execute([$token, $user['id']]);
        
        // Retourner les données utilisateur (sans le mot de passe)
        $userData = [
            'id' => $user['id'],
            'email' => $user['email'],
            'firstname' => $user['firstname'],
            'lastname' => $user['lastname'],
            'associationId' => $user['association_id'],
            'role' => $user['role'] ?? 'user'
        ];
        
        // Ajouter le statut seulement si la colonne existe
        if ($hasStatusColumn && isset($user['status'])) {
            $userData['status'] = $user['status'];
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Connexion réussie',
            'user' => $userData,
            'token' => $token
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }
    
    // ============================================
    // VÉRIFICATION DU TOKEN (CHECK)
    // ============================================
    if ($action === 'check' && $method === 'GET') {
        $token = isset($_GET['token']) ? sanitize($_GET['token']) : getAuthToken();
        
        if (!$token) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Token manquant'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        $user = verifyToken($token);
        
        if (!$user) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Token invalide ou expiré'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        echo json_encode([
            'success' => true,
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'firstname' => $user['firstname'],
                'lastname' => $user['lastname'],
                'associationId' => $user['association_id'],
                'role' => $user['role']
            ]
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }
    
    // ============================================
    // METTRE À JOUR L'ASSOCIATION DE L'UTILISATEUR
    // ============================================
    if ($action === 'updateAssociation' && $method === 'PUT') {
        $token = getAuthToken();
        
        if (!$token) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Authentification requise'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        $user = verifyToken($token);
        if (!$user) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Token invalide'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        $data = json_decode(file_get_contents('php://input'), true);
        // Accepter null, 0, ou un ID valide pour retirer ou changer l'association
        $associationId = isset($data['associationId']) 
            ? ($data['associationId'] === null || $data['associationId'] === 0 ? null : (int)$data['associationId'])
            : null;
        
        // Vérifier que l'association existe si un ID valide est fourni
        if ($associationId !== null && $associationId > 0) {
            $stmt = $pdo->prepare("SELECT id FROM associations WHERE id = ?");
            $stmt->execute([$associationId]);
            if (!$stmt->fetch()) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Association non trouvée'
                ], JSON_UNESCAPED_UNICODE);
                exit();
            }
        }
        
        // Mettre à jour l'association de l'utilisateur (peut être NULL pour retirer l'association)
        $stmt = $pdo->prepare("UPDATE users SET association_id = ? WHERE id = ?");
        $stmt->execute([$associationId, $user['id']]);
        
        // Récupérer l'utilisateur mis à jour
        $stmt = $pdo->prepare("SELECT id, email, firstname, lastname, association_id as associationId, role FROM users WHERE id = ?");
        $stmt->execute([$user['id']]);
        $updatedUser = $stmt->fetch();
        
        echo json_encode([
            'success' => true,
            'message' => 'Association mise à jour avec succès',
            'user' => $updatedUser
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }
    
    // ============================================
    // MOT DE PASSE OUBLIÉ (FORGOT PASSWORD)
    // ============================================
    // Comparaison flexible pour gérer les variations d'encodage
    if (($action === 'forgot-password' || strtolower($action) === 'forgot-password') && $method === 'POST') {
        $rawInput = file_get_contents('php://input');
        $data = json_decode($rawInput, true);
        
        // Vérifier si les données JSON sont valides
        if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Données JSON invalides: ' . json_last_error_msg()
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        // Vérifier si l'email est présent
        if (empty($data) || !isset($data['email']) || empty(trim($data['email']))) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Email requis'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        $email = sanitize($data['email']);
        
        // Vérifier si l'utilisateur existe
        $stmt = $pdo->prepare("SELECT id, email, firstname, lastname FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        // Pour des raisons de sécurité, on retourne toujours un succès
        // même si l'email n'existe pas (pour éviter l'énumération d'emails)
        if ($user) {
            // Générer un token de réinitialisation
            $resetToken = bin2hex(random_bytes(32));
            $resetTokenExpires = date('Y-m-d H:i:s', strtotime('+1 hour'));
            
            // Vérifier et créer les colonnes si elles n'existent pas
            try {
                $checkCols = $pdo->query("SHOW COLUMNS FROM users LIKE 'password_reset_token'");
                if ($checkCols->rowCount() == 0) {
                    $pdo->exec("ALTER TABLE users ADD COLUMN password_reset_token VARCHAR(255) NULL");
                    $pdo->exec("ALTER TABLE users ADD COLUMN password_reset_expires_at DATETIME NULL");
                }
            } catch (PDOException $e) {
                // Les colonnes existent peut-être déjà, continuer
                error_log("Note colonnes reset password: " . $e->getMessage());
            }
            
            // Mettre à jour l'utilisateur avec le token
            try {
                $stmt = $pdo->prepare("UPDATE users SET password_reset_token = ?, password_reset_expires_at = ? WHERE id = ?");
                $stmt->execute([$resetToken, $resetTokenExpires, $user['id']]);
            } catch (PDOException $e) {
                // Si erreur due aux colonnes manquantes, les créer et réessayer
                if (strpos($e->getMessage(), 'password_reset_token') !== false || strpos($e->getMessage(), 'Unknown column') !== false) {
                    try {
                        $pdo->exec("ALTER TABLE users ADD COLUMN password_reset_token VARCHAR(255) NULL");
                        $pdo->exec("ALTER TABLE users ADD COLUMN password_reset_expires_at DATETIME NULL");
                        // Réessayer la mise à jour
                        $stmt = $pdo->prepare("UPDATE users SET password_reset_token = ?, password_reset_expires_at = ? WHERE id = ?");
                        $stmt->execute([$resetToken, $resetTokenExpires, $user['id']]);
                    } catch (PDOException $e2) {
                        error_log("Erreur création colonnes reset password: " . $e2->getMessage());
                        // Continuer quand même pour ne pas révéler si l'email existe
                    }
                } else {
                    error_log("Erreur mise à jour token: " . $e->getMessage());
                    // Continuer quand même pour ne pas révéler si l'email existe
                }
            }
            
            // Construire l'URL de réinitialisation (frontend Angular)
            // En production, utiliser le domaine du frontend
            // En développement, utiliser localhost:4200
            $isProduction = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on';
            $frontendUrl = $isProduction 
                ? 'https://cvac-choisyleroi.fr' 
                : 'http://localhost:4200';
            $resetUrl = $frontendUrl . '/reset-password?token=' . $resetToken;
            
            // Préparer le message email
            $subject = 'Réinitialisation de votre mot de passe CVAC';
            $message = "Bonjour " . htmlspecialchars($user['firstname']) . ",\n\n";
            $message .= "Vous avez demandé à réinitialiser votre mot de passe pour votre compte CVAC.\n\n";
            $message .= "Pour réinitialiser votre mot de passe, cliquez sur le lien suivant :\n";
            $message .= $resetUrl . "\n\n";
            $message .= "Ce lien est valide pendant 1 heure.\n\n";
            $message .= "Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email.\n\n";
            $message .= "Cordialement,\n";
            $message .= "L'équipe CVAC - Conseil de la Vie Associative";
            
            // Envoyer l'email via SMTP Gmail
            $mailSent = sendEmailViaSMTP($email, $subject, $message);
            
            // Log pour debug
            if (!$mailSent) {
                error_log("Erreur envoi email réinitialisation mot de passe pour: {$email}");
                // Log aussi l'URL pour debug en cas d'échec d'envoi
                error_log("URL de réinitialisation: {$resetUrl}");
            } else {
                error_log("Email de réinitialisation envoyé avec succès à: {$email}");
            }
        }
        
        // Toujours retourner un succès pour des raisons de sécurité
        echo json_encode([
            'success' => true,
            'message' => 'Si un compte existe avec cette adresse email, vous recevrez un lien de réinitialisation.'
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }
    
    // ============================================
    // RÉINITIALISATION DU MOT DE PASSE (RESET PASSWORD)
    // ============================================
    if ($action === 'reset-password' && $method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (empty($data['token']) || empty($data['password'])) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Token et mot de passe requis'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        $token = sanitize($data['token']);
        $password = $data['password'];
        
        // Vérifier que le mot de passe respecte les critères minimum
        if (strlen($password) < 8) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Le mot de passe doit contenir au moins 8 caractères'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        // Récupérer l'utilisateur avec le token valide
        // Les colonnes sont créées automatiquement si elles n'existent pas
        // (géré par le script SQL add_password_reset_fields.sql)
        $stmt = $pdo->prepare("SELECT id FROM users WHERE password_reset_token = ? AND password_reset_expires_at > NOW()");
        $stmt->execute([$token]);
        $user = $stmt->fetch();
        
        if (!$user) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Token invalide ou expiré'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        // Hashage du nouveau mot de passe
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        
        // Mettre à jour le mot de passe et supprimer le token
        $stmt = $pdo->prepare("UPDATE users SET password = ?, password_reset_token = NULL, password_reset_expires_at = NULL WHERE id = ?");
        $stmt->execute([$hashedPassword, $user['id']]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Mot de passe réinitialisé avec succès'
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }
    
    // Action non reconnue - Debug
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Action non reconnue',
        'debug' => [
            'action_received' => $action,
            'action_type' => gettype($action),
            'method' => $method,
            'get_params' => $_GET
        ]
    ], JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur serveur: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}

?>

