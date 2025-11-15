<?php
require_once 'config.php';

try {
    $pdo = getDB();
    
    // Récupérer les paramètres de la requête
    $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
    $role = isset($_GET['role']) ? sanitize($_GET['role']) : null;
    $sort = isset($_GET['sort']) ? sanitize($_GET['sort']) : 'role_order';
    $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
    $limit = isset($_GET['limit']) ? min(100, max(1, (int)$_GET['limit'])) : 50;
    $offset = ($page - 1) * $limit;
    
    // Validation du tri
    $allowedSorts = ['name', 'role', 'association', 'role_order'];
    if (!in_array($sort, $allowedSorts)) {
        $sort = 'role_order';
    }
    
    // Si un ID est fourni, retourner un seul membre
    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM members WHERE id = ?");
        $stmt->execute([$id]);
        $member = $stmt->fetch();
        
        if (!$member) {
            http_response_code(404);
            echo json_encode(['error' => 'Membre non trouvé'], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        echo json_encode($member, JSON_UNESCAPED_UNICODE);
        exit();
    }
    
    // Construire la requête avec filtres
    $where = [];
    $params = [];
    
    if ($role) {
        $where[] = "role = ?";
        $params[] = $role;
    }
    
    $whereClause = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";
    
    // Déterminer l'ordre de tri
    $orderBy = "ORDER BY ";
    if ($sort === 'name') {
        $orderBy .= "name ASC";
    } elseif ($sort === 'role') {
        $orderBy .= "role ASC, name ASC";
    } elseif ($sort === 'association') {
        $orderBy .= "association ASC, name ASC";
    } else {
        $orderBy .= "role_order ASC, name ASC";
    }
    
    // Compter le total pour la pagination
    $countStmt = $pdo->prepare("SELECT COUNT(*) as total FROM members {$whereClause}");
    $countStmt->execute($params);
    $total = $countStmt->fetch()['total'];
    $totalPages = ceil($total / $limit);
    
    // Récupérer les membres avec pagination
    $stmt = $pdo->prepare("SELECT * FROM members {$whereClause} {$orderBy} LIMIT ? OFFSET ?");
    foreach ($params as $i => $param) {
        $stmt->bindValue($i + 1, $param);
    }
    $stmt->bindValue(count($params) + 1, $limit, PDO::PARAM_INT);
    $stmt->bindValue(count($params) + 2, $offset, PDO::PARAM_INT);
    $stmt->execute();
    $members = $stmt->fetchAll();
    
    // Si pas de données en base, retourner les membres réels du CVAC (ordre : femmes d'abord)
    if (empty($members)) {
        $members = [
            [
                'id' => 1,
                'name' => 'Ahlem ZENATI',
                'role' => 'Présidente',
                'association' => 'Les Fleurs des Navigateurs',
                'description' => 'Présidente du CVAC, représentante de l\'association Les Fleurs des Navigateurs.',
                'avatar' => 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg',
                'role_order' => 1
            ],
            [
                'id' => 2,
                'name' => 'Michèle COUDERC',
                'role' => 'Membre',
                'association' => 'Choisy ta coop',
                'description' => 'Membre du CVAC, représentante de l\'association Choisy ta coop.',
                'avatar' => 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg',
                'role_order' => 2
            ],
            [
                'id' => 3,
                'name' => 'Josette LEVÊQUE',
                'role' => 'Membre',
                'association' => 'Danses et loisirs',
                'description' => 'Membre du CVAC, représentante de l\'association Danses et loisirs.',
                'avatar' => 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-7.jpg',
                'role_order' => 3
            ],
            [
                'id' => 4,
                'name' => 'Rachel PRIEST',
                'role' => 'Membre',
                'association' => 'Sla Formations',
                'description' => 'Membre du CVAC, représentante de l\'association Sla Formations.',
                'avatar' => 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg',
                'role_order' => 4
            ],
            [
                'id' => 5,
                'name' => 'Yvonne ZODO',
                'role' => 'Membre',
                'association' => 'Société Régionale des Beaux-Arts',
                'description' => 'Membre du CVAC, représentante de la Société Régionale des Beaux-Arts.',
                'avatar' => 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg',
                'role_order' => 5
            ],
            [
                'id' => 6,
                'name' => 'Eric DIOR',
                'role' => 'Vice-président',
                'association' => 'On sème pour la ville',
                'description' => 'Vice-président du CVAC, représentant de l\'association On sème pour la ville.',
                'avatar' => 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg',
                'role_order' => 6
            ],
            [
                'id' => 7,
                'name' => 'Ahmid AIT OUALI',
                'role' => 'Membre',
                'association' => 'Les Résidents des Hautes Bornes',
                'description' => 'Membre du CVAC, représentant de l\'association Les Résidents des Hautes Bornes.',
                'avatar' => 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg',
                'role_order' => 7
            ],
            [
                'id' => 8,
                'name' => 'Azedine ARIF',
                'role' => 'Membre',
                'association' => 'Association d\'Éducation Créative à l\'Environnement',
                'description' => 'Membre du CVAC, représentant de l\'Association d\'Éducation Créative à l\'Environnement.',
                'avatar' => 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg',
                'role_order' => 8
            ],
            [
                'id' => 9,
                'name' => 'Serge LECLERC',
                'role' => 'Membre',
                'association' => 'Association Sociale de Réinsertion par le Logement',
                'description' => 'Membre du CVAC, représentant de l\'Association Sociale de Réinsertion par le Logement.',
                'avatar' => 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg',
                'role_order' => 9
            ],
            [
                'id' => 10,
                'name' => 'Noham SETTBON',
                'role' => 'Membre',
                'association' => 'La Santé à Choisy',
                'description' => 'Membre du CVAC, représentant de l\'association La Santé à Choisy.',
                'avatar' => 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg',
                'role_order' => 10
            ]
        ];
        $total = count($members);
        $totalPages = 1;
    }
    
    // Vérifier si on veut un format simple (compatibilité avec ancien frontend)
    $format = isset($_GET['format']) ? $_GET['format'] : 'full';
    
    if ($format === 'simple') {
        // Retourner directement le tableau pour compatibilité
        echo json_encode($members, JSON_UNESCAPED_UNICODE);
    } else {
        // Retourner avec pagination
        echo json_encode([
            'success' => true,
            'data' => $members,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'total_pages' => $totalPages
            ]
        ], JSON_UNESCAPED_UNICODE);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de la récupération des membres'], JSON_UNESCAPED_UNICODE);
}

?>

