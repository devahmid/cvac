<?php
/**
 * Script de test pour vérifier la connexion à la base de données
 * 
 * Usage: php test_db.php
 */

require_once 'config.php';

echo "🔍 Test de connexion à la base de données CVAC\n";
echo "==============================================\n\n";

try {
    $pdo = getDB();
    echo "✅ Connexion réussie!\n\n";
    
    echo "📋 Informations de connexion:\n";
    echo "   Hôte: " . DB_HOST . "\n";
    echo "   Base de données: " . DB_NAME . "\n";
    echo "   Utilisateur: " . DB_USER . "\n\n";
    
    // Lister les tables
    echo "📊 Tables dans la base de données:\n";
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    if (empty($tables)) {
        echo "   ⚠️  Aucune table trouvée.\n";
        echo "   Exécutez le script database.sql pour créer les tables.\n\n";
    } else {
        echo "   Tables trouvées (" . count($tables) . "):\n";
        foreach ($tables as $table) {
            // Compter les lignes dans chaque table
            $countStmt = $pdo->query("SELECT COUNT(*) as count FROM `$table`");
            $count = $countStmt->fetch()['count'];
            echo "   - $table ($count lignes)\n";
        }
        echo "\n";
    }
    
    // Tester quelques requêtes
    echo "🧪 Tests de requêtes:\n";
    
    // Test membres
    if (in_array('members', $tables)) {
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM members");
        $count = $stmt->fetch()['count'];
        echo "   ✅ Table 'members': $count membres\n";
    }
    
    // Test news
    if (in_array('news', $tables)) {
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM news");
        $count = $stmt->fetch()['count'];
        echo "   ✅ Table 'news': $count actualités\n";
    }
    
    // Test associations
    if (in_array('associations', $tables)) {
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM associations");
        $count = $stmt->fetch()['count'];
        echo "   ✅ Table 'associations': $count associations\n";
    }
    
    echo "\n✅ Base de données opérationnelle!\n";
    
} catch (PDOException $e) {
    echo "❌ ERREUR de connexion:\n";
    echo "   " . $e->getMessage() . "\n\n";
    echo "🔧 Vérifications:\n";
    echo "   1. Vérifiez le mot de passe dans config.php\n";
    echo "   2. Vérifiez que la base de données existe\n";
    echo "   3. Vérifiez que l'utilisateur a les droits nécessaires\n";
    exit(1);
} catch (Exception $e) {
    echo "❌ ERREUR: " . $e->getMessage() . "\n";
    exit(1);
}

?>

