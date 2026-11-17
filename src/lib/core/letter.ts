/**
 * Lettre d'intention (SPEC § 5.3, succession D-004, D-013) : structure imposée, construite à partir de
 * l'inventaire et de quatre champs. La lettre dit ce qui existe et à qui s'adresser, jamais où sont les
 * sauvegardes. Le même modèle sert à l'aperçu, à l'impression et à l'export TXT.
 */
import { formatDate } from './checklist';
import { ACCESS_CONTACTS, ENTRY_TYPES, labelOf, type Entry, type SuccessionData } from './model';

export const DISCLAIMER =
  'Ce document n’a aucune valeur juridique. Il ne remplace ni un testament ni les conseils d’un notaire. Il ne contient aucun secret : ni phrase de récupération, ni clé privée, ni mot de passe.';

/** Conseils aux héritiers, texte fixe. */
export const ADVICE: readonly string[] = [
  'Ne vous précipitez pas. Rien ne presse : des cryptos bien conservées ne disparaissent pas en quelques semaines.',
  'Commencez par le notaire et la personne de confiance indiqués dans cette lettre.',
  'Personne n’a besoin de connaître une phrase de récupération pour vous aider : ni un support de plateforme, ni un « expert en récupération ». Quiconque vous la demande cherche à vous voler.',
  'Ne saisissez jamais une phrase de récupération sur un site, dans une application ou dans un formulaire. Elle se saisit uniquement sur le wallet matériel concerné, ou dans un wallet officiel installé par vos soins.',
  'Pour une plateforme, passez par son site officiel, tapé vous-même dans le navigateur, jamais par un lien reçu par e-mail, SMS ou message.',
  'Méfiez-vous des personnes qui vous contactent spontanément après le décès en proposant leur aide.',
];

export interface LetterEntry {
  nom: string;
  type: string;
  actifs: string;
  montant: string | null;
  contact: string;
  notes: string;
}

export interface LetterModel {
  disclaimer: string;
  greeting: string;
  intro: string;
  contacts: { label: string; value: string }[];
  entries: LetterEntry[];
  advice: readonly string[];
  generatedOn: string;
}

const clean = (s: string | undefined) => (s ?? '').trim();

function entryLine(e: Entry, amounts: boolean): LetterEntry {
  const contact = labelOf(ACCESS_CONTACTS, e.acces) + (clean(e.precision) ? ` — ${clean(e.precision)}` : '');
  return {
    nom: e.nom,
    type: labelOf(ENTRY_TYPES, e.type),
    actifs: clean(e.actifs),
    montant: amounts && e.montant && clean(e.montant) ? clean(e.montant) : null,
    contact,
    notes: clean(e.notes),
  };
}

export function buildLetter(data: SuccessionData, now: Date): LetterModel {
  const l = data.lettre;
  const name = clean(l.nomAffiche);
  const to = clean(l.destinataires);
  const contacts: LetterModel['contacts'] = [];
  if (clean(l.personneConfiance)) contacts.push({ label: 'Personne de confiance', value: clean(l.personneConfiance) });
  if (clean(l.notaire)) contacts.push({ label: 'Notaire', value: clean(l.notaire) });
  return {
    disclaimer: DISCLAIMER,
    greeting: to ? `À l’attention de : ${to}` : 'À l’attention de mes proches',
    intro:
      `${name ? `Moi, ${name}, je` : 'Je'} détiens des cryptoactifs. Cette lettre vous indique ce qui existe et à qui vous adresser pour y accéder. ` +
      'Elle ne dit volontairement pas où se trouvent mes sauvegardes : cette information vous sera transmise par les personnes ci-dessous.',
    contacts,
    entries: data.inventaire.map((e) => entryLine(e, data.reglages.montantsActives)),
    advice: ADVICE,
    generatedOn: formatDate(now),
  };
}

/** Points manquants avant impression (n'empêchent pas d'imprimer). */
export function letterWarnings(data: SuccessionData): string[] {
  const w: string[] = [];
  if (!clean(data.lettre.nomAffiche)) w.push('Votre nom n’est pas renseigné.');
  if (!clean(data.lettre.personneConfiance) && !clean(data.lettre.notaire)) w.push('Aucune personne à contacter : indiquez au moins une personne de confiance ou un notaire.');
  if (data.inventaire.length === 0) w.push('L’inventaire est vide : la lettre ne liste aucun emplacement.');
  return w;
}

/** Lettre en texte brut, pour l'export TXT. */
export function letterText(data: SuccessionData, now: Date): string {
  const m = buildLetter(data, now);
  const out: string[] = ['LETTRE D’INTENTION : TRANSMISSION DE MES CRYPTOACTIFS', '', m.disclaimer, '', m.greeting, '', m.intro, ''];
  out.push('PERSONNES À CONTACTER');
  if (m.contacts.length === 0) out.push('(aucune personne indiquée)');
  for (const c of m.contacts) out.push(`- ${c.label} : ${c.value}`);
  out.push('', 'CE QUI EXISTE');
  if (m.entries.length === 0) out.push('(aucun emplacement)');
  m.entries.forEach((e, i) => {
    out.push(`${i + 1}. ${e.nom} (${e.type})`);
    if (e.actifs) out.push(`   Actifs : ${e.actifs}`);
    if (e.montant) out.push(`   Montant indicatif : ${e.montant}`);
    out.push(`   À qui s’adresser : ${e.contact}`);
    if (e.notes) out.push(`   Notes : ${e.notes.replace(/\n/g, '\n           ')}`);
  });
  out.push('', 'CONSEILS POUR MES PROCHES');
  for (const a of m.advice) out.push(`- ${a}`);
  out.push('', 'Fait à : ______________________   le : ____ / ____ / ________', '', 'Signature :', '', '', `Document préparé le ${m.generatedOn} avec succession-crypto.`, '');
  return out.join('\n');
}

export function letterFileName(now: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `succession-crypto-lettre-${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}.txt`;
}
