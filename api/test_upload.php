<?php
/**
 * Script de test pour uploader une image sur Cloudinary
 * 
 * Usage: 
 *   1. Via navigateur : http://votre-domaine.com/api/test_upload.php
 *   2. Via ligne de commande : php test_upload.php
 *   3. Via formulaire HTML : Ouvrir test_upload_form.html dans le navigateur
 */

// Vérifier que PHP fonctionne
if (!function_exists('phpinfo')) {
    die('PHP n\'est pas correctement configuré sur ce serveur.');
}

// Fonction pour sécuriser les données (si non définie)
if (!function_exists('sanitize')) {
    function sanitize($data) {
        return htmlspecialchars(strip_tags(trim($data)));
    }
}

// Charger la configuration Cloudinary avec gestion d'erreur
try {
    if (!file_exists(__DIR__ . '/cloudinary_config.php')) {
        throw new Exception('Fichier cloudinary_config.php introuvable');
    }
    require_once 'cloudinary_config.php';
} catch (Exception $e) {
    // Si erreur lors du chargement, afficher un message d'erreur HTML
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        ?>
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Erreur Configuration</title>
            <style>
                body { font-family: Arial; padding: 50px; background: #f5f5f5; }
                .error { background: #f8d7da; padding: 20px; border-radius: 5px; color: #721c24; }
            </style>
        </head>
        <body>
            <div class="error">
                <h2>❌ Erreur de configuration</h2>
                <p><strong>Erreur:</strong> <?php echo htmlspecialchars($e->getMessage()); ?></p>
                <p>Vérifiez que le fichier <code>cloudinary_config.php</code> existe dans le dossier <code>api/</code></p>
            </div>
        </body>
        </html>
        <?php
        exit();
    } else {
        header('Content-Type: application/json');
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        exit();
    }
}

// Headers CORS (seulement pour les requêtes POST/OPTIONS)
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}

// Gérer les requêtes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Si c'est une requête GET, afficher un formulaire HTML simple
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Vérifier si le SDK est installé pour afficher un avertissement si nécessaire
    $sdkInstalled = class_exists('Cloudinary\Api\Upload\UploadApi');
    ?>
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Test Upload Cloudinary - CVAC</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 800px;
                margin: 50px auto;
                padding: 20px;
                background: #f5f5f5;
            }
            .container {
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h1 {
                color: #2B5A87;
                margin-bottom: 20px;
            }
            .form-group {
                margin-bottom: 20px;
            }
            label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
                color: #333;
            }
            input[type="file"] {
                width: 100%;
                padding: 10px;
                border: 2px dashed #2B5A87;
                border-radius: 5px;
                background: #f8f9fa;
            }
            select {
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
            }
            button {
                background: #2B5A87;
                color: white;
                padding: 12px 30px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
            }
            button:hover {
                background: #4A7BA7;
            }
            #result {
                margin-top: 20px;
                padding: 15px;
                border-radius: 5px;
                display: none;
            }
            .success {
                background: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
            }
            .error {
                background: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
            }
            .preview {
                margin-top: 20px;
                text-align: center;
            }
            .preview img {
                max-width: 100%;
                max-height: 400px;
                border-radius: 5px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .info {
                background: #e7f3ff;
                padding: 15px;
                border-radius: 5px;
                margin-bottom: 20px;
                border-left: 4px solid #2B5A87;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🧪 Test Upload Cloudinary - CVAC</h1>
            
            <?php if (!$sdkInstalled): ?>
            <div class="error" style="margin-bottom: 20px;">
                <strong>⚠️ Attention:</strong> Le SDK Cloudinary n'est pas installé.<br>
                Exécutez: <code>composer install</code> dans le dossier <code>api/</code>
            </div>
            <?php endif; ?>
            
            <div class="info">
                <strong>Instructions :</strong><br>
                1. Sélectionnez une image à uploader<br>
                2. Choisissez le dossier de destination<br>
                3. Cliquez sur "Uploader l'image"<br>
                4. L'URL Cloudinary sera affichée ci-dessous
            </div>
            
            <form id="uploadForm" enctype="multipart/form-data">
                <div class="form-group">
                    <label for="image">Sélectionner une image :</label>
                    <input type="file" id="image" name="image" accept="image/*" required>
                </div>
                
                <div class="form-group">
                    <label for="folder">Dossier de destination :</label>
                    <select id="folder" name="folder">
                        <option value="cvac/members">Membres (cvac/members)</option>
                        <option value="cvac/news">Actualités (cvac/news)</option>
                        <option value="cvac/projects">Projets (cvac/projects)</option>
                        <option value="cvac/associations">Associations (cvac/associations)</option>
                        <option value="cvac/pages">Pages (cvac/pages)</option>
                        <option value="cvac/resources">Ressources (cvac/resources)</option>
                        <option value="cvac">Racine (cvac)</option>
                    </select>
                </div>
                
                <button type="submit">📤 Uploader l'image</button>
            </form>
            
            <div id="result"></div>
            <div id="preview" class="preview"></div>
        </div>
        
        <script>
            document.getElementById('uploadForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const formData = new FormData();
                const fileInput = document.getElementById('image');
                const folder = document.getElementById('folder').value;
                
                if (!fileInput.files[0]) {
                    showResult('Veuillez sélectionner une image', false);
                    return;
                }
                
                formData.append('image', fileInput.files[0]);
                formData.append('folder', folder);
                
                const resultDiv = document.getElementById('result');
                const previewDiv = document.getElementById('preview');
                resultDiv.style.display = 'block';
                resultDiv.className = 'info';
                resultDiv.innerHTML = '⏳ Upload en cours...';
                previewDiv.innerHTML = '';
                
                try {
                    const response = await fetch('test_upload.php', {
                        method: 'POST',
                        body: formData
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        resultDiv.className = 'success';
                        resultDiv.innerHTML = `
                            <strong>✅ Upload réussi !</strong><br><br>
                            <strong>Public ID:</strong> ${data.public_id}<br>
                            <strong>URL:</strong> <a href="${data.url}" target="_blank">${data.url}</a><br>
                            <strong>Taille:</strong> ${data.width}x${data.height}px<br>
                            <strong>Format:</strong> ${data.format}<br>
                            <strong>Taille fichier:</strong> ${(data.bytes / 1024).toFixed(2)} KB<br>
                            <br>
                            <strong>URL à copier:</strong><br>
                            <code style="background: white; padding: 5px; border-radius: 3px; display: block; margin-top: 5px;">${data.url}</code>
                        `;
                        
                        previewDiv.innerHTML = `<img src="${data.url}" alt="Image uploadée">`;
                    } else {
                        resultDiv.className = 'error';
                        resultDiv.innerHTML = `<strong>❌ Erreur:</strong> ${data.error}`;
                    }
                } catch (error) {
                    resultDiv.className = 'error';
                    resultDiv.innerHTML = `<strong>❌ Erreur:</strong> ${error.message}`;
                }
            });
        </script>
    </body>
    </html>
    <?php
    exit();
}

// Traitement de l'upload POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Définir le Content-Type JSON pour les réponses POST
    header('Content-Type: application/json; charset=utf-8');
    
    // Vérifier si le SDK est installé pour les requêtes POST
    if (!class_exists('Cloudinary\Api\Upload\UploadApi')) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Cloudinary SDK non installé. Installez-le avec: composer require cloudinary/cloudinary_php'
        ]);
        exit();
    }
    
    try {
        // Vérifier qu'un fichier a été uploadé
        if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Aucun fichier uploadé ou erreur lors de l\'upload'
            ]);
            exit();
        }
        
        $file = $_FILES['image'];
        $folder = isset($_POST['folder']) ? sanitize($_POST['folder']) : 'cvac';
        
        // Vérifier le type de fichier
        $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        $fileType = mime_content_type($file['tmp_name']);
        
        if (!in_array($fileType, $allowedTypes)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Type de fichier non autorisé. Formats acceptés: JPEG, PNG, GIF, WebP'
            ]);
            exit();
        }
        
        // Vérifier la taille (max 10MB)
        if ($file['size'] > 10 * 1024 * 1024) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Fichier trop volumineux. Taille maximale: 10MB'
            ]);
            exit();
        }
        
        // Upload vers Cloudinary
        $result = uploadToCloudinary($file['tmp_name'], $folder, [
            'use_filename' => true,
            'unique_filename' => true,
            'overwrite' => false
        ]);
        
        if ($result['success']) {
            http_response_code(200);
            echo json_encode($result);
        } else {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $result['error'] ?? 'Erreur lors de l\'upload'
            ]);
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Erreur: ' . $e->getMessage()
        ]);
    }
}

?>

