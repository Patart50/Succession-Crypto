<script lang="ts">
  /**
   * Sauvegarde : seul moyen de conserver les saisies (succession D-002). Export d'un fichier JSON v1,
   * import avec validation stricte et détecteur de secrets (SPEC § 5.6).
   */
  import { exportFileName, parseBackup, serialize } from '../core/backup';
  import { app } from '../state/app.svelte';
  import { downloadText } from './download';

  let fileInput: HTMLInputElement;
  let error = $state('');

  const time = (d: Date) => d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  function exportFile() {
    const now = new Date();
    downloadText(exportFileName(now), serialize(app.data, now));
    app.markExported(now);
    error = '';
    app.notify('Sauvegarde exportée. Rangez le fichier en lieu sûr.');
  }

  async function importFile() {
    const file = fileInput.files?.[0];
    fileInput.value = '';
    if (!file) return;
    error = '';
    const text = await file.text();
    const result = parseBackup(text);
    if (!result.ok) {
      error = result.error;
      return;
    }
    if (app.dirty && !confirm('Vos saisies actuelles ne sont pas exportées. Les remplacer par le contenu du fichier ?')) return;
    app.replaceAll(result.data);
    const n = result.data.inventaire.length;
    app.notify(`Sauvegarde importée : ${n} emplacement${n > 1 ? 's' : ''}.`);
  }
</script>

<section class="panel save" aria-labelledby="save-title">
  <h2 id="save-title">Sauvegarde</h2>
  <p class="status" role="status">
    {#if app.dirty}
      <strong class="warn">Saisies non exportées.</strong> Elles disparaîtront à la fermeture de l'onglet.
    {:else if app.exportedAt}
      Exporté à {time(app.exportedAt)}.
    {:else}
      Rien à exporter pour l'instant.
    {/if}
  </p>
  <div class="actions">
    <button class="btn btn-primary" type="button" onclick={exportFile}>Exporter (.json)</button>
    <button class="btn" type="button" onclick={() => fileInput.click()}>Importer une sauvegarde</button>
    <input bind:this={fileInput} class="sr-only" type="file" accept="application/json,.json" tabindex="-1" aria-hidden="true" onchange={importFile} />
  </div>
  <div role="alert">
    {#if error}<p class="notice"><span>{error}</span></p>{/if}
  </div>
  <p class="muted small">
    Le fichier n'est pas chiffré : il contient votre inventaire en clair. Rangez-le comme un document sensible (clé USB dans un tiroir fermé, coffre),
    jamais en pièce jointe d'un e-mail ni dans un cloud non chiffré.
  </p>
</section>

<style>
  .save {
    display: grid;
    gap: 0.6rem;
    padding: 1rem 1.2rem;
  }
  h2 {
    font-size: 1.1rem;
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
</style>
