# succession-crypto — Passation

## État (17 nov. 2026)
- J0 : SPEC v0.1 et décisions D-001 à D-008 validées par Arnaud.
- J1 : squelette v0.1.0, PR #1 fusionnée (D-009, thème non mémorisé, acceptée avec la fusion). Site : https://patart50.github.io/succession-crypto/
- J2 : inventaire v0.2.0, PR #2 fusionnée (D-010 validée). Formulaire et liste des emplacements, détecteur de secrets, sauvegarde JSON v1 avec import strict, indicateur « Non exporté », avertissement à la fermeture, réglage des montants désactivé par défaut, exemple fictif.
- Correctif v0.2.1, PR #3 fusionnée : seed coupée entre deux champs, seuls ces deux champs sont effacés (D-011) ; tests de seed de 24 mots coupée.
- J3 : checklist v0.3.0, PR #4 fusionnée (D-012 acceptée avec la fusion) : 18 points en 7 thèmes, impression, export TXT.
- J4 : lettre d'intention v0.4.0, PR #5 fusionnée (D-013 acceptée avec la fusion).
- J5 : règles françaises et bonnes pratiques v0.5.0 en PR (branche `j5-contenu`) : 7 règles sourcées (Légifrance, BOFiP, impots.gouv.fr) vérifiées le 17 nov. 2026, 7 fiches pédagogiques, écran « En préparation » supprimé (D-014, à valider).
- Dépôt renommé en `succession-crypto` (17 nov. 2026). Page blanche le 17 nov. : Pages était sur « Deploy from a branch », le déploiement brut de GitHub a écrasé le nôtre ; redéploiement relancé. Même problème après la fusion de la PR #4 (la source était encore « Deploy from a branch ») : redéploiement relancé à nouveau.

## Vérifié avant la PR J5
- check, 165 tests et build verts (dont : chaque règle a une source https sur un domaine admis, versionnée et datée ; aucun texte ne déclenche le détecteur ; « 4 lettres suffisent » vérifié sur les deux listes BIP39).
- Chaque règle relue contre sa source le 17 nov. 2026 (WebFetch des pages Légifrance, BOFiP et impots.gouv.fr citées).
- Chromium : axe-core WCAG 2 AA sans violation (règles, pratiques, accueil ; clair et sombre ; 1280 et 375 px) ; scénarios J1 à J4 toujours verts ; 10 liens de source officiels en nouvel onglet ; aucune requête externe.

## À faire par Arnaud
1. **Settings → Pages → Source : « GitHub Actions ».** Sinon page blanche après chaque fusion.
2. Relire les règles françaises (écran « Règles françaises ») et fusionner la PR J5 (valider D-014).

## Prochaine étape (Claude)
J6 sur la branche `j6-v1` : relecture complète (textes, accessibilité au clavier et au lecteur d'écran, impression), page « À propos » sans la mention « version de développement », version 1.0.0 ; Arnaud tague `v1.0.0` et crée la release.

## Points d'attention
- Règles françaises : revérifier chaque source et mettre à jour `RULES_VERIFIED` à chaque version (D-014).
- Chaque PR : aucune requête externe, aucune écriture en stockage navigateur.
- `npm audit` : 2 alertes faibles (`deepmerge` via `@sveltejs/vite-plugin-svelte`), outil de build uniquement.
