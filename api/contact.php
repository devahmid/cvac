<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
    exit();
}

// Récupérer les données du formulaire
$data = json_decode(file_get_contents('php://input'), true);

// Validation
$errors = [];

if (empty($data['firstname'])) {
    $errors[] = 'Le prénom est requis';
}
if (empty($data['lastname'])) {
    $errors[] = 'Le nom est requis';
}
if (empty($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Un email valide est requis';
}
if (empty($data['subject'])) {
    $errors[] = 'Le sujet est requis';
}
if (empty($data['message'])) {
    $errors[] = 'Le message est requis';
}
if (empty($data['consent'])) {
    $errors[] = 'Vous devez accepter la politique RGPD';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['errors' => $errors]);
    exit();
}

try {
    $pdo = getDB();
    
    // Insérer le message dans la base de données
    $stmt = $pdo->prepare("
        INSERT INTO contact_messages 
        (firstname, lastname, email, association, subject, message, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, NOW())
    ");
    
    $stmt->execute([
        sanitize($data['firstname']),
        sanitize($data['lastname']),
        sanitize($data['email']),
        sanitize($data['association'] ?? ''),
        sanitize($data['subject']),
        sanitize($data['message'])
    ]);
    
    // Envoyer un email (optionnel)
    $to = 'cvac@choisy-le-roi.fr';
    $subject = 'Nouveau message CVAC: ' . sanitize($data['subject']);
    $message = "Nouveau message reçu via le formulaire de contact:\n\n";
    $message .= "Nom: " . sanitize($data['firstname']) . " " . sanitize($data['lastname']) . "\n";
    $message .= "Email: " . sanitize($data['email']) . "\n";
    $message .= "Association: " . sanitize($data['association'] ?? 'N/A') . "\n";
    $message .= "Sujet: " . sanitize($data['subject']) . "\n\n";
    $message .= "Message:\n" . sanitize($data['message']);
    
    $headers = "From: " . sanitize($data['email']) . "\r\n";
    $headers .= "Reply-To: " . sanitize($data['email']) . "\r\n";
    
    // mail($to, $subject, $message, $headers); // Décommenter pour activer l'envoi d'email
    
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Message envoyé avec succès']);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de l\'envoi du message']);
}

?>

