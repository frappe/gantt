import date_utils from '../src/date_utils.js';

describe('date_utils', () => {
    describe('parse_duration', () => {
        test('should parse year duration', () => {
            expect(date_utils.parse_duration('1y')).toEqual({
                duration: 1,
                scale: 'year'
            });
            expect(date_utils.parse_duration('10y')).toEqual({
                duration: 10,
                scale: 'year'
            });
        });

        test('should parse month duration', () => {
            expect(date_utils.parse_duration('1m')).toEqual({
                duration: 1,
                scale: 'month'
            });
            expect(date_utils.parse_duration('12m')).toEqual({
                duration: 12,
                scale: 'month'
            });
        });

        test('should parse day duration', () => {
            expect(date_utils.parse_duration('1d')).toEqual({
                duration: 1,
                scale: 'day'
            });
            expect(date_utils.parse_duration('30d')).toEqual({
                duration: 30,
                scale: 'day'
            });
        });

        test('should parse hour duration', () => {
            expect(date_utils.parse_duration('1h')).toEqual({
                duration: 1,
                scale: 'hour'
            });
            expect(date_utils.parse_duration('24h')).toEqual({
                duration: 24,
                scale: 'hour'
            });
        });

        test('should handle invalid duration strings', () => {
            expect(date_utils.parse_duration('invalid')).toBeUndefined();
            expect(date_utils.parse_duration('')).toBeUndefined();
            expect(date_utils.parse_duration('1x')).toBeUndefined();
        });
    });

    describe('parse', () => {
        test('should parse date string with default separator', () => {
            const date = date_utils.parse('2024-02-08');
            expect(date).toBeInstanceOf(Date);
            expect(date.getFullYear()).toBe(2024);
            expect(date.getMonth()).toBe(1); // 0-based month
            expect(date.getDate()).toBe(8);
        });

        test('should parse date string with custom separator', () => {
            const date = date_utils.parse('2024/02/08', '/');
            expect(date).toBeInstanceOf(Date);
            expect(date.getFullYear()).toBe(2024);
            expect(date.getMonth()).toBe(1);
            expect(date.getDate()).toBe(8);
        });

        test('should handle Date object input', () => {
            const input = new Date(2024, 1, 8);
            const result = date_utils.parse(input);
            expect(result).toBe(input);
        });
    });

    describe('diff', () => {
        test('should calculate difference in days', () => {
            const date1 = new Date(2024, 1, 1);
            const date2 = new Date(2024, 1, 8);
            expect(date_utils.diff(date2, date1, 'day')).toBeCloseTo(7, 0);
        });

        test('should calculate difference in months', () => {
            const date1 = new Date(2024, 1, 1);
            const date2 = new Date(2024, 4, 1);
            expect(date_utils.diff(date2, date1, 'month')).toBeCloseTo(3, 0);
        });

        test('should calculate difference in years', () => {
            const date1 = new Date(2022, 1, 1);
            const date2 = new Date(2024, 1, 1);
            expect(date_utils.diff(date2, date1, 'year')).toBeCloseTo(2, 0);
        });

        test('should handle negative differences', () => {
            const date1 = new Date(2024, 1, 8);
            const date2 = new Date(2024, 1, 1);
            expect(date_utils.diff(date2, date1, 'day')).toBeCloseTo(-7, 0);
        });

        test('should handle partial months', () => {
            const date1 = new Date(2024, 1, 1);
            const date2 = new Date(2024, 2, 15); // ~1.43 months difference
            expect(date_utils.diff(date2, date1, 'month')).toBeCloseTo(1.43, 2);
        });

        test('should handle partial years', () => {
            const date1 = new Date(2022, 1, 1);
            const date2 = new Date(2024, 7, 1); // ~2.5 years difference
            expect(date_utils.diff(date2, date1, 'year')).toBeCloseTo(2.5, 1);
        });
    });

    describe('add', () => {
        test('should add days to date', () => {
            const date = new Date(2024, 1, 1);
            const result = date_utils.add(date, 7, 'day');
            expect(result.getDate()).toBe(8);
        });

        test('should add months to date', () => {
            const date = new Date(2024, 1, 1);
            const result = date_utils.add(date, 3, 'month');
            expect(result.getMonth()).toBe(4);
        });

        test('should add years to date', () => {
            const date = new Date(2024, 1, 1);
            const result = date_utils.add(date, 2, 'year');
            expect(result.getFullYear()).toBe(2026);
        });

        test('should handle month rollover', () => {
            const date = new Date(2024, 11, 31); // December 31, 2024
            const result = date_utils.add(date, 1, 'day');
            expect(result.getFullYear()).toBe(2025);
            expect(result.getMonth()).toBe(0);
            expect(result.getDate()).toBe(1);
        });
    });

    describe('get_days_in_month', () => {
        test('should return correct days for regular months', () => {
            expect(date_utils.get_days_in_month(new Date(2024, 0, 1))).toBe(31); // January
            expect(date_utils.get_days_in_month(new Date(2024, 3, 1))).toBe(30); // April
            expect(date_utils.get_days_in_month(new Date(2024, 6, 1))).toBe(31); // July
        });

        test('should handle February in leap year', () => {
            expect(date_utils.get_days_in_month(new Date(2024, 1, 1))).toBe(29); // February 2024 (leap year)
        });

        test('should handle February in non-leap year', () => {
            expect(date_utils.get_days_in_month(new Date(2023, 1, 1))).toBe(28); // February 2023 (non-leap year)
        });
    });

    describe('get_days_in_year', () => {
        test('should return 366 for leap years', () => {
            expect(date_utils.get_days_in_year(new Date(2024, 0, 1))).toBe(366);
            expect(date_utils.get_days_in_year(new Date(2020, 0, 1))).toBe(366);
        });

        test('should return 365 for non-leap years', () => {
            expect(date_utils.get_days_in_year(new Date(2023, 0, 1))).toBe(365);
            expect(date_utils.get_days_in_year(new Date(2025, 0, 1))).toBe(365);
        });
    });
}); 