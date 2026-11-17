import { describe, expect, it } from 'vitest';
import { looksLikePrivateKey, looksLikeSeed } from '../lib/core/seed';
import { PRACTICES } from './pratiques';
import { RULES, RULES_VERIFIED } from './regles';

const ALLOWED_HOSTS = ['www.legifrance.gouv.fr', 'bofip.impots.gouv.fr', 'www.impots.gouv.fr'];

describe('règles françaises (D-005, D-014)', () => {
  it('identifiants uniques', () => {
    expect(new Set(RULES.map((r) => r.id)).size).toBe(RULES.length);
  });

  it('chaque règle a au moins une source officielle, en https, datée', () => {
    for (const r of RULES) {
      expect(r.sources.length, r.id).toBeGreaterThan(0);
      for (const s of r.sources) {
        const u = new URL(s.url);
        expect(u.protocol, s.url).toBe('https:');
        expect(ALLOWED_HOSTS, s.url).toContain(u.hostname);
        expect(s.label.length).toBeGreaterThan(10);
        expect(s.version).toMatch(/\d{2}\/\d{2}\/\d{4}/);
      }
    }
  });

  it('chaque règle porte une date de vérification valide, pas dans le futur', () => {
    for (const r of RULES) {
      expect(r.verified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(r.verified))).toBe(false);
    }
    expect(Date.parse(RULES_VERIFIED)).toBeLessThanOrEqual(Date.now());
  });

  it('couvre les sujets de la SPEC § 5.4', () => {
    expect(RULES.map((r) => r.id)).toEqual(
      expect.arrayContaining(['actif-successoral', 'valeur-deces', 'delai-declaration', 'prix-acquisition-heritier', 'comptes-etranger', 'notaire']),
    );
  });
});

describe('bonnes pratiques (D-007)', () => {
  it('chaque fiche a un résumé, des points et un piège', () => {
    for (const p of PRACTICES) {
      expect(p.summary.length).toBeGreaterThan(30);
      expect(p.points.length).toBeGreaterThan(1);
      expect(p.pitfall.length).toBeGreaterThan(20);
    }
  });

  it('couvre les sujets de la SPEC § 5.5', () => {
    expect(PRACTICES.map((p) => p.id)).toEqual(['metal', 'passphrase', 'shamir', 'multisig', 'coffre', 'notaire', 'arnaques']);
  });
});

describe('aucun texte ne déclenche le détecteur de secrets', () => {
  const texts = [
    ...RULES.flatMap((r) => [r.title, r.text, r.practice ?? '']),
    ...PRACTICES.flatMap((p) => [p.title, p.summary, ...p.points, p.pitfall]),
  ];
  it.each(texts.map((t) => [t.slice(0, 50), t]))('%s', (_, t) => {
    expect(looksLikeSeed(t)).toBe(false);
    expect(looksLikePrivateKey(t)).toBe(false);
  });
});
