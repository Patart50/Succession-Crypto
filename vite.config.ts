import { svelte } from '@sveltejs/vite-plugin-svelte';
import { offlineServiceWorker } from 'commun-crypto/vite';
import { readFileSync } from 'node:fs';
import { defineConfig, type Plugin } from 'vite';

const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as { version: string };

/**
 * Politique de sécurité du contenu (succession D-015) : le navigateur refuse toute connexion vers un autre
 * site que celui de l'outil, tout script ou style venu d'ailleurs, et tout envoi de formulaire.
 * Ajoutée au build seulement : en développement, Vite injecte du code en ligne qu'elle bloquerait.
 */
export const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "worker-src 'self'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
].join('; ');

function contentSecurityPolicy(): Plugin {
  return {
    name: 'succession-csp',
    apply: 'build',
    transformIndexHtml: () => [{ tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP }, injectTo: 'head-prepend' }],
  };
}

export default defineConfig({
  // Chemins relatifs : fonctionne à la racine d'un domaine comme sous /succession-crypto/ (GitHub Pages).
  base: './',
  // Service worker hors ligne généré au build (commun-crypto). Il ne met en cache que le code de l'outil, jamais vos saisies.
  plugins: [svelte(), offlineServiceWorker({ name: 'succession-crypto' }), contentSecurityPolicy()],
  define: { __APP_VERSION__: JSON.stringify(version) },
});
