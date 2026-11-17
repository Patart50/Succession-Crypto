# Succession-Crypto

Préparez la transmission de vos cryptos à vos proches, **sans jamais saisir de phrase de récupération, de clé privée ni de mot de passe**. Inventaire de vos plateformes et wallets, checklist des points à préparer, lettre d'intention à imprimer, rappel des règles françaises. **100 % local**, en français : rien n'est envoyé, rien n'est enregistré dans le navigateur.

Site : https://patart50.github.io/succession-crypto/

> Version de développement (0.3.0) : l'inventaire et la checklist sont disponibles ; la lettre arrive dans une prochaine version.

## Principes

- **Aucun secret** : l'outil ne demande et ne garde jamais de seed, de clé privée ni de mot de passe ; une saisie qui ressemble à une phrase de récupération ou à une clé privée est effacée sur-le-champ (listes BIP39 officielles, anglais et français).
- **Aucun réseau** : aucune requête sur Internet, même avec votre accord ; aucune valorisation de vos avoirs.
- **Aucune persistance** : vos saisies restent dans l'onglet ; vous les sauvegardez dans un fichier que vous rangez vous-même.
- **Séparation des informations** : la lettre dit ce qui existe et à qui s'adresser, jamais où sont vos sauvegardes.
- **Pas de conseil personnalisé** : la lettre n'a aucune valeur juridique et ne remplace ni un testament ni un notaire.

Spécification : [docs/SPEC.md](docs/SPEC.md). Décisions : [docs/DECISIONS.md](docs/DECISIONS.md). Passation : [docs/PASSATION.md](docs/PASSATION.md).

## Développement

```sh
npm install
npm run dev     # serveur de développement
npm run check   # types
npm test        # tests (Vitest)
npm run build   # site statique dans dist/
```

Stack : Svelte 5, Vite, TypeScript. Code commun du programme : [commun-crypto](https://github.com/Patart50/commun-crypto).

## Auteur et soutien

Créé par [Arnaud (Patart50)](https://github.com/Patart50). L'outil est gratuit, sans publicité ni compte, et le restera. Pour le soutenir : [GitHub Sponsors](https://github.com/sponsors/Patart50), ou en crypto depuis la fenêtre « Soutenir le projet » en pied de page du site.

## Licence

[AGPL-3.0](LICENSE).
