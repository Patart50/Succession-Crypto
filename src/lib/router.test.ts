import { describe, expect, it } from 'vitest';
import { documentTitle, readView, TABS, VIEWS } from './router';

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

describe('documentTitle', () => {
  it('un titre distinct par écran', () => {
    const titles = VIEWS.map(documentTitle);
    expect(new Set(titles).size).toBe(VIEWS.length);
    expect(documentTitle('lettre')).toBe('Lettre · succession-crypto');
    expect(documentTitle('a-propos')).toBe('À propos et limites · succession-crypto');
    for (const t of titles) expect(t).not.toContain('undefined');
  });
});
