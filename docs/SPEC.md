# succession-crypto — Spécification v0.1

Statut : v0.1, 16 nov. 2026 (J0 : spec et décisions ; J1 : squelette livré). Décisions : [DECISIONS.md](DECISIONS.md) (succession D-001 à D-009).
Dépôt : github.com/Patart50/succession-crypto — licence AGPL-3.0.

## 1. Objectif

Aider un particulier à préparer la transmission de ses cryptoactifs à ses proches, **sans jamais manipuler de phrase de récupération, de clé privée ni de mot de passe**. L'outil produit un inventaire, une checklist et une lettre d'intention à imprimer, et rappelle les règles françaises de base.

Public : détenteur particulier, non expert, résidant fiscal en France.

## 2. Non-objectifs (hors périmètre, définitif)

- Saisir, stocker, chiffrer ou découper une seed, une clé privée ou un mot de passe (D-001).
- Se connecter à un wallet, une plateforme ou une blockchain ; aucune valorisation (D-003).
- Conseil juridique ou fiscal personnalisé ; rédaction de testament ; calcul de droits de succession.
- Implémenter multisig, Shamir ou tout mécanisme cryptographique (D-007).
- Toute persistance automatique dans le navigateur (D-002), y compris des préférences d'affichage (D-009).

## 3. Principes

- Stack du programme : Svelte 5 + Vite + TypeScript + Vitest ; commun-crypto épinglé par tag (thème, polices, `Support`, plugin de service worker) (D-008). Tag utilisé : `v1.2.0`.
- 100 % client-side, **aucun appel réseau, même opt-in**. Hors ligne via service worker, qui ne met en cache que le code de l'outil. Aucun CDN.
- Français, thème clair/sombre (automatique par défaut, choix non mémorisé, D-009), WCAG 2 AA.
- Aucune donnée réelle dans le dépôt : exemples fictifs (« Plateforme A », « Wallet matériel 1 »).
- Auteur et soutien : pied de page « Créé par Arnaud (Patart50) · Soutenir le projet », section dans « À propos et limites » et le README, `.github/FUNDING.yml`.

## 4. Modèle de menace

L'inventaire et la lettre ne contiennent aucun secret mais révèlent l'existence et l'emplacement d'actifs : ce sont des documents sensibles (risque de vol, d'extorsion).

Mesures :
- aucun montant par défaut (D-003) ;
- aucune persistance automatique ; les données ne quittent la mémoire de l'onglet que par un export volontaire (D-002) ;
- séparation des informations : la lettre ne dit jamais où sont les sauvegardes, seulement à qui s'adresser (D-004) ;
- détection et refus de ce qui ressemble à une seed dans tous les champs de texte (D-001) ;
- conseils affichés : où ranger le fichier exporté et la lettre imprimée, ne pas les envoyer par e-mail ni les stocker dans un cloud non chiffré.

Hors protection : machine compromise, document imprimé laissé sans protection, mauvais choix de la personne de confiance.

## 5. Fonctionnalités

### 5.1 Inventaire (J2)

Une ligne par « emplacement » :

| Champ | Type | Obligatoire |
|---|---|---|
| Type | plateforme centralisée / wallet matériel / wallet logiciel / autre (DeFi, staking, NFT…) | oui |
| Nom | texte court (ex. « Plateforme A ») | oui |
| Actifs | texte libre (ex. « BTC, ETH ») | non |
| Montant indicatif | texte, désactivé par défaut (réglage global, avertissement) | non |
| Accès : à qui s'adresser | notaire / personne de confiance / document scellé / autre | oui |
| Précision | texte libre court, sans secret (ex. « enveloppe chez Me X ») | non |
| Procédure décès de la plateforme connue | oui / non / sans objet | non |
| Notes | texte libre | non |

Tous les champs texte passent par le détecteur de seed (D-001).

### 5.2 Checklist (J3)

Liste de points cochables, groupés par thème, chacun avec une explication courte. Thèmes v1 :
1. Inventaire à jour et daté.
2. Sauvegardes : chaque seed sauvegardée hors ligne, support durable, sauvegarde testée, rangée dans un lieu distinct de la lettre.
3. Personnes : personne de confiance désignée et informée ; notaire informé de l'existence d'actifs numériques.
4. Plateformes : procédure en cas de décès connue pour chaque plateforme centralisée.
5. Documents : lettre imprimée, datée, signée ; emplacement connu des proches.
6. Fiscal et déclaratif : obligations déclaratives à jour (contenu J5, sourcé).
7. Révision : date de prochaine révision (annuelle conseillée).

État de la checklist inclus dans l'export JSON.

### 5.3 Lettre d'intention (J4)

Générée à partir de l'inventaire et d'un formulaire (nom affiché, date, destinataires, personne de confiance, notaire). Structure imposée (D-004) :
1. Bandeau en tête : « Ce document n'a aucune valeur juridique. Il ne remplace ni un testament ni les conseils d'un notaire. Il ne contient aucun secret. »
2. Ce qui existe : liste des emplacements (type, nom, actifs ; montants seulement si activés).
3. À qui s'adresser pour chaque emplacement.
4. Conseils aux héritiers : ne pas se précipiter, se méfier des arnaques à la récupération, ne jamais saisir une seed sur un site, contacter le notaire.
5. Date, lieu, signature (zones vides à remplir à la main).

Aucun champ ne permet d'indiquer l'emplacement d'une sauvegarde de seed dans la lettre.

### 5.4 Règles françaises (J5)

Fichier de contenu unique `src/content/regles.ts` : chaque règle a un texte, une source (Légifrance ou BOFiP, URL), une date de vérification (D-005). Sujets à couvrir, **à vérifier un par un au J5, rien n'est acquis à ce stade** :
- inclusion des cryptoactifs dans l'actif successoral, valeur retenue ;
- délai de déclaration de succession ;
- prix d'acquisition retenu pour l'héritier lors d'une cession ultérieure ;
- comptes d'actifs numériques ouverts à l'étranger (obligation déclarative) ;
- rôle du notaire.

Avertissement permanent sur la page : information générale, non personnalisée, datée.

### 5.5 Bonnes pratiques (J5, contenu pédagogique, D-007)

Fiches courtes : sauvegarde de seed sur support métal, passphrase BIP39 et son risque pour les héritiers, Shamir/SLIP-39 via le wallet matériel, multisig, coffre bancaire, enveloppe chez le notaire, arnaques à la récupération.

### 5.6 Exports (D-006)

- **Impression** de la lettre et de la checklist via feuille de style `@media print` (l'utilisateur choisit « Enregistrer en PDF »).
- **TXT** de la lettre et de la checklist.
- **JSON** complet, réimportable sans perte.

Format JSON v1 :

```json
{
  "format": "succession-crypto",
  "version": 1,
  "exporteLe": "2026-11-16T10:00:00Z",
  "reglages": { "montantsActives": false },
  "inventaire": [
    { "id": "…", "type": "plateforme", "nom": "Plateforme A", "actifs": "BTC", "montant": null,
      "acces": "notaire", "precision": "", "procedureDeces": "non", "notes": "" }
  ],
  "checklist": { "inventaire-date": true },
  "lettre": { "nomAffiche": "", "destinataires": "", "personneConfiance": "", "notaire": "" }
}
```

À l'import : validation stricte, détecteur de seed appliqué à tous les champs, refus du fichier entier en cas d'échec avec message précis.

## 6. Détecteur de seed (D-001)

- Listes BIP39 anglaise et française embarquées.
- Un champ est refusé si une suite d'au moins 12 mots contient au moins 11 mots d'une même liste. Seuils à ajuster par tests (faux positifs sur des notes ordinaires).
- Message : expliquer pourquoi c'est refusé et rappeler qu'une seed ne doit jamais être saisie sur un ordinateur.
- Le contenu refusé n'est ni conservé ni journalisé.

## 7. Écrans

Navigation par ancre (`src/lib/router.ts`) ; les ancres ne nomment que des écrans, jamais des données.

1. Accueil `#accueil` : ce que fait l'outil, ce qu'il ne fait pas, rappel « rien n'est enregistré : exportez avant de fermer ».
2. Inventaire `#inventaire`. 3. Checklist `#checklist`. 4. Lettre `#lettre` (aperçu imprimable). 5. Règles françaises `#regles`. 6. Bonnes pratiques `#pratiques`. 7. À propos et limites `#a-propos` (dont Auteur et soutien), lien en pied de page.

Tant qu'un écran n'est pas livré, il affiche « En préparation » avec son jalon.

Avertissement `beforeunload` si des données non exportées existent (J2).

## 8. Jalons

| Jalon | Contenu | État |
|---|---|---|
| J0 | Spec v0.1, décisions D-001 à D-008 | fait |
| J1 | Squelette, commun-crypto, thème, service worker, auteur et soutien, « À propos et limites » | fait (v0.1.0) |
| J2 | Inventaire, détecteur de seed, import/export JSON | |
| J3 | Checklist | |
| J4 | Lettre, impression, export TXT | |
| J5 | Règles françaises sourcées, bonnes pratiques | |
| J6 | Accessibilité, relecture, v1.0.0 | |

## 9. Critères d'acceptation (chaque PR)

`check`, tests et build verts ; vérification dans Chromium avec axe-core (tous les écrans, clair et sombre, 1280 et 375 px) ; aucune requête réseau externe (vérifiée) ; aucune écriture dans localStorage, sessionStorage, IndexedDB ni cookie ; test de checksum des adresses de don vert ; QR codes décodés identiques ; ouverture hors ligne après une première visite.
