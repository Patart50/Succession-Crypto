import { describe, expect, it } from 'vitest';
import { exportFileName, MAX_FILE_CHARS, parseBackup, serialize } from './backup';
import { emptyData, exampleEntries, type SuccessionData } from './model';

const VECTOR_12 = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
const NOW = new Date('2026-11-16T10:00:00Z');

function sample(): SuccessionData {
  const d = emptyData();
  d.inventaire = exampleEntries();
  d.inventaire[1].montant = 'environ 0,5 BTC';
  d.reglages.montantsActives = true;
  d.checklist = { 'inventaire-exporte': true, 'notaire-informe': false };
  d.lettre = { nomAffiche: 'Prénom N.', notaire: 'Maître X' };
  return d;
}

/** Document exporté, modifiable avant réimport. */
function doc(mut: (d: Record<string, any>) => void = () => {}): string {
  const d = JSON.parse(serialize(sample(), NOW));
  mut(d);
  return JSON.stringify(d);
}

function expectError(text: string, fragment: string) {
  const r = parseBackup(text);
  expect(r.ok).toBe(false);
  if (!r.ok) expect(r.error).toContain(fragment);
}

describe('serialize et parseBackup', () => {
  it('aller-retour sans perte', () => {
    const data = sample();
    const r = parseBackup(serialize(data, NOW));
    expect(r).toEqual({ ok: true, data });
  });

  it('en-tête du fichier', () => {
    const d = JSON.parse(serialize(emptyData(), NOW));
    expect(d.format).toBe('succession-crypto');
    expect(d.version).toBe(1);
    expect(d.exporteLe).toBe('2026-11-16T10:00:00.000Z');
  });

  it('accepte un inventaire vide', () => {
    expect(parseBackup(serialize(emptyData(), NOW)).ok).toBe(true);
  });

  it('nom de fichier daté', () => {
    expect(exportFileName(new Date(2026, 10, 6))).toBe('succession-crypto-2026-11-06.json');
  });
});

describe('parseBackup : refus', () => {
  it('fichier non JSON', () => expectError('pas du json', 'JSON valide'));
  it('autre format', () => expectError('{"format":"pmpa-crypto"}', "n'est pas une sauvegarde"));
  it('version plus récente', () => expectError(doc((d) => (d.version = 2)), 'plus récente'));
  it('fichier trop gros', () => expectError(' '.repeat(MAX_FILE_CHARS + 1), 'volumineux'));
  it('champ inconnu', () => expectError(doc((d) => (d.pirate = 1)), 'champ inconnu'));
  it('champ inconnu dans un emplacement', () => expectError(doc((d) => (d.inventaire[0].seed = 'x')), 'champ inconnu'));
  it('champ manquant', () => expectError(doc((d) => delete d.inventaire[0].notes), 'manquant'));
  it('type inconnu', () => expectError(doc((d) => (d.inventaire[0].type = 'banque')), 'type'));
  it('nom vide', () => expectError(doc((d) => (d.inventaire[0].nom = '  ')), 'obligatoire'));
  it('texte trop long', () => expectError(doc((d) => (d.inventaire[0].notes = 'a'.repeat(1001))), '1000 caractères'));
  it('identifiants en double', () => expectError(doc((d) => (d.inventaire[1].id = d.inventaire[0].id)), 'même identifiant'));
  it('réglage invalide', () => expectError(doc((d) => (d.reglages.montantsActives = 'oui')), 'true ou false'));
  it('point de checklist inconnu', () => expectError(doc((d) => (d.checklist['point-libre'] = true)), 'point inconnu'));
  it('point de checklist non booléen', () => expectError(doc((d) => (d.checklist['passphrase'] = 'oui')), 'true ou false'));
  it('champ de lettre inconnu', () => expectError(doc((d) => (d.lettre.adresseSeed = '')), 'champ inconnu'));
});

describe('parseBackup : secrets', () => {
  it('seed dans les notes : refusé, sans répéter le contenu', () => {
    const r = parseBackup(doc((d) => (d.inventaire[1].notes = VECTOR_12)));
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error).toContain('emplacement n° 2');
      expect(r.error).toContain('phrase de récupération');
      expect(r.error).not.toContain('abandon');
    }
  });

  it('seed découpée entre deux champs du même emplacement', () => {
    const words = VECTOR_12.split(' ');
    expectError(
      doc((d) => {
        d.inventaire[0].precision = words.slice(0, 6).join(' ');
        d.inventaire[0].notes = words.slice(6).join(' ');
      }),
      'phrase de récupération',
    );
  });

  it('clé privée dans le nom', () => {
    expectError(doc((d) => (d.inventaire[0].nom = 'e8f32e723decf4051aefac8e2c93c9c5b214313817cdb01a1494b917c8436b35')), 'clé privée');
  });

  it('seed dans la lettre', () => expectError(doc((d) => (d.lettre.destinataires = VECTOR_12)), 'phrase de récupération'));
  it('seed répartie entre le montant et les notes', () => {
    const words = VECTOR_12.split(' ');
    expectError(
      doc((d) => {
        d.inventaire[1].montant = words.slice(0, 5).join(' ');
        d.inventaire[1].notes = words.slice(5).join(' ');
      }),
      'emplacement n° 2 contient une saisie qui ressemble à une phrase de récupération',
    );
  });
});
