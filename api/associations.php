<?php
require_once 'config.php';

try {
    $pdo = getDB();
    $method = $_SERVER['REQUEST_METHOD'];
    
    // Fonction pour vérifier l'authentification (optionnelle pour POST/PUT)
    function getAuthToken() {
        $headers = getallheaders();
        if (isset($headers['Authorization'])) {
            return str_replace('Bearer ', '', $headers['Authorization']);
        }
        return null;
    }
    
    // ============================================
    // GET - Récupérer les associations
    // ============================================
    if ($method === 'GET') {
        $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
        $domain = isset($_GET['domain']) ? sanitize($_GET['domain']) : null;
        $category = isset($_GET['category']) ? sanitize($_GET['category']) : null;
        $public = isset($_GET['public']) ? filter_var($_GET['public'], FILTER_VALIDATE_BOOLEAN) : null;
        $search = isset($_GET['search']) ? sanitize($_GET['search']) : null;
        $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
        $limit = isset($_GET['limit']) ? min(100, max(1, (int)$_GET['limit'])) : 20;
        $offset = ($page - 1) * $limit;
        
        // Si un ID est fourni, retourner une seule association
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM associations WHERE id = ?");
            $stmt->execute([$id]);
            $association = $stmt->fetch();
            
            if (!$association) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'error' => 'Association non trouvée'
                ], JSON_UNESCAPED_UNICODE);
                exit();
            }
            
            // Retourner au format attendu par le frontend
            echo json_encode([
                'success' => true,
                'data' => $association
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        // Construire la requête avec filtres
        $where = [];
        $params = [];
        
        // Filtre par domaine (compatibilité)
        if ($domain) {
            $where[] = "(domain = ? OR category = ?)";
            $params[] = $domain;
            $params[] = $domain;
        }
        
        // Filtre par catégorie
        if ($category) {
            $where[] = "category = ?";
            $params[] = $category;
        }
        
        // Filtre par visibilité publique
        if ($public !== null) {
            $where[] = "is_public = ?";
            $params[] = $public ? 1 : 0;
        }
        
        // Par défaut, montrer uniquement les associations approuvées
        // Les associations rejetées (rejected) et en attente (pending) ne sont pas affichées
        // Note: Si le champ status n'existe pas encore, on accepte toutes les associations publiques
        if (!isset($_GET['include_pending'])) {
            // Vérifier si la colonne status existe dans la table
            try {
                $checkStmt = $pdo->query("SHOW COLUMNS FROM associations LIKE 'status'");
                if ($checkStmt->rowCount() > 0) {
                    // La colonne existe, filtrer pour n'afficher que les associations approuvées
                    // On affiche les associations approuvées et celles sans statut (NULL) pour compatibilité avec les anciennes données
                    $where[] = "(status = 'approved' OR status IS NULL)";
                }
                // Si la colonne n'existe pas, on ne filtre pas par statut
            } catch (Exception $e) {
                // En cas d'erreur, on ne filtre pas par statut
                // Cela permet de fonctionner même si la colonne status n'existe pas encore
            }
        }
        
        // Recherche
        if ($search) {
            $where[] = "(name LIKE ? OR description LIKE ? OR city LIKE ? OR activities LIKE ?)";
            $searchParam = "%{$search}%";
            $params[] = $searchParam;
            $params[] = $searchParam;
            $params[] = $searchParam;
            $params[] = $searchParam;
        }
        
        $whereClause = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";
        
        // Compter le total pour la pagination
        $countStmt = $pdo->prepare("SELECT COUNT(*) as total FROM associations {$whereClause}");
        $countStmt->execute($params);
        $total = $countStmt->fetch()['total'];
        $totalPages = ceil($total / $limit);
        
        // Récupérer les associations avec pagination
        $stmt = $pdo->prepare("SELECT * FROM associations {$whereClause} ORDER BY name ASC LIMIT ? OFFSET ?");
        foreach ($params as $i => $param) {
            $stmt->bindValue($i + 1, $param);
        }
        $stmt->bindValue(count($params) + 1, $limit, PDO::PARAM_INT);
        $stmt->bindValue(count($params) + 2, $offset, PDO::PARAM_INT);
        $stmt->execute();
        $associations = $stmt->fetchAll();
        
        // Retourner avec pagination
        echo json_encode([
            'success' => true,
            'data' => $associations,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'total_pages' => $totalPages
            ]
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }
    
    // ============================================
    // POST - Créer une nouvelle association
    // ============================================
    if ($method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validation des données requises
        if (empty($data['name']) || empty($data['description']) || empty($data['email']) || empty($data['city'])) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Les champs name, description, email et city sont requis'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        // Préparer les données
        $name = sanitize($data['name']);
        $description = sanitize($data['description']);
        $email = sanitize($data['email']);
        $city = sanitize($data['city']);
        $phone = isset($data['phone']) ? sanitize($data['phone']) : null;
        $website = isset($data['website']) ? sanitize($data['website']) : null;
        $address = isset($data['address']) ? sanitize($data['address']) : null;
        $postalCode = isset($data['postalCode']) ? sanitize($data['postalCode']) : null;
        $logo = isset($data['logo']) ? sanitize($data['logo']) : null;
        $coverImage = isset($data['coverImage']) ? sanitize($data['coverImage']) : null;
        $category = isset($data['category']) ? sanitize($data['category']) : null;
        $activities = isset($data['activities']) ? sanitize($data['activities']) : null;
        $president = isset($data['president']) ? sanitize($data['president']) : null;
        $foundingYear = isset($data['foundingYear']) ? (int)$data['foundingYear'] : null;
        $numberOfMembers = isset($data['numberOfMembers']) ? (int)$data['numberOfMembers'] : null;
        $isPublic = isset($data['isPublic']) ? (bool)$data['isPublic'] : true;
        
        // Vérifier si la colonne status existe dans la table
        $hasStatusColumn = false;
        try {
            $checkStmt = $pdo->query("SHOW COLUMNS FROM associations LIKE 'status'");
            $hasStatusColumn = $checkStmt->rowCount() > 0;
        } catch (Exception $e) {
            // Si erreur, on assume que la colonne n'existe pas
            $hasStatusColumn = false;
        }
        
        // Par défaut, les nouvelles associations sont en attente de validation
        $status = 'pending';
        
        // Utiliser category pour domain aussi (compatibilité)
        $domain = $category;
        
        // Construire la requête INSERT dynamiquement selon les colonnes disponibles
        if ($hasStatusColumn) {
            // Insérer en base de données avec status
            $stmt = $pdo->prepare("
                INSERT INTO associations (
                    name, description, email, city, phone, website, address, postal_code,
                    logo, cover_image, category, activities, president, founding_year,
                    number_of_members, is_public, domain, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            
            $stmt->execute([
                $name, $description, $email, $city, $phone, $website, $address, $postalCode,
                $logo, $coverImage, $category, $activities, $president, $foundingYear,
                $numberOfMembers, $isPublic ? 1 : 0, $domain, $status
            ]);
        } else {
            // Insérer en base de données sans status (colonne n'existe pas encore)
            $stmt = $pdo->prepare("
                INSERT INTO associations (
                    name, description, email, city, phone, website, address, postal_code,
                    logo, cover_image, category, activities, president, founding_year,
                    number_of_members, is_public, domain
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            
            $stmt->execute([
                $name, $description, $email, $city, $phone, $website, $address, $postalCode,
                $logo, $coverImage, $category, $activities, $president, $foundingYear,
                $numberOfMembers, $isPublic ? 1 : 0, $domain
            ]);
        }
        
        $newId = $pdo->lastInsertId();
        
        // Récupérer l'association créée
        $stmt = $pdo->prepare("SELECT * FROM associations WHERE id = ?");
        $stmt->execute([$newId]);
        $association = $stmt->fetch();
        
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Association créée avec succès',
            'data' => $association
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }
    
    // ============================================
    // PUT - Mettre à jour une association
    // ============================================
    if ($method === 'PUT') {
        $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'ID de l\'association requis'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        // Vérifier l'authentification
        $token = getAuthToken();
        if (!$token) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'error' => 'Authentification requise'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        // Vérifier le token et récupérer l'utilisateur
        // Fonction verifyToken locale (copiée de auth.php pour éviter les dépendances circulaires)
        function verifyTokenLocal($token) {
            global $pdo;
            if (!$token) return null;
            
            $stmt = $pdo->prepare("SELECT * FROM users WHERE token = ? AND (token_expires_at IS NULL OR token_expires_at > NOW())");
            $stmt->execute([$token]);
            $user = $stmt->fetch();
            
            return $user ? $user : null;
        }
        
        $user = verifyTokenLocal($token);
        if (!$user) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'error' => 'Token invalide ou expiré'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        // Vérifier que l'association existe et que l'utilisateur en est le propriétaire
        $stmt = $pdo->prepare("SELECT id FROM associations WHERE id = ?");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'error' => 'Association non trouvée'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        // Vérifier que l'utilisateur est bien le propriétaire de l'association
        if ($user['association_id'] != $id) {
            http_response_code(403);
            echo json_encode([
                'success' => false,
                'error' => 'Vous n\'êtes pas autorisé à modifier cette association'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Construire la requête de mise à jour dynamiquement
        $updateFields = [];
        $updateParams = [];
        
        $fields = [
            'name', 'description', 'email', 'city', 'phone', 'website', 'address',
            'postal_code', 'logo', 'cover_image', 'category', 'activities',
            'president', 'founding_year', 'number_of_members', 'is_public'
        ];
        
        foreach ($fields as $field) {
            $camelField = str_replace('_', '', ucwords($field, '_'));
            $camelField[0] = strtolower($camelField[0]);
            
            // Gérer les cas spéciaux
            if ($field === 'postal_code') $camelField = 'postalCode';
            if ($field === 'cover_image') $camelField = 'coverImage';
            if ($field === 'founding_year') $camelField = 'foundingYear';
            if ($field === 'number_of_members') $camelField = 'numberOfMembers';
            if ($field === 'is_public') $camelField = 'isPublic';
            
            if (isset($data[$camelField])) {
                $updateFields[] = "{$field} = ?";
                if ($field === 'is_public') {
                    $updateParams[] = $data[$camelField] ? 1 : 0;
                } elseif (in_array($field, ['founding_year', 'number_of_members'])) {
                    // Gérer les valeurs null pour les nombres
                    $updateParams[] = $data[$camelField] !== null ? (int)$data[$camelField] : null;
                } else {
                    // Gérer les valeurs null pour les chaînes
                    $updateParams[] = $data[$camelField] !== null ? sanitize($data[$camelField]) : null;
                }
            }
        }
        
        // Mettre à jour domain aussi si category est modifiée (si la colonne existe)
        if (isset($data['category'])) {
            // Vérifier si la colonne domain existe
            $hasDomainColumn = false;
            try {
                $checkStmt = $pdo->query("SHOW COLUMNS FROM associations LIKE 'domain'");
                $hasDomainColumn = $checkStmt->rowCount() > 0;
            } catch (Exception $e) {
                $hasDomainColumn = false;
            }
            
            if ($hasDomainColumn) {
                $updateFields[] = "domain = ?";
                $updateParams[] = sanitize($data['category']);
            }
        }
        
        if (empty($updateFields)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Aucune donnée à mettre à jour'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        $updateParams[] = $id;
        $updateQuery = "UPDATE associations SET " . implode(", ", $updateFields) . " WHERE id = ?";
        
        try {
            $stmt = $pdo->prepare($updateQuery);
            $stmt->execute($updateParams);
            
            // Récupérer l'association mise à jour
            $stmt = $pdo->prepare("SELECT * FROM associations WHERE id = ?");
            $stmt->execute([$id]);
            $association = $stmt->fetch();
            
            echo json_encode([
                'success' => true,
                'message' => 'Association mise à jour avec succès',
                'data' => $association
            ], JSON_UNESCAPED_UNICODE);
            exit();
        } catch (PDOException $e) {
            http_response_code(500);
            error_log("Erreur UPDATE association: " . $e->getMessage());
            error_log("Requête: " . $updateQuery);
            error_log("Paramètres: " . print_r($updateParams, true));
            echo json_encode([
                'success' => false,
                'error' => 'Erreur lors de la mise à jour de l\'association'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
    }
    
    // ============================================
    // DELETE - Supprimer une association
    // ============================================
    if ($method === 'DELETE') {
        $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'ID de l\'association requis'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        // Vérifier l'authentification
        $token = getAuthToken();
        if (!$token) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'error' => 'Authentification requise'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        // Vérifier le token et récupérer l'utilisateur
        function verifyTokenLocal($token) {
            global $pdo;
            if (!$token) return null;
            
            $stmt = $pdo->prepare("SELECT * FROM users WHERE token = ? AND (token_expires_at IS NULL OR token_expires_at > NOW())");
            $stmt->execute([$token]);
            $user = $stmt->fetch();
            
            return $user ? $user : null;
        }
        
        $user = verifyTokenLocal($token);
        if (!$user) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'error' => 'Token invalide ou expiré'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        // Vérifier que l'association existe et que l'utilisateur en est le propriétaire
        $stmt = $pdo->prepare("SELECT id FROM associations WHERE id = ?");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'error' => 'Association non trouvée'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        // Vérifier que l'utilisateur est bien le propriétaire de l'association
        if ($user['association_id'] != $id) {
            http_response_code(403);
            echo json_encode([
                'success' => false,
                'error' => 'Vous n\'êtes pas autorisé à supprimer cette association'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        try {
            // Supprimer l'association
            $stmt = $pdo->prepare("DELETE FROM associations WHERE id = ?");
            $stmt->execute([$id]);
            
            // Retirer l'association_id des utilisateurs qui étaient liés à cette association
            $stmt = $pdo->prepare("UPDATE users SET association_id = NULL WHERE association_id = ?");
            $stmt->execute([$id]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Association supprimée avec succès'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        } catch (PDOException $e) {
            http_response_code(500);
            error_log("Erreur DELETE association: " . $e->getMessage());
            echo json_encode([
                'success' => false,
                'error' => 'Erreur lors de la suppression de l\'association'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
    }
    
    // Méthode non supportée
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Méthode non supportée'
    ], JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erreur lors du traitement de la requête: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}

?>
