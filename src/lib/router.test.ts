import { describe, expect, it } from 'vitest';
import { readView, TABS, VIEWS } from './router';

describe('readView', () => {
  it('reconnaît chaque écran', () => {
    for (const v of VIEWS) expect(readView(`#${v}`)).toBe(v);
  });

  it("renvoie l'accueil pour une ancre vide ou inconnue", () => {
    expect(readView('')).toBe('accueil');
    expect(readView('#')).toBe('accueil');
    expect(readView('#inconnu')).toBe('accueil');
    expect(readView('#inventaire/123')).toBe('accueil');
  });

  it('chaque onglet pointe vers un écran existant', () => {
    for (const t of TABS) expect(VIEWS).toContain(t.view);
  });
});
