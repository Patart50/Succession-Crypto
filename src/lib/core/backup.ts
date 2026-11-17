/**
 * Sauvegarde JSON v1 (SPEC § 5.6) : export, et import avec validation stricte.
 * À l'import, tout champ texte passe par le détecteur de secrets ; au moindre défaut, le fichier entier
 * est refusé avec un message précis, qui ne répète jamais le contenu refusé.
 */
import { ITEM_IDS } from './checklist';
import { detectInFields, detectSecret, type SecretKind } from './seed';
import {
  ACCESS_CONTACTS,
  DEATH_PROCEDURE,
  ENTRY_TYPES,
  LETTER_FIELDS,
  MAX_LENGTH,
  TEXT_FIELDS,
  type Entry,
  type SuccessionData,
  type TextField,
} from './model';

export const FORMAT = 'succession-crypto';
export const VERSION = 1;
export const MAX_FILE_CHARS = 1_000_000;
export const MAX_ENTRIES = 500;
export const MAX_CHECKLIST_KEYS = 200;
export const MAX_LETTER_LENGTH = 500;

export const FIELD_LABELS: Record<TextField, string> = {
  nom: 'Nom',
  actifs: 'Actifs',
  montant: 'Montant indicatif',
  precision: 'Précision',
  notes: 'Notes',
};

export type ParseResult = { ok: true; data: SuccessionData } | { ok: false; error: string };

/** Contenu du fichier exporté. */
export function serialize(data: SuccessionData, now = new Date()): string {
  const doc = {
    format: FORMAT,
    version: VERSION,
    exporteLe: now.toISOString(),
    reglages: data.reglages,
    inventaire: data.inventaire,
    checklist: data.checklist,
    lettre: data.lettre,
  };
  return JSON.stringify(doc, null, 2) + '\n';
}

/** Nom du fichier exporté : succession-crypto-AAAA-MM-JJ.json (date locale). */
export function exportFileName(now = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${FORMAT}-${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}.json`;
}

class Invalid extends Error {}

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

function onlyKeys(obj: Record<string, unknown>, allowed: readonly string[], where: string): void {
  const extra = Object.keys(obj).find((k) => !allowed.includes(k));
  if (extra !== undefined) throw new Invalid(`${where} : champ inconnu « ${extra.slice(0, 40)} ».`);
}

function secretError(kind: SecretKind, where: string): Invalid {
  const what = kind === 'seed' ? 'une phrase de récupération (seed)' : 'une clé privée';
  return new Invalid(`Fichier refusé : ${where} contient une saisie qui ressemble à ${what}. Rien n'a été importé.`);
}

function checkText(value: unknown, max: number, where: string): string {
  if (typeof value !== 'string') throw new Invalid(`${where} : texte attendu.`);
  if (value.length > max) throw new Invalid(`${where} : ${max} caractères au plus.`);
  const kind = detectSecret(value);
  if (kind) throw secretError(kind, where);
  return value;
}

function checkEnum<T extends string>(value: unknown, list: readonly { id: T }[], where: string): T {
  const found = list.find((x) => x.id === value);
  if (!found) throw new Invalid(`${where} : valeur non reconnue.`);
  return found.id;
}

const ENTRY_KEYS = ['id', 'type', 'nom', 'actifs', 'montant', 'acces', 'precision', 'procedureDeces', 'notes'] as const;

function checkEntry(raw: unknown, index: number): Entry {
  const where = `Inventaire, emplacement n° ${index + 1}`;
  if (!isObject(raw)) throw new Invalid(`${where} : format invalide.`);
  onlyKeys(raw, ENTRY_KEYS, where);
  for (const k of ENTRY_KEYS) if (!(k in raw)) throw new Invalid(`${where} : champ « ${k} » manquant.`);
  if (typeof raw.id !== 'string' || !/^[\w-]{1,64}$/.test(raw.id)) throw new Invalid(`${where} : identifiant invalide.`);
  const field = (k: TextField) => `${where}, champ « ${FIELD_LABELS[k]} »`;
  const entry: Entry = {
    id: raw.id,
    type: checkEnum(raw.type, ENTRY_TYPES, `${where}, type`),
    nom: checkText(raw.nom, MAX_LENGTH.nom, field('nom')),
    actifs: checkText(raw.actifs, MAX_LENGTH.actifs, field('actifs')),
    montant: raw.montant === null ? null : checkText(raw.montant, MAX_LENGTH.montant, field('montant')),
    acces: checkEnum(raw.acces, ACCESS_CONTACTS, `${where}, accès`),
    precision: checkText(raw.precision, MAX_LENGTH.precision, field('precision')),
    procedureDeces: checkEnum(raw.procedureDeces, DEATH_PROCEDURE, `${where}, procédure décès`),
    notes: checkText(raw.notes, MAX_LENGTH.notes, field('notes')),
  };
  if (entry.nom.trim() === '') throw new Invalid(`${where} : le nom est obligatoire.`);
  // Un secret découpé entre deux champs du même emplacement est refusé aussi.
  const kind = detectInFields(TEXT_FIELDS.map((k) => entry[k] ?? ''));
  if (kind) throw secretError(kind, where);
  return entry;
}

/** Lit un fichier de sauvegarde. Refuse le fichier entier au moindre défaut. */
export function parseBackup(text: string): ParseResult {
  try {
    if (text.length > MAX_FILE_CHARS) throw new Invalid('Fichier trop volumineux pour une sauvegarde succession-crypto.');
    let doc: unknown;
    try {
      doc = JSON.parse(text);
    } catch {
      throw new Invalid("Ce fichier n'est pas un fichier JSON valide.");
    }
    if (!isObject(doc) || doc.format !== FORMAT) throw new Invalid("Ce fichier n'est pas une sauvegarde succession-crypto.");
    if (typeof doc.version !== 'number' || !Number.isInteger(doc.version)) throw new Invalid('Version de sauvegarde absente ou invalide.');
    if (doc.version > VERSION) throw new Invalid("Cette sauvegarde a été créée par une version plus récente de l'outil. Mettez la page à jour.");
    if (doc.version !== VERSION) throw new Invalid('Version de sauvegarde non prise en charge.');
    onlyKeys(doc, ['format', 'version', 'exporteLe', 'reglages', 'inventaire', 'checklist', 'lettre'], 'Sauvegarde');
    if (typeof doc.exporteLe !== 'string' || Number.isNaN(Date.parse(doc.exporteLe))) throw new Invalid("Date d'export absente ou invalide.");

    if (!isObject(doc.reglages)) throw new Invalid('Réglages absents ou invalides.');
    onlyKeys(doc.reglages, ['montantsActives'], 'Réglages');
    if (typeof doc.reglages.montantsActives !== 'boolean') throw new Invalid('Réglages : « montantsActives » doit valoir true ou false.');

    if (!Array.isArray(doc.inventaire)) throw new Invalid('Inventaire absent ou invalide.');
    if (doc.inventaire.length > MAX_ENTRIES) throw new Invalid(`Inventaire : ${MAX_ENTRIES} emplacements au plus.`);
    const inventaire = doc.inventaire.map(checkEntry);
    const ids = new Set(inventaire.map((e) => e.id));
    if (ids.size !== inventaire.length) throw new Invalid('Inventaire : deux emplacements ont le même identifiant.');

    if (!isObject(doc.checklist)) throw new Invalid('Checklist absente ou invalide.');
    const checkKeys = Object.keys(doc.checklist);
    if (checkKeys.length > MAX_CHECKLIST_KEYS) throw new Invalid('Checklist : trop de points.');
    const checklist: Record<string, boolean> = {};
    for (const k of checkKeys) {
      const v = doc.checklist[k];
      if (!ITEM_IDS.has(k)) throw new Invalid(`Checklist : point inconnu « ${k.slice(0, 40)} ».`);
      if (typeof v !== 'boolean') throw new Invalid('Checklist : chaque point doit valoir true ou false.');
      checklist[k] = v;
    }

    if (!isObject(doc.lettre)) throw new Invalid('Lettre absente ou invalide.');
    onlyKeys(doc.lettre, LETTER_FIELDS, 'Lettre');
    const lettre: SuccessionData['lettre'] = {};
    for (const k of LETTER_FIELDS) {
      if (k in doc.lettre) lettre[k] = checkText(doc.lettre[k], MAX_LETTER_LENGTH, `Lettre, champ « ${k} »`);
    }
    const kind = detectInFields(Object.values(lettre));
    if (kind) throw secretError(kind, 'la lettre');

    return { ok: true, data: { reglages: { montantsActives: doc.reglages.montantsActives }, inventaire, checklist, lettre } };
  } catch (e) {
    if (e instanceof Invalid) return { ok: false, error: e.message };
    throw e;
  }
}
