# succession-crypto — Passation

## État (17 nov. 2026)
- J0 : SPEC v0.1 et décisions D-001 à D-008 validées par Arnaud.
- J1 : squelette v0.1.0, PR #1 fusionnée (D-009, thème non mémorisé, acceptée avec la fusion). Site : https://patart50.github.io/succession-crypto/
- J2 : inventaire v0.2.0, PR #2 fusionnée (D-010 validée). Formulaire et liste des emplacements, détecteur de secrets, sauvegarde JSON v1 avec import strict, indicateur « Non exporté », avertissement à la fermeture, réglage des montants désactivé par défaut, exemple fictif.
- Correctif v0.2.1, PR #3 fusionnée : seed coupée entre deux champs, seuls ces deux champs sont effacés (D-011) ; tests de seed de 24 mots coupée.
- J3 : checklist v0.3.0, PR #4 fusionnée (D-012 acceptée avec la fusion) : 18 points en 7 thèmes, impression, export TXT.
- J4 : lettre d'intention v0.4.0 en PR (branche `j4-lettre`) : quatre champs gardés par le détecteur, structure imposée, conseils aux héritiers, impression sur une page A4, export TXT (D-013, à valider).
- Dépôt renommé en `succession-crypto` (17 nov. 2026). Page blanche le 17 nov. : Pages était sur « Deploy from a branch », le déploiement brut de GitHub a écrasé le nôtre ; redéploiement relancé. Même problème après la fusion de la PR #4 (la source était encore « Deploy from a branch ») : redéploiement relancé à nouveau.

## Vérifié avant la PR J4
- check, 96 tests et build verts.
- Chromium : axe-core WCAG 2 AA sans violation (lettre vide, remplie, après refus ; clair et sombre ; 1280 et 375 px) ; scénarios J1 à J3 toujours verts.
- Scénario J4 : avertissements, seed collée dans un champ vide effacée (aussi à l'écran), seed coupée entre deux champs, contenu de la lettre, export TXT, lettre dans la sauvegarde puis restaurée, impression de la seule lettre (PDF A4 d'une page vérifié) ; stockage vide ; aucune requête externe.

## À faire par Arnaud
1. **Settings → Pages → Source : « GitHub Actions ».** Toujours sur « Deploy from a branch » au 17 nov. 12 h : chaque fusion redonne une page blanche jusqu'à ce que Claude relance le déploiement.
2. Relire et fusionner la PR J4 (valider D-013).

## Prochaine étape (Claude)
J5 sur la branche `j5-contenu` : règles françaises sourcées (Légifrance, BOFiP, chaque règle datée, rien de mémoire, D-005) et fiches de bonnes pratiques (D-007).

## Points d'attention
- J5 : vérifier chaque règle fiscale sur Légifrance/BOFiP, aucune affirmation de mémoire.
- Chaque PR : aucune requête externe, aucune écriture en stockage navigateur.
- `npm audit` : 2 alertes faibles (`deepmerge` via `@sveltejs/vite-plugin-svelte`), outil de build uniquement.
