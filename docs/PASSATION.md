# succession-crypto — Passation

## État (16 nov. 2026)
- J0 : SPEC v0.1 et décisions D-001 à D-008 validées par Arnaud.
- J1 : squelette v0.1.0, PR #1 fusionnée (D-009, thème non mémorisé, acceptée avec la fusion). Site : https://patart50.github.io/succession-Crypto/
- J2 : inventaire v0.2.0 en PR (branche `j2-inventaire`). Formulaire et liste des emplacements, détecteur de secrets (D-010, à valider), sauvegarde JSON v1 avec import strict, indicateur « Non exporté », avertissement à la fermeture, réglage des montants désactivé par défaut, exemple fictif.

## Vérifié avant la PR J2
- check, 69 tests et build verts.
- Détecteur : aucun faux positif sur 358 paragraphes de prose du programme (environ 18 000 mots).
- Chromium : axe-core WCAG 2 AA sans violation sur tous les écrans et tous les états de l'inventaire (vide, exemple, formulaire, refus, import refusé), en clair et en sombre, à 1280 et 375 px, sans défilement horizontal.
- Scénario : seed collée ou tapée effacée ; clé privée effacée ; seed coupée entre deux champs refusée ; export, rechargement (rien de gardé), import ; fichier piégé refusé sans répéter son contenu ; montants effacés en masquant le champ ; avertissement à la fermeture ; stockage du navigateur vide ; aucune requête externe.

## À faire par Arnaud
1. Relire et fusionner la PR J2 (valider D-010).
2. Finir de renommer le dépôt : il s'appelle `succession-Crypto` (C majuscule). Le renommer exactement `succession-crypto` (Settings → General). Tant que ce n'est pas fait, le site répond seulement sur `/succession-Crypto/` et les liens du README et des métadonnées (en minuscules) mènent à une page 404.

## Prochaine étape (Claude)
J3 sur la branche `j3-checklist` : checklist par thème (SPEC § 5.2), identifiants stables des points (clés `checklist` du JSON, déjà acceptées par l'import), date de prochaine révision, impression.

## Points d'attention
- J5 : vérifier chaque règle fiscale sur Légifrance/BOFiP, aucune affirmation de mémoire.
- J3 : restreindre l'import aux identifiants de points connus une fois la liste fixée (aujourd'hui : motif `[a-z0-9-]`, 200 points au plus).
- J4 : libellés des champs de la lettre dans les messages d'erreur d'import (aujourd'hui : noms techniques).
- Chaque PR : aucune requête externe, aucune écriture en stockage navigateur.
- `npm audit` : 2 alertes faibles (`deepmerge` via `@sveltejs/vite-plugin-svelte`), outil de build uniquement.
