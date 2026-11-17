<script lang="ts">
  /** Écran Checklist (SPEC § 5.2) : points par thème, progression, liens avec l'inventaire, impression et export TXT. */
  import { CHECKLIST, checklistFileName, checklistText, formatDate, nextReview, platformsWithoutProcedure, progress } from '../core/checklist';
  import { app } from '../state/app.svelte';
  import { downloadText } from './download';

  const today = new Date();
  const p = $derived(progress(app.data.checklist));
  const entries = $derived(app.data.inventaire);
  const missingProcedure = $derived(platformsWithoutProcedure(entries));

  function exportTxt() {
    const now = new Date();
    downloadText(checklistFileName(now), checklistText(app.data, now), 'text/plain');
    app.notify('Checklist exportée en texte.');
  }
</script>

<section class="checklist" aria-labelledby="checklist-title">
  <header>
    <h1 id="checklist-title" tabindex="-1">Checklist</h1>
    <p class="print-only">Établie le {formatDate(today)}. Ce document ne contient aucun secret.</p>
    <p class="no-print">
      Les points à régler pour que vos proches puissent hériter de vos cryptos. Cochez au fur et à mesure ; l'état de la checklist est inclus dans la
      sauvegarde de l'inventaire.
    </p>
    <div class="progress">
      <progress max={p.total} value={p.done} aria-labelledby="progress-label"></progress>
      <span id="progress-label">{p.done} point{p.done > 1 ? 's' : ''} sur {p.total}</span>
    </div>
  </header>

  {#each CHECKLIST as theme (theme.id)}
    <section class="panel theme" aria-labelledby={`t-${theme.id}`}>
      <h2 id={`t-${theme.id}`}>{theme.title}</h2>
      <ul>
        {#each theme.items as item (item.id)}
          <li>
            <label class="item">
              <input
                type="checkbox"
                checked={!!app.data.checklist[item.id]}
                onchange={(e) => app.setCheck(item.id, e.currentTarget.checked)}
                aria-describedby={`d-${item.id}`}
              />
              <span class="title">{item.title}</span>
            </label>
            <p class="detail" id={`d-${item.id}`}>
              {item.detail}
              {#if item.id === 'inventaire-complet'}
                <span class="link-note no-print">
                  {#if entries.length === 0}
                    Votre <a href="#inventaire">inventaire</a> est vide.
                  {:else}
                    Votre <a href="#inventaire">inventaire</a> compte {entries.length} emplacement{entries.length > 1 ? 's' : ''}.
                  {/if}
                </span>
              {:else if item.id === 'inventaire-exporte' && app.dirty}
                <span class="link-note warn no-print">Vos saisies actuelles ne sont pas exportées.</span>
              {:else if item.id === 'plateformes-procedure' && missingProcedure.length > 0}
                <span class="link-note warn">
                  Procédure non renseignée dans l'<a href="#inventaire">inventaire</a> : {missingProcedure.map((e) => e.nom).join(', ')}.
                </span>
              {:else if item.id === 'revision-planifiee'}
                <span class="link-note">Prochaine révision suggérée : <strong>{formatDate(nextReview(today))}</strong>.</span>
              {/if}
            </p>
          </li>
        {/each}
      </ul>
    </section>
  {/each}

  <div class="actions no-print">
    <button class="btn btn-primary" type="button" onclick={() => print()}>Imprimer ou enregistrer en PDF</button>
    <button class="btn" type="button" onclick={exportTxt}>Exporter en texte (.txt)</button>
  </div>
  <p class="muted small no-print">
    Pour garder l'état de vos cases et le retrouver plus tard, exportez la sauvegarde depuis l'<a href="#inventaire">inventaire</a>.
  </p>
</section>

<style>
  .checklist {
    display: grid;
    gap: 1rem;
    max-width: 52rem;
  }
  header {
    display: grid;
    gap: 0.6rem;
  }
  h1 {
    font-size: clamp(1.6rem, 3.5vw, 2.1rem);
  }
  h1:focus {
    outline: none;
  }
  .progress {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    font-weight: 600;
  }
  progress {
    width: min(18rem, 60%);
    height: 0.6rem;
    accent-color: var(--accent);
  }
  .theme {
    padding: 1rem 1.2rem;
  }
  h2 {
    font-size: 1.15rem;
    margin-bottom: 0.6rem;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.9rem;
  }
  .item {
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    cursor: pointer;
    font-weight: 600;
  }
  .item input {
    width: 1.15rem;
    height: 1.15rem;
    margin-top: 0.2rem;
    flex: none;
    accent-color: var(--accent);
  }
  .detail {
    margin: 0.15rem 0 0 1.75rem;
    font-size: 0.9rem;
    color: var(--muted);
  }
  .link-note {
    display: block;
    margin-top: 0.25rem;
    color: var(--ink);
  }
  .warn {
    color: var(--warn);
  }
  .actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .small {
    font-size: 0.86rem;
  }
  .print-only {
    display: none;
  }
  @media print {
    :global(body) {
      background: #fff;
      color: #000;
    }
    .no-print {
      display: none !important;
    }
    .print-only {
      display: block;
    }
    .checklist {
      max-width: none;
      gap: 0.6rem;
    }
    .theme {
      border: 0;
      box-shadow: none;
      padding: 0;
      break-inside: avoid;
    }
    .detail,
    .link-note,
    .warn {
      color: #333;
    }
    progress {
      display: none;
    }
  }
</style>
