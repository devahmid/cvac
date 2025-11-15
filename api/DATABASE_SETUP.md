# Configuration Base de Données CVAC

## 📊 Informations de Production

- **Nom de la base de données**: `u281164575_cvac`
- **Utilisateur MySQL**: `u281164575_admin`
- **Hôte**: `localhost` (hébergement mutualisé)
- **Site web**: `cvac-choisyleroi.fr`
- **Taille actuelle**: 1 MB

---

## 🔧 Configuration

### Fichier `config.php`

Le fichier `config.php` a été mis à jour avec vos informations de base de données.

⚠️ **IMPORTANT**: Vous devez ajouter le **mot de passe MySQL** dans `config.php` :

```php
define('DB_PASS', 'votre_mot_de_passe_mysql');
```

---

## 📦 Installation de la Base de Données

### 1. Exécuter le script SQL

Via phpMyAdmin ou ligne de commande :

1. Connectez-vous à phpMyAdmin
2. Sélectionnez la base `u281164575_cvac`
3. Allez dans l'onglet "SQL"
4. Copiez-collez le contenu de `database.sql`
5. Exécutez le script

**OU** via ligne de commande :

```bash
mysql -u u281164575_admin -p u281164575_cvac < database.sql
```

### 2. Vérifier les tables créées

Après l'exécution, vous devriez avoir ces tables :

- ✅ `members` - Membres du CVAC
- ✅ `news` - Actualités et événements
- ✅ `contact_messages` - Messages de contact
- ✅ `associations` - Associations locales
- ✅ `projects` - Projets inter-associatifs
- ✅ `project_associations` - Liaison projets-associations
- ✅ `resources` - Ressources et documents
- ✅ `page_content` - Contenu éditable des pages
- ✅ `values` - Valeurs du CVAC
- ✅ `missions` - Missions du CVAC
- ✅ `statistics` - Statistiques générales

---

## 🧪 Test de Connexion

Créer un fichier `test_db.php` :

```php
<?php
require_once 'config.php';

try {
    $pdo = getDB();
    echo "✅ Connexion à la base de données réussie!\n";
    echo "Base de données: " . DB_NAME . "\n";
    
    // Lister les tables
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "\nTables trouvées (" . count($tables) . "):\n";
    foreach ($tables as $table) {
        echo "  - $table\n";
    }
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
}
?>
```

Exécuter :
```bash
php test_db.php
```

---

## 🔐 Sécurité

### Variables d'Environnement (Recommandé)

Pour la production, utilisez des variables d'environnement :

1. Créer un fichier `.env` (ne pas commiter dans Git) :
```
DB_HOST=localhost
DB_NAME=u281164575_cvac
DB_USER=u281164575_admin
DB_PASS=votre_mot_de_passe
```

2. Modifier `config.php` pour lire depuis `.env` :
```php
// Charger depuis .env si disponible
if (file_exists(__DIR__ . '/.env')) {
    $env = parse_ini_file(__DIR__ . '/.env');
    define('DB_HOST', $env['DB_HOST'] ?? 'localhost');
    define('DB_NAME', $env['DB_NAME'] ?? 'u281164575_cvac');
    define('DB_USER', $env['DB_USER'] ?? 'u281164575_admin');
    define('DB_PASS', $env['DB_PASS'] ?? '');
}
```

---

## 📝 Checklist de Déploiement

- [ ] Ajouter le mot de passe MySQL dans `config.php`
- [ ] Exécuter `database.sql` pour créer les tables
- [ ] Vérifier la connexion avec `test_db.php`
- [ ] Tester les endpoints API
- [ ] Configurer les permissions de fichiers (chmod 644 pour les fichiers PHP)
- [ ] Vérifier que les uploads fonctionnent (dossier `uploads/` avec permissions 755)

---

## 🆘 Dépannage

### Erreur "Access denied"
- Vérifiez le nom d'utilisateur et le mot de passe
- Vérifiez que l'utilisateur a les droits sur la base de données

### Erreur "Unknown database"
- Vérifiez que la base `u281164575_cvac` existe
- Créez-la si nécessaire : `CREATE DATABASE u281164575_cvac CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`

### Erreur "Table doesn't exist"
- Exécutez le script `database.sql` pour créer les tables

---

## 📚 Ressources

- Documentation MySQL : https://dev.mysql.com/doc/
- phpMyAdmin : Interface web pour gérer la base de données
- PDO Documentation : https://www.php.net/manual/fr/book.pdo.php

