<script lang="ts">
  /** Écran Règles françaises (SPEC § 5.4) : règles sourcées et datées (D-005, D-014). */
  import { RULES, RULES_VERIFIED } from '../../content/regles';

  const verified = new Date(`${RULES_VERIFIED}T12:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
</script>

<section class="rules" aria-labelledby="rules-title">
  <header>
    <h1 id="rules-title" tabindex="-1">Règles françaises</h1>
    <p>Ce que dit la loi française sur les cryptos dans une succession, pour un défunt domicilié en France. Chaque règle renvoie à sa source officielle.</p>
    <p class="notice" role="note">
      <span
        ><strong>Information générale, vérifiée le {verified}.</strong> Ce n’est pas un conseil juridique ou fiscal personnalisé, et les règles changent :
        consultez la source et un notaire avant toute décision.</span
      >
    </p>
  </header>

  <ol class="list">
    {#each RULES as r (r.id)}
      <li class="panel rule" aria-labelledby={`r-${r.id}`}>
        <h2 id={`r-${r.id}`}>{r.title}</h2>
        <p>{r.text}</p>
        {#if r.practice}
          <p class="practice"><strong>En pratique :</strong> {r.practice}</p>
        {/if}
        <div class="sources">
          <p class="src-title">Source{r.sources.length > 1 ? 's' : ''}</p>
          <ul>
            {#each r.sources as s (s.url)}
              <li>
                <a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}<span class="sr-only"> (nouvel onglet)</span></a><span class="version"
                  >, {s.version}</span
                >
              </li>
            {/each}
          </ul>
        </div>
      </li>
    {/each}
  </ol>

  <p class="muted small">
    Les droits à payer dépendent du lien de parenté, des abattements et de l’ensemble de la succession : leur calcul relève du notaire, pas de cet outil. Une erreur ou une
    règle à mettre à jour ? <a href="https://github.com/Patart50/succession-crypto/issues" target="_blank" rel="noopener noreferrer">Signalez-la sur GitHub</a>.
  </p>
</section>

<style>
  .rules {
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
  .list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.9rem;
  }
  .rule {
    padding: 1rem 1.2rem;
    display: grid;
    gap: 0.5rem;
  }
  h2 {
    font-size: 1.15rem;
  }
  .practice {
    border-left: 3px solid var(--accent);
    padding-left: 0.7rem;
  }
  .sources {
    font-size: 0.86rem;
    color: var(--muted);
  }
  .src-title {
    font-weight: 600;
  }
  .sources ul {
    margin: 0.2rem 0 0;
    padding-left: 1.1rem;
  }
  .sources a {
    overflow-wrap: anywhere;
  }
  .small {
    font-size: 0.86rem;
  }
</style>
