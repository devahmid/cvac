# Configuration Email - CVAC

## Problèmes résolus

### 1. Affichage du nom de domaine au lieu de l'hébergeur
✅ **Résolu** : Les en-têtes email sont maintenant configurés avec :
- `From`: CVAC - Conseil de la Vie Associative <cvac.choisy@gmail.com>
- `Message-ID`: Utilise le nom de domaine dans l'identifiant
- `Return-Path`: Configuré correctement

### 2. Éviter les spams
✅ **Amélioré** : En-têtes optimisés ajoutés :
- MIME-Version et Content-Type corrects
- Message-ID unique avec domaine
- Date et X-Mailer configurés
- Reply-To configuré pour permettre la réponse directe

## Configuration DNS recommandée (pour améliorer encore la délivrabilité)

Pour éviter complètement les spams, configurez ces enregistrements DNS pour votre domaine `cvac-choisyleroi.fr` :

### 1. SPF (Sender Policy Framework)
Ajoutez cet enregistrement TXT dans votre DNS :
```
v=spf1 include:_spf.google.com ~all
```
(Cela autorise Gmail à envoyer des emails pour votre domaine)

### 2. DKIM (DomainKeys Identified Mail)
Si vous utilisez Gmail avec votre domaine, configurez DKIM via Google Workspace.

### 3. DMARC (Domain-based Message Authentication)
Ajoutez cet enregistrement TXT :
```
v=DMARC1; p=quarantine; rua=mailto:cvac.choisy@gmail.com
```

## Notes importantes

1. **Sur hébergement mutualisé** : Le serveur mail peut nécessiter que le "From" corresponde à une adresse email valide sur le serveur. Si les emails ne partent pas, contactez votre hébergeur.

2. **Alternative recommandée** : Pour une meilleure délivrabilité, envisagez d'utiliser :
   - Un service d'envoi d'emails professionnel (SendGrid, Mailgun, etc.)
   - PHPMailer avec SMTP authentifié
   - Google Workspace avec votre domaine

3. **Test** : Testez l'envoi d'emails et vérifiez :
   - Que l'email arrive bien (pas dans les spams)
   - Que le "From" affiche correctement "CVAC - Conseil de la Vie Associative"
   - Que le Reply-To fonctionne pour répondre directement à l'expéditeur

## Code actuel

Le fichier `contact.php` utilise maintenant :
- Email de destination : `cvac.choisy@gmail.com`
- From : `CVAC - Conseil de la Vie Associative <cvac.choisy@gmail.com>`
- Reply-To : L'adresse email de l'expéditeur du formulaire
- En-têtes optimisés pour la délivrabilité



