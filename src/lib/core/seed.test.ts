import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { detectInFields, detectSecret, findSecretFields, looksLikePrivateKey, looksLikeSeed, normalize, secretMessage, WORDLISTS } from './seed';

const file = (name: string) => readFileSync(new URL(`./wordlists/${name}`, import.meta.url));
const sha256 = (buf: Buffer) => createHash('sha256').update(buf).digest('hex');

// Vecteurs de test publics du BIP39 : jamais de vraie phrase de récupération dans le dépôt.
const VECTOR_12 = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
const VECTOR_24 = Array(23).fill('zoo').join(' ') + ' vote';
const frenchWords = readFileSync(new URL('./wordlists/french.txt', import.meta.url), 'utf8').trim().split('\n');
/** Mots français pris à pas fixe dans la liste : suite synthétique, déterministe. */
const FRENCH_12 = Array.from({ length: 12 }, (_, i) => frenchWords[(i * 173 + 41) % 2048]).join(' ');

describe('listes BIP39 embarquées', () => {
  it('sont les fichiers officiels, inchangés', () => {
    expect(sha256(file('english.txt'))).toBe('2f5eed53a4727b4bf8880d8f3f199efc90e58503646d9ff8eff3a2ed3b24dbda');
    expect(sha256(file('french.txt'))).toBe('ebc3959ab7801a1df6bac4fa7d970652f1df76b683cd2f4003c941c63d517e59');
  });

  it('4 lettres identifient chaque mot (affirmé dans la fiche « métal »)', () => {
    for (const name of ['english.txt', 'french.txt']) {
      const words = readFileSync(new URL(`./wordlists/${name}`, import.meta.url), 'utf8').trim().split('\n');
      const prefixes = new Set(words.map((w) => normalize(w).slice(0, 4)));
      expect(prefixes.size, name).toBe(2048);
    }
  });

  it('contiennent 2048 mots chacune', () => {
    expect(WORDLISTS.english.words.size).toBe(2048);
    expect(WORDLISTS.french.words.size).toBe(2048);
  });
});

describe('normalize', () => {
  it('retire accents et majuscules', () => {
    expect(normalize('Élève ÉPÉE')).toBe('eleve epee');
  });
});

describe('looksLikeSeed : refuse', () => {
  it.each([
    ['12 mots anglais', VECTOR_12],
    ['24 mots anglais', VECTOR_24],
    ['12 mots français', FRENCH_12],
    ['français sans accents', normalize(FRENCH_12)],
    ['en majuscules', VECTOR_12.toUpperCase()],
    ['une ligne par mot', VECTOR_12.split(' ').join('\n')],
    ['liste numérotée', VECTOR_12.split(' ').map((w, i) => `${i + 1}. ${w}`).join(' ')],
    ['séparée par des virgules', VECTOR_12.split(' ').join(',')],
    ['abrégée en 4 lettres', VECTOR_24.split(' ').map((w) => w.slice(0, 4)).join(' ')],
    ['avec une faute de frappe', VECTOR_12.replace('about', 'abuot')],
    ['au milieu d\'une note', `Ma phrase est : ${VECTOR_12}. Ne pas la perdre.`],
  ])('%s', (_, text) => {
    expect(looksLikeSeed(text)).toBe(true);
  });
});

describe('looksLikeSeed : accepte', () => {
  it.each([
    ['note en français', "Contacter Maître Durand, notaire à Cherbourg. L'enveloppe scellée est chez lui depuis mars."],
    [
      'longue note en français',
      "Mon frère connaît le notaire et garde une copie de cette lettre. La procédure de la plateforme demande un acte de décès, un certificat d'hérédité et une pièce d'identité de l'héritier. Penser à prévenir la banque et à vérifier les comptes ouverts à l'étranger avant la déclaration.",
    ],
    ['note en anglais', 'Ask my sister about the hardware wallet. The backup is with the notary, never online, and she knows the procedure.'],
    ['liste d\'actifs', 'BTC, ETH, SOL, ADA, DOT, USDC, LINK, AVAX, MATIC, ATOM, XRP, LTC'],
    ['11 mots seulement', VECTOR_12.split(' ').slice(0, 11).join(' ')],
    ['deux fautes de frappe', VECTOR_12.replace('about', 'abuot').replace('abandon', 'abnadon')],
    ['texte vide', ''],
  ])('%s', (_, text) => {
    expect(looksLikeSeed(text)).toBe(false);
  });
});

describe('looksLikePrivateKey', () => {
  it.each([
    ['hexadécimal 64', 'e8f32e723decf4051aefac8e2c93c9c5b214313817cdb01a1494b917c8436b35'],
    ['hexadécimal avec 0x', '0xE8F32E723DECF4051AEFAC8E2C93C9C5B214313817CDB01A1494B917C8436B35'],
    ['WIF', 'clé : 5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ'],
    [
      'xprv',
      'xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi',
    ],
  ])('refuse : %s', (_, text) => {
    expect(looksLikePrivateKey(text)).toBe(true);
  });

  it.each([
    ['adresse Bitcoin', 'bc1qd5j0yrrxp6wrk5ds0xne97hdrz5fvxjl8q22p4'],
    ['adresse Ethereum', '0x7e4b6bad06813506b724b5ea3cc9545a7b97eba4'],
    ['adresse Bitcoin ancienne', '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2'],
    ['note ordinaire', 'Wallet matériel rangé au coffre, code PIN connu de ma femme.'],
  ])('accepte : %s', (_, text) => {
    expect(looksLikePrivateKey(text)).toBe(false);
  });
});

describe('detectInFields', () => {
  const w = VECTOR_12.split(' ');
  it('seed coupée entre deux champs non adjacents, dans un ordre ou dans l’autre', () => {
    expect(detectInFields([w.slice(0, 5).join(' '), 'Enveloppe chez le notaire.', w.slice(5).join(' ')])).toBe('seed');
    expect(detectInFields([w.slice(5).join(' '), 'Note', w.slice(0, 5).join(' ')])).toBe('seed');
  });
  it('clé privée dans un champ', () => {
    expect(detectInFields(['Plateforme A', 'e8f32e723decf4051aefac8e2c93c9c5b214313817cdb01a1494b917c8436b35'])).toBe('cle');
  });
  it('champs ordinaires', () => {
    expect(detectInFields(['Plateforme A', 'BTC, ETH', '', 'Le notaire a la liste.', 'Procédure décès connue.'])).toBeNull();
  });
});

describe('findSecretFields', () => {
  const w = VECTOR_12.split(' ');
  it('désigne la paire en cause, et elle seule', () => {
    const r = findSecretFields(['Plateforme A', w.slice(0, 6).join(' '), 'BTC', 'Le notaire a la liste.', w.slice(6).join(' ')]);
    expect(r).toEqual({ kind: 'seed', fields: [1, 4] });
  });
  it('désigne un champ seul quand il suffit', () => {
    expect(findSecretFields(['Plateforme A', VECTOR_12])).toEqual({ kind: 'seed', fields: [1] });
  });
  it('rien à signaler', () => {
    expect(findSecretFields(['Plateforme A', 'BTC'])).toBeNull();
  });
});

describe('seed de 24 mots (Ledger) coupée', () => {
  const w24 = VECTOR_24.split(' ');
  const parts = (n: number) => Array.from({ length: n }, (_, i) => w24.slice((i * 24) / n, ((i + 1) * 24) / n).join(' '));
  it.each([2, 3, 4])('en %i champs : détectée', (n) => {
    expect(detectInFields(parts(n))).toBe('seed');
  });
  it('en 6 champs de 4 mots : non détectée (limite documentée)', () => {
    expect(detectInFields(parts(6))).toBeNull();
  });
});

describe('detectSecret et message', () => {
  it('distingue seed et clé', () => {
    expect(detectSecret(VECTOR_12)).toBe('seed');
    expect(detectSecret('e8f32e723decf4051aefac8e2c93c9c5b214313817cdb01a1494b917c8436b35')).toBe('cle');
    expect(detectSecret('Plateforme A')).toBeNull();
  });

  it('explique le refus sans répéter la saisie', () => {
    expect(secretMessage('seed')).toContain('phrase de récupération');
    expect(secretMessage('cle')).toContain('clé privée');
    expect(secretMessage('seed')).not.toContain('abandon');
  });
});
