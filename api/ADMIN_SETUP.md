# Guide d'Installation - Système d'Administration

## 📋 Résumé

Le système d'administration permet de valider les utilisateurs et les associations créées.

---

## 🚀 Installation

### Étape 1 : Exécuter le script SQL

Exécutez le fichier `add_admin_fields.sql` pour ajouter les champs de validation :

```sql
-- Ce script ajoute :
-- 1. Champs de validation à la table associations (status, validated_at, validated_by, rejection_reason)
-- 2. Champs de validation à la table users (status, validated_at, validated_by, rejection_reason)
```

### Étape 2 : Créer un compte administrateur

Pour créer un compte admin, exécutez cette requête SQL :

```sql
-- Mettre à jour un utilisateur existant en admin
UPDATE users SET role = 'admin', status = 'active' WHERE email = 'votre-email@example.com';

-- OU créer un admin directement
INSERT INTO users (email, password, firstname, lastname, role, status, token, token_expires_at) 
VALUES (
  'admin@cvac.fr',
  '$2y$10$...', -- Hash du mot de passe (généré avec password_hash)
  'Admin',
  'CVAC',
  'admin',
  'active',
  NULL,
  NULL
);
```

**Pour générer le hash du mot de passe :**
```php
<?php
echo password_hash('VotreMotDePasse123!', PASSWORD_BCRYPT);
?>
```

---

## 🔐 Accès Administration

Une fois connecté avec un compte admin, vous verrez un lien "Administration" dans le menu utilisateur.

**URL :** `/admin`

---

## ✨ Fonctionnalités

### Dashboard Admin
- Statistiques en temps réel
- Nombre d'associations en attente
- Nombre d'utilisateurs en attente
- Totaux généraux

### Validation des Associations
- Voir toutes les associations en attente
- Valider une association (devient visible publiquement)
- Rejeter une association (avec raison)
- Voir les détails d'une association

### Validation des Utilisateurs
- Voir tous les utilisateurs en attente
- Valider un utilisateur (peut se connecter)
- Rejeter un utilisateur (avec raison)

---

## 🔄 Flux de Validation

### Associations
1. Un utilisateur crée une association → Statut : `pending`
2. L'association n'est **pas visible** dans l'annuaire public
3. L'admin voit l'association dans `/admin`
4. L'admin valide → Statut : `approved` → Association visible publiquement
5. OU l'admin rejette → Statut : `rejected` → Association jamais visible

### Utilisateurs
1. Un utilisateur s'inscrit → Statut : `pending`
2. L'utilisateur **ne peut pas se connecter** tant qu'il n'est pas validé
3. L'admin voit l'utilisateur dans `/admin`
4. L'admin valide → Statut : `active` → Utilisateur peut se connecter
5. OU l'admin rejette → Statut : `rejected` → Utilisateur ne peut jamais se connecter

---

## 📝 Notes Importantes

1. **Par défaut** : Toutes les nouvelles associations/utilisateurs sont en attente
2. **Sécurité** : Seuls les utilisateurs avec `role = 'admin'` peuvent accéder à `/admin`
3. **Visibilité** : Les associations rejetées ne sont jamais visibles publiquement
4. **Connexion** : Les utilisateurs rejetés ne peuvent pas se connecter

---

## 🐛 Dépannage

### Erreur : "Accès administrateur requis"
→ Vérifiez que votre compte a `role = 'admin'` dans la base de données

### Les associations ne s'affichent pas dans l'annuaire
→ Vérifiez que leur statut est `approved` et `is_public = TRUE`

### Les utilisateurs ne peuvent pas se connecter
→ Vérifiez que leur statut est `active` (pas `pending` ou `rejected`)

---

## ✅ Checklist

- [ ] Script SQL `add_admin_fields.sql` exécuté
- [ ] Compte administrateur créé
- [ ] Test d'accès à `/admin` réussi
- [ ] Test de validation d'association réussi
- [ ] Test de validation d'utilisateur réussi

Une fois tous ces points cochés, le système d'administration est opérationnel ! 🎉

