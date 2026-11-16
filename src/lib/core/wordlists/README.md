# Listes de mots BIP39

Copiées sans modification depuis le dépôt officiel des BIP :
https://github.com/bitcoin/bips/tree/master/bip-0039 (commit `c0614759ed8c878c7ff45a1d0326e88711bab13e`, 16 nov. 2026).

| Fichier | Mots | SHA-256 |
|---|---|---|
| `english.txt` | 2048 | `2f5eed53a4727b4bf8880d8f3f199efc90e58503646d9ff8eff3a2ed3b24dbda` |
| `french.txt` | 2048 | `ebc3959ab7801a1df6bac4fa7d970652f1df76b683cd2f4003c941c63d517e59` |

Elles servent uniquement à **refuser** une saisie qui ressemble à une phrase de récupération (succession D-001). Le test `seed.test.ts` vérifie ces empreintes : toute modification de ces fichiers fait échouer la CI.
