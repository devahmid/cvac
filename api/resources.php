<?php
require_once 'config.php';

try {
    $pdo = getDB();
    
    // Récupérer les paramètres de la requête
    $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
    $category = isset($_GET['category']) ? sanitize($_GET['category']) : null;
    $year = isset($_GET['year']) ? (int)$_GET['year'] : null;
    $search = isset($_GET['search']) ? sanitize($_GET['search']) : null;
    $download = isset($_GET['download']) && $_GET['download'] == '1';
    $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
    $limit = isset($_GET['limit']) ? min(100, max(1, (int)$_GET['limit'])) : 20;
    $offset = ($page - 1) * $limit;
    
    // Si un ID est fourni avec download, servir le fichier
    if ($id && $download) {
        $stmt = $pdo->prepare("SELECT * FROM resources WHERE id = ?");
        $stmt->execute([$id]);
        $resource = $stmt->fetch();
        
        if (!$resource) {
            http_response_code(404);
            echo json_encode(['error' => 'Ressource non trouvée'], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        $filePath = $resource['file_path'];
        
        // Vérifier que le fichier existe
        if (!file_exists($filePath)) {
            http_response_code(404);
            echo json_encode(['error' => 'Fichier non trouvé'], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        // Incrémenter le compteur de téléchargements
        $updateStmt = $pdo->prepare("UPDATE resources SET download_count = download_count + 1 WHERE id = ?");
        $updateStmt->execute([$id]);
        
        // Servir le fichier
        header('Content-Type: application/pdf');
        header('Content-Disposition: attachment; filename="' . basename($filePath) . '"');
        header('Content-Length: ' . filesize($filePath));
        readfile($filePath);
        exit();
    }
    
    // Si un ID est fourni sans download, retourner les détails
    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM resources WHERE id = ?");
        $stmt->execute([$id]);
        $resource = $stmt->fetch();
        
        if (!$resource) {
            http_response_code(404);
            echo json_encode(['error' => 'Ressource non trouvée'], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        echo json_encode($resource, JSON_UNESCAPED_UNICODE);
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
        $where[] = "year = ?";
        $params[] = $year;
    }
    
    if ($search) {
        $where[] = "(title LIKE ? OR description LIKE ?)";
        $searchParam = "%{$search}%";
        $params[] = $searchParam;
        $params[] = $searchParam;
    }
    
    $whereClause = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";
    
    // Compter le total pour la pagination
    $countStmt = $pdo->prepare("SELECT COUNT(*) as total FROM resources {$whereClause}");
    $countStmt->execute($params);
    $total = $countStmt->fetch()['total'];
    $totalPages = ceil($total / $limit);
    
    // Récupérer les ressources avec pagination
    $stmt = $pdo->prepare("SELECT * FROM resources {$whereClause} ORDER BY year DESC, created_at DESC LIMIT ? OFFSET ?");
    foreach ($params as $i => $param) {
        $stmt->bindValue($i + 1, $param);
    }
    $stmt->bindValue(count($params) + 1, $limit, PDO::PARAM_INT);
    $stmt->bindValue(count($params) + 2, $offset, PDO::PARAM_INT);
    $stmt->execute();
    $resources = $stmt->fetchAll();
    
    // Si pas de données en base, retourner des données de démo
    if (empty($resources)) {
        $resources = [
            [
                'id' => 1,
                'title' => 'Règlement de fonctionnement',
                'description' => 'Version 2024 du règlement de fonctionnement du CVAC',
                'file_path' => '/uploads/documents/reglement-2024.pdf',
                'file_size' => 870400,
                'file_type' => 'application/pdf',
                'category' => 'officiels',
                'year' => 2024,
                'download_count' => 45
            ],
            [
                'id' => 2,
                'title' => 'Délibération du Conseil Municipal',
                'description' => 'Délibération du 22 mai 2024 concernant le CVAC',
                'file_path' => '/uploads/documents/deliberation-2024.pdf',
                'file_size' => 1258291,
                'file_type' => 'application/pdf',
                'category' => 'officiels',
                'year' => 2024,
                'download_count' => 32
            ],
            [
                'id' => 3,
                'title' => 'Charte des valeurs',
                'description' => 'Charte officielle des valeurs du CVAC',
                'file_path' => '/uploads/documents/charte-valeurs.pdf',
                'file_size' => 665600,
                'file_type' => 'application/pdf',
                'category' => 'officiels',
                'year' => 2024,
                'download_count' => 28
            ],
            [
                'id' => 4,
                'title' => 'Assemblée Générale 2024',
                'description' => 'Compte rendu de l\'assemblée générale du 15 novembre 2024',
                'file_path' => '/uploads/documents/ag-2024-11-15.pdf',
                'file_size' => 1153434,
                'file_type' => 'application/pdf',
                'category' => 'comptes_rendus',
                'year' => 2024,
                'download_count' => 67
            ],
            [
                'id' => 5,
                'title' => 'Bilan d\'activité 2024',
                'description' => 'Rapport annuel d\'activité du CVAC pour l\'année 2024',
                'file_path' => '/uploads/documents/bilan-2024.pdf',
                'file_size' => 2202009,
                'file_type' => 'application/pdf',
                'category' => 'bilans',
                'year' => 2024,
                'download_count' => 89
            ],
            [
                'id' => 6,
                'title' => 'Guide de candidature projets',
                'description' => 'Guide pratique pour proposer un projet inter-associatif',
                'file_path' => '/uploads/documents/guide-candidature.pdf',
                'file_size' => 943718,
                'file_type' => 'application/pdf',
                'category' => 'guides',
                'year' => 2024,
                'download_count' => 123
            ]
        ];
        $total = count($resources);
        $totalPages = 1;
    }
    
    // Retourner avec pagination
    echo json_encode([
        'success' => true,
        'data' => $resources,
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'total_pages' => $totalPages
        ]
    ], JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de la récupération des ressources'], JSON_UNESCAPED_UNICODE);
}

?>

