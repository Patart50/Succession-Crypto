<script lang="ts">
  /** Écran Inventaire (SPEC § 5.1) : liste des emplacements, ajout, modification, suppression, réglage des montants. */
  import { tick } from 'svelte';
  import { ACCESS_CONTACTS, DEATH_PROCEDURE, ENTRY_TYPES, labelOf, type Entry } from '../core/model';
  import { app } from '../state/app.svelte';
  import EntryForm from './EntryForm.svelte';
  import SavePanel from './SavePanel.svelte';

  /** null : liste ; 'new' : ajout ; sinon identifiant de l'emplacement modifié. */
  let editing = $state<string | null>(null);
  const editedEntry = $derived(editing && editing !== 'new' ? (app.data.inventaire.find((e) => e.id === editing) ?? null) : null);
  const entries = $derived(app.data.inventaire);

  async function backToList(focusId?: string) {
    editing = null;
    await tick();
    const target = focusId ? document.getElementById(`entry-${focusId}`) : document.getElementById('inventory-title');
    target?.focus();
  }

  function save(entry: Entry) {
    const isNew = editing === 'new';
    if (isNew) app.addEntry(entry);
    else app.updateEntry(entry);
    app.notify(isNew ? 'Emplacement ajouté.' : 'Emplacement modifié.');
    void backToList(entry.id);
  }

  async function remove(entry: Entry) {
    if (!confirm(`Supprimer l'emplacement « ${entry.nom} » ?`)) return;
    app.removeEntry(entry.id);
    app.notify('Emplacement supprimé.');
    await tick();
    document.getElementById('inventory-title')?.focus();
  }

  function toggleAmounts(e: Event & { currentTarget: HTMLInputElement }) {
    const on = e.currentTarget.checked;
    const n = app.amountCount;
    if (!on && n > 0 && !confirm(`Masquer le champ effacera ${n > 1 ? `les ${n} montants saisis` : 'le montant saisi'}. Continuer ?`)) {
      e.currentTarget.checked = true;
      return;
    }
    app.setAmounts(on);
  }

  function example() {
    app.loadExample();
    app.notify('Exemple fictif chargé : deux emplacements.');
  }
</script>

<section class="inventory" aria-labelledby="inventory-title">
  <header>
    <h1 id="inventory-title" tabindex="-1">Inventaire</h1>
    <p>
      Un emplacement par plateforme ou par wallet : ce qu'il contient et à qui vos proches devront s'adresser. Ne notez jamais une phrase de récupération,
      une clé privée, un mot de passe ou un code PIN.
    </p>
  </header>

  {#if editing !== null}
    <EntryForm
      initial={editedEntry}
      amountsEnabled={app.data.reglages.montantsActives}
      onsave={save}
      oncancel={() => backToList(editing !== 'new' ? (editing ?? undefined) : undefined)}
    />
  {:else}
    <div class="toolbar">
      <button class="btn btn-primary" type="button" onclick={() => (editing = 'new')}>Ajouter un emplacement</button>
      {#if entries.length === 0}
        <button class="btn" type="button" onclick={example}>Charger un exemple fictif</button>
      {/if}
    </div>

    {#if entries.length === 0}
      <p class="muted">Aucun emplacement pour l'instant.</p>
    {:else}
      <ul class="entries" aria-label="Emplacements">
        {#each entries as e (e.id)}
          <li class="panel entry">
            <h2 id={`entry-${e.id}`} tabindex="-1">{e.nom}</h2>
            <p class="type">{labelOf(ENTRY_TYPES, e.type)}</p>
            <dl>
              {#if e.actifs}<div><dt>Actifs</dt><dd>{e.actifs}</dd></div>{/if}
              {#if app.data.reglages.montantsActives && e.montant}<div><dt>Montant indicatif</dt><dd>{e.montant}</dd></div>{/if}
              <div>
                <dt>À qui s'adresser</dt>
                <dd>{labelOf(ACCESS_CONTACTS, e.acces)}{e.precision ? ` — ${e.precision}` : ''}</dd>
              </div>
              {#if e.type === 'plateforme'}
                <div><dt>Procédure décès connue</dt><dd>{labelOf(DEATH_PROCEDURE, e.procedureDeces)}</dd></div>
              {/if}
              {#if e.notes}<div class="wide"><dt>Notes</dt><dd class="notes">{e.notes}</dd></div>{/if}
            </dl>
            <div class="row-actions">
              <button class="btn btn-small" type="button" onclick={() => (editing = e.id)} aria-label={`Modifier ${e.nom}`}>Modifier</button>
              <button class="btn btn-small btn-danger" type="button" onclick={() => remove(e)} aria-label={`Supprimer ${e.nom}`}>Supprimer</button>
            </div>
          </li>
        {/each}
      </ul>
    {/if}

    <SavePanel />

    <section class="panel settings" aria-labelledby="settings-title">
      <h2 id="settings-title">Réglage</h2>
      <label class="check">
        <input type="checkbox" checked={app.data.reglages.montantsActives} onchange={toggleAmounts} aria-describedby="amounts-hint" />
        Afficher un champ « montant indicatif »
      </label>
      <p id="amounts-hint" class="muted small">
        Désactivé par défaut. Un montant n'est pas nécessaire pour transmettre, et il fait de l'inventaire un document plus sensible. Le masquer efface les
        montants saisis.
      </p>
    </section>
  {/if}
</section>

<style>
  .inventory {
    display: grid;
    gap: 1.1rem;
    max-width: 52rem;
  }
  header {
    display: grid;
    gap: 0.5rem;
  }
  h1 {
    font-size: clamp(1.6rem, 3.5vw, 2.1rem);
  }
  h1:focus,
  h2:focus {
    outline: none;
  }
  .toolbar {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .entries {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.8rem;
  }
  .entry {
    padding: 1rem 1.2rem;
    display: grid;
    gap: 0.4rem;
  }
  .entry h2 {
    font-size: 1.15rem;
    overflow-wrap: anywhere;
  }
  .type {
    font-size: 0.85rem;
    color: var(--muted);
  }
  dl {
    margin: 0.2rem 0 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
    gap: 0.5rem 1.2rem;
  }
  dl .wide {
    grid-column: 1 / -1;
  }
  dt {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--muted);
  }
  dd {
    margin: 0;
    overflow-wrap: anywhere;
  }
  .notes {
    white-space: pre-line;
  }
  .row-actions {
    display: flex;
    gap: 0.4rem;
    margin-top: 0.3rem;
  }
  .settings {
    padding: 1rem 1.2rem;
    display: grid;
    gap: 0.5rem;
  }
  .settings h2 {
    font-size: 1.1rem;
  }
  .check {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 550;
  }
  .check input {
    width: auto;
    accent-color: var(--accent);
  }
  .small {
    font-size: 0.86rem;
  }
</style>
