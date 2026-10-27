import { defineConfig, fontProviders } from 'astro/config';
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
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Geist',
      cssVariable: '--font-sans',
      weights: ['400 900'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
    },
  ],
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
