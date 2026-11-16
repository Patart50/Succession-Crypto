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
