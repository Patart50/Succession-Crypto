/**
 * Bonnes pratiques (SPEC § 5.5, succession D-007) : fiches pédagogiques, sans aucune règle juridique ni
 * mise en œuvre. Aucune fiche ne recommande une marque ni un service.
 */

export interface Practice {
  id: string;
  title: string;
  summary: string;
  points: readonly string[];
  /** Le piège à éviter. */
  pitfall: string;
}

export const PRACTICES: readonly Practice[] = [
  {
    id: 'metal',
    title: 'Sauvegarder sa phrase de récupération sur métal',
    summary: 'Le papier brûle, prend l’eau et s’efface. Une plaque métal gravée ou poinçonnée dure des décennies.',
    points: [
      'Recopiez les mots dans l’ordre, numérotés, puis relisez-les mot à mot face à l’écran du wallet.',
      'Les 4 premières lettres de chaque mot suffisent à les identifier dans les listes officielles.',
      'Rangez la plaque dans un lieu protégé, à part de la lettre d’intention et de l’inventaire.',
    ],
    pitfall: 'Prendre la phrase en photo « en attendant » : une photo finit tôt ou tard dans un cloud.',
  },
  {
    id: 'passphrase',
    title: 'Passphrase : une protection qui peut tout bloquer',
    summary:
      'Une passphrase (parfois appelée « 25e mot ») s’ajoute à la phrase de récupération. Sans elle, la phrase seule ouvre un wallet différent, vide.',
    points: [
      'Elle protège si quelqu’un trouve votre phrase de récupération.',
      'Elle doit être sauvegardée elle aussi, à un autre endroit que la phrase.',
      'Vos proches doivent savoir qu’elle existe, sinon ils croiront le wallet vide.',
    ],
    pitfall: 'Une passphrase que vous seul connaissez : le jour où vous n’êtes plus là, les fonds sont perdus pour tout le monde.',
  },
  {
    id: 'shamir',
    title: 'Partage de Shamir : découper la sauvegarde en parts',
    summary:
      'Certains wallets matériels créent une sauvegarde en plusieurs parts (norme SLIP-39), par exemple 3 parts dont 2 suffisent. Une part seule ne révèle rien.',
    points: [
      'Confiez les parts à des personnes ou des lieux différents : notaire, proche, coffre.',
      'Vos héritiers réunissent le nombre de parts requis, sans qu’aucun dépositaire ne puisse agir seul.',
      'Le découpage se fait dans le wallet matériel, jamais sur un ordinateur ou un site.',
    ],
    pitfall:
      'Couper soi-même sa phrase de 24 mots en trois morceaux de 8 : chaque morceau facilite le travail d’un voleur, et un morceau perdu bloque tout. Ce n’est pas un partage de Shamir.',
  },
  {
    id: 'multisig',
    title: 'Multisig : plusieurs clés pour un même coffre',
    summary:
      'Un wallet multisignature exige plusieurs clés pour déplacer les fonds, par exemple 2 sur 3. Chaque clé a sa propre sauvegarde.',
    points: [
      'Une clé perdue ou volée ne suffit ni à bloquer ni à vider le wallet.',
      'Les clés peuvent être réparties entre vous, un proche de confiance et un lieu sûr.',
      'Il faut aussi conserver la description du wallet (configuration multisig), sans laquelle les clés ne suffisent pas.',
    ],
    pitfall: 'Une installation que vos héritiers ne sauront pas utiliser : documentez la marche à suivre, ou choisissez plus simple.',
  },
  {
    id: 'coffre',
    title: 'Coffre bancaire : sûr, mais pas immédiat',
    summary: 'Un coffre protège bien une plaque métal ou une part de sauvegarde contre le vol et le feu.',
    points: [
      'Après un décès, l’accès des héritiers à un coffre passe par une procédure de la banque : renseignez-vous auprès d’elle.',
      'Indiquez dans la lettre qu’un coffre existe et dans quelle banque, sans dire ce qu’il contient.',
    ],
    pitfall: 'Y ranger à la fois la phrase de récupération et la passphrase : un seul accès suffirait alors.',
  },
  {
    id: 'notaire',
    title: 'Enveloppe scellée chez le notaire',
    summary:
      'Le notaire peut conserver une enveloppe scellée, datée, qui indique où se trouvent vos sauvegardes. C’est le complément naturel de la lettre d’intention.',
    points: [
      'L’enveloppe dit où sont les sauvegardes, pas ce qu’elles contiennent : pas de phrase de récupération dedans.',
      'Mettez-la à jour à chaque changement : nouveau wallet, nouvel emplacement.',
      'La lettre d’intention dit à vos proches que cette enveloppe existe.',
    ],
    pitfall: 'Glisser la phrase de récupération dans l’enveloppe « pour simplifier » : elle passe alors entre beaucoup de mains.',
  },
  {
    id: 'arnaques',
    title: 'Arnaques à la récupération',
    summary:
      'Après un décès, des escrocs se présentent comme « experts en récupération », support de plateforme ou avocats spécialisés. Ils visent des héritiers pressés et peu familiers des cryptos.',
    points: [
      'Personne n’a besoin de la phrase de récupération pour vous aider. Quiconque la demande cherche à voler.',
      'Une plateforme se contacte par son site officiel, tapé à la main, jamais par un lien reçu.',
      'Méfiez-vous de toute aide spontanée, surtout payante d’avance ou pressée.',
    ],
    pitfall: 'Saisir la phrase de récupération dans un site ou une application « de vérification » : les fonds partent dans la minute.',
  },
];
