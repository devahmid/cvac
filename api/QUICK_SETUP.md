# Guide Rapide d'Installation - API CVAC

## ✅ Identifiants de Base de Données

- **Base de données** : `u281164575_cvac`
- **Utilisateur** : `u281164575_admin`
- **Mot de passe** : (configuré dans `config.php`)

---

## 🚀 Installation en 3 Étapes

### Étape 1 : Exécuter le Script SQL

**Option A - Via phpMyAdmin (Recommandé) :**
1. Connectez-vous à phpMyAdmin
2. Sélectionnez la base de données `u281164575_cvac`
3. Cliquez sur l'onglet "SQL"
4. Copiez-collez le contenu du fichier `setup_complete.sql`
5. Cliquez sur "Exécuter"

**Option B - Via ligne de commande :**
```bash
mysql -u u281164575_admin -p u281164575_cvac < setup_complete.sql
```

### Étape 2 : Vérifier l'Installation

Exécutez ces requêtes SQL pour vérifier :

```sql
-- Vérifier que la table users existe
SHOW TABLES LIKE 'users';

-- Vérifier les colonnes de la table associations
DESCRIBE associations;

-- Vérifier que les colonnes Cloudinary existent
DESCRIBE news;
DESCRIBE members;
DESCRIBE associations;
```

### Étape 3 : Tester l'API

**Test d'inscription :**
```bash
curl -X POST https://cvac-choisyleroi.fr/api/auth.php?action=signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456!",
    "firstname": "Test",
    "lastname": "User"
  }'
```

**Test de connexion :**
```bash
curl -X POST https://cvac-choisyleroi.fr/api/auth.php?action=login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456!"
  }'
```

**Test des associations publiques :**
```bash
curl https://cvac-choisyleroi.fr/api/associations.php?public=true
```

---

## 📋 Ce que le Script Fait

Le script `setup_complete.sql` :

1. ✅ **Crée la table `users`** pour l'authentification
2. ✅ **Ajoute les champs manquants** à la table `associations` :
   - `category`, `city`, `postal_code`
   - `cover_image`, `activities`, `president`
   - `founding_year`, `number_of_members`, `is_public`
3. ✅ **Ajoute les colonnes Cloudinary** à toutes les tables nécessaires
4. ✅ **Crée les index** pour améliorer les performances
5. ✅ **Migre les données existantes** (domain → category, is_public par défaut)

---

## ⚠️ Notes Importantes

- Le script est **idempotent** : vous pouvez l'exécuter plusieurs fois sans problème
- Il vérifie automatiquement si les colonnes/tables existent avant de les créer
- Compatible avec MySQL 5.7+ et MariaDB 10.2+

---

## 🐛 Dépannage

### Erreur : "Table 'users' already exists"
→ C'est normal, la table existe déjà. Le script continue.

### Erreur : "Column 'category' already exists"
→ C'est normal, la colonne existe déjà. Le script continue.

### Erreur de connexion à la base de données
→ Vérifiez les identifiants dans `config.php`
→ Vérifiez que le mot de passe MySQL est correct

---

## ✅ Checklist

- [ ] Script SQL exécuté (`setup_complete.sql`)
- [ ] Table `users` créée et visible
- [ ] Colonnes ajoutées à `associations` (vérifier avec `DESCRIBE associations`)
- [ ] Test d'inscription réussi
- [ ] Test de connexion réussi
- [ ] Test de récupération des associations publiques réussi

Une fois tous ces points cochés, l'API est prête ! 🎉

