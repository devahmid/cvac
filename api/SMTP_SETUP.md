# Configuration SMTP Gmail pour CVAC

## ✅ Avantages de cette solution

1. **Affichage correct** : Les emails affichent "CVAC - Conseil de la Vie Associative" au lieu de l'hébergeur
2. **Moins de spams** : Gmail gère automatiquement SPF, DKIM et DMARC
3. **Fiabilité** : Meilleure délivrabilité grâce à l'authentification SMTP
4. **Reply-To fonctionnel** : Permet de répondre directement à l'expéditeur

## 📋 Étapes de configuration

### 1. Installer PHPMailer

Sur votre serveur, dans le dossier `api/`, exécutez :

```bash
composer install
```

Ou si Composer n'est pas installé globalement :

```bash
php composer.phar install
```

### 2. Configurer Gmail

#### Étape 1 : Activer l'authentification à 2 facteurs

1. Allez sur https://myaccount.google.com/security
2. Activez la "Validation en deux étapes" si ce n'est pas déjà fait

#### Étape 2 : Générer un mot de passe d'application

1. Allez sur https://myaccount.google.com/apppasswords
2. Sélectionnez "Autre (nom personnalisé)" 
3. Entrez "CVAC Website" comme nom
4. Cliquez sur "Générer"
5. **Copiez le mot de passe généré** (16 caractères sans espaces)

### 3. Configurer le fichier email_config.php

Ouvrez `api/email_config.php` et remplacez :

```php
define('SMTP_PASSWORD', ''); // ⚠️ À configurer
```

Par :

```php
define('SMTP_PASSWORD', 'votre-mot-de-passe-d-application'); // Le mot de passe de 16 caractères généré
```

⚠️ **IMPORTANT** : Utilisez le **mot de passe d'application** généré, PAS votre mot de passe Gmail normal !

### 4. Vérifier la configuration

Les autres paramètres dans `email_config.php` sont déjà configurés :
- ✅ SMTP_HOST : smtp.gmail.com
- ✅ SMTP_PORT : 587
- ✅ SMTP_USERNAME : cvac.choisy@gmail.com
- ✅ SMTP_FROM_EMAIL : cvac.choisy@gmail.com
- ✅ SMTP_FROM_NAME : CVAC - Conseil de la Vie Associative
- ✅ SMTP_TO_EMAIL : cvac.choisy@gmail.com

## 🧪 Test

1. Testez le formulaire de contact sur votre site
2. Vérifiez que l'email arrive bien dans la boîte de réception (pas dans les spams)
3. Vérifiez que l'expéditeur affiche "CVAC - Conseil de la Vie Associative"
4. Testez le Reply-To en répondant à l'email

## 🔒 Sécurité

- Le fichier `email_config.php` contient des informations sensibles
- Assurez-vous qu'il n'est pas accessible publiquement
- Vérifiez que votre `.htaccess` protège ce fichier si nécessaire

## ❓ Dépannage

### Erreur "SMTP connect() failed"
- Vérifiez que le mot de passe d'application est correct
- Vérifiez que l'authentification à 2 facteurs est activée
- Vérifiez que le port 587 n'est pas bloqué par votre hébergeur

### Emails toujours dans les spams
- Attendez quelques heures après la première configuration
- Vérifiez que le mot de passe d'application est bien utilisé (pas le mot de passe Gmail)
- Contactez votre hébergeur si le problème persiste

### Composer non disponible
Si Composer n'est pas disponible sur votre hébergeur mutualisé :
1. Téléchargez PHPMailer manuellement depuis https://github.com/PHPMailer/PHPMailer
2. Extrayez dans `api/vendor/phpmailer/phpmailer/`
3. Modifiez `email_config.php` pour charger PHPMailer manuellement

## 📞 Support

En cas de problème, vérifiez les logs d'erreur PHP de votre serveur.



