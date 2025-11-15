<?php
require_once 'config.php';

try {
    $pdo = getDB();
    
    // Récupérer toutes les valeurs actives
    $stmt = $pdo->query("SELECT * FROM values WHERE is_active = 1 ORDER BY display_order ASC");
    $values = $stmt->fetchAll();
    
    // Si pas de données, retourner des valeurs par défaut
    if (empty($values)) {
        $values = [
            [
                'id' => 1,
                'title' => 'Laïcité',
                'description' => 'Garantir la neutralité et le respect de toutes les convictions dans un cadre républicain',
                'icon' => 'balance-scale',
                'display_order' => 1
            ],
            [
                'id' => 2,
                'title' => 'Respect',
                'description' => 'Cultiver l\'écoute mutuelle et la bienveillance dans tous nos échanges',
                'icon' => 'heart',
                'display_order' => 2
            ],
            [
                'id' => 3,
                'title' => 'Solidarité',
                'description' => 'Favoriser l\'entraide collective et le soutien mutuel entre associations',
                'icon' => 'hands-helping',
                'display_order' => 3
            ],
            [
                'id' => 4,
                'title' => 'Inclusivité',
                'description' => 'Assurer l\'ouverture à tous sans discrimination et favoriser la participation de chacun',
                'icon' => 'users-line',
                'display_order' => 4
            ]
        ];
    }
    
    echo json_encode([
        'success' => true,
        'data' => $values
    ], JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de la récupération des valeurs'], JSON_UNESCAPED_UNICODE);
}

?>

