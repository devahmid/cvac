<?php
require_once 'config.php';
require_once 'cloudinary_config.php';

// Vérifier que c'est une requête POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
    exit();
}

// Vérifier qu'un fichier a été uploadé
if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'Aucun fichier uploadé']);
    exit();
}

$file = $_FILES['image'];
$folder = isset($_POST['folder']) ? sanitize($_POST['folder']) : 'cvac';
$type = isset($_POST['type']) ? sanitize($_POST['type']) : 'general';

// Validation du type de fichier
$allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
$allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

$fileExtension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

if (!in_array($file['type'], $allowedTypes) || !in_array($fileExtension, $allowedExtensions)) {
    http_response_code(400);
    echo json_encode(['error' => 'Type de fichier non autorisé. Formats acceptés : JPEG, PNG, WebP, GIF']);
    exit();
}

// Validation de la taille (max 10MB)
$maxSize = 10 * 1024 * 1024; // 10MB
if ($file['size'] > $maxSize) {
    http_response_code(400);
    echo json_encode(['error' => 'Fichier trop volumineux. Taille maximale : 10MB']);
    exit();
}

// Déterminer le dossier selon le type
$uploadFolder = $folder . '/' . $type;

// Mapping des types vers les dossiers Cloudinary
$folderMap = [
    'news' => CLOUDINARY_FOLDER_NEWS,
    'project' => CLOUDINARY_FOLDER_PROJECTS,
    'member' => CLOUDINARY_FOLDER_MEMBERS,
    'association' => CLOUDINARY_FOLDER_ASSOCIATIONS,
    'page' => CLOUDINARY_FOLDER_PAGES,
    'resource' => CLOUDINARY_FOLDER_RESOURCES
];

if (isset($folderMap[$type])) {
    $uploadFolder = $folderMap[$type];
}

// Options d'upload selon le type
$uploadOptions = [
    'public_id' => $type . '_' . time() . '_' . uniqid()
];

// Options spécifiques selon le type
switch ($type) {
    case 'member':
        // Pour les avatars, générer un format carré
        $uploadOptions['eager'] = [
            ['width' => 200, 'height' => 200, 'crop' => 'fill', 'gravity' => 'face', 'quality' => 'auto'],
            ['width' => 400, 'height' => 400, 'crop' => 'fill', 'gravity' => 'face', 'quality' => 'auto']
        ];
        break;
    case 'news':
    case 'project':
        // Pour les images d'articles, générer plusieurs tailles
        $uploadOptions['eager'] = [
            ['width' => 400, 'height' => 300, 'crop' => 'fill', 'quality' => 'auto'],
            ['width' => 800, 'height' => 600, 'crop' => 'fill', 'quality' => 'auto'],
            ['width' => 1200, 'height' => 900, 'crop' => 'fill', 'quality' => 'auto']
        ];
        break;
    case 'association':
        // Pour les logos, format carré avec fond transparent
        $uploadOptions['eager'] = [
            ['width' => 200, 'height' => 200, 'crop' => 'fit', 'quality' => 'auto'],
            ['width' => 400, 'height' => 400, 'crop' => 'fit', 'quality' => 'auto']
        ];
        break;
}

// Upload vers Cloudinary
$result = uploadToCloudinary($file['tmp_name'], $uploadFolder, $uploadOptions);

if ($result['success']) {
    echo json_encode([
        'success' => true,
        'url' => $result['url'],
        'public_id' => $result['public_id'],
        'width' => $result['width'],
        'height' => $result['height'],
        'format' => $result['format'],
        'size' => $result['bytes'],
        'folder' => $uploadFolder
    ], JSON_UNESCAPED_UNICODE);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erreur lors de l\'upload : ' . ($result['error'] ?? 'Erreur inconnue')
    ], JSON_UNESCAPED_UNICODE);
}

?>

