# Guide de test d'upload Cloudinary

## 🚀 Méthode 1 : Via le navigateur (le plus simple)

1. **Ouvrez votre navigateur** et allez à :
   ```
   http://votre-domaine.com/api/test_upload.php
   ```
   Ou en local :
   ```
   http://localhost/api/test_upload.php
   ```

2. **Utilisez le formulaire** :
   - Cliquez sur "Sélectionner une image"
   - Choisissez une photo (JPEG, PNG, GIF, WebP)
   - Sélectionnez le dossier de destination (ex: `cvac/members`)
   - Cliquez sur "Uploader l'image"

3. **Résultat** :
   - L'URL Cloudinary sera affichée
   - Un aperçu de l'image sera visible
   - Vous pouvez copier l'URL pour l'utiliser dans votre application

## 🖥️ Méthode 2 : Via ligne de commande (curl)

```bash
curl -X POST http://votre-domaine.com/api/test_upload.php \
  -F "image=@/chemin/vers/votre/image.jpg" \
  -F "folder=cvac/members"
```

## 📝 Méthode 3 : Via JavaScript (depuis le frontend)

```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);
formData.append('folder', 'cvac/members');

fetch('/api/upload.php', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log('URL Cloudinary:', data.url);
    console.log('Public ID:', data.public_id);
  }
});
```

## 📋 Dossiers disponibles

- `cvac/members` - Photos des membres
- `cvac/news` - Images des actualités
- `cvac/projects` - Images des projets
- `cvac/associations` - Logos des associations
- `cvac/pages` - Images des pages
- `cvac/resources` - Documents et ressources
- `cvac` - Racine (pour les images générales)

## ✅ Vérifications

Après l'upload, vous devriez recevoir :
- ✅ `success: true`
- ✅ `url` : URL complète de l'image sur Cloudinary
- ✅ `public_id` : ID public à stocker en base de données
- ✅ `width` et `height` : Dimensions de l'image
- ✅ `format` : Format de l'image (jpg, png, etc.)
- ✅ `bytes` : Taille du fichier en octets

## 🔍 Vérifier dans Cloudinary

1. Allez sur https://console.cloudinary.com/
2. Connectez-vous avec votre compte
3. Allez dans "Media Library"
4. Vous devriez voir votre image dans le dossier choisi

## 🐛 Dépannage

### Erreur "Cloudinary SDK non installé"
```bash
cd api/
composer install
```

### Erreur "Invalid API credentials"
Vérifiez vos identifiants dans `cloudinary_config.php` :
- `cloud_name`
- `api_key`
- `api_secret`

### Erreur "File too large"
La taille maximale est de 10MB. Réduisez la taille de votre image.

### Erreur "Invalid file type"
Formats acceptés : JPEG, PNG, GIF, WebP



