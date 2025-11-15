<?php
require_once 'config.php';

try {
    $pdo = getDB();
    
    // Récupérer les paramètres
    $page = isset($_GET['page']) ? sanitize($_GET['page']) : null;
    $section = isset($_GET['section']) ? sanitize($_GET['section']) : null;
    
    // Si une page et une section sont spécifiées, retourner cette section
    if ($page && $section) {
        $stmt = $pdo->prepare("SELECT * FROM page_content WHERE page_slug = ? AND section_key = ? AND is_active = 1");
        $stmt->execute([$page, $section]);
        $content = $stmt->fetch();
        
        if (!$content) {
            http_response_code(404);
            echo json_encode(['error' => 'Contenu non trouvé'], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        // Décoder le JSON si c'est du contenu JSON
        if ($content['content_type'] === 'json') {
            $content['content'] = json_decode($content['content'], true);
        }
        
        if ($content['metadata']) {
            $content['metadata'] = json_decode($content['metadata'], true);
        }
        
        echo json_encode($content, JSON_UNESCAPED_UNICODE);
        exit();
    }
    
    // Si seule la page est spécifiée, retourner tout le contenu de la page
    if ($page) {
        $stmt = $pdo->prepare("SELECT * FROM page_content WHERE page_slug = ? AND is_active = 1 ORDER BY display_order ASC");
        $stmt->execute([$page]);
        $contents = $stmt->fetchAll();
        
        // Organiser par section
        $organized = [];
        foreach ($contents as $content) {
            $sectionKey = $content['section_key'];
            
            // Décoder le JSON si nécessaire
            if ($content['content_type'] === 'json') {
                $content['content'] = json_decode($content['content'], true);
            }
            
            if ($content['metadata']) {
                $content['metadata'] = json_decode($content['metadata'], true);
            }
            
            $organized[$sectionKey] = $content;
        }
        
        echo json_encode([
            'success' => true,
            'page' => $page,
            'data' => $organized
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }
    
    // Sinon, retourner toutes les pages
    $stmt = $pdo->query("SELECT DISTINCT page_slug FROM page_content WHERE is_active = 1 ORDER BY page_slug ASC");
    $pages = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    echo json_encode([
        'success' => true,
        'pages' => $pages
    ], JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de la récupération du contenu'], JSON_UNESCAPED_UNICODE);
}

?>

