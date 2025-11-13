// Import all locale files directly
import en_US from './locales/en-US.json';
import it_IT from './locales/it-IT.json';
import fr_FR from './locales/fr-FR.json';
import es_ES from './locales/es-ES.json';
import de_DE from './locales/de-DE.json';

// Static map of all available locales
const locales = {
  'en': en_US,
  'en-US': en_US,
  'it': it_IT,
  'it-IT': it_IT,
  'fr': fr_FR,
  'fr-FR': fr_FR,
  'es': es_ES,
  'es-ES': es_ES,
  'de': de_DE,
  'de-DE': de_DE
};

/**
 * Add custom locales to the available locales
 * @param {Object} customLocales - Object containing custom locale translations
 */
export function addLocales(customLocales) {
  if (!customLocales) return;

  // Merge custom locales with existing ones
  Object.keys(customLocales).forEach(langCode => {
    locales[langCode] = customLocales[langCode];
  });
}

/**
 * Get a translation for a key in the specified language
 * @param {string} key - The translation key
 * @param {string} lang - The language code (defaults to 'en')
 * @param {Object} params - Parameters to replace in the translation
 * @returns {string} The translated text or the key if not found
 */
export function translate(key, lang = 'en', params = {}) {
  // Get the appropriate locale or fall back to English
  const langCode = normalizeLangCode(lang);
  const locale = locales[langCode] || locales['en'];

  if (!locale) {
    return key;
  }

  let text = locale[key] || key;

  // Replace any parameters in the text
  if (params && Object.keys(params).length > 0) {
    Object.keys(params).forEach(param => {
      text = text.replace(new RegExp(`{${param}}`, 'g'), params[param]);
    });
  }

  return text;
}

/**
 * Alias for translate function for backward compatibility
 */
export function gettext(key, lang, params) {
  return translate(key, lang, params);
}

/**
 * Normalize language code to find the most appropriate match
 * @param {string} langCode - The language code to normalize
 * @returns {string} The normalized language code
 */
function normalizeLangCode(langCode) {
  if (!langCode) return 'en';

  // First check exact match
  if (locales[langCode]) return langCode;

  // Check language part only (e.g., 'en' from 'en-US')
  const mainLang = langCode.split('-')[0];
  if (locales[mainLang]) return mainLang;

  // Check for any variant of the language
  const allKeys = Object.keys(locales);
  for (let i = 0; i < allKeys.length; i++) {
    if (allKeys[i].startsWith(mainLang + '-')) {
      return allKeys[i];
    }
  }

  return 'en';
}

/**
 * Get all available languages
 * @returns {Object} An object with language codes as keys
 */
export function getAvailableLanguages() {
  return Object.keys(locales);
}

export default {
  translate,
  gettext,
  getAvailableLanguages,
  addLocales
};
