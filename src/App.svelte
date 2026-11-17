<script lang="ts">
  /**
   * succession-crypto : coquille de l'application. Navigation par ancre, voir lib/router.ts.
   * Aucune persistance (succession D-002) : même le choix du thème ne dure que le temps de l'onglet (succession D-009).
   */
  import { onMount, tick } from 'svelte';
  import ThemeToggle from 'commun-crypto/ui/ThemeToggle.svelte';
  import Support from 'commun-crypto/ui/Support.svelte';
  import { applyTheme, type Theme } from 'commun-crypto/theme';
  import { AUTHOR } from 'commun-crypto/support';
  import { readView, TABS, type View } from './lib/router';
  import { SUPPORT_INTRO } from './lib/ui/supportIntro';
  import Home from './lib/ui/Home.svelte';
  import About from './lib/ui/About.svelte';
  import Upcoming from './lib/ui/Upcoming.svelte';
  import Inventory from './lib/ui/Inventory.svelte';
  import Checklist from './lib/ui/Checklist.svelte';
  import { app } from './lib/state/app.svelte';

  let view = $state<View>(readView(location.hash));
  let theme = $state<Theme>('auto');

  onMount(() => {
    const onHash = async () => {
      view = readView(location.hash);
      scrollTo(0, 0);
      await tick();
      document.querySelector<HTMLElement>('main h1')?.focus();
    };
    // Saisies non exportées : le navigateur demande confirmation avant de fermer l'onglet (D-002).
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!app.dirty) return;
      e.preventDefault();
      e.returnValue = '';
    };
    addEventListener('hashchange', onHash);
    addEventListener('beforeunload', onBeforeUnload);
    return () => {
      removeEventListener('hashchange', onHash);
      removeEventListener('beforeunload', onBeforeUnload);
    };
  });

  $effect(() => applyTheme(theme));

  const upcoming: Partial<Record<View, { title: string; milestone: string; summary: string }>> = {
    lettre: {
      title: "Lettre d'intention",
      milestone: 'J4',
      summary: "Un document à imprimer, dater et signer pour vos proches : ce qui existe et à qui s'adresser, jamais où se trouvent vos sauvegardes.",
    },
    regles: {
      title: 'Règles françaises',
      milestone: 'J5',
      summary: 'Les règles de base de la succession de cryptoactifs en France, chacune avec sa source officielle et sa date de vérification.',
    },
    pratiques: {
      title: 'Bonnes pratiques',
      milestone: 'J5',
      summary: 'Sauvegarde sur métal, passphrase, Shamir, multisig, notaire, arnaques à la récupération : expliqués simplement.',
    },
  };
</script>

<a class="skip" href="#contenu">Aller au contenu</a>

<header class="top">
  <div class="top-inner">
    <div class="brand">
      <a class="brand-name" href="#accueil" aria-label="succession-crypto, accueil">succession-crypto</a>
      <span class="brand-tag"
        ><span class="tagline">Transmettre ses cryptos ·&nbsp;</span>par
        <a href={AUTHOR.url} target="_blank" rel="noopener author">{AUTHOR.name} ({AUTHOR.handle})</a></span
      >
    </div>
    <div class="top-actions">
      {#if app.dirty}
        <a class="unsaved" href="#inventaire" title="Exportez une sauvegarde depuis l'écran Inventaire">Non exporté</a>
      {/if}
      <span class="local" class:hide-narrow={app.dirty} title="Rien n'est enregistré ni envoyé sur Internet">
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"
          ><path d="M8 1.5 2.5 3.8v3.7c0 3.2 2.3 6 5.5 7 3.2-1 5.5-3.8 5.5-7V3.8L8 1.5Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" /></svg
        >
        <span class="local-text">100 % local</span>
      </span>
      <ThemeToggle {theme} onchange={(t) => (theme = t)} />
    </div>
  </div>
  <nav class="tabs" aria-label="Sections">
    {#each TABS as t (t.view)}
      <a href={`#${t.view}`} aria-current={view === t.view ? 'page' : undefined}>{t.label}</a>
    {/each}
  </nav>
</header>

<main id="contenu" tabindex="-1">
  {#if view === 'a-propos'}
    <About />
  {:else if view === 'inventaire'}
    <Inventory />
  {:else if view === 'checklist'}
    <Checklist />
  {:else if upcoming[view]}
    {@const u = upcoming[view]!}
    <Upcoming title={u.title} milestone={u.milestone} summary={u.summary} />
  {:else}
    <Home />
  {/if}
</main>

<footer class="foot">
  <p>
    Information générale, pas un conseil juridique ou fiscal. Pour toute disposition, consultez un notaire. Code source libre (AGPL-3.0) sur
    <a href="https://github.com/Patart50/succession-crypto" rel="noopener" target="_blank">GitHub</a> ·
    <a href="#a-propos">À propos et limites</a> · v{__APP_VERSION__}
  </p>
  <p class="credit">
    Créé par <a href={AUTHOR.url} target="_blank" rel="noopener author">{AUTHOR.name} ({AUTHOR.handle})</a> · <Support intro={SUPPORT_INTRO} />
  </p>
</footer>

{#if app.toast}
  <div class="toast" role="status" aria-live="polite">{app.toast}</div>
{/if}

<style>
  :global(a.btn) {
    text-decoration: none;
  }
  .skip {
    position: absolute;
    left: 1rem;
    top: -3rem;
    z-index: 100;
    background: var(--accent);
    color: var(--on-accent);
    padding: 0.5rem 0.8rem;
    border-radius: var(--radius);
    font-weight: 600;
  }
  .skip:focus {
    top: 0.5rem;
  }
  main:focus {
    outline: none;
  }
  .top {
    background: var(--surface);
    border-bottom: 1px solid var(--rule);
  }
  .top-inner,
  .tabs,
  main,
  .foot {
    max-width: 60rem;
    margin: 0 auto;
    padding-inline: 1rem;
  }
  .top-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding-block: 0.8rem 0.4rem;
  }
  .brand {
    display: grid;
  }
  .brand-name {
    text-decoration: none;
    color: var(--ink);
    width: fit-content;
    font-family: var(--font-doc);
    font-size: 1.45rem;
    font-weight: 650;
    letter-spacing: -0.01em;
    white-space: nowrap;
  }
  .brand-tag {
    font-size: 0.82rem;
    color: var(--muted);
  }
  .top-actions {
    display: flex;
    align-items: center;
    gap: 0.2rem;
  }
  .local {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.82rem;
    color: var(--gain);
    padding-inline: 0.4rem;
  }
  .unsaved {
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--warn);
    padding-inline: 0.4rem;
    white-space: nowrap;
  }
  .toast {
    position: fixed;
    left: 50%;
    bottom: 1.25rem;
    transform: translateX(-50%);
    background: var(--ink);
    color: var(--paper);
    padding: 0.6rem 1rem;
    border-radius: var(--radius);
    box-shadow: var(--shadow-pop);
    font-size: 0.92rem;
    z-index: 50;
    max-width: calc(100vw - 2rem);
  }
  .tabs {
    display: flex;
    gap: 0.2rem;
    overflow-x: auto;
  }
  .tabs a {
    padding: 0.5rem 0.8rem;
    text-decoration: none;
    color: var(--muted);
    font-weight: 550;
    border-bottom: 2px solid transparent;
    white-space: nowrap;
  }
  .tabs a[aria-current='page'] {
    color: var(--ink);
    border-bottom-color: var(--accent);
  }
  main {
    padding-block: 1.5rem 3rem;
    display: grid;
    gap: 1rem;
    min-width: 0;
  }
  @media (max-width: 560px) {
    .tagline,
    .local-text,
    .hide-narrow {
      display: none;
    }
    .brand-name {
      font-size: 1.25rem;
    }
  }
  .foot {
    padding-block: 0 2.5rem;
    font-size: 0.82rem;
    color: var(--muted);
  }
  .foot p:first-child {
    border-top: 1px solid var(--rule);
    padding-top: 1.5rem;
  }
  .credit {
    margin-top: 0.4rem;
  }
  @media print {
    .top,
    .foot,
    .skip,
    .toast {
      display: none;
    }
    main {
      padding-block: 0;
    }
  }
</style>
