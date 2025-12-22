<?php
/**
 * Configuration Email CVAC
 * Utilise la fonction mail() native de PHP (fonctionne avec Hostinger)
 */

// Configuration par défaut (utilise la fonction mail() de PHP)
define('SMTP_HOST', '');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', '');
define('SMTP_PASSWORD', '');

// Email d'expéditeur
define('FROM_EMAIL', 'contact@cvac-choisyleroi.fr');
define('FROM_NAME', 'CVAC - Conseil de la Vie Associative');

// Email de réception (pour compatibilité avec l'ancien code)
define('SMTP_TO_EMAIL', 'contact@cvac-choisyleroi.fr');

// URL de base pour les liens dans les emails
define('BASE_URL', 'https://cvac-choisyleroi.fr');

/**
 * Envoie un email via la fonction mail() native de PHP
 * 
 * @param string $to Email du destinataire
 * @param string $subject Sujet de l'email
 * @param string $message Corps du message
 * @param string $replyTo Email pour la réponse (optionnel)
 * @param string $replyToName Nom pour la réponse (optionnel)
 * @return bool True si l'email a été envoyé avec succès
 */
function sendEmailViaSMTP($to, $subject, $message, $replyTo = null, $replyToName = null) {
    // Préparer les en-têtes email
    $headers = [];
    $headers[] = 'From: ' . FROM_NAME . ' <' . FROM_EMAIL . '>';
    $headers[] = 'Reply-To: ' . ($replyTo ? ($replyToName ? $replyToName . ' <' . $replyTo . '>' : $replyTo) : FROM_EMAIL);
    $headers[] = 'X-Mailer: PHP/' . phpversion();
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-Type: text/plain; charset=UTF-8';
    $headers[] = 'Content-Transfer-Encoding: 8bit';
    
    // Convertir le message en UTF-8 si nécessaire
    $message = mb_convert_encoding($message, 'UTF-8', 'auto');
    
    // Envoyer l'email
    $success = mail($to, $subject, $message, implode("\r\n", $headers));
    
    if (!$success) {
        error_log("Erreur envoi email CVAC vers: {$to}");
    }
    
    return $success;
}

?>

