import { describe, expect, it } from 'vitest';
import { ALL_ITEMS, CHECKLIST, checklistFileName, checklistText, ITEM_IDS, nextReview, platformsWithoutProcedure, progress } from './checklist';
import { emptyData, emptyEntry } from './model';
import { looksLikePrivateKey, looksLikeSeed } from './seed';

describe('contenu de la checklist', () => {
  it('reprend les sept thèmes de la SPEC § 5.2', () => {
    expect(CHECKLIST.map((t) => t.id)).toEqual(['inventaire', 'sauvegardes', 'personnes', 'plateformes', 'documents', 'fiscal', 'revision']);
  });

  it('identifiants uniques et au format accepté par la sauvegarde', () => {
    expect(ITEM_IDS.size).toBe(ALL_ITEMS.length);
    for (const i of ALL_ITEMS) expect(i.id).toMatch(/^[a-z0-9-]{1,60}$/);
  });

  it('identifiants figés : les renommer casserait les sauvegardes existantes', () => {
    expect([...ITEM_IDS]).toEqual([
      'inventaire-complet', 'inventaire-exporte',
      'sauvegarde-hors-ligne', 'sauvegarde-durable', 'sauvegarde-testee', 'sauvegarde-separee', 'passphrase', 'double-authentification',
      'personne-confiance', 'notaire-informe', 'proches-informes',
      'plateformes-procedure', 'plateformes-identite',
      'lettre-signee', 'lettre-rangee',
      'declarations-a-jour', 'historique-conserve',
      'revision-planifiee',
    ]);
  });

  it('chaque point a un titre et une explication', () => {
    for (const i of ALL_ITEMS) {
      expect(i.title.length).toBeGreaterThan(10);
      expect(i.detail.length).toBeGreaterThan(20);
    }
  });

  it('aucun texte ne déclenche le détecteur de secrets', () => {
    for (const i of ALL_ITEMS) {
      expect(looksLikeSeed(`${i.title} ${i.detail}`)).toBe(false);
      expect(looksLikePrivateKey(i.detail)).toBe(false);
    }
  });
});

describe('calculs', () => {
  it('progression', () => {
    expect(progress({})).toEqual({ done: 0, total: ALL_ITEMS.length });
    expect(progress({ passphrase: true, 'notaire-informe': true, 'lettre-signee': false }).done).toBe(2);
  });

  it('plateformes sans procédure décès connue', () => {
    const a = { ...emptyEntry(), nom: 'A', type: 'plateforme' as const, procedureDeces: 'oui' as const };
    const b = { ...emptyEntry(), nom: 'B', type: 'plateforme' as const, procedureDeces: 'non' as const };
    const c = { ...emptyEntry(), nom: 'C', type: 'materiel' as const, procedureDeces: 'sans-objet' as const };
    expect(platformsWithoutProcedure([a, b, c]).map((e) => e.nom)).toEqual(['B']);
  });

  it('révision un an plus tard, y compris un 29 février', () => {
    expect(nextReview(new Date(2026, 10, 17)).toDateString()).toBe(new Date(2027, 10, 17).toDateString());
    expect(nextReview(new Date(2028, 1, 29)).toDateString()).toBe(new Date(2029, 2, 1).toDateString());
  });
});

describe('export TXT', () => {
  it('liste chaque point coché ou non, sans secret', () => {
    const d = emptyData();
    d.checklist = { passphrase: true };
    const txt = checklistText(d, new Date(2026, 10, 17));
    expect(txt).toContain('Établie le 17 novembre 2026 · 1 point sur 18');
    expect(txt).toContain('[x] Si vous utilisez une passphrase');
    expect(txt).toContain('[ ] Une date de révision est fixée');
    expect(txt).toContain('Prochaine révision suggérée : 17 novembre 2027');
    expect(txt.split('\n').filter((l) => l.startsWith('[')).length).toBe(18);
  });

  it('nom de fichier daté', () => {
    expect(checklistFileName(new Date(2026, 10, 7))).toBe('succession-crypto-checklist-2026-11-07.txt');
  });
});
