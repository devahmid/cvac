<?php
/**
 * Gestionnaire d'erreurs pour l'API CVAC
 */

http_response_code(404);
header('Content-Type: application/json; charset=utf-8');

echo json_encode([
    'success' => false,
    'error' => 'Endpoint non trouvé',
    'message' => 'L\'endpoint demandé n\'existe pas ou n\'est pas disponible.'
], JSON_UNESCAPED_UNICODE);

?>

