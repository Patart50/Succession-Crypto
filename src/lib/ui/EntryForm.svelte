<script lang="ts">
  /**
   * Formulaire d'un emplacement (ajout ou modification). Chaque champ texte passe par le détecteur de
   * secrets à chaque frappe : une saisie suspecte est effacée sur-le-champ et jamais conservée (D-001).
   */
  import { onMount, untrack } from 'svelte';
  import { ACCESS_CONTACTS, DEATH_PROCEDURE, ENTRY_TYPES, MAX_LENGTH, TEXT_FIELDS, emptyEntry, type Entry, type TextField } from '../core/model';
  import { detectSecret, findSecretFields, secretMessage } from '../core/seed';
  import { FIELD_LABELS } from '../core/backup';

  let {
    initial = null,
    amountsEnabled,
    onsave,
    oncancel,
  }: { initial?: Entry | null; amountsEnabled: boolean; onsave: (entry: Entry) => void; oncancel: () => void } = $props();

  // Copie de travail prise à l'ouverture du formulaire : les modifications ne touchent l'inventaire qu'à l'enregistrement.
  const start = untrack(() => initial);
  const isNew = start === null;
  let entry = $state<Entry>(start ? { ...start } : emptyEntry());
  let montant = $state(start?.montant ?? '');
  let errors = $state<Partial<Record<TextField, string>>>({});
  let alert = $state('');
  let heading: HTMLHeadingElement;

  onMount(() => heading.focus());

  function value(field: TextField): string {
    return field === 'montant' ? montant : entry[field];
  }

  function clear(field: TextField) {
    if (field === 'montant') montant = '';
    else entry[field] = '';
  }

  /** Vérifie un champ à chaque frappe ; efface une saisie qui ressemble à un secret. */
  function guard(field: TextField) {
    const kind = detectSecret(value(field));
    if (kind) {
      clear(field);
      errors[field] = secretMessage(kind);
      alert = secretMessage(kind);
    } else if (field !== 'nom' || entry.nom.trim() !== '') {
      errors[field] = undefined;
    }
  }

  function changeType(type: Entry['type']) {
    entry.type = type;
    if (type !== 'plateforme') entry.procedureDeces = 'sans-objet';
    else if (entry.procedureDeces === 'sans-objet') entry.procedureDeces = 'non';
  }

  function submit(e: SubmitEvent) {
    e.preventDefault();
    const fields = TEXT_FIELDS.filter((f) => f !== 'montant' || amountsEnabled);
    const found = findSecretFields(fields.map(value));
    if (found) {
      // Secret coupé entre deux champs : seuls ces deux champs sont effacés (succession D-011).
      const culprits = found.fields.map((i) => fields[i]);
      for (const f of culprits) {
        clear(f);
        errors[f] = secretMessage(found.kind);
      }
      const names = culprits.map((f) => `« ${FIELD_LABELS[f]} »`).join(' et ');
      alert =
        culprits.length > 1
          ? `${secretMessage(found.kind)} Les champs ${names}, qui la formaient une fois réunis, ont été effacés.`
          : `${secretMessage(found.kind)} Le champ ${names} a été effacé.`;
      heading.focus();
      return;
    }
    if (entry.nom.trim() === '') {
      errors.nom = 'Le nom est obligatoire (par exemple « Plateforme A »).';
      document.getElementById('f-nom')?.focus();
      return;
    }
    onsave({
      ...entry,
      nom: entry.nom.trim(),
      actifs: entry.actifs.trim(),
      precision: entry.precision.trim(),
      notes: entry.notes.trim(),
      montant: amountsEnabled && montant.trim() !== '' ? montant.trim() : null,
    });
  }

  const describedBy = (field: string, hint = true) => [hint ? `h-${field}` : '', errors[field as TextField] ? `e-${field}` : ''].filter(Boolean).join(' ') || undefined;
</script>

<form class="panel form" onsubmit={submit} novalidate aria-labelledby="form-title">
  <h2 id="form-title" tabindex="-1" bind:this={heading}>{isNew ? 'Ajouter un emplacement' : 'Modifier l’emplacement'}</h2>
  <p class="muted small">
    Notez ce qui existe et à qui s'adresser, <strong>jamais</strong> une phrase de récupération, une clé privée, un mot de passe ou un code PIN. Une saisie
    qui ressemble à un secret est effacée immédiatement.
  </p>

  <div class="alert" role="alert">
    {#if alert}<p class="notice"><span>{alert}</span></p>{/if}
  </div>

  <div class="grid">
    <label class="field">
      <span>Type</span>
      <select value={entry.type} onchange={(e) => changeType(e.currentTarget.value as Entry['type'])} aria-describedby="h-type">
        {#each ENTRY_TYPES as t (t.id)}<option value={t.id}>{t.label}</option>{/each}
      </select>
      <small id="h-type">{ENTRY_TYPES.find((t) => t.id === entry.type)?.hint}</small>
    </label>

    <label class="field">
      <span>Nom <span aria-hidden="true">*</span></span>
      <input
        id="f-nom"
        bind:value={entry.nom}
        oninput={() => guard('nom')}
        maxlength={MAX_LENGTH.nom}
        required
        autocomplete="off"
        aria-invalid={errors.nom ? 'true' : undefined}
        aria-describedby={describedBy('nom')}
      />
      <small id="h-nom">Obligatoire. Par exemple « Plateforme A » ou « Wallet matériel 1 ».</small>
      {#if errors.nom}<small class="error" id="e-nom">{errors.nom}</small>{/if}
    </label>

    <label class="field">
      <span>Actifs</span>
      <input
        bind:value={entry.actifs}
        oninput={() => guard('actifs')}
        maxlength={MAX_LENGTH.actifs}
        autocomplete="off"
        aria-invalid={errors.actifs ? 'true' : undefined}
        aria-describedby={describedBy('actifs')}
      />
      <small id="h-actifs">Facultatif. Par exemple « BTC, ETH ».</small>
      {#if errors.actifs}<small class="error" id="e-actifs">{errors.actifs}</small>{/if}
    </label>

    {#if amountsEnabled}
      <label class="field">
        <span>Montant indicatif</span>
        <input
          bind:value={montant}
          oninput={() => guard('montant')}
          maxlength={MAX_LENGTH.montant}
          autocomplete="off"
          aria-invalid={errors.montant ? 'true' : undefined}
          aria-describedby={describedBy('montant')}
        />
        <small id="h-montant">Facultatif. Attention : il révèle la valeur de vos avoirs à qui lira l'inventaire.</small>
        {#if errors.montant}<small class="error" id="e-montant">{errors.montant}</small>{/if}
      </label>
    {/if}

    <label class="field">
      <span>À qui s'adresser</span>
      <select bind:value={entry.acces} aria-describedby="h-acces">
        {#each ACCESS_CONTACTS as a (a.id)}<option value={a.id}>{a.label}</option>{/each}
      </select>
      <small id="h-acces">La personne ou le document qui permettra à vos proches d'y accéder.</small>
    </label>

    <label class="field">
      <span>Précision</span>
      <input
        bind:value={entry.precision}
        oninput={() => guard('precision')}
        maxlength={MAX_LENGTH.precision}
        autocomplete="off"
        aria-invalid={errors.precision ? 'true' : undefined}
        aria-describedby={describedBy('precision')}
      />
      <small id="h-precision">Facultatif. Par exemple « enveloppe scellée chez le notaire ». Aucun secret.</small>
      {#if errors.precision}<small class="error" id="e-precision">{errors.precision}</small>{/if}
    </label>

    {#if entry.type === 'plateforme'}
      <fieldset class="field wide">
        <legend>Connaissez-vous la procédure de la plateforme en cas de décès ?</legend>
        <div class="radios">
          {#each DEATH_PROCEDURE.filter((d) => d.id !== 'sans-objet') as d (d.id)}
            <label class="radio"><input type="radio" name="deces" value={d.id} bind:group={entry.procedureDeces} /> {d.label}</label>
          {/each}
        </div>
      </fieldset>
    {/if}

    <label class="field wide">
      <span>Notes</span>
      <textarea
        bind:value={entry.notes}
        oninput={() => guard('notes')}
        maxlength={MAX_LENGTH.notes}
        rows="3"
        aria-invalid={errors.notes ? 'true' : undefined}
        aria-describedby={describedBy('notes')}
      ></textarea>
      <small id="h-notes">Facultatif. Ce que vos proches doivent savoir, sans aucun secret ({MAX_LENGTH.notes} caractères au plus).</small>
      {#if errors.notes}<small class="error" id="e-notes">{errors.notes}</small>{/if}
    </label>
  </div>

  <div class="actions">
    <button class="btn btn-primary" type="submit">Enregistrer</button>
    <button class="btn" type="button" onclick={oncancel}>Annuler</button>
  </div>
</form>

<style>
  .form {
    display: grid;
    gap: 0.9rem;
    padding: 1.1rem 1.2rem;
  }
  h2 {
    font-size: 1.25rem;
  }
  h2:focus {
    outline: none;
  }
  .small {
    font-size: 0.88rem;
  }
  .alert:empty {
    display: none;
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
  input:not([type='radio']),
  select {
    height: 2.5rem;
  }
  fieldset {
    border: 0;
    padding: 0;
    margin: 0;
  }
  legend {
    font-size: 0.85rem;
    font-weight: 550;
    padding: 0;
    margin-bottom: 0.3rem;
  }
  .radios {
    display: flex;
    gap: 1.2rem;
  }
  .radio {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
  }
  .radio input {
    width: auto;
    accent-color: var(--accent);
  }
  textarea {
    resize: vertical;
  }
  .actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
</style>
