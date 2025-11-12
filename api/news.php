<?php
require_once 'config.php';

try {
    $pdo = getDB();
    
    // Récupérer les actualités
    $stmt = $pdo->query("SELECT * FROM news ORDER BY date DESC LIMIT 20");
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
                'image' => 'https://storage.googleapis.com/uxpilot-auth.appspot.com/f5aaa8b9f7-58cc20fbc6dd3a2b17c1.png',
                'views' => 245
            ],
            [
                'id' => 2,
                'title' => 'Festival Inter-Associatif',
                'date' => '2024-11-08',
                'category' => 'Événement',
                'content' => 'Un événement réussi qui a rassemblé plus de 20 associations choisyennes.',
                'image' => 'https://storage.googleapis.com/uxpilot-auth.appspot.com/dc3454a2a6-e9d3dff6ab27c509f9f8.png',
                'views' => 189
            ],
            [
                'id' => 3,
                'title' => 'Nouveau projet jeunesse',
                'date' => '2024-11-01',
                'category' => 'Projet',
                'content' => 'Lancement d\'un projet collaboratif entre 5 associations pour l\'engagement citoyen.',
                'image' => 'https://storage.googleapis.com/uxpilot-auth.appspot.com/6497433179-2191d204900d7b3c33ff.png',
                'views' => 156
            ]
        ];
    }
    
    echo json_encode($news, JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de la récupération des actualités']);
}

?>

