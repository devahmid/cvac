<?php
require_once 'config.php';

try {
    $pdo = getDB();
    $method = $_SERVER['REQUEST_METHOD'];
    $action = isset($_GET['action']) ? sanitize($_GET['action']) : null;
    
    // Fonction pour vérifier l'authentification admin
    function getAuthToken() {
        $headers = getallheaders();
        if (isset($headers['Authorization'])) {
            return str_replace('Bearer ', '', $headers['Authorization']);
        }
        return null;
    }
    
    function verifyAdminToken($token) {
        global $pdo;
        if (!$token) return null;
        
        $stmt = $pdo->prepare("SELECT * FROM users WHERE token = ? AND role = 'admin' AND (token_expires_at IS NULL OR token_expires_at > NOW())");
        $stmt->execute([$token]);
        $user = $stmt->fetch();
        
        return $user ? $user : null;
    }
    
    function requireAdmin() {
        $token = getAuthToken();
        $admin = verifyAdminToken($token);
        
        if (!$admin) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Accès administrateur requis'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        return $admin;
    }
    
    // Fonction pour logger les actions admin
    function logAdminAction($adminId, $action, $entityType, $entityId = null, $details = null) {
        global $pdo;
        try {
            // Vérifier si la table existe
            $checkTable = $pdo->query("SHOW TABLES LIKE 'admin_logs'");
            if ($checkTable->rowCount() > 0) {
                $ipAddress = $_SERVER['REMOTE_ADDR'] ?? null;
                $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? null;
                
                $stmt = $pdo->prepare("
                    INSERT INTO admin_logs (admin_id, action, entity_type, entity_id, details, ip_address, user_agent)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                ");
                $stmt->execute([$adminId, $action, $entityType, $entityId, $details, $ipAddress, $userAgent]);
            }
        } catch (Exception $e) {
            // Ignorer les erreurs de log pour ne pas bloquer les actions
            error_log("Erreur log admin: " . $e->getMessage());
        }
    }
    
    // ============================================
    // GET - Récupérer les données à valider
    // ============================================
    if ($method === 'GET') {
        $admin = requireAdmin();
        
        if ($action === 'pending-associations') {
            // Vérifier si la colonne status existe
            $hasStatusColumn = false;
            try {
                $checkStmt = $pdo->query("SHOW COLUMNS FROM associations LIKE 'status'");
                $hasStatusColumn = $checkStmt->rowCount() > 0;
            } catch (Exception $e) {
                $hasStatusColumn = false;
            }
            
            // Récupérer les associations en attente de validation
            if ($hasStatusColumn) {
                $stmt = $pdo->prepare("
                    SELECT a.*, u.email as creator_email, u.firstname as creator_firstname, u.lastname as creator_lastname
                    FROM associations a
                    LEFT JOIN users u ON u.association_id = a.id
                    WHERE a.status = 'pending'
                    ORDER BY a.created_at DESC
                ");
            } else {
                // Si la colonne n'existe pas, retourner un tableau vide
                $stmt = $pdo->prepare("
                    SELECT a.*, u.email as creator_email, u.firstname as creator_firstname, u.lastname as creator_lastname
                    FROM associations a
                    LEFT JOIN users u ON u.association_id = a.id
                    WHERE 1 = 0
                ");
            }
            $stmt->execute();
            $associations = $stmt->fetchAll();
            
            echo json_encode([
                'success' => true,
                'data' => $associations
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        if ($action === 'pending-users') {
            // Vérifier si la colonne status existe
            $hasStatusColumn = false;
            try {
                $checkStmt = $pdo->query("SHOW COLUMNS FROM users LIKE 'status'");
                $hasStatusColumn = $checkStmt->rowCount() > 0;
            } catch (Exception $e) {
                $hasStatusColumn = false;
            }
            
            // Récupérer les utilisateurs en attente de validation
            if ($hasStatusColumn) {
                $stmt = $pdo->prepare("
                    SELECT u.*, a.name as association_name
                    FROM users u
                    LEFT JOIN associations a ON a.id = u.association_id
                    WHERE u.status = 'pending'
                    ORDER BY u.created_at DESC
                ");
            } else {
                // Si la colonne n'existe pas, retourner un tableau vide
                $stmt = $pdo->prepare("
                    SELECT u.*, a.name as association_name
                    FROM users u
                    LEFT JOIN associations a ON a.id = u.association_id
                    WHERE 1 = 0
                ");
            }
            $stmt->execute();
            $users = $stmt->fetchAll();
            
            echo json_encode([
                'success' => true,
                'data' => $users
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        if ($action === 'all-associations') {
            // Récupérer toutes les associations avec leurs créateurs
            $stmt = $pdo->prepare("
                SELECT a.*, u.email as creator_email, u.firstname as creator_firstname, u.lastname as creator_lastname
                FROM associations a
                LEFT JOIN users u ON u.association_id = a.id
                ORDER BY a.created_at DESC
            ");
            $stmt->execute();
            $associations = $stmt->fetchAll();
            
            echo json_encode([
                'success' => true,
                'data' => $associations
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        if ($action === 'all-users') {
            // Récupérer tous les utilisateurs avec leur association
            $stmt = $pdo->prepare("
                SELECT u.*, a.name as association_name
                FROM users u
                LEFT JOIN associations a ON a.id = u.association_id
                ORDER BY u.created_at DESC
            ");
            $stmt->execute();
            $users = $stmt->fetchAll();
            
            echo json_encode([
                'success' => true,
                'data' => $users
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        if ($action === 'stats') {
            // Statistiques pour le dashboard admin
            $stats = [];
            
            // Vérifier si les colonnes status existent
            $hasAssociationsStatusColumn = false;
            $hasUsersStatusColumn = false;
            try {
                $checkStmt = $pdo->query("SHOW COLUMNS FROM associations LIKE 'status'");
                $hasAssociationsStatusColumn = $checkStmt->rowCount() > 0;
            } catch (Exception $e) {
                $hasAssociationsStatusColumn = false;
            }
            
            try {
                $checkStmt = $pdo->query("SHOW COLUMNS FROM users LIKE 'status'");
                $hasUsersStatusColumn = $checkStmt->rowCount() > 0;
            } catch (Exception $e) {
                $hasUsersStatusColumn = false;
            }
            
            // Associations en attente
            if ($hasAssociationsStatusColumn) {
                $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM associations WHERE status = 'pending'");
                $stmt->execute();
                $stats['pending_associations'] = (int)$stmt->fetch()['count'];
            } else {
                $stats['pending_associations'] = 0;
            }
            
            // Utilisateurs en attente
            if ($hasUsersStatusColumn) {
                $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM users WHERE status = 'pending'");
                $stmt->execute();
                $stats['pending_users'] = (int)$stmt->fetch()['count'];
            } else {
                $stats['pending_users'] = 0;
            }
            
            // Total associations
            $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM associations");
            $stmt->execute();
            $stats['total_associations'] = (int)$stmt->fetch()['count'];
            
            // Total utilisateurs
            $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM users");
            $stmt->execute();
            $stats['total_users'] = (int)$stmt->fetch()['count'];
            
            echo json_encode([
                'success' => true,
                'data' => $stats
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        if ($action === 'admin-logs') {
            $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
            $limit = isset($_GET['limit']) ? min(100, max(1, (int)$_GET['limit'])) : 50;
            $offset = ($page - 1) * $limit;
            
            try {
                $checkTable = $pdo->query("SHOW TABLES LIKE 'admin_logs'");
                if ($checkTable->rowCount() > 0) {
                    $stmt = $pdo->prepare("
                        SELECT al.*, u.firstname, u.lastname, u.email
                        FROM admin_logs al
                        LEFT JOIN users u ON u.id = al.admin_id
                        ORDER BY al.created_at DESC
                        LIMIT ? OFFSET ?
                    ");
                    $stmt->bindValue(1, $limit, PDO::PARAM_INT);
                    $stmt->bindValue(2, $offset, PDO::PARAM_INT);
                    $stmt->execute();
                    $logs = $stmt->fetchAll();
                    
                    $countStmt = $pdo->prepare("SELECT COUNT(*) as total FROM admin_logs");
                    $countStmt->execute();
                    $total = $countStmt->fetch()['total'];
                    
                    echo json_encode([
                        'success' => true,
                        'data' => $logs,
                        'pagination' => [
                            'page' => $page,
                            'limit' => $limit,
                            'total' => $total,
                            'total_pages' => ceil($total / $limit)
                        ]
                    ], JSON_UNESCAPED_UNICODE);
                } else {
                    echo json_encode([
                        'success' => true,
                        'data' => [],
                        'pagination' => ['page' => 1, 'limit' => $limit, 'total' => 0, 'total_pages' => 0]
                    ], JSON_UNESCAPED_UNICODE);
                }
            } catch (Exception $e) {
                echo json_encode([
                    'success' => true,
                    'data' => [],
                    'pagination' => ['page' => 1, 'limit' => $limit, 'total' => 0, 'total_pages' => 0]
                ], JSON_UNESCAPED_UNICODE);
            }
            exit();
        }
        
        if ($action === 'advanced-stats') {
            $stats = [];
            
            // Statistiques utilisateurs
            $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM users");
            $stmt->execute();
            $stats['total_users'] = (int)$stmt->fetch()['total'];
            
            $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM users WHERE role = 'admin'");
            $stmt->execute();
            $stats['admin_users'] = (int)$stmt->fetch()['total'];
            
            // Statistiques par statut utilisateur
            try {
                $checkStmt = $pdo->query("SHOW COLUMNS FROM users LIKE 'status'");
                if ($checkStmt->rowCount() > 0) {
                    $stmt = $pdo->prepare("SELECT status, COUNT(*) as count FROM users GROUP BY status");
                    $stmt->execute();
                    $stats['users_by_status'] = $stmt->fetchAll();
                }
            } catch (Exception $e) {}
            
            // Statistiques associations
            $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM associations");
            $stmt->execute();
            $stats['total_associations'] = (int)$stmt->fetch()['total'];
            
            // Statistiques par statut association
            try {
                $checkStmt = $pdo->query("SHOW COLUMNS FROM associations LIKE 'status'");
                if ($checkStmt->rowCount() > 0) {
                    $stmt = $pdo->prepare("SELECT status, COUNT(*) as count FROM associations GROUP BY status");
                    $stmt->execute();
                    $stats['associations_by_status'] = $stmt->fetchAll();
                }
            } catch (Exception $e) {}
            
            // Statistiques par catégorie
            $stmt = $pdo->prepare("SELECT category, COUNT(*) as count FROM associations WHERE category IS NOT NULL GROUP BY category ORDER BY count DESC");
            $stmt->execute();
            $stats['associations_by_category'] = $stmt->fetchAll();
            
            // Inscriptions par mois (12 derniers mois)
            $stmt = $pdo->prepare("
                SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count
                FROM users
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
                GROUP BY month
                ORDER BY month ASC
            ");
            $stmt->execute();
            $stats['users_by_month'] = $stmt->fetchAll();
            
            // Associations créées par mois
            $stmt = $pdo->prepare("
                SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count
                FROM associations
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
                GROUP BY month
                ORDER BY month ASC
            ");
            $stmt->execute();
            $stats['associations_by_month'] = $stmt->fetchAll();
            
            // Actualités
            try {
                $checkTable = $pdo->query("SHOW TABLES LIKE 'news'");
                if ($checkTable->rowCount() > 0) {
                    $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM news");
                    $stmt->execute();
                    $stats['total_news'] = (int)$stmt->fetch()['total'];
                    
                    try {
                        $checkStmt = $pdo->query("SHOW COLUMNS FROM news LIKE 'status'");
                        if ($checkStmt->rowCount() > 0) {
                            $stmt = $pdo->prepare("SELECT status, COUNT(*) as count FROM news GROUP BY status");
                            $stmt->execute();
                            $stats['news_by_status'] = $stmt->fetchAll();
                        }
                    } catch (Exception $e) {}
                }
            } catch (Exception $e) {}
            
            echo json_encode([
                'success' => true,
                'data' => $stats
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        if ($action === 'pending-news') {
            try {
                $checkTable = $pdo->query("SHOW TABLES LIKE 'news'");
                if ($checkTable->rowCount() > 0) {
                    $checkStmt = $pdo->query("SHOW COLUMNS FROM news LIKE 'status'");
                    if ($checkStmt->rowCount() > 0) {
                        $stmt = $pdo->prepare("
                            SELECT n.*, u.firstname, u.lastname, u.email as author_email
                            FROM news n
                            LEFT JOIN users u ON u.id = n.author_id
                            WHERE n.status = 'pending'
                            ORDER BY n.created_at DESC
                        ");
                    } else {
                        $stmt = $pdo->prepare("
                            SELECT n.*, u.firstname, u.lastname, u.email as author_email
                            FROM news n
                            LEFT JOIN users u ON u.id = n.author_id
                            WHERE 1 = 0
                        ");
                    }
                    $stmt->execute();
                    $news = $stmt->fetchAll();
                } else {
                    $news = [];
                }
            } catch (Exception $e) {
                $news = [];
            }
            
            echo json_encode([
                'success' => true,
                'data' => $news
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        if ($action === 'all-news') {
            try {
                $checkTable = $pdo->query("SHOW TABLES LIKE 'news'");
                if ($checkTable->rowCount() > 0) {
                    $stmt = $pdo->prepare("
                        SELECT n.*, u.firstname, u.lastname, u.email as author_email
                        FROM news n
                        LEFT JOIN users u ON u.id = n.author_id
                        ORDER BY n.created_at DESC
                    ");
                    $stmt->execute();
                    $news = $stmt->fetchAll();
                } else {
                    $news = [];
                }
            } catch (Exception $e) {
                $news = [];
            }
            
            echo json_encode([
                'success' => true,
                'data' => $news
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        if ($action === 'email-templates') {
            try {
                $checkTable = $pdo->query("SHOW TABLES LIKE 'email_templates'");
                if ($checkTable->rowCount() > 0) {
                    $stmt = $pdo->prepare("SELECT * FROM email_templates ORDER BY name ASC");
                    $stmt->execute();
                    $templates = $stmt->fetchAll();
                } else {
                    $templates = [];
                }
            } catch (Exception $e) {
                $templates = [];
            }
            
            echo json_encode([
                'success' => true,
                'data' => $templates
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        if ($action === 'email-history') {
            $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
            $limit = isset($_GET['limit']) ? min(100, max(1, (int)$_GET['limit'])) : 20;
            $offset = ($page - 1) * $limit;
            
            try {
                $checkTable = $pdo->query("SHOW TABLES LIKE 'email_history'");
                if ($checkTable->rowCount() > 0) {
                    $stmt = $pdo->prepare("
                        SELECT eh.*, u.firstname, u.lastname, et.name as template_name
                        FROM email_history eh
                        LEFT JOIN users u ON u.id = eh.admin_id
                        LEFT JOIN email_templates et ON et.id = eh.template_id
                        ORDER BY eh.created_at DESC
                        LIMIT ? OFFSET ?
                    ");
                    $stmt->bindValue(1, $limit, PDO::PARAM_INT);
                    $stmt->bindValue(2, $offset, PDO::PARAM_INT);
                    $stmt->execute();
                    $history = $stmt->fetchAll();
                    
                    $countStmt = $pdo->prepare("SELECT COUNT(*) as total FROM email_history");
                    $countStmt->execute();
                    $total = $countStmt->fetch()['total'];
                    
                    echo json_encode([
                        'success' => true,
                        'data' => $history,
                        'pagination' => [
                            'page' => $page,
                            'limit' => $limit,
                            'total' => $total,
                            'total_pages' => ceil($total / $limit)
                        ]
                    ], JSON_UNESCAPED_UNICODE);
                } else {
                    echo json_encode([
                        'success' => true,
                        'data' => [],
                        'pagination' => ['page' => 1, 'limit' => $limit, 'total' => 0, 'total_pages' => 0]
                    ], JSON_UNESCAPED_UNICODE);
                }
            } catch (Exception $e) {
                echo json_encode([
                    'success' => true,
                    'data' => [],
                    'pagination' => ['page' => 1, 'limit' => $limit, 'total' => 0, 'total_pages' => 0]
                ], JSON_UNESCAPED_UNICODE);
            }
            exit();
        }
        
        // Si aucune action GET n'a été reconnue
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Action non reconnue'
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }
    
    // ============================================
    // POST - Valider/Rejeter
    // ============================================
    if ($method === 'POST') {
        $admin = requireAdmin();
        $data = json_decode(file_get_contents('php://input'), true);
        
        if ($action === 'validate-association') {
            $associationId = isset($data['id']) ? (int)$data['id'] : null;
            $approved = isset($data['approved']) ? (bool)$data['approved'] : true;
            $reason = isset($data['reason']) ? sanitize($data['reason']) : null;
            
            if (!$associationId) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'ID de l\'association requis'
                ], JSON_UNESCAPED_UNICODE);
                exit();
            }
            
            // Vérifier si la colonne status existe
            $hasStatusColumn = false;
            try {
                $checkStmt = $pdo->query("SHOW COLUMNS FROM associations LIKE 'status'");
                $hasStatusColumn = $checkStmt->rowCount() > 0;
            } catch (Exception $e) {
                $hasStatusColumn = false;
            }
            
            if ($hasStatusColumn) {
                $status = $approved ? 'approved' : 'rejected';
                
                // Vérifier si les autres colonnes existent
                $hasValidatedColumns = false;
                try {
                    $checkStmt = $pdo->query("SHOW COLUMNS FROM associations LIKE 'validated_at'");
                    $hasValidatedColumns = $checkStmt->rowCount() > 0;
                } catch (Exception $e) {
                    $hasValidatedColumns = false;
                }
                
                if ($hasValidatedColumns) {
                    $stmt = $pdo->prepare("
                        UPDATE associations 
                        SET status = ?, validated_at = NOW(), validated_by = ?, rejection_reason = ?
                        WHERE id = ?
                    ");
                    $stmt->execute([$status, $admin['id'], $reason, $associationId]);
                } else {
                    // Si les colonnes de validation n'existent pas, mettre à jour seulement le status
                    $stmt = $pdo->prepare("UPDATE associations SET status = ? WHERE id = ?");
                    $stmt->execute([$status, $associationId]);
                }
            }
            
            // Si approuvée, la rendre publique par défaut
            if ($approved) {
                $stmt = $pdo->prepare("UPDATE associations SET is_public = 1 WHERE id = ?");
                $stmt->execute([$associationId]);
            }
            
            logAdminAction($admin['id'], $approved ? 'validate' : 'reject', 'association', $associationId, $reason);
            
            echo json_encode([
                'success' => true,
                'message' => $approved ? 'Association validée avec succès' : 'Association rejetée'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        if ($action === 'validate-user') {
            $userId = isset($data['id']) ? (int)$data['id'] : null;
            $approved = isset($data['approved']) ? (bool)$data['approved'] : true;
            $reason = isset($data['reason']) ? sanitize($data['reason']) : null;
            
            if (!$userId) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'ID de l\'utilisateur requis'
                ], JSON_UNESCAPED_UNICODE);
                exit();
            }
            
            // Vérifier si la colonne status existe
            $hasStatusColumn = false;
            try {
                $checkStmt = $pdo->query("SHOW COLUMNS FROM users LIKE 'status'");
                $hasStatusColumn = $checkStmt->rowCount() > 0;
            } catch (Exception $e) {
                $hasStatusColumn = false;
            }
            
            if ($hasStatusColumn) {
                $status = $approved ? 'active' : 'rejected';
                
                // Vérifier si les autres colonnes existent
                $hasValidatedColumns = false;
                try {
                    $checkStmt = $pdo->query("SHOW COLUMNS FROM users LIKE 'validated_at'");
                    $hasValidatedColumns = $checkStmt->rowCount() > 0;
                } catch (Exception $e) {
                    $hasValidatedColumns = false;
                }
                
                if ($hasValidatedColumns) {
                    $stmt = $pdo->prepare("
                        UPDATE users 
                        SET status = ?, validated_at = NOW(), validated_by = ?, rejection_reason = ?
                        WHERE id = ?
                    ");
                    $stmt->execute([$status, $admin['id'], $reason, $userId]);
                } else {
                    // Si les colonnes de validation n'existent pas, mettre à jour seulement le status
                    $stmt = $pdo->prepare("UPDATE users SET status = ? WHERE id = ?");
                    $stmt->execute([$status, $userId]);
                }
            }
            
            logAdminAction($admin['id'], $approved ? 'validate' : 'reject', 'user', $userId, $reason);
            
            echo json_encode([
                'success' => true,
                'message' => $approved ? 'Utilisateur validé avec succès' : 'Utilisateur rejeté'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        if ($action === 'update-association-status') {
            $associationId = isset($data['id']) ? (int)$data['id'] : null;
            $status = isset($data['status']) ? sanitize($data['status']) : null;
            
            if (!$associationId || !$status) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'ID et statut requis'
                ], JSON_UNESCAPED_UNICODE);
                exit();
            }
            
            // Vérifier que le statut est valide
            if (!in_array($status, ['pending', 'approved', 'rejected'])) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Statut invalide'
                ], JSON_UNESCAPED_UNICODE);
                exit();
            }
            
            // Vérifier si la colonne status existe
            $hasStatusColumn = false;
            try {
                $checkStmt = $pdo->query("SHOW COLUMNS FROM associations LIKE 'status'");
                $hasStatusColumn = $checkStmt->rowCount() > 0;
            } catch (Exception $e) {
                $hasStatusColumn = false;
            }
            
            if ($hasStatusColumn) {
                $updateFields = ["status = ?", "validated_at = NOW()", "validated_by = ?"];
                $updateParams = [$status, $admin['id']];
                
                // Vérifier si la colonne rejection_reason existe
                try {
                    $checkReasonStmt = $pdo->query("SHOW COLUMNS FROM associations LIKE 'rejection_reason'");
                    if ($checkReasonStmt->rowCount() > 0 && isset($data['reason'])) {
                        $updateFields[] = "rejection_reason = ?";
                        $updateParams[] = sanitize($data['reason']);
                    }
                } catch (Exception $e) { /* ignore */ }
                
                $updateParams[] = $associationId;
                
                $stmt = $pdo->prepare("
                    UPDATE associations 
                    SET " . implode(", ", $updateFields) . "
                    WHERE id = ?
                ");
                $stmt->execute($updateParams);
            }
            
            logAdminAction($admin['id'], 'update_status', 'association', $associationId, "Nouveau statut: {$status}");
            
            echo json_encode([
                'success' => true,
                'message' => 'Statut de l\'association mis à jour avec succès'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        if ($action === 'delete-association') {
            $associationId = isset($data['id']) ? (int)$data['id'] : null;
            
            if (!$associationId) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'ID de l\'association requis'
                ], JSON_UNESCAPED_UNICODE);
                exit();
            }
            
            try {
                // Retirer l'association_id des utilisateurs qui étaient liés à cette association
                $stmt = $pdo->prepare("UPDATE users SET association_id = NULL WHERE association_id = ?");
                $stmt->execute([$associationId]);
                
                // Supprimer l'association
                $stmt = $pdo->prepare("DELETE FROM associations WHERE id = ?");
                $stmt->execute([$associationId]);
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Association supprimée avec succès'
                ], JSON_UNESCAPED_UNICODE);
                exit();
            } catch (PDOException $e) {
                http_response_code(500);
                error_log("Erreur DELETE association admin: " . $e->getMessage());
                echo json_encode([
                    'success' => false,
                    'message' => 'Erreur lors de la suppression de l\'association'
                ], JSON_UNESCAPED_UNICODE);
                exit();
            }
        }
        
        if ($action === 'update-user-role') {
            $userId = isset($data['id']) ? (int)$data['id'] : null;
            $role = isset($data['role']) ? sanitize($data['role']) : null;
            
            if (!$userId || !$role) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'ID et rôle requis'
                ], JSON_UNESCAPED_UNICODE);
                exit();
            }
            
            // Vérifier que le rôle est valide
            if (!in_array($role, ['user', 'admin'])) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Rôle invalide'
                ], JSON_UNESCAPED_UNICODE);
                exit();
            }
            
            // Empêcher de retirer le dernier admin
            if ($role === 'user') {
                $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM users WHERE role = 'admin' AND id != ?");
                $stmt->execute([$userId]);
                $adminCount = $stmt->fetch()['count'];
                
                if ($adminCount < 1) {
                    http_response_code(400);
                    echo json_encode([
                        'success' => false,
                        'message' => 'Impossible de retirer le dernier administrateur'
                    ], JSON_UNESCAPED_UNICODE);
                    exit();
                }
            }
            
            $stmt = $pdo->prepare("UPDATE users SET role = ? WHERE id = ?");
            $stmt->execute([$role, $userId]);
            
            logAdminAction($admin['id'], 'update_role', 'user', $userId, "Nouveau rôle: {$role}");
            
            echo json_encode([
                'success' => true,
                'message' => 'Rôle de l\'utilisateur mis à jour avec succès'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        if ($action === 'delete-user') {
            $userId = isset($data['id']) ? (int)$data['id'] : null;
            
            if (!$userId) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'ID de l\'utilisateur requis'
                ], JSON_UNESCAPED_UNICODE);
                exit();
            }
            
            // Empêcher de supprimer le dernier admin
            $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
            $stmt->execute([$userId]);
            $user = $stmt->fetch();
            
            if ($user && $user['role'] === 'admin') {
                $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM users WHERE role = 'admin'");
                $stmt->execute();
                $adminCount = $stmt->fetch()['count'];
                
                if ($adminCount <= 1) {
                    http_response_code(400);
                    echo json_encode([
                        'success' => false,
                        'message' => 'Impossible de supprimer le dernier administrateur'
                    ], JSON_UNESCAPED_UNICODE);
                    exit();
                }
            }
            
            try {
                // Retirer l'association_id si l'utilisateur en avait une
                $stmt = $pdo->prepare("UPDATE users SET association_id = NULL WHERE id = ?");
                $stmt->execute([$userId]);
                
                // Supprimer l'utilisateur
                $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
                $stmt->execute([$userId]);
                
                logAdminAction($admin['id'], 'delete', 'user', $userId);
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Utilisateur supprimé avec succès'
                ], JSON_UNESCAPED_UNICODE);
                exit();
            } catch (PDOException $e) {
                http_response_code(500);
                error_log("Erreur DELETE user admin: " . $e->getMessage());
                echo json_encode([
                    'success' => false,
                    'message' => 'Erreur lors de la suppression de l\'utilisateur'
                ], JSON_UNESCAPED_UNICODE);
                exit();
            }
        }
        
        if ($action === 'send-email-to-users') {
            require_once 'email_config.php';
            
            $recipients = isset($data['recipients']) ? $data['recipients'] : [];
            $subject = isset($data['subject']) ? sanitize($data['subject']) : '';
            $message = isset($data['message']) ? $data['message'] : '';
            
            if (empty($recipients) || empty($subject) || empty($message)) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Destinataires, sujet et message requis'
                ], JSON_UNESCAPED_UNICODE);
                exit();
            }
            
            $sent = 0;
            $failed = 0;
            $errors = [];
            
            foreach ($recipients as $userId) {
                $userId = (int)$userId;
                $stmt = $pdo->prepare("SELECT email, firstname, lastname FROM users WHERE id = ?");
                $stmt->execute([$userId]);
                $user = $stmt->fetch();
                
                if ($user) {
                    // Personnaliser le message avec le prénom de l'utilisateur
                    $personalizedMessage = "Bonjour " . htmlspecialchars($user['firstname']) . ",\n\n";
                    $personalizedMessage .= $message;
                    $personalizedMessage .= "\n\nCordialement,\nL'équipe CVAC - Conseil de la Vie Associative";
                    
                    $mailSent = sendEmailViaSMTP($user['email'], $subject, $personalizedMessage);
                    
                    if ($mailSent) {
                        $sent++;
                    } else {
                        $failed++;
                        $errors[] = $user['email'];
                    }
                }
            }
            
            logAdminAction($admin['id'], 'send_email', 'users', null, "Envoyé à {$sent} utilisateurs");
            
            echo json_encode([
                'success' => true,
                'message' => "Emails envoyés : {$sent} réussis, {$failed} échoués",
                'sent' => $sent,
                'failed' => $failed,
                'errors' => $errors
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        if ($action === 'export-users-csv') {
            $stmt = $pdo->prepare("
                SELECT u.id, u.firstname, u.lastname, u.email, u.role, u.status, u.created_at, a.name as association_name
                FROM users u
                LEFT JOIN associations a ON a.id = u.association_id
                ORDER BY u.created_at DESC
            ");
            $stmt->execute();
            $users = $stmt->fetchAll();
            
            header('Content-Type: text/csv; charset=utf-8');
            header('Content-Disposition: attachment; filename="utilisateurs_' . date('Y-m-d') . '.csv"');
            
            $output = fopen('php://output', 'w');
            
            // BOM UTF-8 pour Excel
            fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));
            
            // En-têtes
            fputcsv($output, ['ID', 'Prénom', 'Nom', 'Email', 'Rôle', 'Statut', 'Association', 'Date d\'inscription'], ';');
            
            // Données
            foreach ($users as $user) {
                fputcsv($output, [
                    $user['id'],
                    $user['firstname'],
                    $user['lastname'],
                    $user['email'],
                    $user['role'] ?? 'user',
                    $user['status'] ?? 'pending',
                    $user['association_name'] ?? '',
                    $user['created_at']
                ], ';');
            }
            
            fclose($output);
            logAdminAction($admin['id'], 'export', 'users', null, 'Export CSV utilisateurs');
            exit();
        }
        
        if ($action === 'export-associations-csv') {
            $stmt = $pdo->prepare("
                SELECT a.*, u.email as creator_email, u.firstname as creator_firstname, u.lastname as creator_lastname
                FROM associations a
                LEFT JOIN users u ON u.association_id = a.id
                ORDER BY a.created_at DESC
            ");
            $stmt->execute();
            $associations = $stmt->fetchAll();
            
            header('Content-Type: text/csv; charset=utf-8');
            header('Content-Disposition: attachment; filename="associations_' . date('Y-m-d') . '.csv"');
            
            $output = fopen('php://output', 'w');
            
            // BOM UTF-8 pour Excel
            fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));
            
            // En-têtes
            fputcsv($output, ['ID', 'Nom', 'Description', 'Email', 'Téléphone', 'Ville', 'Catégorie', 'Statut', 'Créateur', 'Date création'], ';');
            
            // Données
            foreach ($associations as $asso) {
                fputcsv($output, [
                    $asso['id'],
                    $asso['name'],
                    mb_substr(strip_tags($asso['description'] ?? ''), 0, 100),
                    $asso['email'],
                    $asso['phone'] ?? '',
                    $asso['city'],
                    $asso['category'] ?? '',
                    $asso['status'] ?? 'pending',
                    ($asso['creator_firstname'] ?? '') . ' ' . ($asso['creator_lastname'] ?? ''),
                    $asso['created_at']
                ], ';');
            }
            
            fclose($output);
            logAdminAction($admin['id'], 'export', 'associations', null, 'Export CSV associations');
            exit();
        }
        
        if ($action === 'validate-news' || $action === 'reject-news') {
            $newsId = isset($data['id']) ? (int)$data['id'] : null;
            $approved = $action === 'validate-news';
            $reason = isset($data['reason']) ? sanitize($data['reason']) : null;
            
            if (!$newsId) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'ID de l\'actualité requis'
                ], JSON_UNESCAPED_UNICODE);
                exit();
            }
            
            try {
                $checkTable = $pdo->query("SHOW TABLES LIKE 'news'");
                if ($checkTable->rowCount() > 0) {
                    $checkStmt = $pdo->query("SHOW COLUMNS FROM news LIKE 'status'");
                    if ($checkStmt->rowCount() > 0) {
                        $status = $approved ? 'published' : 'rejected';
                        
                        $updateFields = ["status = ?", "validated_at = NOW()", "validated_by = ?"];
                        $updateParams = [$status, $admin['id']];
                        
                        try {
                            $checkReasonStmt = $pdo->query("SHOW COLUMNS FROM news LIKE 'rejection_reason'");
                            if ($checkReasonStmt->rowCount() > 0 && $reason) {
                                $updateFields[] = "rejection_reason = ?";
                                $updateParams[] = $reason;
                            }
                        } catch (Exception $e) {}
                        
                        $updateParams[] = $newsId;
                        
                        $stmt = $pdo->prepare("
                            UPDATE news 
                            SET " . implode(", ", $updateFields) . "
                            WHERE id = ?
                        ");
                        $stmt->execute($updateParams);
                        
                        logAdminAction($admin['id'], $approved ? 'validate' : 'reject', 'news', $newsId, $reason);
                    }
                }
            } catch (Exception $e) {
                error_log("Erreur validation actualité: " . $e->getMessage());
            }
            
            echo json_encode([
                'success' => true,
                'message' => $approved ? 'Actualité validée avec succès' : 'Actualité rejetée'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        if ($action === 'delete-news') {
            $newsId = isset($data['id']) ? (int)$data['id'] : null;
            
            if (!$newsId) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'ID de l\'actualité requis'
                ], JSON_UNESCAPED_UNICODE);
                exit();
            }
            
            try {
                $checkTable = $pdo->query("SHOW TABLES LIKE 'news'");
                if ($checkTable->rowCount() > 0) {
                    $stmt = $pdo->prepare("DELETE FROM news WHERE id = ?");
                    $stmt->execute([$newsId]);
                    
                    logAdminAction($admin['id'], 'delete', 'news', $newsId);
                }
            } catch (Exception $e) {
                error_log("Erreur suppression actualité: " . $e->getMessage());
            }
            
            echo json_encode([
                'success' => true,
                'message' => 'Actualité supprimée avec succès'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        if ($action === 'save-email-template') {
            $templateId = isset($data['id']) ? (int)$data['id'] : null;
            $name = isset($data['name']) ? sanitize($data['name']) : '';
            $subject = isset($data['subject']) ? sanitize($data['subject']) : '';
            $body = isset($data['body']) ? $data['body'] : '';
            $variables = isset($data['variables']) ? sanitize($data['variables']) : '';
            
            if (empty($name) || empty($subject) || empty($body)) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Nom, sujet et corps du template requis'
                ], JSON_UNESCAPED_UNICODE);
                exit();
            }
            
            try {
                $checkTable = $pdo->query("SHOW TABLES LIKE 'email_templates'");
                if ($checkTable->rowCount() > 0) {
                    if ($templateId) {
                        $stmt = $pdo->prepare("
                            UPDATE email_templates 
                            SET name = ?, subject = ?, body = ?, variables = ?
                            WHERE id = ?
                        ");
                        $stmt->execute([$name, $subject, $body, $variables, $templateId]);
                    } else {
                        $stmt = $pdo->prepare("
                            INSERT INTO email_templates (name, subject, body, variables)
                            VALUES (?, ?, ?, ?)
                        ");
                        $stmt->execute([$name, $subject, $body, $variables]);
                        $templateId = $pdo->lastInsertId();
                    }
                    
                    logAdminAction($admin['id'], $templateId ? 'update' : 'create', 'email_template', $templateId);
                }
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Erreur lors de la sauvegarde du template'
                ], JSON_UNESCAPED_UNICODE);
                exit();
            }
            
            echo json_encode([
                'success' => true,
                'message' => 'Template sauvegardé avec succès',
                'data' => ['id' => $templateId]
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        if ($action === 'delete-email-template') {
            $templateId = isset($data['id']) ? (int)$data['id'] : null;
            
            if (!$templateId) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'ID du template requis'
                ], JSON_UNESCAPED_UNICODE);
                exit();
            }
            
            try {
                $checkTable = $pdo->query("SHOW TABLES LIKE 'email_templates'");
                if ($checkTable->rowCount() > 0) {
                    $stmt = $pdo->prepare("DELETE FROM email_templates WHERE id = ?");
                    $stmt->execute([$templateId]);
                    
                    logAdminAction($admin['id'], 'delete', 'email_template', $templateId);
                }
            } catch (Exception $e) {
                error_log("Erreur suppression template: " . $e->getMessage());
            }
            
            echo json_encode([
                'success' => true,
                'message' => 'Template supprimé avec succès'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Action non reconnue'
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }
    
    // Méthode non supportée
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Méthode non supportée'
    ], JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur serveur: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}

?>

