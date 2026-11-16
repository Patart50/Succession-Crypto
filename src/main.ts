import { mount } from 'svelte';
import 'commun-crypto/theme.css';
import App from './App.svelte';

const app = mount(App, {
  target: document.getElementById('app')!,
});

// Hors ligne : service worker généré au build (absent en développement).
// Il met en cache le code de l'outil, jamais vos saisies (succession D-002).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      // Non bloquant : l'application fonctionne sans, simplement pas hors ligne.
    });
  });
}

export default app;
