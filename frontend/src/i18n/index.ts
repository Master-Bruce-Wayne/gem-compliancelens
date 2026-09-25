import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en/translation.json';
import hiTranslation from './locales/hi/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'hi'],
    debug: false,
    resources: {
      en: { translation: enTranslation },
      hi: { translation: hiTranslation },
    },
    interpolation: {
      escapeValue: false, // React already handles XSS escaping
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'gem_i18n_lang',
    },
  });

// Keep <html lang="..."> in sync for screen readers
i18n.on('languageChanged', (lng) => {
  const langCode = lng.split('-')[0]; // 'hi-IN' → 'hi'
  document.documentElement.lang = langCode;
});

export default i18n;
