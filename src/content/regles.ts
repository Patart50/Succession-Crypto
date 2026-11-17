/**
 * Règles françaises (SPEC § 5.4, succession D-005, D-014). Chaque règle cite sa source officielle et la date
 * à laquelle elle a été vérifiée. Rien n'est écrit de mémoire : toute modification se fait source en main,
 * avec une nouvelle date de vérification. Sources admises : legifrance.gouv.fr, bofip.impots.gouv.fr,
 * impots.gouv.fr (D-014).
 */

export interface Source {
  label: string;
  url: string;
  /** Version ou date de mise à jour affichée par la source. */
  version: string;
}

export interface Rule {
  id: string;
  title: string;
  /** Ce que dit la règle, reformulé simplement. */
  text: string;
  /** Conséquence concrète pour une succession de cryptos ; ce n'est pas la règle elle-même. */
  practice?: string;
  sources: readonly Source[];
  /** Date de vérification des sources, au format AAAA-MM-JJ. */
  verified: string;
}

export const RULES_VERIFIED = '2026-11-17';

export const RULES: readonly Rule[] = [
  {
    id: 'actif-successoral',
    title: 'Les cryptos font partie de la succession',
    text:
      'Lorsque le défunt était domicilié en France, tous les biens qu’il transmet, situés en France ou hors de France, entrent dans le champ des droits de succession. Les textes ne prévoient pas d’exception pour les cryptoactifs, qu’ils soient sur une plateforme française, étrangère ou dans un wallet personnel.',
    practice: 'Des cryptos oubliées dans la déclaration de succession restent dans le champ de l’impôt. D’où l’intérêt d’un inventaire complet.',
    sources: [
      {
        label: 'BOFiP, BOI-ENR-DMTG-10-10-30, § III.A (article 750 ter du CGI)',
        url: 'https://bofip.impots.gouv.fr/doctrine/BOI-ENR-DMTG-10-10-30',
        version: 'version du 12/09/2012',
      },
    ],
    verified: RULES_VERIFIED,
  },
  {
    id: 'valeur-deces',
    title: 'Les cryptos sont évaluées au jour du décès',
    text:
      'Les biens transmis sont évalués à leur valeur vénale au jour du fait générateur de l’impôt (article 666 du CGI). Pour les droits de succession, ce fait générateur est le décès.',
    practice: 'Le cours retenu est celui du jour du décès, pas celui du jour où les héritiers récupèrent l’accès. Une forte baisse entre-temps ne change pas cette valeur.',
    sources: [
      {
        label: 'BOFiP, BOI-ENR-DMTG-10-40-10-10 (valeur vénale, article 666 du CGI)',
        url: 'https://bofip.impots.gouv.fr/doctrine/BOI-ENR-DMTG-10-40-10-10',
        version: 'version du 29/12/2017',
      },
      {
        label: 'BOFiP, BOI-ENR-DMTG-10-30 (le décès, fait générateur)',
        url: 'https://bofip.impots.gouv.fr/doctrine/BOI-ENR-DMTG-10-30',
        version: 'version du 12/09/2012',
      },
    ],
    verified: RULES_VERIFIED,
  },
  {
    id: 'delai-declaration',
    title: 'La déclaration de succession se dépose dans les 6 mois',
    text:
      'La déclaration de succession se dépose dans les 6 mois du décès lorsque le défunt est décédé en France métropolitaine, et dans l’année dans les autres cas. Des délais particuliers existent pour certains départements d’outre-mer.',
    practice: 'Six mois passent vite quand il faut d’abord retrouver les accès : c’est la raison d’être de l’inventaire et de la lettre.',
    sources: [
      {
        label: 'BOFiP, BOI-ENR-DMTG-10-60-50, § 1 et suivants (article 641 du CGI)',
        url: 'https://bofip.impots.gouv.fr/doctrine/BOI-ENR-DMTG-10-60-50',
        version: 'version du 30/10/2014',
      },
      {
        label: 'impots.gouv.fr, « Dois-je faire une déclaration de succession en cas de décès d’un proche ? »',
        url: 'https://www.impots.gouv.fr/particulier/questions/dois-je-faire-une-declaration-de-succession-en-cas-de-deces-dun-proche',
        version: 'mise à jour du 30/03/2026',
      },
    ],
    verified: RULES_VERIFIED,
  },
  {
    id: 'dispense-declaration',
    title: 'Une petite succession peut être dispensée de déclaration',
    text:
      'La déclaration n’est pas obligatoire lorsque l’actif brut de la succession est inférieur à 50 000 € pour une transmission aux héritiers en ligne directe et au conjoint survivant, s’ils n’ont pas reçu auparavant de donation non enregistrée ou non déclarée du défunt. Le seuil est de 3 000 € pour les autres héritiers.',
    practice: 'Les cryptos comptent dans l’actif brut, à leur valeur au jour du décès.',
    sources: [
      {
        label: 'impots.gouv.fr, « Dois-je faire une déclaration de succession en cas de décès d’un proche ? »',
        url: 'https://www.impots.gouv.fr/particulier/questions/dois-je-faire-une-declaration-de-succession-en-cas-de-deces-dun-proche',
        version: 'mise à jour du 30/03/2026',
      },
    ],
    verified: RULES_VERIFIED,
  },
  {
    id: 'notaire',
    title: 'Le notaire est obligatoire en présence d’immobilier',
    text: 'L’intervention d’un notaire est obligatoire lorsque la succession comprend des biens ou des droits immobiliers.',
    practice:
      'Sans immobilier, la loi ne l’impose pas dans ce cas, mais un notaire informé de l’existence des cryptos facilite beaucoup leur prise en compte. C’est un conseil, pas une obligation.',
    sources: [
      {
        label: 'impots.gouv.fr, « Dois-je faire une déclaration de succession en cas de décès d’un proche ? »',
        url: 'https://www.impots.gouv.fr/particulier/questions/dois-je-faire-une-declaration-de-succession-en-cas-de-deces-dun-proche',
        version: 'mise à jour du 30/03/2026',
      },
    ],
    verified: RULES_VERIFIED,
  },
  {
    id: 'prix-acquisition-heritier',
    title: 'Pour l’héritier qui revend, le prix d’acquisition est la valeur déclarée',
    text:
      'En cas d’acquisition à titre gratuit (succession, donation), le prix d’acquisition des crypto-actifs est la valeur retenue pour le calcul des droits de mutation ou, à défaut, leur valeur réelle au moment de leur entrée dans le patrimoine.',
    practice:
      'La plus-value de l’héritier, lors d’une revente ultérieure, se calcule à partir de la valeur figurant dans la déclaration de succession, pas du prix payé par le défunt. Une valeur sous-estimée dans la déclaration augmenterait d’autant la plus-value imposable à la revente.',
    sources: [
      {
        label: 'Légifrance, article 150 VH bis du CGI, III, B',
        url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000050366751',
        version: 'en vigueur depuis le 01/07/2026',
      },
    ],
    verified: RULES_VERIFIED,
  },
  {
    id: 'comptes-etranger',
    title: 'Les comptes ouverts à l’étranger se déclarent chaque année',
    text:
      'Les personnes physiques domiciliées en France doivent déclarer chaque année les comptes d’actifs numériques ouverts, détenus, utilisés ou clos auprès d’organismes établis à l’étranger, sur le formulaire 3916-bis (article 1649 bis C du CGI). Un compte non déclaré est passible d’une amende de 750 €, portée à 1 500 € si sa valeur a dépassé 50 000 € au cours de l’année, dans la limite de 10 000 € par déclaration (article 1736 du CGI).',
    practice: 'Pour vos héritiers, une liste des plateformes déclarées chaque année est aussi une liste fiable des comptes à retrouver.',
    sources: [
      {
        label: 'impots.gouv.fr, « Modalités de déclaration des comptes d’actifs numériques détenus à l’étranger »',
        url: 'https://www.impots.gouv.fr/actualite/modalites-de-declaration-des-comptes-dactifs-numeriques-detenus-letranger?l=fr',
        version: 'modifié le 06/05/2024',
      },
      {
        label: 'BOFiP, BOI-CF-INF-20-10-50, § I.D (article 1736 du CGI)',
        url: 'https://bofip.impots.gouv.fr/bofip/10841-PGP.html',
        version: 'version du 26/05/2021',
      },
    ],
    verified: RULES_VERIFIED,
  },
];
