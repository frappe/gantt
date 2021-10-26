const YEAR = 'year';
const MONTH = 'month';
const DAY = 'day';
const HOUR = 'hour';
const MINUTE = 'minute';
const SECOND = 'second';
const MILLISECOND = 'millisecond';
const monthNames = {
    en: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ],
    es: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
    ],
    ru: [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь',
    ],
    ptBr: [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro',
    ],
    fr: [
        'Janvier',
        'Février',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Août',
        'Septembre',
        'Octobre',
        'Novembre',
        'Décembre',
    ],
    tr: [
        'Ocak',
        'Şubat',
        'Mart',
        'Nisan',
        'Mayıs',
        'Haziran',
        'Temmuz',
        'Ağustos',
        'Eylül',
        'Ekim',
        'Kasım',
        'Aralık',
    ],
    zh: [
        '一月',
        '二月',
        '三月',
        '四月',
        '五月',
        '六月',
        '七月',
        '八月',
        '九月',
        '十月',
        '十一月',
        '十二月',
    ],
};
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
function padStart(maybeStr, targetLength, padString) {
    const str = `${maybeStr}`;
    let truncatedLength = Math.trunc(targetLength);
    let paddedString = String(typeof padString !== 'undefined' ? padString : ' ');
    if (str.length > truncatedLength) {
        return String(str);
    }
    truncatedLength -= str.length;
    if (targetLength > paddedString.length) {
        paddedString += paddedString.repeat(truncatedLength / paddedString.length);
    }
    return paddedString.slice(0, truncatedLength) + String(str);
}
export default {
    parse(date, date_separator = '-', time_separator = /[.:]/) {
        if (date instanceof Date) {
            return date;
        }
        if (typeof date === 'string') {
            const parts = date.split(' ');
            const dateParts = parts[0]
                .split(date_separator)
                .map((val) => parseInt(val, 10));
            const timeParts = parts[1] && parts[1].split(time_separator);
            // month is 0 indexed
            dateParts[1] -= 1;
            let values = dateParts;
            if (timeParts && timeParts.length) {
                if (timeParts.length === 4) {
                    timeParts[3] = `0.${timeParts[3]}`;
                    timeParts[3] = parseFloat(timeParts[3]) * 1000;
                }
                values = values.concat(timeParts.map((v) => Number(v)));
            }
            // @ts-ignore
            return new Date(...values);
        }
        return null;
    },
    toString(date, with_time = false) {
        if (!(date instanceof Date)) {
            throw new TypeError('Invalid argument type');
        }
        const vals = this.getDateValues(date).map((val, i) => {
            if (i === 1) {
                // add 1 for month
                // eslint-disable-next-line no-param-reassign
                val += 1;
            }
            if (i === 6) {
                return padStart(`${val}`, 3, '0');
            }
            return padStart(`${val}`, 2, '0');
        });
        const dateString = `${vals[0]}-${vals[1]}-${vals[2]}`;
        const timeString = `${vals[3]}:${vals[4]}:${vals[5]}.${vals[6]}`;
        return dateString + (with_time ? ` ${timeString}` : '');
    },
    format(date, format_string = 'YYYY-MM-DD HH:mm:ss.SSS', lang = 'en') {
        if (!Object.keys(monthNames).includes(lang)) {
            throw new Error('Invalid Language');
        }
        const values = this.getDateValues(date).map((d) => padStart(d, 2, 0));
        const formatMap = {
            YYYY: values[0],
            MM: padStart(+values[1] + 1, 2, 0),
            DD: values[2],
            HH: values[3],
            mm: values[4],
            ss: values[5],
            SSS: values[6],
            D: values[2],
            MMMM: monthNames[lang][+values[1]],
            MMM: monthNames[lang][+values[1]],
        };
        let str = format_string;
        const formattedValues = [];
        Object.keys(formatMap)
            .sort((a, b) => b.length - a.length) // big string first
            .forEach((key) => {
            if (str.includes(key)) {
                str = str.replace(key, `$${formattedValues.length}`);
                formattedValues.push(formatMap[key]);
            }
        });
        formattedValues.forEach((value, i) => {
            str = str.replace(`$${i}`, value);
        });
        return str;
    },
    diff(dateA, dateB, scale = DAY) {
        const milliseconds = Number(dateA) - Number(dateB);
        const seconds = milliseconds / 1000;
        const minutes = seconds / 60;
        const hours = minutes / 60;
        const days = hours / 24;
        const months = days / 30;
        const years = months / 12;
        if (!scale.endsWith('s')) {
            // eslint-disable-next-line no-param-reassign
            scale += 's';
        }
        return Math.floor({
            milliseconds,
            seconds,
            minutes,
            hours,
            days,
            months,
            years,
        }[scale]);
    },
    today() {
        const vals = this.getDateValues(new Date()).slice(0, 3);
        // @ts-ignore
        return new Date(...vals);
    },
    now() {
        return new Date();
    },
    add(date, qty, scale) {
        const numQty = typeof qty === 'string' ? parseInt(qty, 10) : qty;
        const vals = [
            date.getFullYear() + (scale === YEAR ? numQty : 0),
            date.getMonth() + (scale === MONTH ? numQty : 0),
            date.getDate() + (scale === DAY ? numQty : 0),
            date.getHours() + (scale === HOUR ? numQty : 0),
            date.getMinutes() + (scale === MINUTE ? numQty : 0),
            date.getSeconds() + (scale === SECOND ? numQty : 0),
            date.getMilliseconds() + (scale === MILLISECOND ? numQty : 0),
        ];
        // @ts-ignore
        return new Date(...vals);
    },
    startOf(date, scale) {
        const scores = {
            [YEAR]: 6,
            [MONTH]: 5,
            [DAY]: 4,
            [HOUR]: 3,
            [MINUTE]: 2,
            [SECOND]: 1,
            [MILLISECOND]: 0,
        };
        function shouldReset(newScale) {
            const maxScore = scores[scale];
            return scores[newScale] <= maxScore;
        }
        const vals = [
            date.getFullYear(),
            shouldReset(YEAR) ? 0 : date.getMonth(),
            shouldReset(MONTH) ? 1 : date.getDate(),
            shouldReset(DAY) ? 0 : date.getHours(),
            shouldReset(HOUR) ? 0 : date.getMinutes(),
            shouldReset(MINUTE) ? 0 : date.getSeconds(),
            shouldReset(SECOND) ? 0 : date.getMilliseconds(),
        ];
        // @ts-ignore
        return new Date(...vals);
    },
    clone(date) {
        // @ts-ignore
        return new Date(...this.getDateValues(date));
    },
    getDateValues(date) {
        return [
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
            date.getMilliseconds(),
        ];
    },
    getDaysInMonth(date) {
        const numDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const month = date.getMonth();
        if (month !== 1) {
            return numDays[month];
        }
        // Feb
        const year = date.getFullYear();
        if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
            return 29;
        }
        return 28;
    },
};
//# sourceMappingURL=dateUtils.js.map