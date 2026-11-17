/**
 * État de l'application, en mémoire seulement (succession D-002) : rien n'est écrit dans le navigateur.
 * `dirty` signale des saisies non exportées (avertissement à la fermeture de l'onglet).
 */
import { emptyData, exampleEntries, type Entry, type SuccessionData } from '../core/model';

class AppState {
  data = $state<SuccessionData>(emptyData());
  /** Saisies modifiées depuis le dernier export ou import. */
  dirty = $state(false);
  /** Heure du dernier export, pour l'affichage. */
  exportedAt = $state<Date | null>(null);
  toast = $state<string | null>(null);
  #toastTimer: ReturnType<typeof setTimeout> | undefined;

  #changed() {
    this.dirty = true;
  }

  addEntry(entry: Entry) {
    this.data.inventaire.push(entry);
    this.#changed();
  }

  updateEntry(entry: Entry) {
    const i = this.data.inventaire.findIndex((e) => e.id === entry.id);
    if (i === -1) return;
    this.data.inventaire[i] = entry;
    this.#changed();
  }

  removeEntry(id: string) {
    this.data.inventaire = this.data.inventaire.filter((e) => e.id !== id);
    this.#changed();
  }

  /** Active ou désactive le champ montant ; le désactiver efface les montants saisis (D-003). */
  setAmounts(on: boolean) {
    this.data.reglages.montantsActives = on;
    if (!on) for (const e of this.data.inventaire) e.montant = null;
    this.#changed();
  }

  /** Nombre de montants saisis (pour prévenir avant de les effacer). */
  get amountCount(): number {
    return this.data.inventaire.filter((e) => e.montant !== null && e.montant.trim() !== '').length;
  }

  /** Coche ou décoche un point de la checklist ; un point décoché est retiré de la sauvegarde. */
  setCheck(id: string, checked: boolean) {
    if (checked) this.data.checklist[id] = true;
    else delete this.data.checklist[id];
    this.#changed();
  }

  loadExample() {
    for (const e of exampleEntries()) this.data.inventaire.push(e);
    this.#changed();
  }

  /** Remplace toutes les saisies par celles d'un fichier importé (déjà validé). */
  replaceAll(data: SuccessionData) {
    this.data = data;
    this.dirty = false;
    this.exportedAt = null;
  }

  markExported(at = new Date()) {
    this.dirty = false;
    this.exportedAt = at;
  }

  notify(message: string) {
    this.toast = message;
    clearTimeout(this.#toastTimer);
    this.#toastTimer = setTimeout(() => (this.toast = null), 4000);
  }
}

export const app = new AppState();
export type { AppState };
