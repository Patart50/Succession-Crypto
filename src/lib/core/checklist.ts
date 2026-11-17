/**
 * Checklist (SPEC § 5.2) : points à préparer, groupés par thème. Les identifiants sont stables : ce sont les
 * clés de `checklist` dans la sauvegarde JSON. Ne jamais renommer un identifiant ; en ajouter un est sans risque.
 * Aucun point ne demande de saisir un secret, et aucun n'affirme une règle fiscale : le détail juridique
 * et fiscal vient au J5, sourcé (D-005).
 */
import type { Entry, SuccessionData } from './model';

export interface ChecklistItem {
  id: string;
  title: string;
  detail: string;
}

export interface ChecklistTheme {
  id: string;
  title: string;
  items: readonly ChecklistItem[];
}

export const CHECKLIST: readonly ChecklistTheme[] = [
  {
    id: 'inventaire',
    title: 'Inventaire',
    items: [
      {
        id: 'inventaire-complet',
        title: 'Chaque plateforme et chaque wallet figure dans l’inventaire',
        detail: 'Y compris les petits soldes, les comptes oubliés, le staking et la DeFi. Un actif que vos proches ignorent est un actif perdu.',
      },
      {
        id: 'inventaire-exporte',
        title: 'L’inventaire est exporté et rangé en lieu sûr',
        detail: 'Le fichier n’est pas chiffré : rangez-le comme un document sensible, jamais en pièce jointe d’un e-mail ni dans un cloud non chiffré.',
      },
    ],
  },
  {
    id: 'sauvegardes',
    title: 'Sauvegardes',
    items: [
      {
        id: 'sauvegarde-hors-ligne',
        title: 'Chaque phrase de récupération est notée hors ligne',
        detail: 'Sur papier ou sur métal. Jamais en photo, ni dans un e-mail, un cloud, une note de téléphone ou un gestionnaire de mots de passe en ligne.',
      },
      {
        id: 'sauvegarde-durable',
        title: 'Le support résiste au temps, au feu et à l’eau',
        detail: 'Une plaque métal dure plus longtemps qu’une feuille de papier. Vérifiez qu’elle reste lisible.',
      },
      {
        id: 'sauvegarde-testee',
        title: 'Chaque sauvegarde a été testée',
        detail: 'Restaurez-la sur un appareil réinitialisé, ou utilisez la fonction de vérification de votre wallet. Une sauvegarde jamais testée peut contenir une erreur.',
      },
      {
        id: 'sauvegarde-separee',
        title: 'Les sauvegardes sont rangées à part de la lettre et de l’inventaire',
        detail: 'Trouver un seul de ces documents ne doit pas suffire pour accéder à vos cryptos.',
      },
      {
        id: 'passphrase',
        title: 'Si vous utilisez une passphrase, sa transmission est prévue',
        detail:
          'Une passphrase (parfois appelée « 25e mot ») s’ajoute à la phrase de récupération. Sans elle, vos proches n’ouvriront qu’un wallet vide. Cochez si vous n’en utilisez pas.',
      },
      {
        id: 'double-authentification',
        title: 'Les codes de secours de la double authentification sont rangés',
        detail: 'Sans votre téléphone ni ces codes, l’accès à un compte de plateforme passe par une longue vérification d’identité auprès du support.',
      },
    ],
  },
  {
    id: 'personnes',
    title: 'Personnes',
    items: [
      {
        id: 'personne-confiance',
        title: 'Une personne de confiance est désignée et sait qu’elle l’est',
        detail: 'Quelqu’un qui comprend un minimum les cryptos et que vos héritiers pourront solliciter. Elle n’a pas besoin de connaître vos secrets.',
      },
      {
        id: 'notaire-informe',
        title: 'Votre notaire sait que vous détenez des cryptoactifs',
        detail: 'Sans détail sensible. Il peut garder une enveloppe scellée qui indique où se trouvent vos sauvegardes.',
      },
      {
        id: 'proches-informes',
        title: 'Vos proches savent que ce dossier existe',
        detail: 'Ils doivent savoir qu’il y a quelque chose à chercher, et à qui s’adresser.',
      },
    ],
  },
  {
    id: 'plateformes',
    title: 'Plateformes',
    items: [
      {
        id: 'plateformes-procedure',
        title: 'Vous connaissez la procédure décès de chaque plateforme',
        detail: 'Documents demandés, adresse de contact, délais. Notez-la dans l’inventaire, à l’emplacement de la plateforme.',
      },
      {
        id: 'plateformes-identite',
        title: 'Vos comptes sont à votre nom, avec une identité vérifiée',
        detail: 'Vos héritiers devront prouver leur lien avec le titulaire du compte. Un compte au nom d’un tiers ou non vérifié complique tout.',
      },
    ],
  },
  {
    id: 'documents',
    title: 'Documents',
    items: [
      {
        id: 'lettre-signee',
        title: 'La lettre d’intention est imprimée, datée et signée',
        detail: 'Elle dit ce qui existe et à qui s’adresser, jamais où sont vos sauvegardes.',
      },
      {
        id: 'lettre-rangee',
        title: 'La lettre est rangée là où vos proches la chercheront',
        detail: 'Avec vos papiers importants, ou chez votre notaire. À part des sauvegardes.',
      },
    ],
  },
  {
    id: 'fiscal',
    title: 'Fiscal et déclaratif',
    items: [
      {
        id: 'declarations-a-jour',
        title: 'Vos déclarations liées aux cryptos sont à jour',
        detail: 'Comptes ouverts à l’étranger, plus-values de cession. Le détail, avec les sources officielles, viendra dans la section « Règles françaises ».',
      },
      {
        id: 'historique-conserve',
        title: 'L’historique de vos achats et ventes est conservé',
        detail: 'Relevés des plateformes, prix d’acquisition. Votre notaire et vos héritiers en auront besoin.',
      },
    ],
  },
  {
    id: 'revision',
    title: 'Révision',
    items: [
      {
        id: 'revision-planifiee',
        title: 'Une date de révision est fixée',
        detail:
          'Une fois par an, et après chaque changement : nouvelle plateforme, nouveau wallet, déménagement, naissance, mariage, séparation, changement de notaire.',
      },
    ],
  },
];

export const ALL_ITEMS: readonly ChecklistItem[] = CHECKLIST.flatMap((t) => t.items);
export const ITEM_IDS: ReadonlySet<string> = new Set(ALL_ITEMS.map((i) => i.id));

export function progress(checked: Record<string, boolean>): { done: number; total: number } {
  return { done: ALL_ITEMS.filter((i) => checked[i.id]).length, total: ALL_ITEMS.length };
}

/** Plateformes de l'inventaire dont la procédure décès n'est pas connue. */
export function platformsWithoutProcedure(entries: readonly Entry[]): Entry[] {
  return entries.filter((e) => e.type === 'plateforme' && e.procedureDeces !== 'oui');
}

/** Date suggérée pour la prochaine révision : un an après `from`. */
export function nextReview(from: Date): Date {
  const d = new Date(from);
  d.setFullYear(d.getFullYear() + 1);
  return d;
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Checklist en texte brut, pour l'export TXT. */
export function checklistText(data: SuccessionData, now: Date): string {
  const { done, total } = progress(data.checklist);
  const lines = ['Succession crypto : checklist', `Établie le ${formatDate(now)} · ${done} point${done > 1 ? 's' : ''} sur ${total}`, ''];
  for (const theme of CHECKLIST) {
    lines.push(theme.title.toUpperCase());
    for (const item of theme.items) lines.push(`[${data.checklist[item.id] ? 'x' : ' '}] ${item.title}`);
    lines.push('');
  }
  lines.push(`Prochaine révision suggérée : ${formatDate(nextReview(now))}`);
  lines.push('', 'Ce document ne contient aucun secret. Information générale, pas un conseil juridique ou fiscal.', '');
  return lines.join('\n');
}

/** Nom du fichier TXT : succession-crypto-checklist-AAAA-MM-JJ.txt (date locale). */
export function checklistFileName(now: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `succession-crypto-checklist-${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}.txt`;
}
