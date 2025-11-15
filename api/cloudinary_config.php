<?php
/**
 * Configuration Cloudinary pour le CVAC
 * 
 * Pour utiliser ce fichier :
 * 1. Créer un compte sur https://cloudinary.com
 * 2. Remplacer les valeurs ci-dessous par vos identifiants
 * 3. Installer le SDK : composer require cloudinary/cloudinary_php
 */

// Charger l'autoloader Composer si disponible
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
}

// Si le SDK est disponible, importer les classes
if (class_exists('Cloudinary\Configuration\Configuration')) {
    // Configuration Cloudinary CVAC
    \Cloudinary\Configuration\Configuration::instance([
        'cloud' => [
            'cloud_name' => 'dxzvuvlye',
            'api_key' => '554544883388485',
            'api_secret' => '7goZ7gfaUYB2buWATmDppyG8Hvw'
        ],
        'url' => [
            'secure' => true
        ]
    ]);
}

/**
 * Génère une URL Cloudinary optimisée
 * 
 * @param string $publicId - L'ID public de l'image (ex: "cvac/news/image123")
 * @param array $options - Options de transformation
 *   - width: Largeur en pixels
 *   - height: Hauteur en pixels
 *   - crop: Mode de recadrage ('fill', 'fit', 'scale', 'thumb')
 *   - quality: Qualité ('auto' ou nombre 1-100)
 *   - format: Format ('auto', 'webp', 'jpg', 'png')
 *   - gravity: Point focal ('face', 'auto', etc.)
 * 
 * @return string URL Cloudinary optimisée
 */
if (!function_exists('getCloudinaryUrl')) {
function getCloudinaryUrl($publicId, $options = []) {
    if (!class_exists('Cloudinary\Configuration\Configuration')) {
        // Fallback : retourner l'URL telle quelle si SDK non installé
        return $publicId;
    }
    
    $defaultOptions = [
        'secure' => true,
        'fetch_format' => 'auto', // Auto WebP/AVIF selon le navigateur
        'quality' => 'auto',      // Compression automatique
    ];
    
    $finalOptions = array_merge($defaultOptions, $options);
    
    // Construire les transformations
    $transformations = [];
    
    if (isset($options['width'])) {
        $transformations['width'] = $options['width'];
    }
    if (isset($options['height'])) {
        $transformations['height'] = $options['height'];
    }
    if (isset($options['crop'])) {
        $transformations['crop'] = $options['crop'];
    }
    if (isset($options['quality'])) {
        $transformations['quality'] = $options['quality'];
    }
    if (isset($options['format'])) {
        $transformations['fetch_format'] = $options['format'];
    }
    if (isset($options['gravity'])) {
        $transformations['gravity'] = $options['gravity'];
    }
    
    try {
        $config = \Cloudinary\Configuration\Configuration::instance();
        $cloudName = $config->cloud->cloudName;
        
        // Construire l'URL manuellement
        $transformString = '';
        if (!empty($transformations)) {
            $parts = [];
            foreach ($transformations as $key => $value) {
                $parts[] = $key . '_' . $value;
            }
            $transformString = implode(',', $parts) . '/';
        }
        
        return "https://res.cloudinary.com/{$cloudName}/image/upload/{$transformString}{$publicId}";
    } catch (Exception $e) {
        // En cas d'erreur, retourner l'URL de base
        $config = \Cloudinary\Configuration\Configuration::instance();
        return "https://res.cloudinary.com/" . $config->cloud->cloudName . "/image/upload/" . $publicId;
    }
}
}

/**
 * Upload une image vers Cloudinary
 * 
 * @param string $filePath - Chemin du fichier à uploader
 * @param string $folder - Dossier de destination (ex: 'cvac/news')
 * @param array $options - Options supplémentaires
 * 
 * @return array Résultat de l'upload
 */
if (!function_exists('uploadToCloudinary')) {
function uploadToCloudinary($filePath, $folder = 'cvac', $options = []) {
    if (!class_exists('Cloudinary\Api\Upload\UploadApi')) {
        return [
            'success' => false,
            'error' => 'Cloudinary SDK non installé. Installez-le avec : composer require cloudinary/cloudinary_php'
        ];
    }
    
    $uploadApi = new \Cloudinary\Api\Upload\UploadApi();
    
    $defaultOptions = [
        'folder' => $folder,
        'use_filename' => true,
        'unique_filename' => true,
        'overwrite' => false,
        'resource_type' => 'image',
        // Générer automatiquement plusieurs tailles
        'eager' => [
            ['width' => 400, 'height' => 300, 'crop' => 'fill', 'quality' => 'auto'],
            ['width' => 800, 'height' => 600, 'crop' => 'fill', 'quality' => 'auto'],
            ['width' => 1200, 'height' => 900, 'crop' => 'fill', 'quality' => 'auto']
        ],
        // Optimisations automatiques
        'fetch_format' => 'auto',
        'quality' => 'auto'
    ];
    
    $finalOptions = array_merge($defaultOptions, $options);
    
    try {
        $result = $uploadApi->upload($filePath, $finalOptions);
        
        return [
            'success' => true,
            'public_id' => $result['public_id'],
            'url' => $result['secure_url'],
            'width' => $result['width'],
            'height' => $result['height'],
            'format' => $result['format'],
            'bytes' => $result['bytes'],
            'eager' => isset($result['eager']) ? $result['eager'] : []
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'error' => $e->getMessage()
        ];
    }
}
}

/**
 * Supprime une image de Cloudinary
 * 
 * @param string $publicId - L'ID public de l'image à supprimer
 * 
 * @return array Résultat de la suppression
 */
if (!function_exists('deleteFromCloudinary')) {
function deleteFromCloudinary($publicId) {
    if (!class_exists('Cloudinary\Api\Upload\UploadApi')) {
        return [
            'success' => false,
            'error' => 'Cloudinary SDK non installé'
        ];
    }
    
    $uploadApi = new \Cloudinary\Api\Upload\UploadApi();
    
    try {
        $result = $uploadApi->destroy($publicId);
        return [
            'success' => $result['result'] === 'ok',
            'message' => $result['result']
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'error' => $e->getMessage()
        ];
    }
}
}

// Constantes pour les dossiers Cloudinary
if (!defined('CLOUDINARY_FOLDER_NEWS')) {
    define('CLOUDINARY_FOLDER_NEWS', 'cvac/news');
    define('CLOUDINARY_FOLDER_PROJECTS', 'cvac/projects');
    define('CLOUDINARY_FOLDER_MEMBERS', 'cvac/members');
    define('CLOUDINARY_FOLDER_ASSOCIATIONS', 'cvac/associations');
    define('CLOUDINARY_FOLDER_PAGES', 'cvac/pages');
    define('CLOUDINARY_FOLDER_RESOURCES', 'cvac/resources');
}

?>
