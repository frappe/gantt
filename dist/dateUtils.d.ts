export declare type Language = 'ptBr' | 'ru' | 'en' | 'fr' | 'es' | 'tr' | 'zh';
declare const _default: {
    parse(date: String | Date, date_separator?: string, time_separator?: RegExp): Date | null;
    to_string(date: Date, with_time?: boolean): string;
    format(date: Date, format_string?: string, lang?: Language): string;
    diff(dateA: number | Date, dateB: number | Date, scale?: string): number;
    today(): Date;
    now(): Date;
    add(date: Date, qty: string | number, scale: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond'): Date;
    start_of(date: Date, scale: string): Date;
    clone(date: Date): Date;
    get_date_values(date: Date): number[];
    get_days_in_month(date: Date): number;
};
export default _default;
