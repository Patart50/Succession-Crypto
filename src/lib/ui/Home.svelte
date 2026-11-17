<script lang="ts">
  /** Accueil : ce que fait l'outil, ce qu'il ne fait jamais, et la règle « rien n'est enregistré ». */
</script>

<section class="home" aria-labelledby="home-title">
  <h1 id="home-title" tabindex="-1">Préparer la transmission de vos cryptos, sans jamais confier un secret</h1>
  <p>
    Si vous disparaissez demain, vos proches sauront-ils que vos cryptos existent, où elles sont et à qui s'adresser ? Cet outil vous aide à
    préparer un <strong>inventaire</strong>, à suivre une <strong>checklist</strong> et à rédiger une <strong>lettre d'intention</strong> à imprimer,
    avec les règles françaises de base.
  </p>

  <div class="cols">
    <div class="card">
      <h2>Ce que fait l'outil</h2>
      <ul>
        <li>Recenser vos plateformes et wallets, et la personne à qui s'adresser pour chacun.</li>
        <li>Vous guider point par point : sauvegardes, notaire, personne de confiance, révision.</li>
        <li>Produire une lettre claire pour vos proches, à imprimer, dater et signer.</li>
        <li>Rappeler les règles françaises, chacune avec sa source officielle.</li>
      </ul>
    </div>
    <div class="card">
      <h2>Ce qu'il ne fera jamais</h2>
      <ul>
        <li>Demander ou garder une <strong>phrase de récupération</strong>, une clé privée ou un mot de passe.</li>
        <li>Se connecter à un wallet, une plateforme ou une blockchain.</li>
        <li>Envoyer quoi que ce soit sur Internet.</li>
        <li>Remplacer un testament ou les conseils d'un notaire.</li>
      </ul>
    </div>
  </div>

  <p class="notice" role="note">
    <span
      ><strong>Rien n'est enregistré.</strong> Vos saisies restent dans cet onglet et disparaissent à sa fermeture. Pour les retrouver plus tard, vous
      exporterez un fichier que vous rangerez vous-même, en lieu sûr.</span
    >
  </p>

  <p class="muted small">
    Version de développement : l'<a href="#inventaire">inventaire</a>, la <a href="#checklist">checklist</a> et la <a href="#lettre">lettre</a> sont disponibles ; les règles françaises et les bonnes pratiques arrivent dans la prochaine version. Méthode et limites :
    <a href="#a-propos">À propos</a>.
  </p>
</section>

<style>
  .home {
    display: grid;
    gap: 1rem;
    max-width: 48rem;
    padding-block: 0.5rem;
  }
  h1 {
    font-size: 1.8rem;
    line-height: 1.2;
  }
  h1:focus {
    outline: none;
  }
  .cols {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
    gap: 1rem;
  }
  .card {
    background: var(--surface);
    border: 1px solid var(--rule);
    border-radius: var(--radius);
    padding: 1rem 1.1rem;
  }
  h2 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }
  ul {
    margin: 0;
    padding-left: 1.2rem;
    display: grid;
    gap: 0.4rem;
  }
  .small {
    font-size: 0.86rem;
  }
</style>
