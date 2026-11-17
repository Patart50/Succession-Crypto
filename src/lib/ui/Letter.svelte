<script lang="ts">
  /**
   * Écran Lettre (SPEC § 5.3) : quatre champs gardés par le détecteur de secrets, aperçu de la lettre,
   * impression (seule la lettre est imprimée) et export TXT.
   */
  import { buildLetter, letterFileName, letterText, letterWarnings } from '../core/letter';
  import { LETTER_FIELDS, LETTER_LABELS, type LetterField } from '../core/model';
  import { MAX_LETTER_LENGTH } from '../core/backup';
  import { detectSecret, findSecretFields, secretMessage } from '../core/seed';
  import { app } from '../state/app.svelte';
  import { downloadText } from './download';
  import LetterDocument from './LetterDocument.svelte';

  const HINTS: Record<LetterField, string> = {
    nomAffiche: 'Tel qu’il apparaîtra dans la lettre, par exemple votre prénom et votre nom.',
    destinataires: 'Par exemple « mes enfants » ou « ma femme et mes enfants ».',
    personneConfiance: 'Nom et moyen de la joindre. Elle n’a pas besoin de connaître vos secrets.',
    notaire: 'Nom, étude, ville. Il peut garder l’enveloppe scellée qui indique où sont vos sauvegardes.',
  };
  const MULTILINE: Record<LetterField, boolean> = { nomAffiche: false, destinataires: false, personneConfiance: true, notaire: true };

  let errors = $state<Partial<Record<LetterField, string>>>({});
  let alert = $state('');
  const now = new Date();
  const model = $derived(buildLetter(app.data, now));
  const warnings = $derived(letterWarnings(app.data));

  function input(field: LetterField, el: HTMLInputElement | HTMLTextAreaElement) {
    const value = el.value;
    const kind = detectSecret(value);
    if (kind) {
      // Vidé aussi dans la page : si l'état était déjà vide, Svelte ne redessinerait pas le champ.
      el.value = '';
      app.setLetter(field, '');
      errors[field] = secretMessage(kind);
      alert = `${secretMessage(kind)} Le champ « ${LETTER_LABELS[field]} » a été effacé.`;
      return;
    }
    app.setLetter(field, value);
    errors[field] = undefined;
    // Seed coupée entre deux champs de la lettre : ces deux champs sont effacés (D-011).
    const found = findSecretFields(LETTER_FIELDS.map((f) => app.data.lettre[f] ?? ''));
    if (found) {
      const culprits = found.fields.map((i) => LETTER_FIELDS[i]);
      for (const f of culprits) {
        app.setLetter(f, '');
        if (f === field) el.value = '';
        errors[f] = secretMessage(found.kind);
      }
      alert = `${secretMessage(found.kind)} Les champs ${culprits.map((f) => `« ${LETTER_LABELS[f]} »`).join(' et ')} ont été effacés.`;
    } else if (Object.values(errors).every((e) => !e)) {
      alert = '';
    }
  }

  function exportTxt() {
    const d = new Date();
    downloadText(letterFileName(d), letterText(app.data, d), 'text/plain');
    app.notify('Lettre exportée en texte.');
  }
</script>

<section class="letter-screen" aria-labelledby="letter-title">
  <header class="no-print">
    <h1 id="letter-title" tabindex="-1">Lettre d’intention</h1>
    <p>
      Un document à imprimer, dater et signer pour vos proches. Il dit ce qui existe, d’après votre <a href="#inventaire">inventaire</a>, et à qui
      s’adresser. Il ne dit jamais où se trouvent vos sauvegardes : transmettez cette information par un autre canal, par exemple une enveloppe scellée chez
      votre notaire.
    </p>
  </header>

  <form class="panel form no-print" onsubmit={(e) => e.preventDefault()} aria-labelledby="letter-form-title" novalidate>
    <h2 id="letter-form-title">Informations de la lettre</h2>
    <div role="alert">
      {#if alert}<p class="notice"><span>{alert}</span></p>{/if}
    </div>
    <div class="grid">
      {#each LETTER_FIELDS as f (f)}
        <label class="field" class:wide={MULTILINE[f]}>
          <span>{LETTER_LABELS[f]}</span>
          {#if MULTILINE[f]}
            <textarea
              rows="2"
              maxlength={MAX_LETTER_LENGTH}
              value={app.data.lettre[f] ?? ''}
              oninput={(e) => input(f, e.currentTarget)}
              aria-invalid={errors[f] ? 'true' : undefined}
              aria-describedby={`lh-${f}${errors[f] ? ` le-${f}` : ''}`}
            ></textarea>
          {:else}
            <input
              maxlength={MAX_LETTER_LENGTH}
              autocomplete="off"
              value={app.data.lettre[f] ?? ''}
              oninput={(e) => input(f, e.currentTarget)}
              aria-invalid={errors[f] ? 'true' : undefined}
              aria-describedby={`lh-${f}${errors[f] ? ` le-${f}` : ''}`}
            />
          {/if}
          <small id={`lh-${f}`}>{HINTS[f]}</small>
          {#if errors[f]}<small class="error" id={`le-${f}`}>{errors[f]}</small>{/if}
        </label>
      {/each}
    </div>
    <p class="muted small">
      Aucun secret ici non plus : ni phrase de récupération, ni mot de passe, ni code PIN, ni emplacement de vos sauvegardes.
    </p>
  </form>

  {#if warnings.length > 0}
    <div class="panel warnings no-print" role="status">
      <p><strong>Avant d’imprimer :</strong></p>
      <ul>
        {#each warnings as w (w)}<li>{w}</li>{/each}
      </ul>
    </div>
  {/if}

  <div class="actions no-print">
    <button class="btn btn-primary" type="button" onclick={() => print()}>Imprimer ou enregistrer en PDF</button>
    <button class="btn" type="button" onclick={exportTxt}>Exporter en texte (.txt)</button>
  </div>

  <h2 class="preview-title no-print">Aperçu</h2>
  <LetterDocument {model} />

  <p class="muted small no-print">
    Une fois imprimée : datez, signez, rangez la lettre là où vos proches la chercheront, à part de vos sauvegardes. Pensez à cocher les points
    correspondants de la <a href="#checklist">checklist</a> et à exporter votre sauvegarde depuis l’<a href="#inventaire">inventaire</a>.
  </p>
</section>

<style>
  .letter-screen {
    display: grid;
    gap: 1rem;
    max-width: 52rem;
  }
  header {
    display: grid;
    gap: 0.5rem;
  }
  h1 {
    font-size: clamp(1.6rem, 3.5vw, 2.1rem);
  }
  h1:focus {
    outline: none;
  }
  .form {
    display: grid;
    gap: 0.8rem;
    padding: 1.1rem 1.2rem;
  }
  .form h2,
  .preview-title {
    font-size: 1.15rem;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
    gap: 0.9rem 1rem;
  }
  .wide {
    grid-column: 1 / -1;
  }
  .field {
    align-content: start;
  }
  input {
    height: 2.5rem;
  }
  textarea {
    resize: vertical;
  }
  .warnings {
    padding: 0.9rem 1.2rem;
    border-color: var(--warn);
  }
  .warnings ul {
    margin: 0.3rem 0 0;
    padding-left: 1.2rem;
  }
  .actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .small {
    font-size: 0.86rem;
  }
  @media print {
    :global(body) {
      background: #fff;
      color: #000;
    }
    .no-print {
      display: none !important;
    }
    .letter-screen {
      max-width: none;
    }
  }
</style>
