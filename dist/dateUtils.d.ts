export declare type Language = 'ptBr' | 'ru' | 'en' | 'fr' | 'es' | 'tr' | 'zh';
declare const _default: {
    parse(date: String | Date, date_separator?: string, time_separator?: RegExp): Date | null;
    toString(date: Date, with_time?: boolean): string;
    format(date: Date, format_string?: string, lang?: Language): string;
    diff(dateA: number | Date, dateB: number | Date, scale?: string): number;
    today(): Date;
    now(): Date;
    add(date: Date, qty: string | number, scale: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond'): Date;
    startOf(date: Date, scale: string): Date;
    clone(date: Date): Date;
    getDateValues(date: Date): number[];
    getDaysInMonth(date: Date): number;
};
export default _default;
