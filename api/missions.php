<?php
require_once 'config.php';

try {
    $pdo = getDB();
    
    // Récupérer toutes les missions actives
    $stmt = $pdo->query("SELECT * FROM missions WHERE is_active = 1 ORDER BY display_order ASC");
    $missions = $stmt->fetchAll();
    
    // Si pas de données, retourner des missions par défaut
    if (empty($missions)) {
        $missions = [
            [
                'id' => 1,
                'title' => 'Interface Ville-Associations',
                'description' => 'Faciliter le dialogue et les échanges entre les associations choisyennes et la municipalité pour une collaboration harmonieuse et constructive.',
                'icon' => 'bridge',
                'display_order' => 1
            ],
            [
                'id' => 2,
                'title' => 'Recueil des Besoins',
                'description' => 'Identifier et collecter les besoins exprimés par le tissu associatif pour mieux orienter les politiques publiques locales.',
                'icon' => 'clipboard-list',
                'display_order' => 2
            ],
            [
                'id' => 3,
                'title' => 'Espace de Concertation',
                'description' => 'Offrir un lieu d\'échange, de réflexion et de débat où les associations peuvent partager leurs expériences et s\'entraider mutuellement.',
                'icon' => 'comments',
                'display_order' => 3
            ],
            [
                'id' => 4,
                'title' => 'Force de Proposition',
                'description' => 'Formuler des propositions concrètes concernant les projets associatifs et les initiatives inter-associatives à développer sur le territoire.',
                'icon' => 'lightbulb',
                'display_order' => 4
            ],
            [
                'id' => 5,
                'title' => 'Promotion des Valeurs',
                'description' => 'Valoriser et promouvoir les valeurs associatives, le bénévolat et l\'engagement citoyen auprès de tous les habitants.',
                'icon' => 'megaphone',
                'display_order' => 5
            ],
            [
                'id' => 6,
                'title' => 'Représentation Associative',
                'description' => 'Représenter les associations choisyennes auprès de la municipalité et porter leurs voix dans les instances décisionnelles locales.',
                'icon' => 'handshake',
                'display_order' => 6
            ]
        ];
    }
    
    echo json_encode([
        'success' => true,
        'data' => $missions
    ], JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de la récupération des missions'], JSON_UNESCAPED_UNICODE);
}

?>

