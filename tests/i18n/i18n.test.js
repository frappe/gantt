import { translate, gettext, getAvailableLanguages } from '../../src/i18n';

describe('i18n core functionality', () => {
  test('translate returns original key for unknown language', () => {
    const result = translate('unknown_key', 'xx-XX');
    expect(result).toBe('unknown_key');
  });

  test('translate returns original key for unknown translation', () => {
    const result = translate('unknown_key', 'en');
    expect(result).toBe('unknown_key');
  });

  test('translate returns correct translation for English', () => {
    const result = translate('Today', 'en');
    expect(result).toBe('Today');
  });

  test('gettext is an alias for translate', () => {
    const translateResult = translate('Today', 'en');
    const gettextResult = gettext('Today', 'en');
    expect(translateResult).toBe(gettextResult);
  });

  test('translate replaces parameters in translation', () => {
    const result = translate('task_no_start_date', 'en', { id: '123' });
    expect(result).toContain('123');
  });

  test('translate handles various language codes', () => {
    // Test full language code
    const resultEnUS = translate('Today', 'en-US');
    expect(resultEnUS).toBe('Today');

    // Test main language code
    const resultEn = translate('Today', 'en');
    expect(resultEn).toBe('Today');

    // Test for language variants
    const resultIt = translate('Today', 'it');
    expect(resultIt).toBe('Oggi');

    const resultFr = translate('Today', 'fr');
    expect(resultFr).toBe("Aujourd'hui");
  });

  test('translate falls back to main language code', () => {
    // Use a region-specific variant not directly defined
    const result = translate('Today', 'en-CUSTOM');

    // Should fall back to main
    expect(result).toBe('Today');
  });

  test('translate handles missing language gracefully', () => {
    const result = translate('Some Text', null);
    expect(result).toBe('Some Text');
  });

  test('translate handles null parameters gracefully', () => {
    const result = translate('Today', 'en', null);
    expect(result).toBe('Today');
  });

  test('getAvailableLanguages returns all available languages', () => {
    const languages = getAvailableLanguages();

    // Should contain all our statically loaded languages
    expect(languages).toContain('en');
    expect(languages).toContain('en-US');
    expect(languages).toContain('it');
    expect(languages).toContain('it-IT');
    expect(languages).toContain('fr');
    expect(languages).toContain('fr-FR');
    expect(languages).toContain('es');
    expect(languages).toContain('es-ES');
    expect(languages).toContain('de');
    expect(languages).toContain('de-DE');
  });
});
