import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://mathia.xyz',
  integrations: [
    sitemap({
      filter: (page) => !/\/(about|404)\/?$/.test(page) && page !== 'https://mathia.xyz/',
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
