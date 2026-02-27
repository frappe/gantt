import language from './language/today_languages.json';
test('it', () => {
    const lang = language;
    expect(lang['it']).toBe('oggi');
});