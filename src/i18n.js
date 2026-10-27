import { i18n } from 'astro:config/server';
import { getRelativeLocaleUrl } from 'astro:i18n';
import en from '../locales/en.json';
import de from '../locales/de.json';

const translations = { en, de };

export function getLocalePaths() {
    return i18n.locales.map((lang) => ({ params: { lang } }));
}

export function useTranslations(lang) {
    return translations[lang] ?? translations[i18n.defaultLocale];
}

export function getLocalizedPath(pathname, targetLang) {
    const subpath = pathname.replace(new RegExp(`^/(${i18n.locales.join('|')})(?=/|$)`), '');
    return getRelativeLocaleUrl(targetLang, subpath);
}
