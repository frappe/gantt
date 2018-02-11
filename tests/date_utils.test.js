import date_utils from '../src/date_utils';

test('Parse: parses string date', () => {
    const date = date_utils.parse('2017-09-09');

    expect(date.getDate()).toBe(9);
    expect(date.getMonth()).toBe(8);
    expect(date.getFullYear()).toBe(2017);
});

test('Parse: parses string datetime', () => {
    const date = date_utils.parse('2017-08-27 16:08:34');

    expect(date.getFullYear()).toBe(2017);
    expect(date.getMonth()).toBe(7);
    expect(date.getDate()).toBe(27);
    expect(date.getHours()).toBe(16);
    expect(date.getMinutes()).toBe(8);
    expect(date.getSeconds()).toBe(34);
});

test('Format: converts date object to string', () => {
    const date = new Date('2017-09-18');
    expect(date_utils.to_string(date)).toBe('2017-09-18');
});

test('Parse: returns Date Object as is', () => {
    const d = new Date();
    const date = date_utils.parse(d);

    expect(d).toBe(date);
});

test('Diff: returns diff between 2 date objects', () => {
    const a = date_utils.parse('2017-09-08');
    const b = date_utils.parse('2017-06-07');

    expect(date_utils.diff(a, b, 'day')).toBe(93);
    expect(date_utils.diff(a, b, 'month')).toBe(3);
    expect(date_utils.diff(a, b, 'year')).toBe(0);
});

test('StartOf', () => {
    const date = date_utils.parse('2017-08-12 15:07:34');

    const start_of_minute = date_utils.start_of(date, 'minute');
    expect(date_utils.to_string(start_of_minute, true)).toBe(
        '2017-08-12 15:07:00'
    );

    const start_of_hour = date_utils.start_of(date, 'hour');
    expect(date_utils.to_string(start_of_hour, true)).toBe(
        '2017-08-12 15:00:00'
    );

    const start_of_day = date_utils.start_of(date, 'day');
    expect(date_utils.to_string(start_of_day, true)).toBe(
        '2017-08-12 00:00:00'
    );

    const start_of_month = date_utils.start_of(date, 'month');
    expect(date_utils.to_string(start_of_month, true)).toBe(
        '2017-08-01 00:00:00'
    );

    const start_of_year = date_utils.start_of(date, 'year');
    expect(date_utils.to_string(start_of_year, true)).toBe(
        '2017-01-01 00:00:00'
    );
});

test('format', () => {
    const date = date_utils.parse('2017-08-12 15:07:23');
    expect(date_utils.format(date, 'YYYY-MM-DD')).toBe('2017-08-12');
});
