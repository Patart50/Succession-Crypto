# succession-crypto — Journal des décisions

Numérotation propre au projet. Dans les échanges : « succession D-00x ». Une décision n'est jamais réécrite : une nouvelle décision la remplace.

## D-001 — Aucun secret, détecteur de seed (16 nov. 2026, validée par Arnaud)
L'outil ne saisit ni ne stocke aucune seed, clé privée ou mot de passe. Tous les champs texte et tout fichier importé passent par un détecteur (listes BIP39 anglaise et française) qui refuse une suite de 12 mots ou plus quasi entièrement issue d'une liste, avec un message explicite. Le contenu refusé n'est pas conservé.

## D-002 — Aucune persistance automatique (16 nov. 2026, validée)
Ni localStorage, ni IndexedDB, ni cookie pour les données utilisateur. Sauvegarde uniquement par un fichier JSON exporté et réimporté volontairement. Pas de chiffrement de ce fichier : on ne recrée pas un coffre. Avertissement avant fermeture si des données ne sont pas exportées.

## D-003 — Montants optionnels, aucune valorisation, aucun réseau (16 nov. 2026, validée)
Champ montant désactivé par défaut (réglage global avec avertissement). Aucun appel réseau, même opt-in : pas de prix, pas de valorisation.

## D-004 — Lettre à séparation des informations (16 nov. 2026, validée)
La lettre décrit ce qui existe et à qui s'adresser, jamais où se trouvent les sauvegardes. Bandeau « aucune valeur juridique, ne remplace pas un testament, ne contient aucun secret » en tête. Structure imposée par l'outil.

## D-005 — Règles françaises sourcées et datées (16 nov. 2026, validée)
Contenu fiscal et juridique dans un fichier unique ; chaque règle porte une source (Légifrance ou BOFiP) et une date de vérification. Revue à chaque version. Rien n'est écrit de mémoire.

## D-006 — Exports par impression CSS, TXT et JSON (16 nov. 2026, validée)
PDF via `@media print` et « Enregistrer en PDF » du navigateur. Aucune bibliothèque PDF.

## D-007 — Bonnes pratiques en contenu seulement (16 nov. 2026, validée)
Multisig, Shamir, notaire, coffre : fiches pédagogiques, aucune implémentation.

## D-008 — Stack du programme et commun-crypto (16 nov. 2026, validée)
Svelte 5 + Vite + TypeScript + Vitest ; commun-crypto en dépendance git épinglée par tag (thème, polices, `Support`, service worker). decimal.js seulement si un calcul sur montants apparaît (aucun prévu en v1).

## D-009 — Thème non mémorisé (16 nov. 2026, J1, à valider en revue de PR)
Application stricte de D-002 : le choix du thème (automatique, clair, sombre) n'est pas enregistré. Il suit le système par défaut et un choix manuel ne dure que le temps de l'onglet. Les autres outils mémorisent ce réglage ; ici, la règle « rien n'est écrit dans le navigateur » reste vérifiable sans exception. Le service worker ne met en cache que le code de l'outil.

## D-010 — Détecteur de secrets étendu (16 nov. 2026, J2, validée avec la fusion de la PR #2 ; effacement précisé par D-011)
Précise D-001 sans la remplacer. Le détecteur refuse aussi : les sauvegardes abrégées (4 premières lettres des mots BIP39), une phrase avec une faute de frappe (11 mots sur 12), une phrase coupée entre deux champs quelconques d'un même emplacement (chaque paire de champs vérifiée dans les deux ordres), et les clés privées (hexadécimal 64, WIF, xprv et apparentées, base58 long). Une saisie suspecte est effacée à la frappe ; un secret coupé entre deux champs entraîne l'effacement de tous les champs texte du formulaire, faute de savoir lesquels sont en cause. Listes BIP39 copiées depuis bitcoin/bips et vérifiées par empreinte SHA-256, sans dépendance npm. Limites documentées (SPEC § 6) : trois champs ou plus, deux fautes ou plus, mots de passe et codes PIN.

## D-011 — Effacement ciblé d'une seed coupée (17 nov. 2026, validée par Arnaud)
Remplace, dans D-010, l'effacement de tous les champs texte. Quand une phrase de récupération n'apparaît qu'en réunissant deux champs, seuls ces deux champs sont effacés, signalés en erreur et nommés dans le message ; les autres saisies sont gardées et rien n'est enregistré. Le détecteur sait quelle paire a déclenché le refus (`findSecretFields`) : effacer le reste pénalisait l'utilisateur sans gain de sécurité. Le reste de D-010 est validé.

## D-012 — Contenu de la checklist (17 nov. 2026, J3, à valider en revue de PR)
18 points en 7 thèmes (SPEC § 5.2), formulés comme des actions vérifiables, sans aucune règle fiscale ou juridique énoncée (le thème « Fiscal et déclaratif » renvoie au J5, D-005). Identifiants figés par un test, car ce sont les clés de la sauvegarde ; l'import refuse désormais un identifiant inconnu (validation stricte). La date de prochaine révision est suggérée (un an après le jour de consultation) et imprimée, mais pas enregistrée : la stocker aurait demandé une version 2 du format JSON pour un gain faible. Points ajoutés par rapport à la SPEC v0.1 : passphrase, codes de secours de la double authentification, identité vérifiée sur les plateformes, historique des transactions.

## D-013 — Contenu de la lettre d'intention (17 nov. 2026, J4, à valider en revue de PR)
Applique D-004 (SPEC § 5.3). Quatre champs seulement (nom, destinataires, personne de confiance, notaire), gardés par le détecteur de secrets comme l'inventaire (D-010, D-011). Pas de champ date ni lieu : ils s'écrivent à la main avec la signature, ce qui évite une date imprimée qui vieillit ; la date de préparation figure en pied de lettre. Les conseils aux héritiers sont un texte fixe, centré sur les arnaques à la récupération (principal risque après un décès) et l'ordre des démarches. L'intro dit explicitement que l'emplacement des sauvegardes est transmis par les personnes à contacter. Les manques sont signalés sans bloquer l'impression. Mise en page d'impression resserrée pour tenir sur une page A4 avec un inventaire court.

## D-014 — Sources et présentation des règles françaises (17 nov. 2026, J5, à valider en revue de PR)
Précise D-005. Sources admises : Légifrance et BOFiP, plus les pages officielles d'impots.gouv.fr (DGFiP), plus à jour sur les seuils et délais pratiques ; aucun site privé, même de notaires ou d'avocats. Chaque source affiche la version ou la date de mise à jour donnée par la source elle-même, et chaque règle sa date de vérification. Le texte de la règle reformule la source sans rien y ajouter ; toute conséquence ou tout conseil va dans « En pratique », séparé visuellement. Sept règles retenues (SPEC § 5.4) ; pas de barème ni d'abattement (calcul de droits hors périmètre). À chaque version : revérifier chaque source et mettre à jour `RULES_VERIFIED`.
