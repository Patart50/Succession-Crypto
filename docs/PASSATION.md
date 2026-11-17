# succession-crypto — Passation

## État (17 nov. 2026)
- J0 : SPEC v0.1 et décisions D-001 à D-008 validées par Arnaud.
- J1 : squelette v0.1.0, PR #1 fusionnée (D-009, thème non mémorisé, acceptée avec la fusion). Site : https://patart50.github.io/succession-crypto/
- J2 : inventaire v0.2.0, PR #2 fusionnée (D-010 validée). Formulaire et liste des emplacements, détecteur de secrets, sauvegarde JSON v1 avec import strict, indicateur « Non exporté », avertissement à la fermeture, réglage des montants désactivé par défaut, exemple fictif.
- Correctif v0.2.1, PR #3 fusionnée : seed coupée entre deux champs, seuls ces deux champs sont effacés (D-011) ; tests de seed de 24 mots coupée.
- J3 : checklist v0.3.0 en PR (branche `j3-checklist`) : 18 points en 7 thèmes, liens avec l'inventaire, date de révision suggérée, impression, export TXT, import restreint aux points connus (D-012, à valider).
- Dépôt renommé en `succession-crypto` (17 nov. 2026). Page blanche le 17 nov. : Pages était sur « Deploy from a branch », le déploiement brut de GitHub a écrasé le nôtre ; redéploiement relancé, Arnaud passe la source sur « GitHub Actions ».

## Vérifié avant la PR J3
- check, 87 tests et build verts.
- Chromium : axe-core WCAG 2 AA sans violation (checklist vide et remplie, clair et sombre, 1280 et 375 px) ; scénarios J1 et J2 toujours verts.
- Scénario J3 : progression, plateforme sans procédure signalée, rappel d'export, export TXT, cases dans la sauvegarde puis restaurées après import, décocher, impression (navigation et boutons masqués, rendu PDF A4 sur deux pages) ; stockage vide ; aucune requête externe.

## À faire par Arnaud
1. Vérifier que Settings → Pages → Source vaut « GitHub Actions » (sinon page blanche à chaque fusion).
2. Relire et fusionner la PR J3 (valider D-012).

## Prochaine étape (Claude)
J4 sur la branche `j4-lettre` : formulaire de la lettre (nom affiché, date, destinataires, personne de confiance, notaire), structure imposée (D-004), aperçu imprimable, export TXT, libellés des champs de la lettre dans les messages d'erreur d'import.

## Points d'attention
- J5 : vérifier chaque règle fiscale sur Légifrance/BOFiP, aucune affirmation de mémoire.
- J4 : libellés des champs de la lettre dans les messages d'erreur d'import (aujourd'hui : noms techniques).
- Chaque PR : aucune requête externe, aucune écriture en stockage navigateur.
- `npm audit` : 2 alertes faibles (`deepmerge` via `@sveltejs/vite-plugin-svelte`), outil de build uniquement.
