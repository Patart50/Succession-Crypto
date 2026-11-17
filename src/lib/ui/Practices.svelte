<script lang="ts">
  /** Écran Bonnes pratiques (SPEC § 5.5, D-007) : fiches pédagogiques, aucune mise en œuvre. */
  import { PRACTICES } from '../../content/pratiques';
</script>

<section class="practices" aria-labelledby="practices-title">
  <header>
    <h1 id="practices-title" tabindex="-1">Bonnes pratiques</h1>
    <p>
      Comment conserver vos accès pour qu’ils soient à la fois protégés de votre vivant et transmissibles après vous. Ces fiches expliquent ; l’outil ne met
      en œuvre aucune de ces techniques et ne vous demandera jamais un secret.
    </p>
    <nav aria-label="Fiches">
      <ul class="toc">
        {#each PRACTICES as p (p.id)}<li><a href={`#pratiques`} onclick={(e) => { e.preventDefault(); document.getElementById(`p-${p.id}`)?.focus(); document.getElementById(`p-${p.id}`)?.scrollIntoView({ block: 'start' }); }}>{p.title}</a></li>{/each}
      </ul>
    </nav>
  </header>

  {#each PRACTICES as p (p.id)}
    <article class="panel practice" aria-labelledby={`p-${p.id}`}>
      <h2 id={`p-${p.id}`} tabindex="-1">{p.title}</h2>
      <p>{p.summary}</p>
      <ul>
        {#each p.points as pt (pt)}<li>{pt}</li>{/each}
      </ul>
      <p class="pitfall"><strong>Piège à éviter :</strong> {p.pitfall}</p>
    </article>
  {/each}

  <p class="muted small">
    Pour passer à l’action : la <a href="#checklist">checklist</a> reprend ces points un par un.
  </p>
</section>

<style>
  .practices {
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
  h1:focus,
  h2:focus {
    outline: none;
  }
  .toc {
    margin: 0;
    padding-left: 1.2rem;
    display: grid;
    gap: 0.2rem;
    font-size: 0.92rem;
  }
  .practice {
    padding: 1rem 1.2rem;
    display: grid;
    gap: 0.5rem;
    scroll-margin-top: 1rem;
  }
  h2 {
    font-size: 1.15rem;
  }
  ul {
    margin: 0;
    padding-left: 1.2rem;
    display: grid;
    gap: 0.3rem;
  }
  .pitfall {
    border-left: 3px solid var(--warn);
    padding-left: 0.7rem;
  }
  .small {
    font-size: 0.86rem;
  }
</style>
