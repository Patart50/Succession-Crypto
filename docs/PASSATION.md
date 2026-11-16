# succession-crypto — Passation

## État (16 nov. 2026)
- J0 : SPEC v0.1 et décisions D-001 à D-008 validées par Arnaud.
- J1 : squelette livré en PR (branche `j1-squelette`, version 0.1.0). Coquille, navigation par ancre des 7 écrans (5 « En préparation »), accueil, « À propos et limites », auteur et soutien via commun-crypto `v1.2.0`, service worker, CI et déploiement Pages. Décision D-009 (thème non mémorisé) à valider en revue.

## Vérifié avant la PR J1
check, tests (7) et build verts ; axe-core WCAG 2 AA sans violation sur les 7 écrans et la fenêtre de soutien, en clair et en sombre, à 1280 et 375 px ; aucune requête externe ; localStorage, sessionStorage, IndexedDB et cookies vides ; QR codes décodés identiques aux adresses ; ouverture hors ligne.

## À faire par Arnaud
Relire et fusionner la PR J1. Le site se déploie sur https://patart50.github.io/succession-crypto/ à la fusion.

## Prochaine étape (Claude)
J2 sur la branche `j2-inventaire` : modèle de l'inventaire, formulaire, détecteur de seed (listes BIP39 anglaise et française, seuils réglés par tests), import/export JSON v1 avec validation stricte, avertissement `beforeunload`, réglage des montants désactivé par défaut.

## Points d'attention
- J5 : vérifier chaque règle fiscale sur Légifrance/BOFiP, aucune affirmation de mémoire.
- J2 : régler les seuils du détecteur par tests (faux positifs sur des notes ordinaires, vraies seeds avec fautes ou majuscules).
- Chaque PR : aucune requête externe, aucune écriture en stockage navigateur.
- `npm audit` : 2 alertes faibles (`deepmerge` via `@sveltejs/vite-plugin-svelte`), outil de build uniquement, pas de correctif publié ; même situation dans les autres outils.
