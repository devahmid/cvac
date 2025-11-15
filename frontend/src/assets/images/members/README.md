# Photos des Membres du CVAC

Ce dossier contient les photos des membres du CVAC.

## Format des fichiers

Les photos doivent être nommées selon le format suivant :
- Format de nom : `nom-prenom.jpg` ou `nom-prenom.png`
- Format d'image recommandé : JPG ou PNG
- Taille recommandée : 400x400 pixels minimum (carré)
- Poids recommandé : < 500 KB par image

## Liste des fichiers attendus

Voici la liste des fichiers d'images attendus pour chaque membre :

1. **Ahlem ZENATI** (Présidente)
   - Fichier : `ahlem-zenati.jpg` ou `ahlem-zenati.png`

2. **Michèle COUDERC** (Membre)
   - Fichier : `michele-couderc.jpg` ou `michele-couderc.png`

3. **Josette LEVÊQUE** (Membre)
   - Fichier : `josette-leveque.jpg` ou `josette-leveque.png`

4. **Rachel PRIEST** (Membre)
   - Fichier : `rachel-priest.jpg` ou `rachel-priest.png`

5. **Yvonne ZODO** (Membre)
   - Fichier : `yvonne-zodo.jpg` ou `yvonne-zodo.png`

6. **Eric DIOR** (Vice-président)
   - Fichier : `eric-dior.jpg` ou `eric-dior.png`

7. **Ahmid AIT OUALI** (Membre)
   - Fichier : `ahmid-ait-ouali.jpg` ou `ahmid-ait-ouali.png`

8. **Azedine ARIF** (Membre)
   - Fichier : `azedine-arif.jpg` ou `azedine-arif.png`

9. **Serge LECLERC** (Membre)
   - Fichier : `serge-leclerc.jpg` ou `serge-leclerc.png`

10. **Noham SETTBON** (Membre)
    - Fichier : `noham-settbon.jpg` ou `noham-settbon.png`

## Fonctionnement

Le système essaie d'abord de charger l'image locale (`.jpg` puis `.png` si le `.jpg` n'existe pas). Si aucune image locale n'est trouvée, il utilise l'image par défaut ou l'URL externe configurée dans les données du membre.

## Comment ajouter les photos

1. Placez les fichiers d'images dans ce dossier (`frontend/src/assets/images/members/`)
2. Nommez-les exactement comme indiqué ci-dessus (en minuscules, avec des tirets)
3. Redémarrez le serveur de développement Angular si nécessaire
4. Les images seront automatiquement chargées par l'application

## Note

Si vous utilisez Cloudinary pour héberger les images, vous pouvez également configurer les URLs Cloudinary dans l'API. Le système utilisera automatiquement les URLs Cloudinary si elles sont disponibles, sinon il cherchera les images locales.

