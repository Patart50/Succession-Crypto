/**
 * Navigation par ancre (#accueil, #inventaire…). Aucune donnée dans l'URL : les ancres ne nomment que des écrans.
 */
export const VIEWS = ['accueil', 'inventaire', 'checklist', 'lettre', 'regles', 'pratiques', 'a-propos'] as const;
export type View = (typeof VIEWS)[number];

/** Onglets de la navigation principale, dans l'ordre (la page À propos est dans le pied de page). */
export const TABS: readonly { view: View; label: string }[] = [
  { view: 'accueil', label: 'Accueil' },
  { view: 'inventaire', label: 'Inventaire' },
  { view: 'checklist', label: 'Checklist' },
  { view: 'lettre', label: 'Lettre' },
  { view: 'regles', label: 'Règles françaises' },
  { view: 'pratiques', label: 'Bonnes pratiques' },
];

/** Écran correspondant à une ancre ; toute ancre inconnue mène à l'accueil. */
export function readView(hash: string): View {
  const name = hash.replace(/^#/, '');
  return (VIEWS as readonly string[]).includes(name) ? (name as View) : 'accueil';
}
