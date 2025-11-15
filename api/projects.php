<?php
require_once 'config.php';

try {
    $pdo = getDB();
    
    // Récupérer les paramètres de la requête
    $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
    $status = isset($_GET['status']) ? sanitize($_GET['status']) : null;
    $year = isset($_GET['year']) ? (int)$_GET['year'] : null;
    $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
    $limit = isset($_GET['limit']) ? min(100, max(1, (int)$_GET['limit'])) : 20;
    $offset = ($page - 1) * $limit;
    
    // Si un ID est fourni, retourner un seul projet avec ses associations
    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM projects WHERE id = ?");
        $stmt->execute([$id]);
        $project = $stmt->fetch();
        
        if (!$project) {
            http_response_code(404);
            echo json_encode(['error' => 'Projet non trouvé'], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        // Récupérer les associations liées au projet
        $stmtAssoc = $pdo->prepare("
            SELECT a.*, pa.role as project_role 
            FROM associations a
            INNER JOIN project_associations pa ON a.id = pa.association_id
            WHERE pa.project_id = ?
        ");
        $stmtAssoc->execute([$id]);
        $project['associations'] = $stmtAssoc->fetchAll();
        
        echo json_encode($project, JSON_UNESCAPED_UNICODE);
        exit();
    }
    
    // Construire la requête avec filtres
    $where = [];
    $params = [];
    
    if ($status) {
        $where[] = "status = ?";
        $params[] = $status;
    }
    
    if ($year) {
        $where[] = "(YEAR(start_date) = ? OR YEAR(end_date) = ?)";
        $params[] = $year;
        $params[] = $year;
    }
    
    $whereClause = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";
    
    // Compter le total pour la pagination
    $countStmt = $pdo->prepare("SELECT COUNT(*) as total FROM projects {$whereClause}");
    $countStmt->execute($params);
    $total = $countStmt->fetch()['total'];
    $totalPages = ceil($total / $limit);
    
    // Récupérer les projets avec pagination
    $stmt = $pdo->prepare("SELECT * FROM projects {$whereClause} ORDER BY start_date DESC, created_at DESC LIMIT ? OFFSET ?");
    foreach ($params as $i => $param) {
        $stmt->bindValue($i + 1, $param);
    }
    $stmt->bindValue(count($params) + 1, $limit, PDO::PARAM_INT);
    $stmt->bindValue(count($params) + 2, $offset, PDO::PARAM_INT);
    $stmt->execute();
    $projects = $stmt->fetchAll();
    
    // Pour chaque projet, récupérer les associations associées
    foreach ($projects as &$project) {
        $stmtAssoc = $pdo->prepare("
            SELECT a.id, a.name, a.domain, pa.role as project_role 
            FROM associations a
            INNER JOIN project_associations pa ON a.id = pa.association_id
            WHERE pa.project_id = ?
        ");
        $stmtAssoc->execute([$project['id']]);
        $project['associations'] = $stmtAssoc->fetchAll();
    }
    
    // Si pas de données en base, retourner des données de démo
    if (empty($projects)) {
        $projects = [
            [
                'id' => 1,
                'title' => 'Festival Culturel Inter-Générationnel',
                'description' => 'Un événement rassemblant toutes les générations autour d\'activités culturelles diversifiées : concerts, ateliers créatifs, spectacles de danse et expositions.',
                'content' => 'Détails complets du festival...',
                'image' => 'https://storage.googleapis.com/uxpilot-auth.appspot.com/ba501b29d2-ba969dcbac525f20193a.png',
                'status' => 'terminé',
                'start_date' => '2024-10-01',
                'end_date' => '2024-10-15',
                'location' => 'Parc Municipal',
                'budget' => null,
                'public_target' => 'Tous âges',
                'participants_count' => 800,
                'associations' => [
                    ['id' => 2, 'name' => 'Théâtre en Mouvement', 'domain' => 'Culture', 'project_role' => 'Organisateur'],
                    ['id' => 1, 'name' => 'Club Sportif Choisyen', 'domain' => 'Sport', 'project_role' => 'Partenaire']
                ]
            ],
            [
                'id' => 2,
                'title' => 'Choisy Verte & Solidaire',
                'description' => 'Projet alliant protection de l\'environnement et solidarité, avec des actions de nettoyage, de sensibilisation et d\'aide aux familles en difficulté.',
                'content' => 'Détails du projet environnemental...',
                'image' => 'https://storage.googleapis.com/uxpilot-auth.appspot.com/4f3d3f70f9-6c08a3312f2f96f5b08d.png',
                'status' => 'en_cours',
                'start_date' => '2024-10-01',
                'end_date' => '2025-03-31',
                'location' => 'Quartiers de Choisy',
                'budget' => null,
                'public_target' => 'Familles et bénévoles',
                'participants_count' => 150,
                'associations' => [
                    ['id' => 3, 'name' => 'Solidarité Choisyenne', 'domain' => 'Solidarité', 'project_role' => 'Coordinateur']
                ]
            ],
            [
                'id' => 3,
                'title' => 'Numérique pour Tous',
                'description' => 'Formation aux outils numériques pour réduire la fracture digitale, avec un focus sur les seniors.',
                'content' => 'Détails des formations...',
                'image' => 'https://storage.googleapis.com/uxpilot-auth.appspot.com/cbdc0647c4-f2277dc5a467727db3e5.png',
                'status' => 'en_cours',
                'start_date' => '2024-09-01',
                'end_date' => '2025-06-30',
                'location' => 'Centre Social',
                'budget' => null,
                'public_target' => 'Seniors',
                'participants_count' => 120,
                'associations' => []
            ]
        ];
        $total = count($projects);
        $totalPages = 1;
    }
    
    // Retourner avec pagination
    echo json_encode([
        'success' => true,
        'data' => $projects,
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'total_pages' => $totalPages
        ]
    ], JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de la récupération des projets'], JSON_UNESCAPED_UNICODE);
}

?>

