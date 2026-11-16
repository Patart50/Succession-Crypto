import { beforeEach, describe, expect, it } from 'vitest';
import { emptyData, emptyEntry } from '../core/model';
import { app } from './app.svelte';

beforeEach(() => app.replaceAll(emptyData()));

describe('état en mémoire', () => {
  it('démarre vide et sans saisie à exporter', () => {
    expect(app.data.inventaire).toEqual([]);
    expect(app.dirty).toBe(false);
  });

  it('ajouter, modifier, supprimer marque les saisies non exportées', () => {
    const e = { ...emptyEntry(), nom: 'Plateforme A' };
    app.addEntry(e);
    expect(app.dirty).toBe(true);
    app.markExported();
    expect(app.dirty).toBe(false);
    app.updateEntry({ ...e, nom: 'Plateforme B' });
    expect(app.data.inventaire[0].nom).toBe('Plateforme B');
    expect(app.dirty).toBe(true);
    app.removeEntry(e.id);
    expect(app.data.inventaire).toEqual([]);
  });

  it('désactiver les montants les efface', () => {
    app.setAmounts(true);
    app.addEntry({ ...emptyEntry(), nom: 'A', montant: '0,1 BTC' });
    expect(app.amountCount).toBe(1);
    app.setAmounts(false);
    expect(app.data.inventaire[0].montant).toBeNull();
    expect(app.amountCount).toBe(0);
  });

  it("l'exemple est fictif", () => {
    app.loadExample();
    expect(app.data.inventaire.map((e) => e.nom)).toEqual(['Plateforme A', 'Wallet matériel 1']);
  });

  it("un import remplace tout et n'est pas « non exporté »", () => {
    app.addEntry({ ...emptyEntry(), nom: 'A' });
    const d = emptyData();
    d.reglages.montantsActives = true;
    app.replaceAll(d);
    expect(app.data.inventaire).toEqual([]);
    expect(app.data.reglages.montantsActives).toBe(true);
    expect(app.dirty).toBe(false);
  });
});
