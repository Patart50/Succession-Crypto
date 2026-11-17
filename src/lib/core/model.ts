/**
 * Modèle de données (SPEC § 5.1, § 5.6). Tout reste en mémoire (succession D-002) ;
 * le seul moyen de le conserver est l'export JSON.
 */

export const ENTRY_TYPES = [
  { id: 'plateforme', label: 'Plateforme centralisée', hint: 'Binance, Coinbase, Kraken…' },
  { id: 'materiel', label: 'Wallet matériel', hint: 'Ledger, Trezor…' },
  { id: 'logiciel', label: 'Wallet logiciel', hint: 'application sur téléphone ou ordinateur' },
  { id: 'autre', label: 'Autre', hint: 'DeFi, staking, NFT…' },
] as const;
export type EntryType = (typeof ENTRY_TYPES)[number]['id'];

export const ACCESS_CONTACTS = [
  { id: 'notaire', label: 'Le notaire' },
  { id: 'confiance', label: 'La personne de confiance' },
  { id: 'scelle', label: 'Un document scellé' },
  { id: 'autre', label: 'Autre' },
] as const;
export type AccessContact = (typeof ACCESS_CONTACTS)[number]['id'];

export const DEATH_PROCEDURE = [
  { id: 'oui', label: 'Oui' },
  { id: 'non', label: 'Non' },
  { id: 'sans-objet', label: 'Sans objet' },
] as const;
export type DeathProcedure = (typeof DEATH_PROCEDURE)[number]['id'];

/** Longueurs maximales des champs texte. */
export const MAX_LENGTH = { nom: 80, actifs: 200, montant: 60, precision: 200, notes: 1000 } as const;

/** Champs texte d'un emplacement, tous soumis au détecteur de secrets. */
export const TEXT_FIELDS = ['nom', 'actifs', 'montant', 'precision', 'notes'] as const;
export type TextField = (typeof TEXT_FIELDS)[number];

export interface Entry {
  id: string;
  type: EntryType;
  nom: string;
  actifs: string;
  /** Montant indicatif, texte libre ; null si non renseigné (D-003). */
  montant: string | null;
  acces: AccessContact;
  precision: string;
  procedureDeces: DeathProcedure;
  notes: string;
}

export interface Settings {
  /** Champ montant affiché ; désactivé par défaut (D-003). */
  montantsActives: boolean;
}

/** Champs de la lettre d'intention (SPEC § 5.3). */
export const LETTER_FIELDS = ['nomAffiche', 'destinataires', 'personneConfiance', 'notaire'] as const;
export type LetterField = (typeof LETTER_FIELDS)[number];
export const LETTER_LABELS: Record<LetterField, string> = {
  nomAffiche: 'Votre nom',
  destinataires: 'Destinataires',
  personneConfiance: 'Personne de confiance',
  notaire: 'Notaire',
};
export type Letter = Partial<Record<LetterField, string>>;

export interface SuccessionData {
  reglages: Settings;
  inventaire: Entry[];
  /** Points de la checklist cochés (J3), par identifiant. */
  checklist: Record<string, boolean>;
  lettre: Letter;
}

export function emptyData(): SuccessionData {
  return { reglages: { montantsActives: false }, inventaire: [], checklist: {}, lettre: {} };
}

export function newId(): string {
  return crypto.randomUUID();
}

export function emptyEntry(): Entry {
  return { id: newId(), type: 'plateforme', nom: '', actifs: '', montant: null, acces: 'notaire', precision: '', procedureDeces: 'non', notes: '' };
}

export function labelOf<T extends readonly { id: string; label: string }[]>(list: T, id: string): string {
  return list.find((x) => x.id === id)?.label ?? id;
}

/** Exemple entièrement fictif, pour découvrir l'outil. */
export function exampleEntries(): Entry[] {
  return [
    {
      id: newId(),
      type: 'plateforme',
      nom: 'Plateforme A',
      actifs: 'BTC, ETH',
      montant: null,
      acces: 'notaire',
      precision: 'Le notaire a la liste des plateformes utilisées.',
      procedureDeces: 'oui',
      notes: 'Procédure décès : acte de décès et certificat d’hérédité à envoyer au support.',
    },
    {
      id: newId(),
      type: 'materiel',
      nom: 'Wallet matériel 1',
      actifs: 'BTC',
      montant: null,
      acces: 'scelle',
      precision: 'Enveloppe scellée chez le notaire.',
      procedureDeces: 'sans-objet',
      notes: 'L’appareil est rangé à part de l’enveloppe.',
    },
  ];
}
