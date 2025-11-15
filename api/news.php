<?php
require_once 'config.php';

try {
    $pdo = getDB();
    
    // Récupérer les paramètres de la requête
    $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
    $category = isset($_GET['category']) ? sanitize($_GET['category']) : null;
    $year = isset($_GET['year']) ? (int)$_GET['year'] : null;
    $search = isset($_GET['search']) ? sanitize($_GET['search']) : null;
    $incrementViews = isset($_GET['increment_views']) && $_GET['increment_views'] == '1';
    $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
    $limit = isset($_GET['limit']) ? min(100, max(1, (int)$_GET['limit'])) : 20;
    $offset = ($page - 1) * $limit;
    
    // Si un ID est fourni, retourner une seule actualité
    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM news WHERE id = ?");
        $stmt->execute([$id]);
        $newsItem = $stmt->fetch();
        
        if (!$newsItem) {
            http_response_code(404);
            echo json_encode(['error' => 'Actualité non trouvée'], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        // Incrémenter les vues si demandé
        if ($incrementViews) {
            $updateStmt = $pdo->prepare("UPDATE news SET views = views + 1 WHERE id = ?");
            $updateStmt->execute([$id]);
            $newsItem['views'] = $newsItem['views'] + 1;
        }
        
        echo json_encode($newsItem, JSON_UNESCAPED_UNICODE);
        exit();
    }
    
    // Construire la requête avec filtres
    $where = [];
    $params = [];
    
    if ($category) {
        $where[] = "category = ?";
        $params[] = $category;
    }
    
    if ($year) {
        $where[] = "YEAR(date) = ?";
        $params[] = $year;
    }
    
    if ($search) {
        $where[] = "(title LIKE ? OR content LIKE ? OR excerpt LIKE ?)";
        $searchParam = "%{$search}%";
        $params[] = $searchParam;
        $params[] = $searchParam;
        $params[] = $searchParam;
    }
    
    $whereClause = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";
    
    // Compter le total pour la pagination
    $countStmt = $pdo->prepare("SELECT COUNT(*) as total FROM news {$whereClause}");
    $countStmt->execute($params);
    $total = $countStmt->fetch()['total'];
    $totalPages = ceil($total / $limit);
    
    // Récupérer les actualités avec pagination
    $stmt = $pdo->prepare("SELECT * FROM news {$whereClause} ORDER BY date DESC, created_at DESC LIMIT ? OFFSET ?");
    foreach ($params as $i => $param) {
        $stmt->bindValue($i + 1, $param);
    }
    $stmt->bindValue(count($params) + 1, $limit, PDO::PARAM_INT);
    $stmt->bindValue(count($params) + 2, $offset, PDO::PARAM_INT);
    $stmt->execute();
    $news = $stmt->fetchAll();
    
    // Si pas de données en base, retourner des données de démo
    if (empty($news)) {
        $news = [
            [
                'id' => 1,
                'title' => 'Réunion plénière du CVAC',
                'date' => '2024-11-15',
                'category' => 'Réunion plénière',
                'content' => 'Retour sur notre dernière assemblée générale et les projets votés pour 2025.',
                'excerpt' => 'Retour sur notre dernière assemblée générale...',
                'image' => 'https://storage.googleapis.com/uxpilot-auth.appspot.com/f5aaa8b9f7-58cc20fbc6dd3a2b17c1.png',
                'views' => 245
            ],
            [
                'id' => 2,
                'title' => 'Festival Inter-Associatif',
                'date' => '2024-11-08',
                'category' => 'Événement',
                'content' => 'Un événement réussi qui a rassemblé plus de 20 associations choisyennes.',
                'excerpt' => 'Un événement réussi qui a rassemblé...',
                'image' => 'https://storage.googleapis.com/uxpilot-auth.appspot.com/dc3454a2a6-e9d3dff6ab27c509f9f8.png',
                'views' => 189
            ],
            [
                'id' => 3,
                'title' => 'Nouveau projet jeunesse',
                'date' => '2024-11-01',
                'category' => 'Projet',
                'content' => 'Lancement d\'un projet collaboratif entre 5 associations pour l\'engagement citoyen.',
                'excerpt' => 'Lancement d\'un projet collaboratif...',
                'image' => 'https://storage.googleapis.com/uxpilot-auth.appspot.com/6497433179-2191d204900d7b3c33ff.png',
                'views' => 156
            ]
        ];
        $total = count($news);
        $totalPages = 1;
    }
    
    // Vérifier si on veut un format simple (compatibilité avec ancien frontend)
    $format = isset($_GET['format']) ? $_GET['format'] : 'full';
    
    if ($format === 'simple') {
        // Retourner directement le tableau pour compatibilité
        echo json_encode($news, JSON_UNESCAPED_UNICODE);
    } else {
        // Retourner avec pagination
        echo json_encode([
            'success' => true,
            'data' => $news,
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
    echo json_encode(['error' => 'Erreur lors de la récupération des actualités'], JSON_UNESCAPED_UNICODE);
}

?>

