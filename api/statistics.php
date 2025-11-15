<?php
require_once 'config.php';

try {
    $pdo = getDB();
    
    // Récupérer toutes les statistiques actives
    $stmt = $pdo->query("SELECT * FROM statistics WHERE is_active = 1 ORDER BY display_order ASC");
    $stats = $stmt->fetchAll();
    
    // Si pas de données, retourner des statistiques calculées depuis les autres tables
    if (empty($stats)) {
        // Compter les associations
        $stmtAssoc = $pdo->query("SELECT COUNT(*) as count FROM associations");
        $assocCount = $stmtAssoc->fetch()['count'] ?: 200;
        
        // Compter les projets
        $stmtProjects = $pdo->query("SELECT COUNT(*) as count FROM projects");
        $projectCount = $stmtProjects->fetch()['count'] ?: 15;
        
        // Compter les membres
        $stmtMembers = $pdo->query("SELECT COUNT(*) as count FROM members");
        $memberCount = $stmtMembers->fetch()['count'] ?: 10;
        
        $stats = [
            [
                'key_name' => 'associations_count',
                'label' => 'Associations',
                'value' => $assocCount . '+',
                'icon' => 'users',
                'display_order' => 1
            ],
            [
                'key_name' => 'domains_count',
                'label' => 'Domaines',
                'value' => '15',
                'icon' => 'tags',
                'display_order' => 2
            ],
            [
                'key_name' => 'volunteers_count',
                'label' => 'Bénévoles',
                'value' => '5000+',
                'icon' => 'hands-helping',
                'display_order' => 3
            ],
            [
                'key_name' => 'projects_supported',
                'label' => 'Projets Soutenus',
                'value' => (string)$projectCount,
                'icon' => 'project-diagram',
                'display_order' => 4
            ]
        ];
    }
    
    echo json_encode([
        'success' => true,
        'data' => $stats
    ], JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de la récupération des statistiques'], JSON_UNESCAPED_UNICODE);
}

?>

