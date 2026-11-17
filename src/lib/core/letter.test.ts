import { describe, expect, it } from 'vitest';
import { ADVICE, buildLetter, DISCLAIMER, letterFileName, letterText, letterWarnings } from './letter';
import { emptyData, exampleEntries, type SuccessionData } from './model';
import { looksLikeSeed } from './seed';

const NOW = new Date(2026, 10, 17);

function sample(): SuccessionData {
  const d = emptyData();
  d.inventaire = exampleEntries();
  d.lettre = { nomAffiche: 'Prénom N.', destinataires: 'Mes enfants', personneConfiance: 'Personne X, 06 00 00 00 00', notaire: 'Maître Y, Cherbourg' };
  return d;
}

describe('buildLetter', () => {
  it('suit la structure imposée', () => {
    const m = buildLetter(sample(), NOW);
    expect(m.disclaimer).toBe(DISCLAIMER);
    expect(m.disclaimer).toContain('aucune valeur juridique');
    expect(m.disclaimer).toContain('ne contient aucun secret');
    expect(m.greeting).toBe('À l’attention de : Mes enfants');
    expect(m.intro.startsWith('Moi, Prénom N., je détiens')).toBe(true);
    expect(m.contacts.map((c) => c.label)).toEqual(['Personne de confiance', 'Notaire']);
    expect(m.entries).toHaveLength(2);
    expect(m.advice).toBe(ADVICE);
    expect(m.generatedOn).toBe('17 novembre 2026');
  });

  it('formule par défaut sans nom ni destinataires', () => {
    const m = buildLetter(emptyData(), NOW);
    expect(m.greeting).toBe('À l’attention de mes proches');
    expect(m.intro.startsWith('Je détiens')).toBe(true);
    expect(m.contacts).toEqual([]);
  });

  it('à qui s’adresser : contact et précision', () => {
    const m = buildLetter(sample(), NOW);
    expect(m.entries[1].contact).toBe('Un document scellé — Enveloppe scellée chez le notaire.');
  });

  it('montants seulement si le réglage est activé', () => {
    const d = sample();
    d.inventaire[0].montant = '0,1 BTC';
    expect(buildLetter(d, NOW).entries[0].montant).toBeNull();
    d.reglages.montantsActives = true;
    expect(buildLetter(d, NOW).entries[0].montant).toBe('0,1 BTC');
  });

  it('les textes fixes ne déclenchent pas le détecteur', () => {
    expect(looksLikeSeed([DISCLAIMER, ...ADVICE].join(' '))).toBe(false);
  });
});

describe('letterWarnings', () => {
  it('rien à signaler sur une lettre complète', () => expect(letterWarnings(sample())).toEqual([]));
  it('signale les manques', () => {
    const w = letterWarnings(emptyData());
    expect(w).toHaveLength(3);
    expect(w.join(' ')).toContain('Aucune personne à contacter');
  });
});

describe('letterText', () => {
  it('contient chaque partie, dans l’ordre', () => {
    const t = letterText(sample(), NOW);
    const order = ['aucune valeur juridique', 'À l’attention de : Mes enfants', 'PERSONNES À CONTACTER', 'CE QUI EXISTE', '1. Plateforme A (Plateforme centralisée)', 'CONSEILS POUR MES PROCHES', 'Fait à', 'Signature', 'Document préparé le 17 novembre 2026'];
    let last = -1;
    for (const s of order) {
      const i = t.indexOf(s);
      expect(i, s).toBeGreaterThan(last);
      last = i;
    }
  });

  it('nom de fichier daté', () => expect(letterFileName(new Date(2026, 0, 5))).toBe('succession-crypto-lettre-2026-01-05.txt'));
});
