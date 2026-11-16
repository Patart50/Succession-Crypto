<script lang="ts">
  /**
   * Page « À propos et limites » : ce que fait l'outil, ce qu'il ne fait pas, vos données, précautions, limites.
   * Structure reprise de carnet-crypto (About.svelte).
   */
  import { AUTHOR, SPONSORS_URL } from 'commun-crypto/support';
  import Support from 'commun-crypto/ui/Support.svelte';
  import { SUPPORT_INTRO } from './supportIntro';

  const version = __APP_VERSION__;
  const repo = 'https://github.com/Patart50/succession-crypto';
</script>

<article class="about" aria-labelledby="about-title">
  <header>
    <h1 id="about-title" tabindex="-1">À propos et limites</h1>
    <p class="muted">succession-crypto {version} · logiciel libre (AGPL-3.0) · version de développement</p>
  </header>

  <section>
    <h2>Ce que fait l'outil</h2>
    <ul>
      <li>
        Il vous aide à préparer la <strong>transmission de vos cryptoactifs</strong> : un inventaire de vos plateformes et wallets, une checklist des points à
        régler et une lettre d'intention à imprimer pour vos proches.
      </li>
      <li>Il rappelle les règles françaises de base, chacune avec sa source officielle et sa date de vérification.</li>
      <li>Il explique les bonnes pratiques (sauvegardes, notaire, Shamir, multisig) sans les mettre en œuvre.</li>
    </ul>
  </section>

  <section>
    <h2>Ce qu'il ne fait pas, volontairement</h2>
    <ul>
      <li>
        <strong>Aucun secret.</strong> L'outil ne demande et ne garde jamais de phrase de récupération (seed), de clé privée ni de mot de passe. Une saisie
        qui ressemble à une phrase de récupération (listes officielles BIP39, anglais et français) ou à une clé privée est effacée sur-le-champ, et un
        fichier importé qui en contient est refusé. Ce détecteur est un garde-fou, pas une garantie : il ne reconnaît ni un mot de passe ni un code PIN.
      </li>
      <li><strong>Aucune connexion</strong> à un wallet, une plateforme ou une blockchain, et aucune valorisation de vos avoirs.</li>
      <li>
        <strong>Aucun conseil personnalisé.</strong> La lettre d'intention n'a aucune valeur juridique : elle ne remplace ni un testament ni les conseils d'un
        notaire.
      </li>
    </ul>
  </section>

  <section>
    <h2>Vos données</h2>
    <ul>
      <li>
        <strong>Rien n'est envoyé.</strong> L'outil ne fait aucune requête sur Internet, même avec votre accord : pas de serveur, pas de compte, pas de mesure
        d'audience, pas de cours de crypto.
      </li>
      <li>
        <strong>Rien n'est enregistré.</strong> Vos saisies restent dans la mémoire de l'onglet et disparaissent à sa fermeture. Même le choix du thème n'est pas
        mémorisé. Pour reprendre plus tard, exportez un fichier (bouton « Exporter » de l'inventaire) et réimportez-le. Le navigateur vous prévient si vous fermez
        l'onglet avec des saisies non exportées.
      </li>
      <li>
        Hors ligne : une fois chargé, l'outil fonctionne sans réseau. Le navigateur garde en cache le code de l'outil, jamais vos saisies.
      </li>
    </ul>
  </section>

  <section>
    <h2>Précautions</h2>
    <ul>
      <li>
        Le fichier exporté n'est pas chiffré : c'est voulu, pour ne pas recréer un coffre-fort à mot de passe. Rangez-le comme un document sensible (clé USB
        dans un tiroir fermé, coffre), jamais en pièce jointe d'un e-mail ni dans un cloud non chiffré.
      </li>
      <li>
        Sans aucun secret, un inventaire ou une lettre révèle tout de même que vous détenez des cryptos et où. Traitez-les comme des documents sensibles : pas
        d'envoi par e-mail, pas de cloud non chiffré, pas d'impression laissée en vue.
      </li>
      <li>
        Séparez les informations : la lettre dit ce qui existe et à qui s'adresser ; l'emplacement de vos sauvegardes se transmet par un autre canal, par
        exemple une enveloppe scellée chez votre notaire.
      </li>
      <li>L'outil ne protège pas contre un ordinateur compromis : utilisez-le sur une machine à jour et de confiance.</li>
    </ul>
  </section>

  <section>
    <h2>Avertissement</h2>
    <p>
      Information générale, à jour à la date indiquée pour chaque règle. Ce n'est ni un conseil juridique, ni un conseil fiscal, ni un conseil en
      investissement. Pour toute disposition concernant votre succession, consultez un notaire.
    </p>
  </section>

  <section>
    <h2>Contribuer</h2>
    <p>
      Une erreur, une règle à mettre à jour, une idée : <a href={`${repo}/issues`} target="_blank" rel="noopener">ouvrez une discussion sur GitHub</a>. Le code
      source est libre (<a href={`${repo}/blob/main/LICENSE`} target="_blank" rel="noopener">AGPL-3.0</a>).
    </p>
  </section>

  <section>
    <h2>Auteur et soutien</h2>
    <p>
      Créé et maintenu par <a href={AUTHOR.url} target="_blank" rel="noopener author">{AUTHOR.name} ({AUTHOR.handle})</a>, sur son temps libre. L'outil est
      gratuit et le restera. Pour le soutenir : <a href={SPONSORS_URL} target="_blank" rel="noopener">GitHub Sponsors</a>, ou en crypto, <Support intro={SUPPORT_INTRO} />.
    </p>
  </section>

  <p><a href="#accueil">← Retour à l'accueil</a></p>
</article>

<style>
  .about {
    display: grid;
    gap: 1.4rem;
    max-width: 46rem;
  }
  header {
    display: grid;
    gap: 0.3rem;
  }
  h1 {
    font-size: clamp(1.6rem, 3.5vw, 2.1rem);
  }
  h1:focus {
    outline: none;
  }
  h2 {
    font-size: 1.2rem;
    margin-bottom: 0.4rem;
  }
  ul {
    margin: 0;
    padding-left: 1.2rem;
    display: grid;
    gap: 0.45rem;
  }
</style>
