<?php
require_once 'config.php';

try {
    $pdo = getDB();
    
    // Récupérer les paramètres de la requête
    $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
    $domain = isset($_GET['domain']) ? sanitize($_GET['domain']) : null;
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
            echo json_encode(['error' => 'Association non trouvée'], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        echo json_encode($association, JSON_UNESCAPED_UNICODE);
        exit();
    }
    
    // Construire la requête avec filtres
    $where = [];
    $params = [];
    
    if ($domain) {
        $where[] = "domain = ?";
        $params[] = $domain;
    }
    
    if ($search) {
        $where[] = "(name LIKE ? OR description LIKE ?)";
        $searchParam = "%{$search}%";
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
    
    // Si pas de données en base, retourner des données de démo
    if (empty($associations)) {
        $associations = [
            [
                'id' => 1,
                'name' => 'Club Sportif Choisyen',
                'description' => 'Association sportive proposant football, basketball et activités jeunesse depuis plus de 30 ans.',
                'domain' => 'Sport',
                'website' => 'https://club-sportif-choisy.fr',
                'email' => 'contact@club-sportif-choisy.fr',
                'phone' => '01 23 45 67 89',
                'address' => 'Stade Municipal, Choisy-le-Roi',
                'logo' => 'https://storage.googleapis.com/uxpilot-auth.appspot.com/51f433a722-a5bf64e66efdef647281.png'
            ],
            [
                'id' => 2,
                'name' => 'Théâtre en Mouvement',
                'description' => 'Compagnie théâtrale amateur proposant cours et spectacles pour tous les âges.',
                'domain' => 'Culture',
                'website' => 'https://theatre-mouvement.fr',
                'email' => 'contact@theatre-mouvement.fr',
                'phone' => '01 23 45 67 90',
                'address' => 'Centre Culturel, Choisy-le-Roi',
                'logo' => 'https://storage.googleapis.com/uxpilot-auth.appspot.com/dd3ef5c866-954182f8460f518eb38b.png'
            ],
            [
                'id' => 3,
                'name' => 'Solidarité Choisyenne',
                'description' => 'Association d\'aide aux personnes en difficulté et de soutien aux familles.',
                'domain' => 'Solidarité',
                'website' => 'https://solidarite-choisy.fr',
                'email' => 'contact@solidarite-choisy.fr',
                'phone' => '01 23 45 67 91',
                'address' => 'Maison des Associations, Choisy-le-Roi',
                'logo' => 'https://storage.googleapis.com/uxpilot-auth.appspot.com/39939d80fb-3bd3e4a45adbdb1eab13.png'
            ]
        ];
        $total = count($associations);
        $totalPages = 1;
    }
    
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
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de la récupération des associations'], JSON_UNESCAPED_UNICODE);
}

?>

