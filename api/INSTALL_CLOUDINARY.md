# 📦 Installation du SDK Cloudinary

## Installation Rapide

Vous avez Composer installé. Pour installer le SDK Cloudinary, exécutez :

```bash
cd api
composer install
```

Cela installera automatiquement le SDK Cloudinary dans le dossier `vendor/`.

---

## Vérification

Après l'installation, testez la connexion :

```bash
php test_cloudinary.php
```

Vous devriez voir :
```
✅ SDK Cloudinary installé
✅ Configuration détectée
✅ Connexion réussie!
```

---

## Structure après Installation

```
api/
├── vendor/              # Dependencies (créé par Composer)
│   └── cloudinary/
├── cloudinary_config.php # ✅ Configuré avec vos credentials
├── upload.php           # ✅ Endpoint d'upload prêt
├── test_cloudinary.php  # Script de test
└── composer.json        # ✅ Créé
```

---

## Problèmes Courants

### Erreur "Class not found"
- Vérifiez que `composer install` a bien été exécuté
- Vérifiez que `vendor/autoload.php` existe

### Erreur de connexion API
- Vérifiez vos credentials dans `cloudinary_config.php`
- Vérifiez que votre compte Cloudinary est actif

---

## ✅ Une fois installé

Vous pourrez :
1. ✅ Uploader des images via `/api/upload.php`
2. ✅ Utiliser `ImageService` dans Angular
3. ✅ Générer des URLs optimisées automatiquement

