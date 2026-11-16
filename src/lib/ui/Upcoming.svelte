<script lang="ts">
  /** Écran annoncé mais pas encore livré : dit honnêtement ce qui arrive et à quel jalon. */
  let { title, milestone, summary }: { title: string; milestone: string; summary: string } = $props();
</script>

<section class="upcoming" aria-labelledby="upcoming-title">
  <h1 id="upcoming-title" tabindex="-1">{title}</h1>
  <p class="badge">En préparation · jalon {milestone}</p>
  <p>{summary}</p>
  <p class="muted">Cette section n'est pas encore disponible dans cette version de développement.</p>
</section>

<style>
  .upcoming {
    display: grid;
    gap: 0.8rem;
    max-width: 42rem;
  }
  h1 {
    font-size: clamp(1.6rem, 3.5vw, 2.1rem);
  }
  h1:focus {
    outline: none;
  }
  .badge {
    width: fit-content;
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--ink);
    background: var(--surface);
    border: 1px solid var(--rule);
    border-radius: 999px;
    padding: 0.15rem 0.7rem;
  }
</style>
