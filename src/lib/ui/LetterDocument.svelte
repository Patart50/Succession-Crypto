<script lang="ts">
  /** Rendu de la lettre d'intention (aperçu à l'écran et impression). Structure imposée par core/letter.ts (D-004). */
  import type { LetterModel } from '../core/letter';

  let { model }: { model: LetterModel } = $props();
</script>

<article class="letter" aria-labelledby="letter-doc-title">
  <p class="disclaimer">{model.disclaimer}</p>
  <h2 id="letter-doc-title">Lettre d’intention : transmission de mes cryptoactifs</h2>
  <p class="greeting">{model.greeting}</p>
  <p>{model.intro}</p>

  <h3>Personnes à contacter</h3>
  {#if model.contacts.length === 0}
    <p class="empty">Aucune personne indiquée.</p>
  {:else}
    <dl class="contacts">
      {#each model.contacts as c (c.label)}
        <div><dt>{c.label}</dt><dd>{c.value}</dd></div>
      {/each}
    </dl>
  {/if}

  <h3>Ce qui existe</h3>
  {#if model.entries.length === 0}
    <p class="empty">Aucun emplacement.</p>
  {:else}
    <ol class="entries">
      {#each model.entries as e, i (i)}
        <li>
          <p class="entry-name"><strong>{e.nom}</strong> <span class="type">({e.type})</span></p>
          {#if e.actifs}<p>Actifs : {e.actifs}</p>{/if}
          {#if e.montant}<p>Montant indicatif : {e.montant}</p>{/if}
          <p>À qui s’adresser : {e.contact}</p>
          {#if e.notes}<p class="notes">Notes : {e.notes}</p>{/if}
        </li>
      {/each}
    </ol>
  {/if}

  <h3>Conseils pour mes proches</h3>
  <ul class="advice">
    {#each model.advice as a (a)}<li>{a}</li>{/each}
  </ul>

  <div class="sign">
    <p>Fait à : <span class="blank wide"></span> le : <span class="blank"></span></p>
    <p>Signature :</p>
    <div class="sign-box"></div>
  </div>
  <p class="generated">Document préparé le {model.generatedOn} avec succession-crypto.</p>
</article>

<style>
  .letter {
    background: var(--surface);
    border: 1px solid var(--rule);
    border-radius: var(--radius);
    padding: 1.6rem 1.8rem;
    display: grid;
    gap: 0.55rem;
    font-family: var(--font-doc);
    line-height: 1.55;
    overflow-wrap: anywhere;
  }
  .disclaimer {
    font-family: var(--font-ui, inherit);
    font-size: 0.85rem;
    font-weight: 600;
    border: 1.5px solid var(--ink);
    border-radius: 4px;
    padding: 0.5rem 0.7rem;
  }
  h2 {
    font-size: 1.3rem;
    margin-top: 0.4rem;
  }
  h3 {
    font-size: 1.05rem;
    margin-top: 0.8rem;
  }
  p {
    margin: 0;
  }
  .greeting {
    font-style: italic;
  }
  .empty {
    color: var(--muted);
  }
  .contacts {
    margin: 0;
    display: grid;
    gap: 0.3rem;
  }
  .contacts div {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  dt {
    font-weight: 700;
  }
  dt::after {
    content: ' :';
  }
  dd {
    margin: 0;
    white-space: pre-line;
  }
  .entries {
    margin: 0;
    padding-left: 1.4rem;
    display: grid;
    gap: 0.6rem;
  }
  .type {
    color: var(--muted);
  }
  .notes {
    white-space: pre-line;
  }
  .advice {
    margin: 0;
    padding-left: 1.2rem;
    display: grid;
    gap: 0.25rem;
  }
  .sign {
    margin-top: 1.2rem;
    display: grid;
    gap: 0.6rem;
  }
  .blank {
    display: inline-block;
    width: 7rem;
    border-bottom: 1px solid var(--ink);
  }
  .blank.wide {
    width: 11rem;
  }
  .sign-box {
    height: 4.5rem;
  }
  .generated {
    font-size: 0.8rem;
    color: var(--muted);
  }
  @media print {
    .letter {
      border: 0;
      padding: 0;
      background: #fff;
      color: #000;
      font-size: 10pt;
      line-height: 1.4;
      gap: 0.3rem;
    }
    h2 {
      font-size: 14pt;
      margin-top: 0.2rem;
    }
    h3 {
      font-size: 11pt;
      margin-top: 0.45rem;
    }
    .entries {
      gap: 0.35rem;
    }
    .advice {
      gap: 0.1rem;
    }
    .sign {
      margin-top: 0.7rem;
      gap: 0.4rem;
    }
    .sign-box {
      height: 3.5rem;
    }
    .disclaimer {
      border-color: #000;
    }
    .type,
    .empty,
    .generated {
      color: #444;
    }
    .entries li,
    .sign {
      break-inside: avoid;
    }
  }
</style>
