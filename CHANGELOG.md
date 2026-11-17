# Notes de version

## 1.0.0 — Première version stable (J6)

- Accueil : parcours en quatre étapes (inventaire, sauvegarde, checklist, lettre).
- Sécurité : politique de sécurité du contenu ; le navigateur bloque toute connexion vers un autre site que celui de l'outil.
- Accessibilité : chaque écran donne son titre à l'onglet (annoncé par les lecteurs d'écran) ; le lien « Aller au contenu » ne fait plus quitter l'écran en cours ; audit complet au clavier, à 320 px et avec les bonnes pratiques d'axe-core.
- Robustesse vérifiée : fichiers d'import vides, binaires ou piégés refusés ; texte HTML importé affiché comme texte ; 500 emplacements importés et affichés en moins d'une seconde.
- Page « À propos » : date de vérification des règles, liens externes sans transmission de données.

## 0.5.0 — Règles françaises et bonnes pratiques (J5)

- Règles françaises : 7 règles sur la succession de cryptos (périmètre, évaluation au jour du décès, délai de déclaration, dispense, notaire, prix d'acquisition de l'héritier, comptes à l'étranger), chacune avec sa source officielle (Légifrance, BOFiP, impots.gouv.fr), sa version et sa date de vérification.
- Bonnes pratiques : 7 fiches (métal, passphrase, Shamir, multisig, coffre, enveloppe chez le notaire, arnaques à la récupération), chacune avec son piège à éviter.
- Tous les écrans sont désormais disponibles.

## 0.4.0 — Lettre d'intention (J4)

- Lettre à imprimer, dater et signer : ce qui existe d'après l'inventaire, les personnes à contacter, des conseils pour vos proches contre les arnaques à la récupération. Elle ne dit jamais où sont vos sauvegardes.
- Quatre champs (votre nom, destinataires, personne de confiance, notaire), protégés par le détecteur de secrets.
- Aperçu à l'écran, impression ou PDF (une page A4 pour un inventaire court), export en texte (.txt).
- Avertissements avant impression : nom absent, aucune personne à contacter, inventaire vide.
- La lettre est incluse dans la sauvegarde ; les erreurs d'import nomment ses champs en clair.

## 0.3.0 — Checklist (J3)

- Checklist de 18 points en 7 thèmes : inventaire, sauvegardes, personnes, plateformes, documents, fiscal et déclaratif, révision. Chaque point est expliqué en une phrase.
- Liens avec l'inventaire : nombre d'emplacements, plateformes dont la procédure décès n'est pas renseignée, rappel si les saisies ne sont pas exportées.
- Date de prochaine révision suggérée (un an).
- Impression ou enregistrement en PDF, export en texte (.txt).
- L'état des cases est inclus dans la sauvegarde ; l'import refuse un point inconnu.

## 0.2.1 — Effacement ciblé

- Une phrase de récupération coupée entre deux champs n'efface plus tout le formulaire : seuls les deux champs en cause sont vidés et nommés, le reste de la saisie est gardé.
- Tests ajoutés pour une phrase de 24 mots (Ledger) coupée en 2, 3 ou 4 champs.

## 0.2.0 — Inventaire (J2)

- Inventaire : un emplacement par plateforme ou wallet, avec ses actifs, la personne ou le document à qui s'adresser, une précision, la procédure décès de la plateforme et des notes. Ajout, modification, suppression ; exemple fictif pour découvrir l'outil.
- Détecteur de secrets : une saisie qui ressemble à une phrase de récupération (anglais ou français, abrégée, numérotée, avec une faute de frappe, coupée entre deux champs) ou à une clé privée est effacée sur-le-champ, jamais conservée.
- Sauvegarde : export d'un fichier JSON à ranger soi-même ; import avec vérification stricte, qui refuse un fichier contenant un secret sans en répéter le contenu.
- Rien n'est enregistré dans le navigateur : indicateur « Non exporté » et confirmation avant de fermer l'onglet.
- Montant indicatif désactivé par défaut ; le masquer efface les montants saisis.

## 0.1.0 — Squelette (J1)

- Accueil : ce que fait l'outil, ce qu'il ne fera jamais (aucun secret, aucune connexion, aucun envoi), rappel « rien n'est enregistré ».
- Navigation : Accueil, Inventaire, Checklist, Lettre, Règles françaises, Bonnes pratiques ; les sections à venir annoncent leur jalon.
- Page « À propos et limites » : ce que fait l'outil, ce qu'il ne fait pas, vos données, précautions, avertissement, contribuer, auteur et soutien.
- Thème clair, sombre ou automatique, non mémorisé : rien n'est écrit dans le navigateur.
- Hors ligne après une première visite. Aucune requête sur Internet.
- Accessibilité : WCAG 2 AA vérifié avec axe-core sur tous les écrans, en clair et en sombre, sur bureau et à 375 px.
