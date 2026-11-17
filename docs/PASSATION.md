# succession-crypto — Passation

## État (17 nov. 2026, v1.0.0)
- J0 : SPEC v0.1 et décisions D-001 à D-008 validées par Arnaud.
- J1 : squelette v0.1.0, PR #1 fusionnée (D-009, thème non mémorisé, acceptée avec la fusion). Site : https://patart50.github.io/succession-crypto/
- J2 : inventaire v0.2.0, PR #2 fusionnée (D-010 validée). Formulaire et liste des emplacements, détecteur de secrets, sauvegarde JSON v1 avec import strict, indicateur « Non exporté », avertissement à la fermeture, réglage des montants désactivé par défaut, exemple fictif.
- Correctif v0.2.1, PR #3 fusionnée : seed coupée entre deux champs, seuls ces deux champs sont effacés (D-011) ; tests de seed de 24 mots coupée.
- J3 : checklist v0.3.0, PR #4 fusionnée (D-012 acceptée avec la fusion) : 18 points en 7 thèmes, impression, export TXT.
- J4 : lettre d'intention v0.4.0, PR #5 fusionnée (D-013 acceptée avec la fusion).
- J5 : règles françaises et bonnes pratiques v0.5.0, PR #6 fusionnée (D-014 acceptée avec la fusion).
- J6 : v1.0.0 en PR (branche `j6-v1`) : relecture des textes, parcours en quatre étapes, titre de document par écran, correction du lien d'évitement, CSP (D-015, à valider), audit complet.
- Dépôt renommé en `succession-crypto` (17 nov. 2026). Page blanche le 17 nov. : Pages était sur « Deploy from a branch », le déploiement brut de GitHub a écrasé le nôtre ; redéploiement relancé. Même problème après la fusion de la PR #4 (la source était encore « Deploy from a branch ») : redéploiement relancé à nouveau. Source passée sur « GitHub Actions » ensuite : la fusion de la PR #5 n'a déclenché que notre déploiement (constaté le 17 nov.).

## Vérifié avant la PR J6 (v1.0.0)
- check, 166 tests, build verts ; `npm audit` : 0 vulnérabilité ; bundle : 173 Ko de JS (listes BIP39 comprises), 21 Ko de CSS.
- Scénarios Chromium J1 à J5 rejoués, tous verts.
- Audit J6 (53 contrôles) : axe-core avec `best-practice` et WCAG 2.2 AA sur les 7 écrans remplis ; un seul h1 et pas de saut de titre ; focus visible sur chaque élément au clavier ; lien d'évitement ; focus sur le titre à chaque changement d'écran ; titre du document par écran ; formulaire d'inventaire entièrement au clavier ; annonces `role=status` et `role=alert`, `aria-invalid` et `aria-describedby` sur un champ refusé ; fenêtre de soutien (focus, Échap, retour du focus) ; 320 px sans défilement horizontal ; imports vide, binaire, tableau, `__proto__` refusés ; HTML importé affiché comme texte ; 500 emplacements en moins d'une seconde.
- CSP : application intacte (QR codes, export, service worker, polices) ; `fetch` vers un autre site bloqué par le navigateur.

## À faire par Arnaud
1. Relire et fusionner la PR J6 (valider D-015).
2. Taguer et publier : GitHub → Releases → « Draft a new release » → tag `v1.0.0` sur `main`, titre « succession-crypto 1.0.0 », texte = section 1.0.0 du CHANGELOG (ou `git tag v1.0.0 && git push origin v1.0.0` puis créer la release).

## Prochaine étape (Claude)
Aucune obligatoire. Pistes après la v1.0 : revérifier les règles françaises à chaque loi de finances (D-014) ; extraire le détecteur de secrets dans commun-crypto si un autre outil en a besoin ; corriger le même bug de lien d'évitement dans carnet, renfort, dca et staking (voir PROGRAMME).

## Points d'attention
- Règles françaises : revérifier chaque source et mettre à jour `RULES_VERIFIED` à chaque version (D-014).
- Chaque PR : aucune requête externe, aucune écriture en stockage navigateur.
- `npm audit` : 2 alertes faibles (`deepmerge` via `@sveltejs/vite-plugin-svelte`), outil de build uniquement.
