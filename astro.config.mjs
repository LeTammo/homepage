import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://mathia.xyz',
  i18n: {
    locales: ['en', 'de'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  redirects: {
    '/en/about': '/en/',
    '/de/about': '/de/',
  },
  integrations: [
    sitemap({
      filter: (page) => !/\/(about|404)\/?$/.test(page) && page !== 'https://mathia.xyz/',
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', de: 'de' },
      },
    }),
  ],
});
