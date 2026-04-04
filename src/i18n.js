import en from './locales/en.json';
import hi from './locales/hi.json';

const translations = {
  en,
  hi
};

export function getTranslation(lang, key) {
  if (translations[lang] && translations[lang][key]) {
    return translations[lang][key];
  }
  // Fallback to English
  if (translations['en'] && translations['en'][key]) {
    return translations['en'][key];
  }
  // Return the key itself if no translation found
  return key;
}
