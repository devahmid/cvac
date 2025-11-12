<?php
require_once 'config.php';

try {
    $pdo = getDB();
    
    // Récupérer tous les membres
    $stmt = $pdo->query("SELECT * FROM members ORDER BY role_order, name ASC");
    $members = $stmt->fetchAll();
    
    // Si pas de données en base, retourner des données de démo
    if (empty($members)) {
        $members = [
            [
                'id' => 1,
                'name' => 'Jean-Michel Dupont',
                'role' => 'Président',
                'association' => 'Association Culturelle de Choisy',
                'email' => 'j.dupont@cvac-choisy.fr',
                'description' => 'Fort de 15 ans d\'engagement associatif, Jean-Michel pilote le CVAC depuis sa création.',
                'avatar' => 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg'
            ],
            [
                'id' => 2,
                'name' => 'Sophie Martinez',
                'role' => 'Vice-Présidente',
                'association' => 'Solidarité et Entraide Choisyenne',
                'email' => 's.martinez@cvac-choisy.fr',
                'description' => 'Engagée dans le secteur social depuis 20 ans, Sophie apporte son expertise en matière de solidarité.',
                'avatar' => 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg'
            ]
        ];
    }
    
    echo json_encode($members, JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de la récupération des membres']);
}

?>

