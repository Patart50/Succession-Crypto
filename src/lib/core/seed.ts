/**
 * Détecteur de secrets (succession D-001, D-010) : refuse toute saisie qui ressemble à une phrase de
 * récupération BIP39 (anglais ou français) ou à une clé privée. Rien n'est conservé : la fonction
 * ne fait que répondre oui ou non.
 *
 * Règle « phrase de récupération » : parmi 12 mots consécutifs, au moins 11 appartiennent à une même liste
 * BIP39. Un mot compte s'il est dans la liste (accents ignorés, majuscules ignorées) ou s'il est formé des
 * 4 premières lettres d'un mot de la liste (sauvegardes abrégées sur plaque métal). Les nombres et la
 * ponctuation séparent les mots, ce qui couvre les listes numérotées « 1. abandon 2. ability… ».
 */
import englishRaw from './wordlists/english.txt?raw';
import frenchRaw from './wordlists/french.txt?raw';

export type SecretKind = 'seed' | 'cle';

const WINDOW = 12;
const THRESHOLD = 11;

/** Minuscules, sans accents (é → e), pour comparer une saisie et une liste de mots. */
export function normalize(text: string): string {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

interface Wordlist {
  words: Set<string>;
  prefixes: Set<string>;
}

function load(raw: string): Wordlist {
  const list = raw.split('\n').map((w) => normalize(w.trim())).filter(Boolean);
  return {
    words: new Set(list),
    prefixes: new Set(list.filter((w) => w.length > 4).map((w) => w.slice(0, 4))),
  };
}

export const WORDLISTS = { english: load(englishRaw), french: load(frenchRaw) };

function matches(token: string, list: Wordlist): boolean {
  return list.words.has(token) || (token.length === 4 && list.prefixes.has(token));
}

/** Vrai si le texte contient une suite de mots qui ressemble à une phrase de récupération. */
export function looksLikeSeed(text: string): boolean {
  const tokens = normalize(text).match(/[a-z]+/g) ?? [];
  if (tokens.length < WINDOW) return false;
  for (const list of Object.values(WORDLISTS)) {
    const hits = tokens.map((t) => (matches(t, list) ? 1 : 0));
    let count = hits.slice(0, WINDOW).reduce<number>((a, b) => a + b, 0);
    if (count >= THRESHOLD) return true;
    for (let i = WINDOW; i < hits.length; i++) {
      count += hits[i] - hits[i - WINDOW];
      if (count >= THRESHOLD) return true;
    }
  }
  return false;
}

const BASE58 = '1-9A-HJ-NP-Za-km-z';
const PRIVATE_KEY_PATTERNS: readonly RegExp[] = [
  // 32 octets en hexadécimal (clé privée Bitcoin, Ethereum…), avec ou sans 0x.
  /(?:^|[^0-9a-f])(?:0x)?[0-9a-f]{64}(?![0-9a-f])/i,
  // Clé privée Bitcoin au format WIF.
  new RegExp(`(?:^|[^${BASE58}])[5KL][${BASE58}]{50,51}(?![${BASE58}])`),
  // Clé privée étendue (xprv, yprv, zprv, tprv…).
  new RegExp(`[tuvxyz]prv[${BASE58}]{100,}`),
  // Longue chaîne base58 (clé privée Solana et autres ; les adresses font moins de 50 caractères).
  new RegExp(`[${BASE58}]{80,}`),
];

/** Vrai si le texte contient une chaîne qui ressemble à une clé privée. */
export function looksLikePrivateKey(text: string): boolean {
  return PRIVATE_KEY_PATTERNS.some((re) => re.test(text));
}

/** Type de secret détecté dans le texte, ou null. */
export function detectSecret(text: string): SecretKind | null {
  if (looksLikeSeed(text)) return 'seed';
  if (looksLikePrivateKey(text)) return 'cle';
  return null;
}

/**
 * Secret dans un ensemble de champs : chaque champ seul, puis chaque paire de champs mise bout à bout
 * dans les deux ordres, pour refuser une phrase de récupération coupée en deux champs quelconques.
 */
export function detectInFields(values: readonly string[]): SecretKind | null {
  const filled = values.filter((v) => v.trim() !== '');
  for (const v of filled) {
    const kind = detectSecret(v);
    if (kind) return kind;
  }
  for (let i = 0; i < filled.length; i++) {
    for (let j = 0; j < filled.length; j++) {
      if (i !== j && looksLikeSeed(`${filled[i]}\n${filled[j]}`)) return 'seed';
    }
  }
  return null;
}

/** Message affiché quand une saisie est refusée. */
export function secretMessage(kind: SecretKind): string {
  const what = kind === 'seed' ? 'une phrase de récupération (seed)' : 'une clé privée';
  return `Saisie refusée : elle ressemble à ${what}. Elle n'a pas été conservée. Ne saisissez jamais un tel secret sur un ordinateur ni sur un site : notez seulement à qui s'adresser.`;
}
