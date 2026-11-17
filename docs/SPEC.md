# succession-crypto — Spécification v1.0

Statut : v1.0, 17 nov. 2026 (J0 à J6 livrés ; version 1.0.0). Décisions : [DECISIONS.md](DECISIONS.md) (succession D-001 à D-015).
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
- Politique de sécurité du contenu (CSP) ajoutée au build : `connect-src 'self'`, scripts, styles et polices du seul site de l'outil, aucun envoi de formulaire (D-015). Le navigateur bloque toute exfiltration, même par un code compromis.
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

Tous les champs texte passent par le détecteur de secrets à chaque frappe ; une saisie suspecte est effacée sur-le-champ (D-001, D-010). À l'enregistrement, l'emplacement entier est vérifié (secret coupé entre deux champs) ; en cas de refus, seuls les deux champs qui forment le secret une fois réunis sont effacés et nommés dans le message, les autres saisies sont gardées (D-011).

Longueurs maximales : nom 80, actifs 200, montant 60, précision 200, notes 1 000 caractères. Le champ « Procédure décès » n'apparaît que pour une plateforme centralisée (sinon « sans objet »). Masquer le champ montant efface les montants saisis, après confirmation. Un exemple entièrement fictif (« Plateforme A », « Wallet matériel 1 ») peut être chargé quand l'inventaire est vide.

### 5.2 Checklist (J3)

Contenu : `src/lib/core/checklist.ts`. 18 points cochables en 7 thèmes, chacun avec une explication courte (D-012) :

1. **Inventaire** : chaque plateforme et wallet y figure (`inventaire-complet`) ; inventaire exporté et rangé (`inventaire-exporte`).
2. **Sauvegardes** : seed notée hors ligne (`sauvegarde-hors-ligne`), support durable (`sauvegarde-durable`), sauvegarde testée (`sauvegarde-testee`), rangée à part de la lettre (`sauvegarde-separee`), transmission de la passphrase prévue (`passphrase`), codes de secours de la double authentification rangés (`double-authentification`).
3. **Personnes** : personne de confiance désignée et informée (`personne-confiance`), notaire informé (`notaire-informe`), proches informés de l'existence du dossier (`proches-informes`).
4. **Plateformes** : procédure décès connue (`plateformes-procedure`), comptes au nom du titulaire avec identité vérifiée (`plateformes-identite`).
5. **Documents** : lettre imprimée, datée, signée (`lettre-signee`), rangée là où les proches la chercheront (`lettre-rangee`).
6. **Fiscal et déclaratif** : déclarations à jour (`declarations-a-jour`), historique des achats et ventes conservé (`historique-conserve`). Aucune règle n'est énoncée ici : renvoi à la section « Règles françaises » (J5, D-005).
7. **Révision** : date de révision fixée (`revision-planifiee`), une fois par an et après chaque changement.

Les identifiants entre parenthèses sont les clés de `checklist` dans la sauvegarde : ils sont figés (un test l'impose). Seuls les points cochés sont enregistrés.

Liens avec l'inventaire, à l'écran : nombre d'emplacements, rappel si les saisies ne sont pas exportées, liste des plateformes dont la procédure décès n'est pas renseignée (« Oui »). Date de prochaine révision suggérée : un an après le jour de consultation, affichée et imprimée, non enregistrée.

Progression « n points sur 18 ». Impression (navigation, boutons et rappels d'écran masqués ; date et mention « ne contient aucun secret » ajoutées) et export TXT `succession-crypto-checklist-AAAA-MM-JJ.txt`.

### 5.3 Lettre d'intention (J4)

Code : `src/lib/core/letter.ts` (modèle, texte), `src/lib/ui/Letter.svelte` (formulaire, aperçu), `LetterDocument.svelte` (rendu commun à l'écran et à l'impression).

Quatre champs (500 caractères au plus, gardés par le détecteur de secrets comme l'inventaire, y compris une seed coupée entre deux champs) : **Votre nom**, **Destinataires**, **Personne de confiance** (nom et moyen de la joindre), **Notaire** (nom, étude, ville). La date et le lieu ne sont pas saisis : ils s'écrivent à la main avec la signature (D-013).

Structure imposée (D-004) :
1. Bandeau : « Ce document n'a aucune valeur juridique. Il ne remplace ni un testament ni les conseils d'un notaire. Il ne contient aucun secret : ni phrase de récupération, ni clé privée, ni mot de passe. »
2. Titre, « À l'attention de : … » (ou « de mes proches »), introduction : « Moi, …, je détiens des cryptoactifs… Elle ne dit volontairement pas où se trouvent mes sauvegardes : cette information vous sera transmise par les personnes ci-dessous. »
3. Personnes à contacter : personne de confiance, notaire (ceux qui sont renseignés).
4. Ce qui existe : chaque emplacement de l'inventaire (nom, type, actifs, montant seulement si le réglage est activé, « À qui s'adresser : contact — précision », notes).
5. Conseils pour mes proches, texte fixe : ne pas se précipiter ; commencer par le notaire et la personne de confiance ; personne n'a besoin de la phrase de récupération pour aider, quiconque la demande cherche à voler ; ne jamais la saisir sur un site, une application ou un formulaire, seulement sur le wallet concerné ; passer par le site officiel d'une plateforme, jamais par un lien reçu ; se méfier des aides spontanées après le décès.
6. « Fait à : ____ le : ____ », « Signature : », zone vide ; mention « Document préparé le … avec succession-crypto ».

Aucun champ ne permet d'indiquer l'emplacement d'une sauvegarde. Avant impression, l'écran signale les manques (nom absent, aucune personne à contacter, inventaire vide) sans bloquer.

Sorties : impression (seule la lettre ; une page A4 pour un inventaire court) et export TXT `succession-crypto-lettre-AAAA-MM-JJ.txt`. Les champs sont inclus dans la sauvegarde JSON (`lettre`) ; les messages d'erreur d'import utilisent leurs libellés.

### 5.4 Règles françaises (J5)

Contenu : `src/content/regles.ts`. Chaque règle a un titre, un texte qui reformule la source, un « En pratique » facultatif (conséquence pour une succession de cryptos, présentée comme telle), une ou plusieurs sources (libellé, URL, version affichée par la source) et une date de vérification (D-005, D-014). Sources admises : legifrance.gouv.fr, bofip.impots.gouv.fr, impots.gouv.fr ; un test l'impose.

Sept règles, vérifiées le 17 nov. 2026 :

| Règle | Sources |
|---|---|
| Les cryptos font partie de la succession (défunt domicilié en France : tous biens, en France ou hors de France) | BOI-ENR-DMTG-10-10-30 § III.A (art. 750 ter CGI) |
| Évaluation à la valeur vénale au jour du décès | BOI-ENR-DMTG-10-40-10-10 (art. 666 CGI), BOI-ENR-DMTG-10-30 (décès, fait générateur) |
| Déclaration dans les 6 mois (décès en France métropolitaine), un an sinon, cas particuliers outre-mer | BOI-ENR-DMTG-10-60-50 (art. 641 CGI), impots.gouv.fr (MAJ 30/03/2026) |
| Dispense de déclaration : actif brut < 50 000 € (ligne directe, conjoint, sans donation antérieure non déclarée), 3 000 € sinon | impots.gouv.fr (MAJ 30/03/2026) |
| Notaire obligatoire en présence de biens ou droits immobiliers | impots.gouv.fr (MAJ 30/03/2026) |
| Prix d'acquisition de l'héritier : valeur retenue pour les droits de mutation | Légifrance, art. 150 VH bis III B CGI (en vigueur depuis le 01/07/2026) |
| Comptes d'actifs numériques à l'étranger : formulaire 3916-bis chaque année ; amende 750 €, 1 500 € au-delà de 50 000 €, plafond 10 000 € par déclaration | impots.gouv.fr (modifié 06/05/2024, art. 1649 bis C CGI), BOI-CF-INF-20-10-50 § I.D (art. 1736 CGI) |

Bandeau permanent : information générale, date de vérification, pas un conseil personnalisé, consulter la source et un notaire. Aucun calcul de droits (abattements, barème) : hors périmètre.

### 5.5 Bonnes pratiques (J5, D-007)

Contenu : `src/content/pratiques.ts`. Sept fiches (résumé, points, « Piège à éviter ») : sauvegarde sur métal, passphrase, partage de Shamir (SLIP-39, dans le wallet matériel ; découper soi-même sa phrase n'en est pas un), multisig (conserver aussi la description du wallet), coffre bancaire, enveloppe scellée chez le notaire, arnaques à la récupération. Aucune marque ni service recommandé. L'affirmation « 4 lettres identifient chaque mot » est vérifiée par un test sur les deux listes BIP39. Sommaire en tête d'écran.

### 5.6 Exports (D-006)

- **Impression** de la lettre et de la checklist via feuille de style `@media print` (l'utilisateur choisit « Enregistrer en PDF »).
- **TXT** de la checklist (J3) et de la lettre (J4), même contenu que l'impression.
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
  "checklist": { "inventaire-exporte": true },
  "lettre": { "nomAffiche": "", "destinataires": "", "personneConfiance": "", "notaire": "" }
}
```

À l'import : validation stricte (format, version, champs connus seulement, points de checklist connus seulement, types, valeurs des listes, longueurs, identifiants uniques, 1 Mo et 500 emplacements au plus), détecteur de secrets appliqué à chaque champ et à chaque paire de champs d'un emplacement, refus du fichier entier en cas d'échec avec un message précis qui ne répète jamais le contenu refusé. Un import remplace toutes les saisies, après confirmation si elles ne sont pas exportées.

Nom du fichier exporté : `succession-crypto-AAAA-MM-JJ.json`. L'export se fait par un lien local (`blob:`), sans aucun envoi. Le fichier n'est pas chiffré (D-002) : l'interface le dit et conseille où le ranger.

## 6. Détecteur de secrets (D-001, D-010)

Code : `src/lib/core/seed.ts`. Listes : `src/lib/core/wordlists/` (fichiers officiels du dépôt bitcoin/bips, empreintes SHA-256 vérifiées par un test).

**Phrase de récupération.** Le texte est mis en minuscules et sans accents, puis découpé en mots (chiffres et ponctuation séparent, ce qui couvre les listes numérotées). Refus si, parmi 12 mots consécutifs, au moins 11 appartiennent à une même liste BIP39 (anglaise ou française). Un mot compte s'il est dans la liste ou s'il est formé des 4 premières lettres d'un mot de la liste (sauvegarde abrégée). Une faute de frappe est tolérée, deux ne le sont pas.

**Clé privée.** Refus d'une chaîne de 64 caractères hexadécimaux (avec ou sans 0x), d'une clé WIF, d'une clé étendue (xprv, yprv, zprv, tprv…) ou d'une chaîne base58 de 80 caractères ou plus (clé Solana). Les adresses publiques sont acceptées.

**Plusieurs champs.** À l'enregistrement et à l'import, chaque champ est vérifié seul, puis chaque paire de champs mise bout à bout dans les deux ordres. Pour une seed de 24 mots (Ledger par défaut), cela couvre un découpage en 2, 3 ou 4 champs : deux morceaux réunis font toujours au moins 12 mots.

**Mesures.** Aucun faux positif sur la prose de la documentation du programme (358 paragraphes, environ 18 000 mots, français et anglais). Seul un bloc de code Svelte, rempli de mots anglais, est signalé : sans conséquence pour des notes d'utilisateur.

**Limites assumées.** Une phrase de 12 mots coupée en trois champs ou plus, une phrase de 24 mots coupée en cinq champs ou plus, ou comportant deux fautes de frappe ou plus, n'est pas détectée ; un mot de passe ou un code PIN ne peut pas être reconnu. Le détecteur est un garde-fou, pas une garantie : l'interface demande de ne jamais saisir de secret.

Message : il explique pourquoi c'est refusé et rappelle qu'un secret ne doit jamais être saisi sur un ordinateur ; il ne répète jamais la saisie. Le contenu refusé n'est ni conservé ni journalisé.

## 7. Écrans

Navigation par ancre (`src/lib/router.ts`) ; les ancres ne nomment que des écrans, jamais des données. Chaque écran donne son titre au document (« Lettre · succession-crypto »). Le lien « Aller au contenu » place le focus sans changer d'ancre.

1. Accueil `#accueil` : ce que fait l'outil, ce qu'il ne fait pas, rappel « rien n'est enregistré : exportez avant de fermer », parcours en quatre étapes (inventaire, sauvegarde, checklist, lettre).
2. Inventaire `#inventaire`. 3. Checklist `#checklist`. 4. Lettre `#lettre` (aperçu imprimable). 5. Règles françaises `#regles`. 6. Bonnes pratiques `#pratiques`. 7. À propos et limites `#a-propos` (dont Auteur et soutien), lien en pied de page.

Tous les écrans sont livrés depuis la v0.5.0 (l'écran « En préparation » des jalons précédents est supprimé).

Indicateur « Non exporté » dans l'en-tête et avertissement `beforeunload` du navigateur tant que des saisies n'ont pas été exportées.

## 8. Jalons

| Jalon | Contenu | État |
|---|---|---|
| J0 | Spec v0.1, décisions D-001 à D-008 | fait |
| J1 | Squelette, commun-crypto, thème, service worker, auteur et soutien, « À propos et limites » | fait (v0.1.0) |
| J2 | Inventaire, détecteur de secrets, import/export JSON | fait (v0.2.0) |
| J3 | Checklist, impression, export TXT | fait (v0.3.0) |
| J4 | Lettre, impression, export TXT | fait (v0.4.0) |
| J5 | Règles françaises sourcées, bonnes pratiques | fait (v0.5.0) |
| J6 | Accessibilité, relecture, sécurité, v1.0.0 | fait (v1.0.0) |

## 9. Critères d'acceptation (chaque PR)

`check`, tests et build verts ; vérification dans Chromium avec axe-core (tous les écrans, clair et sombre, 1280 et 375 px) ; aucune requête réseau externe (vérifiée) ; aucune écriture dans localStorage, sessionStorage, IndexedDB ni cookie ; test de checksum des adresses de don vert ; QR codes décodés identiques ; ouverture hors ligne après une première visite.

Depuis la v1.0.0, en plus : axe-core avec les bonnes pratiques (`best-practice`, WCAG 2.2 AA), un seul `h1` et aucun saut de niveau de titre par écran, focus visible sur chaque élément atteint au clavier, affichage à 320 px sans défilement horizontal, application intacte sous la CSP (seule une connexion externe volontaire est bloquée).
