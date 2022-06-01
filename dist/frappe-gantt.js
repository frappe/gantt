var Gantt = (function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function commonjsRequire(path) {
		throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
	}

	var moment$1 = {exports: {}};

	(function (module, exports) {
	(function (global, factory) {
		    module.exports = factory() ;
		}(commonjsGlobal, (function () {
		    var hookCallback;

		    function hooks() {
		        return hookCallback.apply(null, arguments);
		    }

		    // This is done to register the method called with moment()
		    // without creating circular dependencies.
		    function setHookCallback(callback) {
		        hookCallback = callback;
		    }

		    function isArray(input) {
		        return (
		            input instanceof Array ||
		            Object.prototype.toString.call(input) === '[object Array]'
		        );
		    }

		    function isObject(input) {
		        // IE8 will treat undefined and null as object if it wasn't for
		        // input != null
		        return (
		            input != null &&
		            Object.prototype.toString.call(input) === '[object Object]'
		        );
		    }

		    function hasOwnProp(a, b) {
		        return Object.prototype.hasOwnProperty.call(a, b);
		    }

		    function isObjectEmpty(obj) {
		        if (Object.getOwnPropertyNames) {
		            return Object.getOwnPropertyNames(obj).length === 0;
		        } else {
		            var k;
		            for (k in obj) {
		                if (hasOwnProp(obj, k)) {
		                    return false;
		                }
		            }
		            return true;
		        }
		    }

		    function isUndefined(input) {
		        return input === void 0;
		    }

		    function isNumber(input) {
		        return (
		            typeof input === 'number' ||
		            Object.prototype.toString.call(input) === '[object Number]'
		        );
		    }

		    function isDate(input) {
		        return (
		            input instanceof Date ||
		            Object.prototype.toString.call(input) === '[object Date]'
		        );
		    }

		    function map(arr, fn) {
		        var res = [],
		            i,
		            arrLen = arr.length;
		        for (i = 0; i < arrLen; ++i) {
		            res.push(fn(arr[i], i));
		        }
		        return res;
		    }

		    function extend(a, b) {
		        for (var i in b) {
		            if (hasOwnProp(b, i)) {
		                a[i] = b[i];
		            }
		        }

		        if (hasOwnProp(b, 'toString')) {
		            a.toString = b.toString;
		        }

		        if (hasOwnProp(b, 'valueOf')) {
		            a.valueOf = b.valueOf;
		        }

		        return a;
		    }

		    function createUTC(input, format, locale, strict) {
		        return createLocalOrUTC(input, format, locale, strict, true).utc();
		    }

		    function defaultParsingFlags() {
		        // We need to deep clone this object.
		        return {
		            empty: false,
		            unusedTokens: [],
		            unusedInput: [],
		            overflow: -2,
		            charsLeftOver: 0,
		            nullInput: false,
		            invalidEra: null,
		            invalidMonth: null,
		            invalidFormat: false,
		            userInvalidated: false,
		            iso: false,
		            parsedDateParts: [],
		            era: null,
		            meridiem: null,
		            rfc2822: false,
		            weekdayMismatch: false,
		        };
		    }

		    function getParsingFlags(m) {
		        if (m._pf == null) {
		            m._pf = defaultParsingFlags();
		        }
		        return m._pf;
		    }

		    var some;
		    if (Array.prototype.some) {
		        some = Array.prototype.some;
		    } else {
		        some = function (fun) {
		            var t = Object(this),
		                len = t.length >>> 0,
		                i;

		            for (i = 0; i < len; i++) {
		                if (i in t && fun.call(this, t[i], i, t)) {
		                    return true;
		                }
		            }

		            return false;
		        };
		    }

		    function isValid(m) {
		        if (m._isValid == null) {
		            var flags = getParsingFlags(m),
		                parsedParts = some.call(flags.parsedDateParts, function (i) {
		                    return i != null;
		                }),
		                isNowValid =
		                    !isNaN(m._d.getTime()) &&
		                    flags.overflow < 0 &&
		                    !flags.empty &&
		                    !flags.invalidEra &&
		                    !flags.invalidMonth &&
		                    !flags.invalidWeekday &&
		                    !flags.weekdayMismatch &&
		                    !flags.nullInput &&
		                    !flags.invalidFormat &&
		                    !flags.userInvalidated &&
		                    (!flags.meridiem || (flags.meridiem && parsedParts));

		            if (m._strict) {
		                isNowValid =
		                    isNowValid &&
		                    flags.charsLeftOver === 0 &&
		                    flags.unusedTokens.length === 0 &&
		                    flags.bigHour === undefined;
		            }

		            if (Object.isFrozen == null || !Object.isFrozen(m)) {
		                m._isValid = isNowValid;
		            } else {
		                return isNowValid;
		            }
		        }
		        return m._isValid;
		    }

		    function createInvalid(flags) {
		        var m = createUTC(NaN);
		        if (flags != null) {
		            extend(getParsingFlags(m), flags);
		        } else {
		            getParsingFlags(m).userInvalidated = true;
		        }

		        return m;
		    }

		    // Plugins that add properties should also add the key here (null value),
		    // so we can properly clone ourselves.
		    var momentProperties = (hooks.momentProperties = []),
		        updateInProgress = false;

		    function copyConfig(to, from) {
		        var i,
		            prop,
		            val,
		            momentPropertiesLen = momentProperties.length;

		        if (!isUndefined(from._isAMomentObject)) {
		            to._isAMomentObject = from._isAMomentObject;
		        }
		        if (!isUndefined(from._i)) {
		            to._i = from._i;
		        }
		        if (!isUndefined(from._f)) {
		            to._f = from._f;
		        }
		        if (!isUndefined(from._l)) {
		            to._l = from._l;
		        }
		        if (!isUndefined(from._strict)) {
		            to._strict = from._strict;
		        }
		        if (!isUndefined(from._tzm)) {
		            to._tzm = from._tzm;
		        }
		        if (!isUndefined(from._isUTC)) {
		            to._isUTC = from._isUTC;
		        }
		        if (!isUndefined(from._offset)) {
		            to._offset = from._offset;
		        }
		        if (!isUndefined(from._pf)) {
		            to._pf = getParsingFlags(from);
		        }
		        if (!isUndefined(from._locale)) {
		            to._locale = from._locale;
		        }

		        if (momentPropertiesLen > 0) {
		            for (i = 0; i < momentPropertiesLen; i++) {
		                prop = momentProperties[i];
		                val = from[prop];
		                if (!isUndefined(val)) {
		                    to[prop] = val;
		                }
		            }
		        }

		        return to;
		    }

		    // Moment prototype object
		    function Moment(config) {
		        copyConfig(this, config);
		        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
		        if (!this.isValid()) {
		            this._d = new Date(NaN);
		        }
		        // Prevent infinite loop in case updateOffset creates new moment
		        // objects.
		        if (updateInProgress === false) {
		            updateInProgress = true;
		            hooks.updateOffset(this);
		            updateInProgress = false;
		        }
		    }

		    function isMoment(obj) {
		        return (
		            obj instanceof Moment || (obj != null && obj._isAMomentObject != null)
		        );
		    }

		    function warn(msg) {
		        if (
		            hooks.suppressDeprecationWarnings === false &&
		            typeof console !== 'undefined' &&
		            console.warn
		        ) {
		            console.warn('Deprecation warning: ' + msg);
		        }
		    }

		    function deprecate(msg, fn) {
		        var firstTime = true;

		        return extend(function () {
		            if (hooks.deprecationHandler != null) {
		                hooks.deprecationHandler(null, msg);
		            }
		            if (firstTime) {
		                var args = [],
		                    arg,
		                    i,
		                    key,
		                    argLen = arguments.length;
		                for (i = 0; i < argLen; i++) {
		                    arg = '';
		                    if (typeof arguments[i] === 'object') {
		                        arg += '\n[' + i + '] ';
		                        for (key in arguments[0]) {
		                            if (hasOwnProp(arguments[0], key)) {
		                                arg += key + ': ' + arguments[0][key] + ', ';
		                            }
		                        }
		                        arg = arg.slice(0, -2); // Remove trailing comma and space
		                    } else {
		                        arg = arguments[i];
		                    }
		                    args.push(arg);
		                }
		                warn(
		                    msg +
		                        '\nArguments: ' +
		                        Array.prototype.slice.call(args).join('') +
		                        '\n' +
		                        new Error().stack
		                );
		                firstTime = false;
		            }
		            return fn.apply(this, arguments);
		        }, fn);
		    }

		    var deprecations = {};

		    function deprecateSimple(name, msg) {
		        if (hooks.deprecationHandler != null) {
		            hooks.deprecationHandler(name, msg);
		        }
		        if (!deprecations[name]) {
		            warn(msg);
		            deprecations[name] = true;
		        }
		    }

		    hooks.suppressDeprecationWarnings = false;
		    hooks.deprecationHandler = null;

		    function isFunction(input) {
		        return (
		            (typeof Function !== 'undefined' && input instanceof Function) ||
		            Object.prototype.toString.call(input) === '[object Function]'
		        );
		    }

		    function set(config) {
		        var prop, i;
		        for (i in config) {
		            if (hasOwnProp(config, i)) {
		                prop = config[i];
		                if (isFunction(prop)) {
		                    this[i] = prop;
		                } else {
		                    this['_' + i] = prop;
		                }
		            }
		        }
		        this._config = config;
		        // Lenient ordinal parsing accepts just a number in addition to
		        // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
		        // TODO: Remove "ordinalParse" fallback in next major release.
		        this._dayOfMonthOrdinalParseLenient = new RegExp(
		            (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
		                '|' +
		                /\d{1,2}/.source
		        );
		    }

		    function mergeConfigs(parentConfig, childConfig) {
		        var res = extend({}, parentConfig),
		            prop;
		        for (prop in childConfig) {
		            if (hasOwnProp(childConfig, prop)) {
		                if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
		                    res[prop] = {};
		                    extend(res[prop], parentConfig[prop]);
		                    extend(res[prop], childConfig[prop]);
		                } else if (childConfig[prop] != null) {
		                    res[prop] = childConfig[prop];
		                } else {
		                    delete res[prop];
		                }
		            }
		        }
		        for (prop in parentConfig) {
		            if (
		                hasOwnProp(parentConfig, prop) &&
		                !hasOwnProp(childConfig, prop) &&
		                isObject(parentConfig[prop])
		            ) {
		                // make sure changes to properties don't modify parent config
		                res[prop] = extend({}, res[prop]);
		            }
		        }
		        return res;
		    }

		    function Locale(config) {
		        if (config != null) {
		            this.set(config);
		        }
		    }

		    var keys;

		    if (Object.keys) {
		        keys = Object.keys;
		    } else {
		        keys = function (obj) {
		            var i,
		                res = [];
		            for (i in obj) {
		                if (hasOwnProp(obj, i)) {
		                    res.push(i);
		                }
		            }
		            return res;
		        };
		    }

		    var defaultCalendar = {
		        sameDay: '[Today at] LT',
		        nextDay: '[Tomorrow at] LT',
		        nextWeek: 'dddd [at] LT',
		        lastDay: '[Yesterday at] LT',
		        lastWeek: '[Last] dddd [at] LT',
		        sameElse: 'L',
		    };

		    function calendar(key, mom, now) {
		        var output = this._calendar[key] || this._calendar['sameElse'];
		        return isFunction(output) ? output.call(mom, now) : output;
		    }

		    function zeroFill(number, targetLength, forceSign) {
		        var absNumber = '' + Math.abs(number),
		            zerosToFill = targetLength - absNumber.length,
		            sign = number >= 0;
		        return (
		            (sign ? (forceSign ? '+' : '') : '-') +
		            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) +
		            absNumber
		        );
		    }

		    var formattingTokens =
		            /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
		        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
		        formatFunctions = {},
		        formatTokenFunctions = {};

		    // token:    'M'
		    // padded:   ['MM', 2]
		    // ordinal:  'Mo'
		    // callback: function () { this.month() + 1 }
		    function addFormatToken(token, padded, ordinal, callback) {
		        var func = callback;
		        if (typeof callback === 'string') {
		            func = function () {
		                return this[callback]();
		            };
		        }
		        if (token) {
		            formatTokenFunctions[token] = func;
		        }
		        if (padded) {
		            formatTokenFunctions[padded[0]] = function () {
		                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
		            };
		        }
		        if (ordinal) {
		            formatTokenFunctions[ordinal] = function () {
		                return this.localeData().ordinal(
		                    func.apply(this, arguments),
		                    token
		                );
		            };
		        }
		    }

		    function removeFormattingTokens(input) {
		        if (input.match(/\[[\s\S]/)) {
		            return input.replace(/^\[|\]$/g, '');
		        }
		        return input.replace(/\\/g, '');
		    }

		    function makeFormatFunction(format) {
		        var array = format.match(formattingTokens),
		            i,
		            length;

		        for (i = 0, length = array.length; i < length; i++) {
		            if (formatTokenFunctions[array[i]]) {
		                array[i] = formatTokenFunctions[array[i]];
		            } else {
		                array[i] = removeFormattingTokens(array[i]);
		            }
		        }

		        return function (mom) {
		            var output = '',
		                i;
		            for (i = 0; i < length; i++) {
		                output += isFunction(array[i])
		                    ? array[i].call(mom, format)
		                    : array[i];
		            }
		            return output;
		        };
		    }

		    // format date using native date object
		    function formatMoment(m, format) {
		        if (!m.isValid()) {
		            return m.localeData().invalidDate();
		        }

		        format = expandFormat(format, m.localeData());
		        formatFunctions[format] =
		            formatFunctions[format] || makeFormatFunction(format);

		        return formatFunctions[format](m);
		    }

		    function expandFormat(format, locale) {
		        var i = 5;

		        function replaceLongDateFormatTokens(input) {
		            return locale.longDateFormat(input) || input;
		        }

		        localFormattingTokens.lastIndex = 0;
		        while (i >= 0 && localFormattingTokens.test(format)) {
		            format = format.replace(
		                localFormattingTokens,
		                replaceLongDateFormatTokens
		            );
		            localFormattingTokens.lastIndex = 0;
		            i -= 1;
		        }

		        return format;
		    }

		    var defaultLongDateFormat = {
		        LTS: 'h:mm:ss A',
		        LT: 'h:mm A',
		        L: 'MM/DD/YYYY',
		        LL: 'MMMM D, YYYY',
		        LLL: 'MMMM D, YYYY h:mm A',
		        LLLL: 'dddd, MMMM D, YYYY h:mm A',
		    };

		    function longDateFormat(key) {
		        var format = this._longDateFormat[key],
		            formatUpper = this._longDateFormat[key.toUpperCase()];

		        if (format || !formatUpper) {
		            return format;
		        }

		        this._longDateFormat[key] = formatUpper
		            .match(formattingTokens)
		            .map(function (tok) {
		                if (
		                    tok === 'MMMM' ||
		                    tok === 'MM' ||
		                    tok === 'DD' ||
		                    tok === 'dddd'
		                ) {
		                    return tok.slice(1);
		                }
		                return tok;
		            })
		            .join('');

		        return this._longDateFormat[key];
		    }

		    var defaultInvalidDate = 'Invalid date';

		    function invalidDate() {
		        return this._invalidDate;
		    }

		    var defaultOrdinal = '%d',
		        defaultDayOfMonthOrdinalParse = /\d{1,2}/;

		    function ordinal(number) {
		        return this._ordinal.replace('%d', number);
		    }

		    var defaultRelativeTime = {
		        future: 'in %s',
		        past: '%s ago',
		        s: 'a few seconds',
		        ss: '%d seconds',
		        m: 'a minute',
		        mm: '%d minutes',
		        h: 'an hour',
		        hh: '%d hours',
		        d: 'a day',
		        dd: '%d days',
		        w: 'a week',
		        ww: '%d weeks',
		        M: 'a month',
		        MM: '%d months',
		        y: 'a year',
		        yy: '%d years',
		    };

		    function relativeTime(number, withoutSuffix, string, isFuture) {
		        var output = this._relativeTime[string];
		        return isFunction(output)
		            ? output(number, withoutSuffix, string, isFuture)
		            : output.replace(/%d/i, number);
		    }

		    function pastFuture(diff, output) {
		        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
		        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
		    }

		    var aliases = {};

		    function addUnitAlias(unit, shorthand) {
		        var lowerCase = unit.toLowerCase();
		        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
		    }

		    function normalizeUnits(units) {
		        return typeof units === 'string'
		            ? aliases[units] || aliases[units.toLowerCase()]
		            : undefined;
		    }

		    function normalizeObjectUnits(inputObject) {
		        var normalizedInput = {},
		            normalizedProp,
		            prop;

		        for (prop in inputObject) {
		            if (hasOwnProp(inputObject, prop)) {
		                normalizedProp = normalizeUnits(prop);
		                if (normalizedProp) {
		                    normalizedInput[normalizedProp] = inputObject[prop];
		                }
		            }
		        }

		        return normalizedInput;
		    }

		    var priorities = {};

		    function addUnitPriority(unit, priority) {
		        priorities[unit] = priority;
		    }

		    function getPrioritizedUnits(unitsObj) {
		        var units = [],
		            u;
		        for (u in unitsObj) {
		            if (hasOwnProp(unitsObj, u)) {
		                units.push({ unit: u, priority: priorities[u] });
		            }
		        }
		        units.sort(function (a, b) {
		            return a.priority - b.priority;
		        });
		        return units;
		    }

		    function isLeapYear(year) {
		        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
		    }

		    function absFloor(number) {
		        if (number < 0) {
		            // -0 -> 0
		            return Math.ceil(number) || 0;
		        } else {
		            return Math.floor(number);
		        }
		    }

		    function toInt(argumentForCoercion) {
		        var coercedNumber = +argumentForCoercion,
		            value = 0;

		        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
		            value = absFloor(coercedNumber);
		        }

		        return value;
		    }

		    function makeGetSet(unit, keepTime) {
		        return function (value) {
		            if (value != null) {
		                set$1(this, unit, value);
		                hooks.updateOffset(this, keepTime);
		                return this;
		            } else {
		                return get(this, unit);
		            }
		        };
		    }

		    function get(mom, unit) {
		        return mom.isValid()
		            ? mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]()
		            : NaN;
		    }

		    function set$1(mom, unit, value) {
		        if (mom.isValid() && !isNaN(value)) {
		            if (
		                unit === 'FullYear' &&
		                isLeapYear(mom.year()) &&
		                mom.month() === 1 &&
		                mom.date() === 29
		            ) {
		                value = toInt(value);
		                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](
		                    value,
		                    mom.month(),
		                    daysInMonth(value, mom.month())
		                );
		            } else {
		                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
		            }
		        }
		    }

		    // MOMENTS

		    function stringGet(units) {
		        units = normalizeUnits(units);
		        if (isFunction(this[units])) {
		            return this[units]();
		        }
		        return this;
		    }

		    function stringSet(units, value) {
		        if (typeof units === 'object') {
		            units = normalizeObjectUnits(units);
		            var prioritized = getPrioritizedUnits(units),
		                i,
		                prioritizedLen = prioritized.length;
		            for (i = 0; i < prioritizedLen; i++) {
		                this[prioritized[i].unit](units[prioritized[i].unit]);
		            }
		        } else {
		            units = normalizeUnits(units);
		            if (isFunction(this[units])) {
		                return this[units](value);
		            }
		        }
		        return this;
		    }

		    var match1 = /\d/, //       0 - 9
		        match2 = /\d\d/, //      00 - 99
		        match3 = /\d{3}/, //     000 - 999
		        match4 = /\d{4}/, //    0000 - 9999
		        match6 = /[+-]?\d{6}/, // -999999 - 999999
		        match1to2 = /\d\d?/, //       0 - 99
		        match3to4 = /\d\d\d\d?/, //     999 - 9999
		        match5to6 = /\d\d\d\d\d\d?/, //   99999 - 999999
		        match1to3 = /\d{1,3}/, //       0 - 999
		        match1to4 = /\d{1,4}/, //       0 - 9999
		        match1to6 = /[+-]?\d{1,6}/, // -999999 - 999999
		        matchUnsigned = /\d+/, //       0 - inf
		        matchSigned = /[+-]?\d+/, //    -inf - inf
		        matchOffset = /Z|[+-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
		        matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi, // +00 -00 +00:00 -00:00 +0000 -0000 or Z
		        matchTimestamp = /[+-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123
		        // any word (or two) characters or numbers including two/three word month in arabic.
		        // includes scottish gaelic two word and hyphenated months
		        matchWord =
		            /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i,
		        regexes;

		    regexes = {};

		    function addRegexToken(token, regex, strictRegex) {
		        regexes[token] = isFunction(regex)
		            ? regex
		            : function (isStrict, localeData) {
		                  return isStrict && strictRegex ? strictRegex : regex;
		              };
		    }

		    function getParseRegexForToken(token, config) {
		        if (!hasOwnProp(regexes, token)) {
		            return new RegExp(unescapeFormat(token));
		        }

		        return regexes[token](config._strict, config._locale);
		    }

		    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
		    function unescapeFormat(s) {
		        return regexEscape(
		            s
		                .replace('\\', '')
		                .replace(
		                    /\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,
		                    function (matched, p1, p2, p3, p4) {
		                        return p1 || p2 || p3 || p4;
		                    }
		                )
		        );
		    }

		    function regexEscape(s) {
		        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
		    }

		    var tokens = {};

		    function addParseToken(token, callback) {
		        var i,
		            func = callback,
		            tokenLen;
		        if (typeof token === 'string') {
		            token = [token];
		        }
		        if (isNumber(callback)) {
		            func = function (input, array) {
		                array[callback] = toInt(input);
		            };
		        }
		        tokenLen = token.length;
		        for (i = 0; i < tokenLen; i++) {
		            tokens[token[i]] = func;
		        }
		    }

		    function addWeekParseToken(token, callback) {
		        addParseToken(token, function (input, array, config, token) {
		            config._w = config._w || {};
		            callback(input, config._w, config, token);
		        });
		    }

		    function addTimeToArrayFromToken(token, input, config) {
		        if (input != null && hasOwnProp(tokens, token)) {
		            tokens[token](input, config._a, config, token);
		        }
		    }

		    var YEAR = 0,
		        MONTH = 1,
		        DATE = 2,
		        HOUR = 3,
		        MINUTE = 4,
		        SECOND = 5,
		        MILLISECOND = 6,
		        WEEK = 7,
		        WEEKDAY = 8;

		    function mod(n, x) {
		        return ((n % x) + x) % x;
		    }

		    var indexOf;

		    if (Array.prototype.indexOf) {
		        indexOf = Array.prototype.indexOf;
		    } else {
		        indexOf = function (o) {
		            // I know
		            var i;
		            for (i = 0; i < this.length; ++i) {
		                if (this[i] === o) {
		                    return i;
		                }
		            }
		            return -1;
		        };
		    }

		    function daysInMonth(year, month) {
		        if (isNaN(year) || isNaN(month)) {
		            return NaN;
		        }
		        var modMonth = mod(month, 12);
		        year += (month - modMonth) / 12;
		        return modMonth === 1
		            ? isLeapYear(year)
		                ? 29
		                : 28
		            : 31 - ((modMonth % 7) % 2);
		    }

		    // FORMATTING

		    addFormatToken('M', ['MM', 2], 'Mo', function () {
		        return this.month() + 1;
		    });

		    addFormatToken('MMM', 0, 0, function (format) {
		        return this.localeData().monthsShort(this, format);
		    });

		    addFormatToken('MMMM', 0, 0, function (format) {
		        return this.localeData().months(this, format);
		    });

		    // ALIASES

		    addUnitAlias('month', 'M');

		    // PRIORITY

		    addUnitPriority('month', 8);

		    // PARSING

		    addRegexToken('M', match1to2);
		    addRegexToken('MM', match1to2, match2);
		    addRegexToken('MMM', function (isStrict, locale) {
		        return locale.monthsShortRegex(isStrict);
		    });
		    addRegexToken('MMMM', function (isStrict, locale) {
		        return locale.monthsRegex(isStrict);
		    });

		    addParseToken(['M', 'MM'], function (input, array) {
		        array[MONTH] = toInt(input) - 1;
		    });

		    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
		        var month = config._locale.monthsParse(input, token, config._strict);
		        // if we didn't find a month name, mark the date as invalid.
		        if (month != null) {
		            array[MONTH] = month;
		        } else {
		            getParsingFlags(config).invalidMonth = input;
		        }
		    });

		    // LOCALES

		    var defaultLocaleMonths =
		            'January_February_March_April_May_June_July_August_September_October_November_December'.split(
		                '_'
		            ),
		        defaultLocaleMonthsShort =
		            'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
		        MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,
		        defaultMonthsShortRegex = matchWord,
		        defaultMonthsRegex = matchWord;

		    function localeMonths(m, format) {
		        if (!m) {
		            return isArray(this._months)
		                ? this._months
		                : this._months['standalone'];
		        }
		        return isArray(this._months)
		            ? this._months[m.month()]
		            : this._months[
		                  (this._months.isFormat || MONTHS_IN_FORMAT).test(format)
		                      ? 'format'
		                      : 'standalone'
		              ][m.month()];
		    }

		    function localeMonthsShort(m, format) {
		        if (!m) {
		            return isArray(this._monthsShort)
		                ? this._monthsShort
		                : this._monthsShort['standalone'];
		        }
		        return isArray(this._monthsShort)
		            ? this._monthsShort[m.month()]
		            : this._monthsShort[
		                  MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'
		              ][m.month()];
		    }

		    function handleStrictParse(monthName, format, strict) {
		        var i,
		            ii,
		            mom,
		            llc = monthName.toLocaleLowerCase();
		        if (!this._monthsParse) {
		            // this is not used
		            this._monthsParse = [];
		            this._longMonthsParse = [];
		            this._shortMonthsParse = [];
		            for (i = 0; i < 12; ++i) {
		                mom = createUTC([2000, i]);
		                this._shortMonthsParse[i] = this.monthsShort(
		                    mom,
		                    ''
		                ).toLocaleLowerCase();
		                this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
		            }
		        }

		        if (strict) {
		            if (format === 'MMM') {
		                ii = indexOf.call(this._shortMonthsParse, llc);
		                return ii !== -1 ? ii : null;
		            } else {
		                ii = indexOf.call(this._longMonthsParse, llc);
		                return ii !== -1 ? ii : null;
		            }
		        } else {
		            if (format === 'MMM') {
		                ii = indexOf.call(this._shortMonthsParse, llc);
		                if (ii !== -1) {
		                    return ii;
		                }
		                ii = indexOf.call(this._longMonthsParse, llc);
		                return ii !== -1 ? ii : null;
		            } else {
		                ii = indexOf.call(this._longMonthsParse, llc);
		                if (ii !== -1) {
		                    return ii;
		                }
		                ii = indexOf.call(this._shortMonthsParse, llc);
		                return ii !== -1 ? ii : null;
		            }
		        }
		    }

		    function localeMonthsParse(monthName, format, strict) {
		        var i, mom, regex;

		        if (this._monthsParseExact) {
		            return handleStrictParse.call(this, monthName, format, strict);
		        }

		        if (!this._monthsParse) {
		            this._monthsParse = [];
		            this._longMonthsParse = [];
		            this._shortMonthsParse = [];
		        }

		        // TODO: add sorting
		        // Sorting makes sure if one month (or abbr) is a prefix of another
		        // see sorting in computeMonthsParse
		        for (i = 0; i < 12; i++) {
		            // make the regex if we don't have it already
		            mom = createUTC([2000, i]);
		            if (strict && !this._longMonthsParse[i]) {
		                this._longMonthsParse[i] = new RegExp(
		                    '^' + this.months(mom, '').replace('.', '') + '$',
		                    'i'
		                );
		                this._shortMonthsParse[i] = new RegExp(
		                    '^' + this.monthsShort(mom, '').replace('.', '') + '$',
		                    'i'
		                );
		            }
		            if (!strict && !this._monthsParse[i]) {
		                regex =
		                    '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
		                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
		            }
		            // test the regex
		            if (
		                strict &&
		                format === 'MMMM' &&
		                this._longMonthsParse[i].test(monthName)
		            ) {
		                return i;
		            } else if (
		                strict &&
		                format === 'MMM' &&
		                this._shortMonthsParse[i].test(monthName)
		            ) {
		                return i;
		            } else if (!strict && this._monthsParse[i].test(monthName)) {
		                return i;
		            }
		        }
		    }

		    // MOMENTS

		    function setMonth(mom, value) {
		        var dayOfMonth;

		        if (!mom.isValid()) {
		            // No op
		            return mom;
		        }

		        if (typeof value === 'string') {
		            if (/^\d+$/.test(value)) {
		                value = toInt(value);
		            } else {
		                value = mom.localeData().monthsParse(value);
		                // TODO: Another silent failure?
		                if (!isNumber(value)) {
		                    return mom;
		                }
		            }
		        }

		        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
		        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
		        return mom;
		    }

		    function getSetMonth(value) {
		        if (value != null) {
		            setMonth(this, value);
		            hooks.updateOffset(this, true);
		            return this;
		        } else {
		            return get(this, 'Month');
		        }
		    }

		    function getDaysInMonth() {
		        return daysInMonth(this.year(), this.month());
		    }

		    function monthsShortRegex(isStrict) {
		        if (this._monthsParseExact) {
		            if (!hasOwnProp(this, '_monthsRegex')) {
		                computeMonthsParse.call(this);
		            }
		            if (isStrict) {
		                return this._monthsShortStrictRegex;
		            } else {
		                return this._monthsShortRegex;
		            }
		        } else {
		            if (!hasOwnProp(this, '_monthsShortRegex')) {
		                this._monthsShortRegex = defaultMonthsShortRegex;
		            }
		            return this._monthsShortStrictRegex && isStrict
		                ? this._monthsShortStrictRegex
		                : this._monthsShortRegex;
		        }
		    }

		    function monthsRegex(isStrict) {
		        if (this._monthsParseExact) {
		            if (!hasOwnProp(this, '_monthsRegex')) {
		                computeMonthsParse.call(this);
		            }
		            if (isStrict) {
		                return this._monthsStrictRegex;
		            } else {
		                return this._monthsRegex;
		            }
		        } else {
		            if (!hasOwnProp(this, '_monthsRegex')) {
		                this._monthsRegex = defaultMonthsRegex;
		            }
		            return this._monthsStrictRegex && isStrict
		                ? this._monthsStrictRegex
		                : this._monthsRegex;
		        }
		    }

		    function computeMonthsParse() {
		        function cmpLenRev(a, b) {
		            return b.length - a.length;
		        }

		        var shortPieces = [],
		            longPieces = [],
		            mixedPieces = [],
		            i,
		            mom;
		        for (i = 0; i < 12; i++) {
		            // make the regex if we don't have it already
		            mom = createUTC([2000, i]);
		            shortPieces.push(this.monthsShort(mom, ''));
		            longPieces.push(this.months(mom, ''));
		            mixedPieces.push(this.months(mom, ''));
		            mixedPieces.push(this.monthsShort(mom, ''));
		        }
		        // Sorting makes sure if one month (or abbr) is a prefix of another it
		        // will match the longer piece.
		        shortPieces.sort(cmpLenRev);
		        longPieces.sort(cmpLenRev);
		        mixedPieces.sort(cmpLenRev);
		        for (i = 0; i < 12; i++) {
		            shortPieces[i] = regexEscape(shortPieces[i]);
		            longPieces[i] = regexEscape(longPieces[i]);
		        }
		        for (i = 0; i < 24; i++) {
		            mixedPieces[i] = regexEscape(mixedPieces[i]);
		        }

		        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
		        this._monthsShortRegex = this._monthsRegex;
		        this._monthsStrictRegex = new RegExp(
		            '^(' + longPieces.join('|') + ')',
		            'i'
		        );
		        this._monthsShortStrictRegex = new RegExp(
		            '^(' + shortPieces.join('|') + ')',
		            'i'
		        );
		    }

		    // FORMATTING

		    addFormatToken('Y', 0, 0, function () {
		        var y = this.year();
		        return y <= 9999 ? zeroFill(y, 4) : '+' + y;
		    });

		    addFormatToken(0, ['YY', 2], 0, function () {
		        return this.year() % 100;
		    });

		    addFormatToken(0, ['YYYY', 4], 0, 'year');
		    addFormatToken(0, ['YYYYY', 5], 0, 'year');
		    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

		    // ALIASES

		    addUnitAlias('year', 'y');

		    // PRIORITIES

		    addUnitPriority('year', 1);

		    // PARSING

		    addRegexToken('Y', matchSigned);
		    addRegexToken('YY', match1to2, match2);
		    addRegexToken('YYYY', match1to4, match4);
		    addRegexToken('YYYYY', match1to6, match6);
		    addRegexToken('YYYYYY', match1to6, match6);

		    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
		    addParseToken('YYYY', function (input, array) {
		        array[YEAR] =
		            input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
		    });
		    addParseToken('YY', function (input, array) {
		        array[YEAR] = hooks.parseTwoDigitYear(input);
		    });
		    addParseToken('Y', function (input, array) {
		        array[YEAR] = parseInt(input, 10);
		    });

		    // HELPERS

		    function daysInYear(year) {
		        return isLeapYear(year) ? 366 : 365;
		    }

		    // HOOKS

		    hooks.parseTwoDigitYear = function (input) {
		        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
		    };

		    // MOMENTS

		    var getSetYear = makeGetSet('FullYear', true);

		    function getIsLeapYear() {
		        return isLeapYear(this.year());
		    }

		    function createDate(y, m, d, h, M, s, ms) {
		        // can't just apply() to create a date:
		        // https://stackoverflow.com/q/181348
		        var date;
		        // the date constructor remaps years 0-99 to 1900-1999
		        if (y < 100 && y >= 0) {
		            // preserve leap years using a full 400 year cycle, then reset
		            date = new Date(y + 400, m, d, h, M, s, ms);
		            if (isFinite(date.getFullYear())) {
		                date.setFullYear(y);
		            }
		        } else {
		            date = new Date(y, m, d, h, M, s, ms);
		        }

		        return date;
		    }

		    function createUTCDate(y) {
		        var date, args;
		        // the Date.UTC function remaps years 0-99 to 1900-1999
		        if (y < 100 && y >= 0) {
		            args = Array.prototype.slice.call(arguments);
		            // preserve leap years using a full 400 year cycle, then reset
		            args[0] = y + 400;
		            date = new Date(Date.UTC.apply(null, args));
		            if (isFinite(date.getUTCFullYear())) {
		                date.setUTCFullYear(y);
		            }
		        } else {
		            date = new Date(Date.UTC.apply(null, arguments));
		        }

		        return date;
		    }

		    // start-of-first-week - start-of-year
		    function firstWeekOffset(year, dow, doy) {
		        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
		            fwd = 7 + dow - doy,
		            // first-week day local weekday -- which local weekday is fwd
		            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

		        return -fwdlw + fwd - 1;
		    }

		    // https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
		    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
		        var localWeekday = (7 + weekday - dow) % 7,
		            weekOffset = firstWeekOffset(year, dow, doy),
		            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
		            resYear,
		            resDayOfYear;

		        if (dayOfYear <= 0) {
		            resYear = year - 1;
		            resDayOfYear = daysInYear(resYear) + dayOfYear;
		        } else if (dayOfYear > daysInYear(year)) {
		            resYear = year + 1;
		            resDayOfYear = dayOfYear - daysInYear(year);
		        } else {
		            resYear = year;
		            resDayOfYear = dayOfYear;
		        }

		        return {
		            year: resYear,
		            dayOfYear: resDayOfYear,
		        };
		    }

		    function weekOfYear(mom, dow, doy) {
		        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
		            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
		            resWeek,
		            resYear;

		        if (week < 1) {
		            resYear = mom.year() - 1;
		            resWeek = week + weeksInYear(resYear, dow, doy);
		        } else if (week > weeksInYear(mom.year(), dow, doy)) {
		            resWeek = week - weeksInYear(mom.year(), dow, doy);
		            resYear = mom.year() + 1;
		        } else {
		            resYear = mom.year();
		            resWeek = week;
		        }

		        return {
		            week: resWeek,
		            year: resYear,
		        };
		    }

		    function weeksInYear(year, dow, doy) {
		        var weekOffset = firstWeekOffset(year, dow, doy),
		            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
		        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
		    }

		    // FORMATTING

		    addFormatToken('w', ['ww', 2], 'wo', 'week');
		    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

		    // ALIASES

		    addUnitAlias('week', 'w');
		    addUnitAlias('isoWeek', 'W');

		    // PRIORITIES

		    addUnitPriority('week', 5);
		    addUnitPriority('isoWeek', 5);

		    // PARSING

		    addRegexToken('w', match1to2);
		    addRegexToken('ww', match1to2, match2);
		    addRegexToken('W', match1to2);
		    addRegexToken('WW', match1to2, match2);

		    addWeekParseToken(
		        ['w', 'ww', 'W', 'WW'],
		        function (input, week, config, token) {
		            week[token.substr(0, 1)] = toInt(input);
		        }
		    );

		    // HELPERS

		    // LOCALES

		    function localeWeek(mom) {
		        return weekOfYear(mom, this._week.dow, this._week.doy).week;
		    }

		    var defaultLocaleWeek = {
		        dow: 0, // Sunday is the first day of the week.
		        doy: 6, // The week that contains Jan 6th is the first week of the year.
		    };

		    function localeFirstDayOfWeek() {
		        return this._week.dow;
		    }

		    function localeFirstDayOfYear() {
		        return this._week.doy;
		    }

		    // MOMENTS

		    function getSetWeek(input) {
		        var week = this.localeData().week(this);
		        return input == null ? week : this.add((input - week) * 7, 'd');
		    }

		    function getSetISOWeek(input) {
		        var week = weekOfYear(this, 1, 4).week;
		        return input == null ? week : this.add((input - week) * 7, 'd');
		    }

		    // FORMATTING

		    addFormatToken('d', 0, 'do', 'day');

		    addFormatToken('dd', 0, 0, function (format) {
		        return this.localeData().weekdaysMin(this, format);
		    });

		    addFormatToken('ddd', 0, 0, function (format) {
		        return this.localeData().weekdaysShort(this, format);
		    });

		    addFormatToken('dddd', 0, 0, function (format) {
		        return this.localeData().weekdays(this, format);
		    });

		    addFormatToken('e', 0, 0, 'weekday');
		    addFormatToken('E', 0, 0, 'isoWeekday');

		    // ALIASES

		    addUnitAlias('day', 'd');
		    addUnitAlias('weekday', 'e');
		    addUnitAlias('isoWeekday', 'E');

		    // PRIORITY
		    addUnitPriority('day', 11);
		    addUnitPriority('weekday', 11);
		    addUnitPriority('isoWeekday', 11);

		    // PARSING

		    addRegexToken('d', match1to2);
		    addRegexToken('e', match1to2);
		    addRegexToken('E', match1to2);
		    addRegexToken('dd', function (isStrict, locale) {
		        return locale.weekdaysMinRegex(isStrict);
		    });
		    addRegexToken('ddd', function (isStrict, locale) {
		        return locale.weekdaysShortRegex(isStrict);
		    });
		    addRegexToken('dddd', function (isStrict, locale) {
		        return locale.weekdaysRegex(isStrict);
		    });

		    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
		        var weekday = config._locale.weekdaysParse(input, token, config._strict);
		        // if we didn't get a weekday name, mark the date as invalid
		        if (weekday != null) {
		            week.d = weekday;
		        } else {
		            getParsingFlags(config).invalidWeekday = input;
		        }
		    });

		    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
		        week[token] = toInt(input);
		    });

		    // HELPERS

		    function parseWeekday(input, locale) {
		        if (typeof input !== 'string') {
		            return input;
		        }

		        if (!isNaN(input)) {
		            return parseInt(input, 10);
		        }

		        input = locale.weekdaysParse(input);
		        if (typeof input === 'number') {
		            return input;
		        }

		        return null;
		    }

		    function parseIsoWeekday(input, locale) {
		        if (typeof input === 'string') {
		            return locale.weekdaysParse(input) % 7 || 7;
		        }
		        return isNaN(input) ? null : input;
		    }

		    // LOCALES
		    function shiftWeekdays(ws, n) {
		        return ws.slice(n, 7).concat(ws.slice(0, n));
		    }

		    var defaultLocaleWeekdays =
		            'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
		        defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
		        defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
		        defaultWeekdaysRegex = matchWord,
		        defaultWeekdaysShortRegex = matchWord,
		        defaultWeekdaysMinRegex = matchWord;

		    function localeWeekdays(m, format) {
		        var weekdays = isArray(this._weekdays)
		            ? this._weekdays
		            : this._weekdays[
		                  m && m !== true && this._weekdays.isFormat.test(format)
		                      ? 'format'
		                      : 'standalone'
		              ];
		        return m === true
		            ? shiftWeekdays(weekdays, this._week.dow)
		            : m
		            ? weekdays[m.day()]
		            : weekdays;
		    }

		    function localeWeekdaysShort(m) {
		        return m === true
		            ? shiftWeekdays(this._weekdaysShort, this._week.dow)
		            : m
		            ? this._weekdaysShort[m.day()]
		            : this._weekdaysShort;
		    }

		    function localeWeekdaysMin(m) {
		        return m === true
		            ? shiftWeekdays(this._weekdaysMin, this._week.dow)
		            : m
		            ? this._weekdaysMin[m.day()]
		            : this._weekdaysMin;
		    }

		    function handleStrictParse$1(weekdayName, format, strict) {
		        var i,
		            ii,
		            mom,
		            llc = weekdayName.toLocaleLowerCase();
		        if (!this._weekdaysParse) {
		            this._weekdaysParse = [];
		            this._shortWeekdaysParse = [];
		            this._minWeekdaysParse = [];

		            for (i = 0; i < 7; ++i) {
		                mom = createUTC([2000, 1]).day(i);
		                this._minWeekdaysParse[i] = this.weekdaysMin(
		                    mom,
		                    ''
		                ).toLocaleLowerCase();
		                this._shortWeekdaysParse[i] = this.weekdaysShort(
		                    mom,
		                    ''
		                ).toLocaleLowerCase();
		                this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
		            }
		        }

		        if (strict) {
		            if (format === 'dddd') {
		                ii = indexOf.call(this._weekdaysParse, llc);
		                return ii !== -1 ? ii : null;
		            } else if (format === 'ddd') {
		                ii = indexOf.call(this._shortWeekdaysParse, llc);
		                return ii !== -1 ? ii : null;
		            } else {
		                ii = indexOf.call(this._minWeekdaysParse, llc);
		                return ii !== -1 ? ii : null;
		            }
		        } else {
		            if (format === 'dddd') {
		                ii = indexOf.call(this._weekdaysParse, llc);
		                if (ii !== -1) {
		                    return ii;
		                }
		                ii = indexOf.call(this._shortWeekdaysParse, llc);
		                if (ii !== -1) {
		                    return ii;
		                }
		                ii = indexOf.call(this._minWeekdaysParse, llc);
		                return ii !== -1 ? ii : null;
		            } else if (format === 'ddd') {
		                ii = indexOf.call(this._shortWeekdaysParse, llc);
		                if (ii !== -1) {
		                    return ii;
		                }
		                ii = indexOf.call(this._weekdaysParse, llc);
		                if (ii !== -1) {
		                    return ii;
		                }
		                ii = indexOf.call(this._minWeekdaysParse, llc);
		                return ii !== -1 ? ii : null;
		            } else {
		                ii = indexOf.call(this._minWeekdaysParse, llc);
		                if (ii !== -1) {
		                    return ii;
		                }
		                ii = indexOf.call(this._weekdaysParse, llc);
		                if (ii !== -1) {
		                    return ii;
		                }
		                ii = indexOf.call(this._shortWeekdaysParse, llc);
		                return ii !== -1 ? ii : null;
		            }
		        }
		    }

		    function localeWeekdaysParse(weekdayName, format, strict) {
		        var i, mom, regex;

		        if (this._weekdaysParseExact) {
		            return handleStrictParse$1.call(this, weekdayName, format, strict);
		        }

		        if (!this._weekdaysParse) {
		            this._weekdaysParse = [];
		            this._minWeekdaysParse = [];
		            this._shortWeekdaysParse = [];
		            this._fullWeekdaysParse = [];
		        }

		        for (i = 0; i < 7; i++) {
		            // make the regex if we don't have it already

		            mom = createUTC([2000, 1]).day(i);
		            if (strict && !this._fullWeekdaysParse[i]) {
		                this._fullWeekdaysParse[i] = new RegExp(
		                    '^' + this.weekdays(mom, '').replace('.', '\\.?') + '$',
		                    'i'
		                );
		                this._shortWeekdaysParse[i] = new RegExp(
		                    '^' + this.weekdaysShort(mom, '').replace('.', '\\.?') + '$',
		                    'i'
		                );
		                this._minWeekdaysParse[i] = new RegExp(
		                    '^' + this.weekdaysMin(mom, '').replace('.', '\\.?') + '$',
		                    'i'
		                );
		            }
		            if (!this._weekdaysParse[i]) {
		                regex =
		                    '^' +
		                    this.weekdays(mom, '') +
		                    '|^' +
		                    this.weekdaysShort(mom, '') +
		                    '|^' +
		                    this.weekdaysMin(mom, '');
		                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
		            }
		            // test the regex
		            if (
		                strict &&
		                format === 'dddd' &&
		                this._fullWeekdaysParse[i].test(weekdayName)
		            ) {
		                return i;
		            } else if (
		                strict &&
		                format === 'ddd' &&
		                this._shortWeekdaysParse[i].test(weekdayName)
		            ) {
		                return i;
		            } else if (
		                strict &&
		                format === 'dd' &&
		                this._minWeekdaysParse[i].test(weekdayName)
		            ) {
		                return i;
		            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
		                return i;
		            }
		        }
		    }

		    // MOMENTS

		    function getSetDayOfWeek(input) {
		        if (!this.isValid()) {
		            return input != null ? this : NaN;
		        }
		        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
		        if (input != null) {
		            input = parseWeekday(input, this.localeData());
		            return this.add(input - day, 'd');
		        } else {
		            return day;
		        }
		    }

		    function getSetLocaleDayOfWeek(input) {
		        if (!this.isValid()) {
		            return input != null ? this : NaN;
		        }
		        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
		        return input == null ? weekday : this.add(input - weekday, 'd');
		    }

		    function getSetISODayOfWeek(input) {
		        if (!this.isValid()) {
		            return input != null ? this : NaN;
		        }

		        // behaves the same as moment#day except
		        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
		        // as a setter, sunday should belong to the previous week.

		        if (input != null) {
		            var weekday = parseIsoWeekday(input, this.localeData());
		            return this.day(this.day() % 7 ? weekday : weekday - 7);
		        } else {
		            return this.day() || 7;
		        }
		    }

		    function weekdaysRegex(isStrict) {
		        if (this._weekdaysParseExact) {
		            if (!hasOwnProp(this, '_weekdaysRegex')) {
		                computeWeekdaysParse.call(this);
		            }
		            if (isStrict) {
		                return this._weekdaysStrictRegex;
		            } else {
		                return this._weekdaysRegex;
		            }
		        } else {
		            if (!hasOwnProp(this, '_weekdaysRegex')) {
		                this._weekdaysRegex = defaultWeekdaysRegex;
		            }
		            return this._weekdaysStrictRegex && isStrict
		                ? this._weekdaysStrictRegex
		                : this._weekdaysRegex;
		        }
		    }

		    function weekdaysShortRegex(isStrict) {
		        if (this._weekdaysParseExact) {
		            if (!hasOwnProp(this, '_weekdaysRegex')) {
		                computeWeekdaysParse.call(this);
		            }
		            if (isStrict) {
		                return this._weekdaysShortStrictRegex;
		            } else {
		                return this._weekdaysShortRegex;
		            }
		        } else {
		            if (!hasOwnProp(this, '_weekdaysShortRegex')) {
		                this._weekdaysShortRegex = defaultWeekdaysShortRegex;
		            }
		            return this._weekdaysShortStrictRegex && isStrict
		                ? this._weekdaysShortStrictRegex
		                : this._weekdaysShortRegex;
		        }
		    }

		    function weekdaysMinRegex(isStrict) {
		        if (this._weekdaysParseExact) {
		            if (!hasOwnProp(this, '_weekdaysRegex')) {
		                computeWeekdaysParse.call(this);
		            }
		            if (isStrict) {
		                return this._weekdaysMinStrictRegex;
		            } else {
		                return this._weekdaysMinRegex;
		            }
		        } else {
		            if (!hasOwnProp(this, '_weekdaysMinRegex')) {
		                this._weekdaysMinRegex = defaultWeekdaysMinRegex;
		            }
		            return this._weekdaysMinStrictRegex && isStrict
		                ? this._weekdaysMinStrictRegex
		                : this._weekdaysMinRegex;
		        }
		    }

		    function computeWeekdaysParse() {
		        function cmpLenRev(a, b) {
		            return b.length - a.length;
		        }

		        var minPieces = [],
		            shortPieces = [],
		            longPieces = [],
		            mixedPieces = [],
		            i,
		            mom,
		            minp,
		            shortp,
		            longp;
		        for (i = 0; i < 7; i++) {
		            // make the regex if we don't have it already
		            mom = createUTC([2000, 1]).day(i);
		            minp = regexEscape(this.weekdaysMin(mom, ''));
		            shortp = regexEscape(this.weekdaysShort(mom, ''));
		            longp = regexEscape(this.weekdays(mom, ''));
		            minPieces.push(minp);
		            shortPieces.push(shortp);
		            longPieces.push(longp);
		            mixedPieces.push(minp);
		            mixedPieces.push(shortp);
		            mixedPieces.push(longp);
		        }
		        // Sorting makes sure if one weekday (or abbr) is a prefix of another it
		        // will match the longer piece.
		        minPieces.sort(cmpLenRev);
		        shortPieces.sort(cmpLenRev);
		        longPieces.sort(cmpLenRev);
		        mixedPieces.sort(cmpLenRev);

		        this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
		        this._weekdaysShortRegex = this._weekdaysRegex;
		        this._weekdaysMinRegex = this._weekdaysRegex;

		        this._weekdaysStrictRegex = new RegExp(
		            '^(' + longPieces.join('|') + ')',
		            'i'
		        );
		        this._weekdaysShortStrictRegex = new RegExp(
		            '^(' + shortPieces.join('|') + ')',
		            'i'
		        );
		        this._weekdaysMinStrictRegex = new RegExp(
		            '^(' + minPieces.join('|') + ')',
		            'i'
		        );
		    }

		    // FORMATTING

		    function hFormat() {
		        return this.hours() % 12 || 12;
		    }

		    function kFormat() {
		        return this.hours() || 24;
		    }

		    addFormatToken('H', ['HH', 2], 0, 'hour');
		    addFormatToken('h', ['hh', 2], 0, hFormat);
		    addFormatToken('k', ['kk', 2], 0, kFormat);

		    addFormatToken('hmm', 0, 0, function () {
		        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
		    });

		    addFormatToken('hmmss', 0, 0, function () {
		        return (
		            '' +
		            hFormat.apply(this) +
		            zeroFill(this.minutes(), 2) +
		            zeroFill(this.seconds(), 2)
		        );
		    });

		    addFormatToken('Hmm', 0, 0, function () {
		        return '' + this.hours() + zeroFill(this.minutes(), 2);
		    });

		    addFormatToken('Hmmss', 0, 0, function () {
		        return (
		            '' +
		            this.hours() +
		            zeroFill(this.minutes(), 2) +
		            zeroFill(this.seconds(), 2)
		        );
		    });

		    function meridiem(token, lowercase) {
		        addFormatToken(token, 0, 0, function () {
		            return this.localeData().meridiem(
		                this.hours(),
		                this.minutes(),
		                lowercase
		            );
		        });
		    }

		    meridiem('a', true);
		    meridiem('A', false);

		    // ALIASES

		    addUnitAlias('hour', 'h');

		    // PRIORITY
		    addUnitPriority('hour', 13);

		    // PARSING

		    function matchMeridiem(isStrict, locale) {
		        return locale._meridiemParse;
		    }

		    addRegexToken('a', matchMeridiem);
		    addRegexToken('A', matchMeridiem);
		    addRegexToken('H', match1to2);
		    addRegexToken('h', match1to2);
		    addRegexToken('k', match1to2);
		    addRegexToken('HH', match1to2, match2);
		    addRegexToken('hh', match1to2, match2);
		    addRegexToken('kk', match1to2, match2);

		    addRegexToken('hmm', match3to4);
		    addRegexToken('hmmss', match5to6);
		    addRegexToken('Hmm', match3to4);
		    addRegexToken('Hmmss', match5to6);

		    addParseToken(['H', 'HH'], HOUR);
		    addParseToken(['k', 'kk'], function (input, array, config) {
		        var kInput = toInt(input);
		        array[HOUR] = kInput === 24 ? 0 : kInput;
		    });
		    addParseToken(['a', 'A'], function (input, array, config) {
		        config._isPm = config._locale.isPM(input);
		        config._meridiem = input;
		    });
		    addParseToken(['h', 'hh'], function (input, array, config) {
		        array[HOUR] = toInt(input);
		        getParsingFlags(config).bigHour = true;
		    });
		    addParseToken('hmm', function (input, array, config) {
		        var pos = input.length - 2;
		        array[HOUR] = toInt(input.substr(0, pos));
		        array[MINUTE] = toInt(input.substr(pos));
		        getParsingFlags(config).bigHour = true;
		    });
		    addParseToken('hmmss', function (input, array, config) {
		        var pos1 = input.length - 4,
		            pos2 = input.length - 2;
		        array[HOUR] = toInt(input.substr(0, pos1));
		        array[MINUTE] = toInt(input.substr(pos1, 2));
		        array[SECOND] = toInt(input.substr(pos2));
		        getParsingFlags(config).bigHour = true;
		    });
		    addParseToken('Hmm', function (input, array, config) {
		        var pos = input.length - 2;
		        array[HOUR] = toInt(input.substr(0, pos));
		        array[MINUTE] = toInt(input.substr(pos));
		    });
		    addParseToken('Hmmss', function (input, array, config) {
		        var pos1 = input.length - 4,
		            pos2 = input.length - 2;
		        array[HOUR] = toInt(input.substr(0, pos1));
		        array[MINUTE] = toInt(input.substr(pos1, 2));
		        array[SECOND] = toInt(input.substr(pos2));
		    });

		    // LOCALES

		    function localeIsPM(input) {
		        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
		        // Using charAt should be more compatible.
		        return (input + '').toLowerCase().charAt(0) === 'p';
		    }

		    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i,
		        // Setting the hour should keep the time, because the user explicitly
		        // specified which hour they want. So trying to maintain the same hour (in
		        // a new timezone) makes sense. Adding/subtracting hours does not follow
		        // this rule.
		        getSetHour = makeGetSet('Hours', true);

		    function localeMeridiem(hours, minutes, isLower) {
		        if (hours > 11) {
		            return isLower ? 'pm' : 'PM';
		        } else {
		            return isLower ? 'am' : 'AM';
		        }
		    }

		    var baseConfig = {
		        calendar: defaultCalendar,
		        longDateFormat: defaultLongDateFormat,
		        invalidDate: defaultInvalidDate,
		        ordinal: defaultOrdinal,
		        dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
		        relativeTime: defaultRelativeTime,

		        months: defaultLocaleMonths,
		        monthsShort: defaultLocaleMonthsShort,

		        week: defaultLocaleWeek,

		        weekdays: defaultLocaleWeekdays,
		        weekdaysMin: defaultLocaleWeekdaysMin,
		        weekdaysShort: defaultLocaleWeekdaysShort,

		        meridiemParse: defaultLocaleMeridiemParse,
		    };

		    // internal storage for locale config files
		    var locales = {},
		        localeFamilies = {},
		        globalLocale;

		    function commonPrefix(arr1, arr2) {
		        var i,
		            minl = Math.min(arr1.length, arr2.length);
		        for (i = 0; i < minl; i += 1) {
		            if (arr1[i] !== arr2[i]) {
		                return i;
		            }
		        }
		        return minl;
		    }

		    function normalizeLocale(key) {
		        return key ? key.toLowerCase().replace('_', '-') : key;
		    }

		    // pick the locale from the array
		    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
		    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
		    function chooseLocale(names) {
		        var i = 0,
		            j,
		            next,
		            locale,
		            split;

		        while (i < names.length) {
		            split = normalizeLocale(names[i]).split('-');
		            j = split.length;
		            next = normalizeLocale(names[i + 1]);
		            next = next ? next.split('-') : null;
		            while (j > 0) {
		                locale = loadLocale(split.slice(0, j).join('-'));
		                if (locale) {
		                    return locale;
		                }
		                if (
		                    next &&
		                    next.length >= j &&
		                    commonPrefix(split, next) >= j - 1
		                ) {
		                    //the next array item is better than a shallower substring of this one
		                    break;
		                }
		                j--;
		            }
		            i++;
		        }
		        return globalLocale;
		    }

		    function isLocaleNameSane(name) {
		        // Prevent names that look like filesystem paths, i.e contain '/' or '\'
		        return name.match('^[^/\\\\]*$') != null;
		    }

		    function loadLocale(name) {
		        var oldLocale = null,
		            aliasedRequire;
		        // TODO: Find a better way to register and load all the locales in Node
		        if (
		            locales[name] === undefined &&
		            'object' !== 'undefined' &&
		            module &&
		            module.exports &&
		            isLocaleNameSane(name)
		        ) {
		            try {
		                oldLocale = globalLocale._abbr;
		                aliasedRequire = commonjsRequire;
		                aliasedRequire('./locale/' + name);
		                getSetGlobalLocale(oldLocale);
		            } catch (e) {
		                // mark as not found to avoid repeating expensive file require call causing high CPU
		                // when trying to find en-US, en_US, en-us for every format call
		                locales[name] = null; // null means not found
		            }
		        }
		        return locales[name];
		    }

		    // This function will load locale and then set the global locale.  If
		    // no arguments are passed in, it will simply return the current global
		    // locale key.
		    function getSetGlobalLocale(key, values) {
		        var data;
		        if (key) {
		            if (isUndefined(values)) {
		                data = getLocale(key);
		            } else {
		                data = defineLocale(key, values);
		            }

		            if (data) {
		                // moment.duration._locale = moment._locale = data;
		                globalLocale = data;
		            } else {
		                if (typeof console !== 'undefined' && console.warn) {
		                    //warn user if arguments are passed but the locale could not be set
		                    console.warn(
		                        'Locale ' + key + ' not found. Did you forget to load it?'
		                    );
		                }
		            }
		        }

		        return globalLocale._abbr;
		    }

		    function defineLocale(name, config) {
		        if (config !== null) {
		            var locale,
		                parentConfig = baseConfig;
		            config.abbr = name;
		            if (locales[name] != null) {
		                deprecateSimple(
		                    'defineLocaleOverride',
		                    'use moment.updateLocale(localeName, config) to change ' +
		                        'an existing locale. moment.defineLocale(localeName, ' +
		                        'config) should only be used for creating a new locale ' +
		                        'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.'
		                );
		                parentConfig = locales[name]._config;
		            } else if (config.parentLocale != null) {
		                if (locales[config.parentLocale] != null) {
		                    parentConfig = locales[config.parentLocale]._config;
		                } else {
		                    locale = loadLocale(config.parentLocale);
		                    if (locale != null) {
		                        parentConfig = locale._config;
		                    } else {
		                        if (!localeFamilies[config.parentLocale]) {
		                            localeFamilies[config.parentLocale] = [];
		                        }
		                        localeFamilies[config.parentLocale].push({
		                            name: name,
		                            config: config,
		                        });
		                        return null;
		                    }
		                }
		            }
		            locales[name] = new Locale(mergeConfigs(parentConfig, config));

		            if (localeFamilies[name]) {
		                localeFamilies[name].forEach(function (x) {
		                    defineLocale(x.name, x.config);
		                });
		            }

		            // backwards compat for now: also set the locale
		            // make sure we set the locale AFTER all child locales have been
		            // created, so we won't end up with the child locale set.
		            getSetGlobalLocale(name);

		            return locales[name];
		        } else {
		            // useful for testing
		            delete locales[name];
		            return null;
		        }
		    }

		    function updateLocale(name, config) {
		        if (config != null) {
		            var locale,
		                tmpLocale,
		                parentConfig = baseConfig;

		            if (locales[name] != null && locales[name].parentLocale != null) {
		                // Update existing child locale in-place to avoid memory-leaks
		                locales[name].set(mergeConfigs(locales[name]._config, config));
		            } else {
		                // MERGE
		                tmpLocale = loadLocale(name);
		                if (tmpLocale != null) {
		                    parentConfig = tmpLocale._config;
		                }
		                config = mergeConfigs(parentConfig, config);
		                if (tmpLocale == null) {
		                    // updateLocale is called for creating a new locale
		                    // Set abbr so it will have a name (getters return
		                    // undefined otherwise).
		                    config.abbr = name;
		                }
		                locale = new Locale(config);
		                locale.parentLocale = locales[name];
		                locales[name] = locale;
		            }

		            // backwards compat for now: also set the locale
		            getSetGlobalLocale(name);
		        } else {
		            // pass null for config to unupdate, useful for tests
		            if (locales[name] != null) {
		                if (locales[name].parentLocale != null) {
		                    locales[name] = locales[name].parentLocale;
		                    if (name === getSetGlobalLocale()) {
		                        getSetGlobalLocale(name);
		                    }
		                } else if (locales[name] != null) {
		                    delete locales[name];
		                }
		            }
		        }
		        return locales[name];
		    }

		    // returns locale data
		    function getLocale(key) {
		        var locale;

		        if (key && key._locale && key._locale._abbr) {
		            key = key._locale._abbr;
		        }

		        if (!key) {
		            return globalLocale;
		        }

		        if (!isArray(key)) {
		            //short-circuit everything else
		            locale = loadLocale(key);
		            if (locale) {
		                return locale;
		            }
		            key = [key];
		        }

		        return chooseLocale(key);
		    }

		    function listLocales() {
		        return keys(locales);
		    }

		    function checkOverflow(m) {
		        var overflow,
		            a = m._a;

		        if (a && getParsingFlags(m).overflow === -2) {
		            overflow =
		                a[MONTH] < 0 || a[MONTH] > 11
		                    ? MONTH
		                    : a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH])
		                    ? DATE
		                    : a[HOUR] < 0 ||
		                      a[HOUR] > 24 ||
		                      (a[HOUR] === 24 &&
		                          (a[MINUTE] !== 0 ||
		                              a[SECOND] !== 0 ||
		                              a[MILLISECOND] !== 0))
		                    ? HOUR
		                    : a[MINUTE] < 0 || a[MINUTE] > 59
		                    ? MINUTE
		                    : a[SECOND] < 0 || a[SECOND] > 59
		                    ? SECOND
		                    : a[MILLISECOND] < 0 || a[MILLISECOND] > 999
		                    ? MILLISECOND
		                    : -1;

		            if (
		                getParsingFlags(m)._overflowDayOfYear &&
		                (overflow < YEAR || overflow > DATE)
		            ) {
		                overflow = DATE;
		            }
		            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
		                overflow = WEEK;
		            }
		            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
		                overflow = WEEKDAY;
		            }

		            getParsingFlags(m).overflow = overflow;
		        }

		        return m;
		    }

		    // iso 8601 regex
		    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
		    var extendedIsoRegex =
		            /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
		        basicIsoRegex =
		            /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
		        tzRegex = /Z|[+-]\d\d(?::?\d\d)?/,
		        isoDates = [
		            ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
		            ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
		            ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
		            ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
		            ['YYYY-DDD', /\d{4}-\d{3}/],
		            ['YYYY-MM', /\d{4}-\d\d/, false],
		            ['YYYYYYMMDD', /[+-]\d{10}/],
		            ['YYYYMMDD', /\d{8}/],
		            ['GGGG[W]WWE', /\d{4}W\d{3}/],
		            ['GGGG[W]WW', /\d{4}W\d{2}/, false],
		            ['YYYYDDD', /\d{7}/],
		            ['YYYYMM', /\d{6}/, false],
		            ['YYYY', /\d{4}/, false],
		        ],
		        // iso time formats and regexes
		        isoTimes = [
		            ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
		            ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
		            ['HH:mm:ss', /\d\d:\d\d:\d\d/],
		            ['HH:mm', /\d\d:\d\d/],
		            ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
		            ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
		            ['HHmmss', /\d\d\d\d\d\d/],
		            ['HHmm', /\d\d\d\d/],
		            ['HH', /\d\d/],
		        ],
		        aspNetJsonRegex = /^\/?Date\((-?\d+)/i,
		        // RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
		        rfc2822 =
		            /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/,
		        obsOffsets = {
		            UT: 0,
		            GMT: 0,
		            EDT: -4 * 60,
		            EST: -5 * 60,
		            CDT: -5 * 60,
		            CST: -6 * 60,
		            MDT: -6 * 60,
		            MST: -7 * 60,
		            PDT: -7 * 60,
		            PST: -8 * 60,
		        };

		    // date from iso format
		    function configFromISO(config) {
		        var i,
		            l,
		            string = config._i,
		            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
		            allowTime,
		            dateFormat,
		            timeFormat,
		            tzFormat,
		            isoDatesLen = isoDates.length,
		            isoTimesLen = isoTimes.length;

		        if (match) {
		            getParsingFlags(config).iso = true;
		            for (i = 0, l = isoDatesLen; i < l; i++) {
		                if (isoDates[i][1].exec(match[1])) {
		                    dateFormat = isoDates[i][0];
		                    allowTime = isoDates[i][2] !== false;
		                    break;
		                }
		            }
		            if (dateFormat == null) {
		                config._isValid = false;
		                return;
		            }
		            if (match[3]) {
		                for (i = 0, l = isoTimesLen; i < l; i++) {
		                    if (isoTimes[i][1].exec(match[3])) {
		                        // match[2] should be 'T' or space
		                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
		                        break;
		                    }
		                }
		                if (timeFormat == null) {
		                    config._isValid = false;
		                    return;
		                }
		            }
		            if (!allowTime && timeFormat != null) {
		                config._isValid = false;
		                return;
		            }
		            if (match[4]) {
		                if (tzRegex.exec(match[4])) {
		                    tzFormat = 'Z';
		                } else {
		                    config._isValid = false;
		                    return;
		                }
		            }
		            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
		            configFromStringAndFormat(config);
		        } else {
		            config._isValid = false;
		        }
		    }

		    function extractFromRFC2822Strings(
		        yearStr,
		        monthStr,
		        dayStr,
		        hourStr,
		        minuteStr,
		        secondStr
		    ) {
		        var result = [
		            untruncateYear(yearStr),
		            defaultLocaleMonthsShort.indexOf(monthStr),
		            parseInt(dayStr, 10),
		            parseInt(hourStr, 10),
		            parseInt(minuteStr, 10),
		        ];

		        if (secondStr) {
		            result.push(parseInt(secondStr, 10));
		        }

		        return result;
		    }

		    function untruncateYear(yearStr) {
		        var year = parseInt(yearStr, 10);
		        if (year <= 49) {
		            return 2000 + year;
		        } else if (year <= 999) {
		            return 1900 + year;
		        }
		        return year;
		    }

		    function preprocessRFC2822(s) {
		        // Remove comments and folding whitespace and replace multiple-spaces with a single space
		        return s
		            .replace(/\([^)]*\)|[\n\t]/g, ' ')
		            .replace(/(\s\s+)/g, ' ')
		            .replace(/^\s\s*/, '')
		            .replace(/\s\s*$/, '');
		    }

		    function checkWeekday(weekdayStr, parsedInput, config) {
		        if (weekdayStr) {
		            // TODO: Replace the vanilla JS Date object with an independent day-of-week check.
		            var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr),
		                weekdayActual = new Date(
		                    parsedInput[0],
		                    parsedInput[1],
		                    parsedInput[2]
		                ).getDay();
		            if (weekdayProvided !== weekdayActual) {
		                getParsingFlags(config).weekdayMismatch = true;
		                config._isValid = false;
		                return false;
		            }
		        }
		        return true;
		    }

		    function calculateOffset(obsOffset, militaryOffset, numOffset) {
		        if (obsOffset) {
		            return obsOffsets[obsOffset];
		        } else if (militaryOffset) {
		            // the only allowed military tz is Z
		            return 0;
		        } else {
		            var hm = parseInt(numOffset, 10),
		                m = hm % 100,
		                h = (hm - m) / 100;
		            return h * 60 + m;
		        }
		    }

		    // date and time from ref 2822 format
		    function configFromRFC2822(config) {
		        var match = rfc2822.exec(preprocessRFC2822(config._i)),
		            parsedArray;
		        if (match) {
		            parsedArray = extractFromRFC2822Strings(
		                match[4],
		                match[3],
		                match[2],
		                match[5],
		                match[6],
		                match[7]
		            );
		            if (!checkWeekday(match[1], parsedArray, config)) {
		                return;
		            }

		            config._a = parsedArray;
		            config._tzm = calculateOffset(match[8], match[9], match[10]);

		            config._d = createUTCDate.apply(null, config._a);
		            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);

		            getParsingFlags(config).rfc2822 = true;
		        } else {
		            config._isValid = false;
		        }
		    }

		    // date from 1) ASP.NET, 2) ISO, 3) RFC 2822 formats, or 4) optional fallback if parsing isn't strict
		    function configFromString(config) {
		        var matched = aspNetJsonRegex.exec(config._i);
		        if (matched !== null) {
		            config._d = new Date(+matched[1]);
		            return;
		        }

		        configFromISO(config);
		        if (config._isValid === false) {
		            delete config._isValid;
		        } else {
		            return;
		        }

		        configFromRFC2822(config);
		        if (config._isValid === false) {
		            delete config._isValid;
		        } else {
		            return;
		        }

		        if (config._strict) {
		            config._isValid = false;
		        } else {
		            // Final attempt, use Input Fallback
		            hooks.createFromInputFallback(config);
		        }
		    }

		    hooks.createFromInputFallback = deprecate(
		        'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
		            'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
		            'discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.',
		        function (config) {
		            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
		        }
		    );

		    // Pick the first defined of two or three arguments.
		    function defaults(a, b, c) {
		        if (a != null) {
		            return a;
		        }
		        if (b != null) {
		            return b;
		        }
		        return c;
		    }

		    function currentDateArray(config) {
		        // hooks is actually the exported moment object
		        var nowValue = new Date(hooks.now());
		        if (config._useUTC) {
		            return [
		                nowValue.getUTCFullYear(),
		                nowValue.getUTCMonth(),
		                nowValue.getUTCDate(),
		            ];
		        }
		        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
		    }

		    // convert an array to a date.
		    // the array should mirror the parameters below
		    // note: all values past the year are optional and will default to the lowest possible value.
		    // [year, month, day , hour, minute, second, millisecond]
		    function configFromArray(config) {
		        var i,
		            date,
		            input = [],
		            currentDate,
		            expectedWeekday,
		            yearToUse;

		        if (config._d) {
		            return;
		        }

		        currentDate = currentDateArray(config);

		        //compute day of the year from weeks and weekdays
		        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
		            dayOfYearFromWeekInfo(config);
		        }

		        //if the day of the year is set, figure out what it is
		        if (config._dayOfYear != null) {
		            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

		            if (
		                config._dayOfYear > daysInYear(yearToUse) ||
		                config._dayOfYear === 0
		            ) {
		                getParsingFlags(config)._overflowDayOfYear = true;
		            }

		            date = createUTCDate(yearToUse, 0, config._dayOfYear);
		            config._a[MONTH] = date.getUTCMonth();
		            config._a[DATE] = date.getUTCDate();
		        }

		        // Default to current date.
		        // * if no year, month, day of month are given, default to today
		        // * if day of month is given, default month and year
		        // * if month is given, default only year
		        // * if year is given, don't default anything
		        for (i = 0; i < 3 && config._a[i] == null; ++i) {
		            config._a[i] = input[i] = currentDate[i];
		        }

		        // Zero out whatever was not defaulted, including time
		        for (; i < 7; i++) {
		            config._a[i] = input[i] =
		                config._a[i] == null ? (i === 2 ? 1 : 0) : config._a[i];
		        }

		        // Check for 24:00:00.000
		        if (
		            config._a[HOUR] === 24 &&
		            config._a[MINUTE] === 0 &&
		            config._a[SECOND] === 0 &&
		            config._a[MILLISECOND] === 0
		        ) {
		            config._nextDay = true;
		            config._a[HOUR] = 0;
		        }

		        config._d = (config._useUTC ? createUTCDate : createDate).apply(
		            null,
		            input
		        );
		        expectedWeekday = config._useUTC
		            ? config._d.getUTCDay()
		            : config._d.getDay();

		        // Apply timezone offset from input. The actual utcOffset can be changed
		        // with parseZone.
		        if (config._tzm != null) {
		            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
		        }

		        if (config._nextDay) {
		            config._a[HOUR] = 24;
		        }

		        // check for mismatching day of week
		        if (
		            config._w &&
		            typeof config._w.d !== 'undefined' &&
		            config._w.d !== expectedWeekday
		        ) {
		            getParsingFlags(config).weekdayMismatch = true;
		        }
		    }

		    function dayOfYearFromWeekInfo(config) {
		        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow, curWeek;

		        w = config._w;
		        if (w.GG != null || w.W != null || w.E != null) {
		            dow = 1;
		            doy = 4;

		            // TODO: We need to take the current isoWeekYear, but that depends on
		            // how we interpret now (local, utc, fixed offset). So create
		            // a now version of current config (take local/utc/offset flags, and
		            // create now).
		            weekYear = defaults(
		                w.GG,
		                config._a[YEAR],
		                weekOfYear(createLocal(), 1, 4).year
		            );
		            week = defaults(w.W, 1);
		            weekday = defaults(w.E, 1);
		            if (weekday < 1 || weekday > 7) {
		                weekdayOverflow = true;
		            }
		        } else {
		            dow = config._locale._week.dow;
		            doy = config._locale._week.doy;

		            curWeek = weekOfYear(createLocal(), dow, doy);

		            weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

		            // Default to current week.
		            week = defaults(w.w, curWeek.week);

		            if (w.d != null) {
		                // weekday -- low day numbers are considered next week
		                weekday = w.d;
		                if (weekday < 0 || weekday > 6) {
		                    weekdayOverflow = true;
		                }
		            } else if (w.e != null) {
		                // local weekday -- counting starts from beginning of week
		                weekday = w.e + dow;
		                if (w.e < 0 || w.e > 6) {
		                    weekdayOverflow = true;
		                }
		            } else {
		                // default to beginning of week
		                weekday = dow;
		            }
		        }
		        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
		            getParsingFlags(config)._overflowWeeks = true;
		        } else if (weekdayOverflow != null) {
		            getParsingFlags(config)._overflowWeekday = true;
		        } else {
		            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
		            config._a[YEAR] = temp.year;
		            config._dayOfYear = temp.dayOfYear;
		        }
		    }

		    // constant that refers to the ISO standard
		    hooks.ISO_8601 = function () {};

		    // constant that refers to the RFC 2822 form
		    hooks.RFC_2822 = function () {};

		    // date from string and format string
		    function configFromStringAndFormat(config) {
		        // TODO: Move this to another part of the creation flow to prevent circular deps
		        if (config._f === hooks.ISO_8601) {
		            configFromISO(config);
		            return;
		        }
		        if (config._f === hooks.RFC_2822) {
		            configFromRFC2822(config);
		            return;
		        }
		        config._a = [];
		        getParsingFlags(config).empty = true;

		        // This array is used to make a Date, either with `new Date` or `Date.UTC`
		        var string = '' + config._i,
		            i,
		            parsedInput,
		            tokens,
		            token,
		            skipped,
		            stringLength = string.length,
		            totalParsedInputLength = 0,
		            era,
		            tokenLen;

		        tokens =
		            expandFormat(config._f, config._locale).match(formattingTokens) || [];
		        tokenLen = tokens.length;
		        for (i = 0; i < tokenLen; i++) {
		            token = tokens[i];
		            parsedInput = (string.match(getParseRegexForToken(token, config)) ||
		                [])[0];
		            if (parsedInput) {
		                skipped = string.substr(0, string.indexOf(parsedInput));
		                if (skipped.length > 0) {
		                    getParsingFlags(config).unusedInput.push(skipped);
		                }
		                string = string.slice(
		                    string.indexOf(parsedInput) + parsedInput.length
		                );
		                totalParsedInputLength += parsedInput.length;
		            }
		            // don't parse if it's not a known token
		            if (formatTokenFunctions[token]) {
		                if (parsedInput) {
		                    getParsingFlags(config).empty = false;
		                } else {
		                    getParsingFlags(config).unusedTokens.push(token);
		                }
		                addTimeToArrayFromToken(token, parsedInput, config);
		            } else if (config._strict && !parsedInput) {
		                getParsingFlags(config).unusedTokens.push(token);
		            }
		        }

		        // add remaining unparsed input length to the string
		        getParsingFlags(config).charsLeftOver =
		            stringLength - totalParsedInputLength;
		        if (string.length > 0) {
		            getParsingFlags(config).unusedInput.push(string);
		        }

		        // clear _12h flag if hour is <= 12
		        if (
		            config._a[HOUR] <= 12 &&
		            getParsingFlags(config).bigHour === true &&
		            config._a[HOUR] > 0
		        ) {
		            getParsingFlags(config).bigHour = undefined;
		        }

		        getParsingFlags(config).parsedDateParts = config._a.slice(0);
		        getParsingFlags(config).meridiem = config._meridiem;
		        // handle meridiem
		        config._a[HOUR] = meridiemFixWrap(
		            config._locale,
		            config._a[HOUR],
		            config._meridiem
		        );

		        // handle era
		        era = getParsingFlags(config).era;
		        if (era !== null) {
		            config._a[YEAR] = config._locale.erasConvertYear(era, config._a[YEAR]);
		        }

		        configFromArray(config);
		        checkOverflow(config);
		    }

		    function meridiemFixWrap(locale, hour, meridiem) {
		        var isPm;

		        if (meridiem == null) {
		            // nothing to do
		            return hour;
		        }
		        if (locale.meridiemHour != null) {
		            return locale.meridiemHour(hour, meridiem);
		        } else if (locale.isPM != null) {
		            // Fallback
		            isPm = locale.isPM(meridiem);
		            if (isPm && hour < 12) {
		                hour += 12;
		            }
		            if (!isPm && hour === 12) {
		                hour = 0;
		            }
		            return hour;
		        } else {
		            // this is not supposed to happen
		            return hour;
		        }
		    }

		    // date from string and array of format strings
		    function configFromStringAndArray(config) {
		        var tempConfig,
		            bestMoment,
		            scoreToBeat,
		            i,
		            currentScore,
		            validFormatFound,
		            bestFormatIsValid = false,
		            configfLen = config._f.length;

		        if (configfLen === 0) {
		            getParsingFlags(config).invalidFormat = true;
		            config._d = new Date(NaN);
		            return;
		        }

		        for (i = 0; i < configfLen; i++) {
		            currentScore = 0;
		            validFormatFound = false;
		            tempConfig = copyConfig({}, config);
		            if (config._useUTC != null) {
		                tempConfig._useUTC = config._useUTC;
		            }
		            tempConfig._f = config._f[i];
		            configFromStringAndFormat(tempConfig);

		            if (isValid(tempConfig)) {
		                validFormatFound = true;
		            }

		            // if there is any input that was not parsed add a penalty for that format
		            currentScore += getParsingFlags(tempConfig).charsLeftOver;

		            //or tokens
		            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

		            getParsingFlags(tempConfig).score = currentScore;

		            if (!bestFormatIsValid) {
		                if (
		                    scoreToBeat == null ||
		                    currentScore < scoreToBeat ||
		                    validFormatFound
		                ) {
		                    scoreToBeat = currentScore;
		                    bestMoment = tempConfig;
		                    if (validFormatFound) {
		                        bestFormatIsValid = true;
		                    }
		                }
		            } else {
		                if (currentScore < scoreToBeat) {
		                    scoreToBeat = currentScore;
		                    bestMoment = tempConfig;
		                }
		            }
		        }

		        extend(config, bestMoment || tempConfig);
		    }

		    function configFromObject(config) {
		        if (config._d) {
		            return;
		        }

		        var i = normalizeObjectUnits(config._i),
		            dayOrDate = i.day === undefined ? i.date : i.day;
		        config._a = map(
		            [i.year, i.month, dayOrDate, i.hour, i.minute, i.second, i.millisecond],
		            function (obj) {
		                return obj && parseInt(obj, 10);
		            }
		        );

		        configFromArray(config);
		    }

		    function createFromConfig(config) {
		        var res = new Moment(checkOverflow(prepareConfig(config)));
		        if (res._nextDay) {
		            // Adding is smart enough around DST
		            res.add(1, 'd');
		            res._nextDay = undefined;
		        }

		        return res;
		    }

		    function prepareConfig(config) {
		        var input = config._i,
		            format = config._f;

		        config._locale = config._locale || getLocale(config._l);

		        if (input === null || (format === undefined && input === '')) {
		            return createInvalid({ nullInput: true });
		        }

		        if (typeof input === 'string') {
		            config._i = input = config._locale.preparse(input);
		        }

		        if (isMoment(input)) {
		            return new Moment(checkOverflow(input));
		        } else if (isDate(input)) {
		            config._d = input;
		        } else if (isArray(format)) {
		            configFromStringAndArray(config);
		        } else if (format) {
		            configFromStringAndFormat(config);
		        } else {
		            configFromInput(config);
		        }

		        if (!isValid(config)) {
		            config._d = null;
		        }

		        return config;
		    }

		    function configFromInput(config) {
		        var input = config._i;
		        if (isUndefined(input)) {
		            config._d = new Date(hooks.now());
		        } else if (isDate(input)) {
		            config._d = new Date(input.valueOf());
		        } else if (typeof input === 'string') {
		            configFromString(config);
		        } else if (isArray(input)) {
		            config._a = map(input.slice(0), function (obj) {
		                return parseInt(obj, 10);
		            });
		            configFromArray(config);
		        } else if (isObject(input)) {
		            configFromObject(config);
		        } else if (isNumber(input)) {
		            // from milliseconds
		            config._d = new Date(input);
		        } else {
		            hooks.createFromInputFallback(config);
		        }
		    }

		    function createLocalOrUTC(input, format, locale, strict, isUTC) {
		        var c = {};

		        if (format === true || format === false) {
		            strict = format;
		            format = undefined;
		        }

		        if (locale === true || locale === false) {
		            strict = locale;
		            locale = undefined;
		        }

		        if (
		            (isObject(input) && isObjectEmpty(input)) ||
		            (isArray(input) && input.length === 0)
		        ) {
		            input = undefined;
		        }
		        // object construction must be done this way.
		        // https://github.com/moment/moment/issues/1423
		        c._isAMomentObject = true;
		        c._useUTC = c._isUTC = isUTC;
		        c._l = locale;
		        c._i = input;
		        c._f = format;
		        c._strict = strict;

		        return createFromConfig(c);
		    }

		    function createLocal(input, format, locale, strict) {
		        return createLocalOrUTC(input, format, locale, strict, false);
		    }

		    var prototypeMin = deprecate(
		            'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
		            function () {
		                var other = createLocal.apply(null, arguments);
		                if (this.isValid() && other.isValid()) {
		                    return other < this ? this : other;
		                } else {
		                    return createInvalid();
		                }
		            }
		        ),
		        prototypeMax = deprecate(
		            'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
		            function () {
		                var other = createLocal.apply(null, arguments);
		                if (this.isValid() && other.isValid()) {
		                    return other > this ? this : other;
		                } else {
		                    return createInvalid();
		                }
		            }
		        );

		    // Pick a moment m from moments so that m[fn](other) is true for all
		    // other. This relies on the function fn to be transitive.
		    //
		    // moments should either be an array of moment objects or an array, whose
		    // first element is an array of moment objects.
		    function pickBy(fn, moments) {
		        var res, i;
		        if (moments.length === 1 && isArray(moments[0])) {
		            moments = moments[0];
		        }
		        if (!moments.length) {
		            return createLocal();
		        }
		        res = moments[0];
		        for (i = 1; i < moments.length; ++i) {
		            if (!moments[i].isValid() || moments[i][fn](res)) {
		                res = moments[i];
		            }
		        }
		        return res;
		    }

		    // TODO: Use [].sort instead?
		    function min() {
		        var args = [].slice.call(arguments, 0);

		        return pickBy('isBefore', args);
		    }

		    function max() {
		        var args = [].slice.call(arguments, 0);

		        return pickBy('isAfter', args);
		    }

		    var now = function () {
		        return Date.now ? Date.now() : +new Date();
		    };

		    var ordering = [
		        'year',
		        'quarter',
		        'month',
		        'week',
		        'day',
		        'hour',
		        'minute',
		        'second',
		        'millisecond',
		    ];

		    function isDurationValid(m) {
		        var key,
		            unitHasDecimal = false,
		            i,
		            orderLen = ordering.length;
		        for (key in m) {
		            if (
		                hasOwnProp(m, key) &&
		                !(
		                    indexOf.call(ordering, key) !== -1 &&
		                    (m[key] == null || !isNaN(m[key]))
		                )
		            ) {
		                return false;
		            }
		        }

		        for (i = 0; i < orderLen; ++i) {
		            if (m[ordering[i]]) {
		                if (unitHasDecimal) {
		                    return false; // only allow non-integers for smallest unit
		                }
		                if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
		                    unitHasDecimal = true;
		                }
		            }
		        }

		        return true;
		    }

		    function isValid$1() {
		        return this._isValid;
		    }

		    function createInvalid$1() {
		        return createDuration(NaN);
		    }

		    function Duration(duration) {
		        var normalizedInput = normalizeObjectUnits(duration),
		            years = normalizedInput.year || 0,
		            quarters = normalizedInput.quarter || 0,
		            months = normalizedInput.month || 0,
		            weeks = normalizedInput.week || normalizedInput.isoWeek || 0,
		            days = normalizedInput.day || 0,
		            hours = normalizedInput.hour || 0,
		            minutes = normalizedInput.minute || 0,
		            seconds = normalizedInput.second || 0,
		            milliseconds = normalizedInput.millisecond || 0;

		        this._isValid = isDurationValid(normalizedInput);

		        // representation for dateAddRemove
		        this._milliseconds =
		            +milliseconds +
		            seconds * 1e3 + // 1000
		            minutes * 6e4 + // 1000 * 60
		            hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
		        // Because of dateAddRemove treats 24 hours as different from a
		        // day when working around DST, we need to store them separately
		        this._days = +days + weeks * 7;
		        // It is impossible to translate months into days without knowing
		        // which months you are are talking about, so we have to store
		        // it separately.
		        this._months = +months + quarters * 3 + years * 12;

		        this._data = {};

		        this._locale = getLocale();

		        this._bubble();
		    }

		    function isDuration(obj) {
		        return obj instanceof Duration;
		    }

		    function absRound(number) {
		        if (number < 0) {
		            return Math.round(-1 * number) * -1;
		        } else {
		            return Math.round(number);
		        }
		    }

		    // compare two arrays, return the number of differences
		    function compareArrays(array1, array2, dontConvert) {
		        var len = Math.min(array1.length, array2.length),
		            lengthDiff = Math.abs(array1.length - array2.length),
		            diffs = 0,
		            i;
		        for (i = 0; i < len; i++) {
		            if (
		                (dontConvert && array1[i] !== array2[i]) ||
		                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))
		            ) {
		                diffs++;
		            }
		        }
		        return diffs + lengthDiff;
		    }

		    // FORMATTING

		    function offset(token, separator) {
		        addFormatToken(token, 0, 0, function () {
		            var offset = this.utcOffset(),
		                sign = '+';
		            if (offset < 0) {
		                offset = -offset;
		                sign = '-';
		            }
		            return (
		                sign +
		                zeroFill(~~(offset / 60), 2) +
		                separator +
		                zeroFill(~~offset % 60, 2)
		            );
		        });
		    }

		    offset('Z', ':');
		    offset('ZZ', '');

		    // PARSING

		    addRegexToken('Z', matchShortOffset);
		    addRegexToken('ZZ', matchShortOffset);
		    addParseToken(['Z', 'ZZ'], function (input, array, config) {
		        config._useUTC = true;
		        config._tzm = offsetFromString(matchShortOffset, input);
		    });

		    // HELPERS

		    // timezone chunker
		    // '+10:00' > ['10',  '00']
		    // '-1530'  > ['-15', '30']
		    var chunkOffset = /([\+\-]|\d\d)/gi;

		    function offsetFromString(matcher, string) {
		        var matches = (string || '').match(matcher),
		            chunk,
		            parts,
		            minutes;

		        if (matches === null) {
		            return null;
		        }

		        chunk = matches[matches.length - 1] || [];
		        parts = (chunk + '').match(chunkOffset) || ['-', 0, 0];
		        minutes = +(parts[1] * 60) + toInt(parts[2]);

		        return minutes === 0 ? 0 : parts[0] === '+' ? minutes : -minutes;
		    }

		    // Return a moment from input, that is local/utc/zone equivalent to model.
		    function cloneWithOffset(input, model) {
		        var res, diff;
		        if (model._isUTC) {
		            res = model.clone();
		            diff =
		                (isMoment(input) || isDate(input)
		                    ? input.valueOf()
		                    : createLocal(input).valueOf()) - res.valueOf();
		            // Use low-level api, because this fn is low-level api.
		            res._d.setTime(res._d.valueOf() + diff);
		            hooks.updateOffset(res, false);
		            return res;
		        } else {
		            return createLocal(input).local();
		        }
		    }

		    function getDateOffset(m) {
		        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
		        // https://github.com/moment/moment/pull/1871
		        return -Math.round(m._d.getTimezoneOffset());
		    }

		    // HOOKS

		    // This function will be called whenever a moment is mutated.
		    // It is intended to keep the offset in sync with the timezone.
		    hooks.updateOffset = function () {};

		    // MOMENTS

		    // keepLocalTime = true means only change the timezone, without
		    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
		    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
		    // +0200, so we adjust the time as needed, to be valid.
		    //
		    // Keeping the time actually adds/subtracts (one hour)
		    // from the actual represented time. That is why we call updateOffset
		    // a second time. In case it wants us to change the offset again
		    // _changeInProgress == true case, then we have to adjust, because
		    // there is no such time in the given timezone.
		    function getSetOffset(input, keepLocalTime, keepMinutes) {
		        var offset = this._offset || 0,
		            localAdjust;
		        if (!this.isValid()) {
		            return input != null ? this : NaN;
		        }
		        if (input != null) {
		            if (typeof input === 'string') {
		                input = offsetFromString(matchShortOffset, input);
		                if (input === null) {
		                    return this;
		                }
		            } else if (Math.abs(input) < 16 && !keepMinutes) {
		                input = input * 60;
		            }
		            if (!this._isUTC && keepLocalTime) {
		                localAdjust = getDateOffset(this);
		            }
		            this._offset = input;
		            this._isUTC = true;
		            if (localAdjust != null) {
		                this.add(localAdjust, 'm');
		            }
		            if (offset !== input) {
		                if (!keepLocalTime || this._changeInProgress) {
		                    addSubtract(
		                        this,
		                        createDuration(input - offset, 'm'),
		                        1,
		                        false
		                    );
		                } else if (!this._changeInProgress) {
		                    this._changeInProgress = true;
		                    hooks.updateOffset(this, true);
		                    this._changeInProgress = null;
		                }
		            }
		            return this;
		        } else {
		            return this._isUTC ? offset : getDateOffset(this);
		        }
		    }

		    function getSetZone(input, keepLocalTime) {
		        if (input != null) {
		            if (typeof input !== 'string') {
		                input = -input;
		            }

		            this.utcOffset(input, keepLocalTime);

		            return this;
		        } else {
		            return -this.utcOffset();
		        }
		    }

		    function setOffsetToUTC(keepLocalTime) {
		        return this.utcOffset(0, keepLocalTime);
		    }

		    function setOffsetToLocal(keepLocalTime) {
		        if (this._isUTC) {
		            this.utcOffset(0, keepLocalTime);
		            this._isUTC = false;

		            if (keepLocalTime) {
		                this.subtract(getDateOffset(this), 'm');
		            }
		        }
		        return this;
		    }

		    function setOffsetToParsedOffset() {
		        if (this._tzm != null) {
		            this.utcOffset(this._tzm, false, true);
		        } else if (typeof this._i === 'string') {
		            var tZone = offsetFromString(matchOffset, this._i);
		            if (tZone != null) {
		                this.utcOffset(tZone);
		            } else {
		                this.utcOffset(0, true);
		            }
		        }
		        return this;
		    }

		    function hasAlignedHourOffset(input) {
		        if (!this.isValid()) {
		            return false;
		        }
		        input = input ? createLocal(input).utcOffset() : 0;

		        return (this.utcOffset() - input) % 60 === 0;
		    }

		    function isDaylightSavingTime() {
		        return (
		            this.utcOffset() > this.clone().month(0).utcOffset() ||
		            this.utcOffset() > this.clone().month(5).utcOffset()
		        );
		    }

		    function isDaylightSavingTimeShifted() {
		        if (!isUndefined(this._isDSTShifted)) {
		            return this._isDSTShifted;
		        }

		        var c = {},
		            other;

		        copyConfig(c, this);
		        c = prepareConfig(c);

		        if (c._a) {
		            other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
		            this._isDSTShifted =
		                this.isValid() && compareArrays(c._a, other.toArray()) > 0;
		        } else {
		            this._isDSTShifted = false;
		        }

		        return this._isDSTShifted;
		    }

		    function isLocal() {
		        return this.isValid() ? !this._isUTC : false;
		    }

		    function isUtcOffset() {
		        return this.isValid() ? this._isUTC : false;
		    }

		    function isUtc() {
		        return this.isValid() ? this._isUTC && this._offset === 0 : false;
		    }

		    // ASP.NET json date format regex
		    var aspNetRegex = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/,
		        // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
		        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
		        // and further modified to allow for strings containing both week and day
		        isoRegex =
		            /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

		    function createDuration(input, key) {
		        var duration = input,
		            // matching against regexp is expensive, do it on demand
		            match = null,
		            sign,
		            ret,
		            diffRes;

		        if (isDuration(input)) {
		            duration = {
		                ms: input._milliseconds,
		                d: input._days,
		                M: input._months,
		            };
		        } else if (isNumber(input) || !isNaN(+input)) {
		            duration = {};
		            if (key) {
		                duration[key] = +input;
		            } else {
		                duration.milliseconds = +input;
		            }
		        } else if ((match = aspNetRegex.exec(input))) {
		            sign = match[1] === '-' ? -1 : 1;
		            duration = {
		                y: 0,
		                d: toInt(match[DATE]) * sign,
		                h: toInt(match[HOUR]) * sign,
		                m: toInt(match[MINUTE]) * sign,
		                s: toInt(match[SECOND]) * sign,
		                ms: toInt(absRound(match[MILLISECOND] * 1000)) * sign, // the millisecond decimal point is included in the match
		            };
		        } else if ((match = isoRegex.exec(input))) {
		            sign = match[1] === '-' ? -1 : 1;
		            duration = {
		                y: parseIso(match[2], sign),
		                M: parseIso(match[3], sign),
		                w: parseIso(match[4], sign),
		                d: parseIso(match[5], sign),
		                h: parseIso(match[6], sign),
		                m: parseIso(match[7], sign),
		                s: parseIso(match[8], sign),
		            };
		        } else if (duration == null) {
		            // checks for null or undefined
		            duration = {};
		        } else if (
		            typeof duration === 'object' &&
		            ('from' in duration || 'to' in duration)
		        ) {
		            diffRes = momentsDifference(
		                createLocal(duration.from),
		                createLocal(duration.to)
		            );

		            duration = {};
		            duration.ms = diffRes.milliseconds;
		            duration.M = diffRes.months;
		        }

		        ret = new Duration(duration);

		        if (isDuration(input) && hasOwnProp(input, '_locale')) {
		            ret._locale = input._locale;
		        }

		        if (isDuration(input) && hasOwnProp(input, '_isValid')) {
		            ret._isValid = input._isValid;
		        }

		        return ret;
		    }

		    createDuration.fn = Duration.prototype;
		    createDuration.invalid = createInvalid$1;

		    function parseIso(inp, sign) {
		        // We'd normally use ~~inp for this, but unfortunately it also
		        // converts floats to ints.
		        // inp may be undefined, so careful calling replace on it.
		        var res = inp && parseFloat(inp.replace(',', '.'));
		        // apply sign while we're at it
		        return (isNaN(res) ? 0 : res) * sign;
		    }

		    function positiveMomentsDifference(base, other) {
		        var res = {};

		        res.months =
		            other.month() - base.month() + (other.year() - base.year()) * 12;
		        if (base.clone().add(res.months, 'M').isAfter(other)) {
		            --res.months;
		        }

		        res.milliseconds = +other - +base.clone().add(res.months, 'M');

		        return res;
		    }

		    function momentsDifference(base, other) {
		        var res;
		        if (!(base.isValid() && other.isValid())) {
		            return { milliseconds: 0, months: 0 };
		        }

		        other = cloneWithOffset(other, base);
		        if (base.isBefore(other)) {
		            res = positiveMomentsDifference(base, other);
		        } else {
		            res = positiveMomentsDifference(other, base);
		            res.milliseconds = -res.milliseconds;
		            res.months = -res.months;
		        }

		        return res;
		    }

		    // TODO: remove 'name' arg after deprecation is removed
		    function createAdder(direction, name) {
		        return function (val, period) {
		            var dur, tmp;
		            //invert the arguments, but complain about it
		            if (period !== null && !isNaN(+period)) {
		                deprecateSimple(
		                    name,
		                    'moment().' +
		                        name +
		                        '(period, number) is deprecated. Please use moment().' +
		                        name +
		                        '(number, period). ' +
		                        'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.'
		                );
		                tmp = val;
		                val = period;
		                period = tmp;
		            }

		            dur = createDuration(val, period);
		            addSubtract(this, dur, direction);
		            return this;
		        };
		    }

		    function addSubtract(mom, duration, isAdding, updateOffset) {
		        var milliseconds = duration._milliseconds,
		            days = absRound(duration._days),
		            months = absRound(duration._months);

		        if (!mom.isValid()) {
		            // No op
		            return;
		        }

		        updateOffset = updateOffset == null ? true : updateOffset;

		        if (months) {
		            setMonth(mom, get(mom, 'Month') + months * isAdding);
		        }
		        if (days) {
		            set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
		        }
		        if (milliseconds) {
		            mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
		        }
		        if (updateOffset) {
		            hooks.updateOffset(mom, days || months);
		        }
		    }

		    var add = createAdder(1, 'add'),
		        subtract = createAdder(-1, 'subtract');

		    function isString(input) {
		        return typeof input === 'string' || input instanceof String;
		    }

		    // type MomentInput = Moment | Date | string | number | (number | string)[] | MomentInputObject | void; // null | undefined
		    function isMomentInput(input) {
		        return (
		            isMoment(input) ||
		            isDate(input) ||
		            isString(input) ||
		            isNumber(input) ||
		            isNumberOrStringArray(input) ||
		            isMomentInputObject(input) ||
		            input === null ||
		            input === undefined
		        );
		    }

		    function isMomentInputObject(input) {
		        var objectTest = isObject(input) && !isObjectEmpty(input),
		            propertyTest = false,
		            properties = [
		                'years',
		                'year',
		                'y',
		                'months',
		                'month',
		                'M',
		                'days',
		                'day',
		                'd',
		                'dates',
		                'date',
		                'D',
		                'hours',
		                'hour',
		                'h',
		                'minutes',
		                'minute',
		                'm',
		                'seconds',
		                'second',
		                's',
		                'milliseconds',
		                'millisecond',
		                'ms',
		            ],
		            i,
		            property,
		            propertyLen = properties.length;

		        for (i = 0; i < propertyLen; i += 1) {
		            property = properties[i];
		            propertyTest = propertyTest || hasOwnProp(input, property);
		        }

		        return objectTest && propertyTest;
		    }

		    function isNumberOrStringArray(input) {
		        var arrayTest = isArray(input),
		            dataTypeTest = false;
		        if (arrayTest) {
		            dataTypeTest =
		                input.filter(function (item) {
		                    return !isNumber(item) && isString(input);
		                }).length === 0;
		        }
		        return arrayTest && dataTypeTest;
		    }

		    function isCalendarSpec(input) {
		        var objectTest = isObject(input) && !isObjectEmpty(input),
		            propertyTest = false,
		            properties = [
		                'sameDay',
		                'nextDay',
		                'lastDay',
		                'nextWeek',
		                'lastWeek',
		                'sameElse',
		            ],
		            i,
		            property;

		        for (i = 0; i < properties.length; i += 1) {
		            property = properties[i];
		            propertyTest = propertyTest || hasOwnProp(input, property);
		        }

		        return objectTest && propertyTest;
		    }

		    function getCalendarFormat(myMoment, now) {
		        var diff = myMoment.diff(now, 'days', true);
		        return diff < -6
		            ? 'sameElse'
		            : diff < -1
		            ? 'lastWeek'
		            : diff < 0
		            ? 'lastDay'
		            : diff < 1
		            ? 'sameDay'
		            : diff < 2
		            ? 'nextDay'
		            : diff < 7
		            ? 'nextWeek'
		            : 'sameElse';
		    }

		    function calendar$1(time, formats) {
		        // Support for single parameter, formats only overload to the calendar function
		        if (arguments.length === 1) {
		            if (!arguments[0]) {
		                time = undefined;
		                formats = undefined;
		            } else if (isMomentInput(arguments[0])) {
		                time = arguments[0];
		                formats = undefined;
		            } else if (isCalendarSpec(arguments[0])) {
		                formats = arguments[0];
		                time = undefined;
		            }
		        }
		        // We want to compare the start of today, vs this.
		        // Getting start-of-today depends on whether we're local/utc/offset or not.
		        var now = time || createLocal(),
		            sod = cloneWithOffset(now, this).startOf('day'),
		            format = hooks.calendarFormat(this, sod) || 'sameElse',
		            output =
		                formats &&
		                (isFunction(formats[format])
		                    ? formats[format].call(this, now)
		                    : formats[format]);

		        return this.format(
		            output || this.localeData().calendar(format, this, createLocal(now))
		        );
		    }

		    function clone() {
		        return new Moment(this);
		    }

		    function isAfter(input, units) {
		        var localInput = isMoment(input) ? input : createLocal(input);
		        if (!(this.isValid() && localInput.isValid())) {
		            return false;
		        }
		        units = normalizeUnits(units) || 'millisecond';
		        if (units === 'millisecond') {
		            return this.valueOf() > localInput.valueOf();
		        } else {
		            return localInput.valueOf() < this.clone().startOf(units).valueOf();
		        }
		    }

		    function isBefore(input, units) {
		        var localInput = isMoment(input) ? input : createLocal(input);
		        if (!(this.isValid() && localInput.isValid())) {
		            return false;
		        }
		        units = normalizeUnits(units) || 'millisecond';
		        if (units === 'millisecond') {
		            return this.valueOf() < localInput.valueOf();
		        } else {
		            return this.clone().endOf(units).valueOf() < localInput.valueOf();
		        }
		    }

		    function isBetween(from, to, units, inclusivity) {
		        var localFrom = isMoment(from) ? from : createLocal(from),
		            localTo = isMoment(to) ? to : createLocal(to);
		        if (!(this.isValid() && localFrom.isValid() && localTo.isValid())) {
		            return false;
		        }
		        inclusivity = inclusivity || '()';
		        return (
		            (inclusivity[0] === '('
		                ? this.isAfter(localFrom, units)
		                : !this.isBefore(localFrom, units)) &&
		            (inclusivity[1] === ')'
		                ? this.isBefore(localTo, units)
		                : !this.isAfter(localTo, units))
		        );
		    }

		    function isSame(input, units) {
		        var localInput = isMoment(input) ? input : createLocal(input),
		            inputMs;
		        if (!(this.isValid() && localInput.isValid())) {
		            return false;
		        }
		        units = normalizeUnits(units) || 'millisecond';
		        if (units === 'millisecond') {
		            return this.valueOf() === localInput.valueOf();
		        } else {
		            inputMs = localInput.valueOf();
		            return (
		                this.clone().startOf(units).valueOf() <= inputMs &&
		                inputMs <= this.clone().endOf(units).valueOf()
		            );
		        }
		    }

		    function isSameOrAfter(input, units) {
		        return this.isSame(input, units) || this.isAfter(input, units);
		    }

		    function isSameOrBefore(input, units) {
		        return this.isSame(input, units) || this.isBefore(input, units);
		    }

		    function diff(input, units, asFloat) {
		        var that, zoneDelta, output;

		        if (!this.isValid()) {
		            return NaN;
		        }

		        that = cloneWithOffset(input, this);

		        if (!that.isValid()) {
		            return NaN;
		        }

		        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

		        units = normalizeUnits(units);

		        switch (units) {
		            case 'year':
		                output = monthDiff(this, that) / 12;
		                break;
		            case 'month':
		                output = monthDiff(this, that);
		                break;
		            case 'quarter':
		                output = monthDiff(this, that) / 3;
		                break;
		            case 'second':
		                output = (this - that) / 1e3;
		                break; // 1000
		            case 'minute':
		                output = (this - that) / 6e4;
		                break; // 1000 * 60
		            case 'hour':
		                output = (this - that) / 36e5;
		                break; // 1000 * 60 * 60
		            case 'day':
		                output = (this - that - zoneDelta) / 864e5;
		                break; // 1000 * 60 * 60 * 24, negate dst
		            case 'week':
		                output = (this - that - zoneDelta) / 6048e5;
		                break; // 1000 * 60 * 60 * 24 * 7, negate dst
		            default:
		                output = this - that;
		        }

		        return asFloat ? output : absFloor(output);
		    }

		    function monthDiff(a, b) {
		        if (a.date() < b.date()) {
		            // end-of-month calculations work correct when the start month has more
		            // days than the end month.
		            return -monthDiff(b, a);
		        }
		        // difference in months
		        var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month()),
		            // b is in (anchor - 1 month, anchor + 1 month)
		            anchor = a.clone().add(wholeMonthDiff, 'months'),
		            anchor2,
		            adjust;

		        if (b - anchor < 0) {
		            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
		            // linear across the month
		            adjust = (b - anchor) / (anchor - anchor2);
		        } else {
		            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
		            // linear across the month
		            adjust = (b - anchor) / (anchor2 - anchor);
		        }

		        //check for negative zero, return zero if negative zero
		        return -(wholeMonthDiff + adjust) || 0;
		    }

		    hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
		    hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

		    function toString() {
		        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
		    }

		    function toISOString(keepOffset) {
		        if (!this.isValid()) {
		            return null;
		        }
		        var utc = keepOffset !== true,
		            m = utc ? this.clone().utc() : this;
		        if (m.year() < 0 || m.year() > 9999) {
		            return formatMoment(
		                m,
		                utc
		                    ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]'
		                    : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ'
		            );
		        }
		        if (isFunction(Date.prototype.toISOString)) {
		            // native implementation is ~50x faster, use it when we can
		            if (utc) {
		                return this.toDate().toISOString();
		            } else {
		                return new Date(this.valueOf() + this.utcOffset() * 60 * 1000)
		                    .toISOString()
		                    .replace('Z', formatMoment(m, 'Z'));
		            }
		        }
		        return formatMoment(
		            m,
		            utc ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ'
		        );
		    }

		    /**
		     * Return a human readable representation of a moment that can
		     * also be evaluated to get a new moment which is the same
		     *
		     * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
		     */
		    function inspect() {
		        if (!this.isValid()) {
		            return 'moment.invalid(/* ' + this._i + ' */)';
		        }
		        var func = 'moment',
		            zone = '',
		            prefix,
		            year,
		            datetime,
		            suffix;
		        if (!this.isLocal()) {
		            func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
		            zone = 'Z';
		        }
		        prefix = '[' + func + '("]';
		        year = 0 <= this.year() && this.year() <= 9999 ? 'YYYY' : 'YYYYYY';
		        datetime = '-MM-DD[T]HH:mm:ss.SSS';
		        suffix = zone + '[")]';

		        return this.format(prefix + year + datetime + suffix);
		    }

		    function format(inputString) {
		        if (!inputString) {
		            inputString = this.isUtc()
		                ? hooks.defaultFormatUtc
		                : hooks.defaultFormat;
		        }
		        var output = formatMoment(this, inputString);
		        return this.localeData().postformat(output);
		    }

		    function from(time, withoutSuffix) {
		        if (
		            this.isValid() &&
		            ((isMoment(time) && time.isValid()) || createLocal(time).isValid())
		        ) {
		            return createDuration({ to: this, from: time })
		                .locale(this.locale())
		                .humanize(!withoutSuffix);
		        } else {
		            return this.localeData().invalidDate();
		        }
		    }

		    function fromNow(withoutSuffix) {
		        return this.from(createLocal(), withoutSuffix);
		    }

		    function to(time, withoutSuffix) {
		        if (
		            this.isValid() &&
		            ((isMoment(time) && time.isValid()) || createLocal(time).isValid())
		        ) {
		            return createDuration({ from: this, to: time })
		                .locale(this.locale())
		                .humanize(!withoutSuffix);
		        } else {
		            return this.localeData().invalidDate();
		        }
		    }

		    function toNow(withoutSuffix) {
		        return this.to(createLocal(), withoutSuffix);
		    }

		    // If passed a locale key, it will set the locale for this
		    // instance.  Otherwise, it will return the locale configuration
		    // variables for this instance.
		    function locale(key) {
		        var newLocaleData;

		        if (key === undefined) {
		            return this._locale._abbr;
		        } else {
		            newLocaleData = getLocale(key);
		            if (newLocaleData != null) {
		                this._locale = newLocaleData;
		            }
		            return this;
		        }
		    }

		    var lang = deprecate(
		        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
		        function (key) {
		            if (key === undefined) {
		                return this.localeData();
		            } else {
		                return this.locale(key);
		            }
		        }
		    );

		    function localeData() {
		        return this._locale;
		    }

		    var MS_PER_SECOND = 1000,
		        MS_PER_MINUTE = 60 * MS_PER_SECOND,
		        MS_PER_HOUR = 60 * MS_PER_MINUTE,
		        MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR;

		    // actual modulo - handles negative numbers (for dates before 1970):
		    function mod$1(dividend, divisor) {
		        return ((dividend % divisor) + divisor) % divisor;
		    }

		    function localStartOfDate(y, m, d) {
		        // the date constructor remaps years 0-99 to 1900-1999
		        if (y < 100 && y >= 0) {
		            // preserve leap years using a full 400 year cycle, then reset
		            return new Date(y + 400, m, d) - MS_PER_400_YEARS;
		        } else {
		            return new Date(y, m, d).valueOf();
		        }
		    }

		    function utcStartOfDate(y, m, d) {
		        // Date.UTC remaps years 0-99 to 1900-1999
		        if (y < 100 && y >= 0) {
		            // preserve leap years using a full 400 year cycle, then reset
		            return Date.UTC(y + 400, m, d) - MS_PER_400_YEARS;
		        } else {
		            return Date.UTC(y, m, d);
		        }
		    }

		    function startOf(units) {
		        var time, startOfDate;
		        units = normalizeUnits(units);
		        if (units === undefined || units === 'millisecond' || !this.isValid()) {
		            return this;
		        }

		        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

		        switch (units) {
		            case 'year':
		                time = startOfDate(this.year(), 0, 1);
		                break;
		            case 'quarter':
		                time = startOfDate(
		                    this.year(),
		                    this.month() - (this.month() % 3),
		                    1
		                );
		                break;
		            case 'month':
		                time = startOfDate(this.year(), this.month(), 1);
		                break;
		            case 'week':
		                time = startOfDate(
		                    this.year(),
		                    this.month(),
		                    this.date() - this.weekday()
		                );
		                break;
		            case 'isoWeek':
		                time = startOfDate(
		                    this.year(),
		                    this.month(),
		                    this.date() - (this.isoWeekday() - 1)
		                );
		                break;
		            case 'day':
		            case 'date':
		                time = startOfDate(this.year(), this.month(), this.date());
		                break;
		            case 'hour':
		                time = this._d.valueOf();
		                time -= mod$1(
		                    time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
		                    MS_PER_HOUR
		                );
		                break;
		            case 'minute':
		                time = this._d.valueOf();
		                time -= mod$1(time, MS_PER_MINUTE);
		                break;
		            case 'second':
		                time = this._d.valueOf();
		                time -= mod$1(time, MS_PER_SECOND);
		                break;
		        }

		        this._d.setTime(time);
		        hooks.updateOffset(this, true);
		        return this;
		    }

		    function endOf(units) {
		        var time, startOfDate;
		        units = normalizeUnits(units);
		        if (units === undefined || units === 'millisecond' || !this.isValid()) {
		            return this;
		        }

		        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

		        switch (units) {
		            case 'year':
		                time = startOfDate(this.year() + 1, 0, 1) - 1;
		                break;
		            case 'quarter':
		                time =
		                    startOfDate(
		                        this.year(),
		                        this.month() - (this.month() % 3) + 3,
		                        1
		                    ) - 1;
		                break;
		            case 'month':
		                time = startOfDate(this.year(), this.month() + 1, 1) - 1;
		                break;
		            case 'week':
		                time =
		                    startOfDate(
		                        this.year(),
		                        this.month(),
		                        this.date() - this.weekday() + 7
		                    ) - 1;
		                break;
		            case 'isoWeek':
		                time =
		                    startOfDate(
		                        this.year(),
		                        this.month(),
		                        this.date() - (this.isoWeekday() - 1) + 7
		                    ) - 1;
		                break;
		            case 'day':
		            case 'date':
		                time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;
		                break;
		            case 'hour':
		                time = this._d.valueOf();
		                time +=
		                    MS_PER_HOUR -
		                    mod$1(
		                        time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
		                        MS_PER_HOUR
		                    ) -
		                    1;
		                break;
		            case 'minute':
		                time = this._d.valueOf();
		                time += MS_PER_MINUTE - mod$1(time, MS_PER_MINUTE) - 1;
		                break;
		            case 'second':
		                time = this._d.valueOf();
		                time += MS_PER_SECOND - mod$1(time, MS_PER_SECOND) - 1;
		                break;
		        }

		        this._d.setTime(time);
		        hooks.updateOffset(this, true);
		        return this;
		    }

		    function valueOf() {
		        return this._d.valueOf() - (this._offset || 0) * 60000;
		    }

		    function unix() {
		        return Math.floor(this.valueOf() / 1000);
		    }

		    function toDate() {
		        return new Date(this.valueOf());
		    }

		    function toArray() {
		        var m = this;
		        return [
		            m.year(),
		            m.month(),
		            m.date(),
		            m.hour(),
		            m.minute(),
		            m.second(),
		            m.millisecond(),
		        ];
		    }

		    function toObject() {
		        var m = this;
		        return {
		            years: m.year(),
		            months: m.month(),
		            date: m.date(),
		            hours: m.hours(),
		            minutes: m.minutes(),
		            seconds: m.seconds(),
		            milliseconds: m.milliseconds(),
		        };
		    }

		    function toJSON() {
		        // new Date(NaN).toJSON() === null
		        return this.isValid() ? this.toISOString() : null;
		    }

		    function isValid$2() {
		        return isValid(this);
		    }

		    function parsingFlags() {
		        return extend({}, getParsingFlags(this));
		    }

		    function invalidAt() {
		        return getParsingFlags(this).overflow;
		    }

		    function creationData() {
		        return {
		            input: this._i,
		            format: this._f,
		            locale: this._locale,
		            isUTC: this._isUTC,
		            strict: this._strict,
		        };
		    }

		    addFormatToken('N', 0, 0, 'eraAbbr');
		    addFormatToken('NN', 0, 0, 'eraAbbr');
		    addFormatToken('NNN', 0, 0, 'eraAbbr');
		    addFormatToken('NNNN', 0, 0, 'eraName');
		    addFormatToken('NNNNN', 0, 0, 'eraNarrow');

		    addFormatToken('y', ['y', 1], 'yo', 'eraYear');
		    addFormatToken('y', ['yy', 2], 0, 'eraYear');
		    addFormatToken('y', ['yyy', 3], 0, 'eraYear');
		    addFormatToken('y', ['yyyy', 4], 0, 'eraYear');

		    addRegexToken('N', matchEraAbbr);
		    addRegexToken('NN', matchEraAbbr);
		    addRegexToken('NNN', matchEraAbbr);
		    addRegexToken('NNNN', matchEraName);
		    addRegexToken('NNNNN', matchEraNarrow);

		    addParseToken(
		        ['N', 'NN', 'NNN', 'NNNN', 'NNNNN'],
		        function (input, array, config, token) {
		            var era = config._locale.erasParse(input, token, config._strict);
		            if (era) {
		                getParsingFlags(config).era = era;
		            } else {
		                getParsingFlags(config).invalidEra = input;
		            }
		        }
		    );

		    addRegexToken('y', matchUnsigned);
		    addRegexToken('yy', matchUnsigned);
		    addRegexToken('yyy', matchUnsigned);
		    addRegexToken('yyyy', matchUnsigned);
		    addRegexToken('yo', matchEraYearOrdinal);

		    addParseToken(['y', 'yy', 'yyy', 'yyyy'], YEAR);
		    addParseToken(['yo'], function (input, array, config, token) {
		        var match;
		        if (config._locale._eraYearOrdinalRegex) {
		            match = input.match(config._locale._eraYearOrdinalRegex);
		        }

		        if (config._locale.eraYearOrdinalParse) {
		            array[YEAR] = config._locale.eraYearOrdinalParse(input, match);
		        } else {
		            array[YEAR] = parseInt(input, 10);
		        }
		    });

		    function localeEras(m, format) {
		        var i,
		            l,
		            date,
		            eras = this._eras || getLocale('en')._eras;
		        for (i = 0, l = eras.length; i < l; ++i) {
		            switch (typeof eras[i].since) {
		                case 'string':
		                    // truncate time
		                    date = hooks(eras[i].since).startOf('day');
		                    eras[i].since = date.valueOf();
		                    break;
		            }

		            switch (typeof eras[i].until) {
		                case 'undefined':
		                    eras[i].until = +Infinity;
		                    break;
		                case 'string':
		                    // truncate time
		                    date = hooks(eras[i].until).startOf('day').valueOf();
		                    eras[i].until = date.valueOf();
		                    break;
		            }
		        }
		        return eras;
		    }

		    function localeErasParse(eraName, format, strict) {
		        var i,
		            l,
		            eras = this.eras(),
		            name,
		            abbr,
		            narrow;
		        eraName = eraName.toUpperCase();

		        for (i = 0, l = eras.length; i < l; ++i) {
		            name = eras[i].name.toUpperCase();
		            abbr = eras[i].abbr.toUpperCase();
		            narrow = eras[i].narrow.toUpperCase();

		            if (strict) {
		                switch (format) {
		                    case 'N':
		                    case 'NN':
		                    case 'NNN':
		                        if (abbr === eraName) {
		                            return eras[i];
		                        }
		                        break;

		                    case 'NNNN':
		                        if (name === eraName) {
		                            return eras[i];
		                        }
		                        break;

		                    case 'NNNNN':
		                        if (narrow === eraName) {
		                            return eras[i];
		                        }
		                        break;
		                }
		            } else if ([name, abbr, narrow].indexOf(eraName) >= 0) {
		                return eras[i];
		            }
		        }
		    }

		    function localeErasConvertYear(era, year) {
		        var dir = era.since <= era.until ? +1 : -1;
		        if (year === undefined) {
		            return hooks(era.since).year();
		        } else {
		            return hooks(era.since).year() + (year - era.offset) * dir;
		        }
		    }

		    function getEraName() {
		        var i,
		            l,
		            val,
		            eras = this.localeData().eras();
		        for (i = 0, l = eras.length; i < l; ++i) {
		            // truncate time
		            val = this.clone().startOf('day').valueOf();

		            if (eras[i].since <= val && val <= eras[i].until) {
		                return eras[i].name;
		            }
		            if (eras[i].until <= val && val <= eras[i].since) {
		                return eras[i].name;
		            }
		        }

		        return '';
		    }

		    function getEraNarrow() {
		        var i,
		            l,
		            val,
		            eras = this.localeData().eras();
		        for (i = 0, l = eras.length; i < l; ++i) {
		            // truncate time
		            val = this.clone().startOf('day').valueOf();

		            if (eras[i].since <= val && val <= eras[i].until) {
		                return eras[i].narrow;
		            }
		            if (eras[i].until <= val && val <= eras[i].since) {
		                return eras[i].narrow;
		            }
		        }

		        return '';
		    }

		    function getEraAbbr() {
		        var i,
		            l,
		            val,
		            eras = this.localeData().eras();
		        for (i = 0, l = eras.length; i < l; ++i) {
		            // truncate time
		            val = this.clone().startOf('day').valueOf();

		            if (eras[i].since <= val && val <= eras[i].until) {
		                return eras[i].abbr;
		            }
		            if (eras[i].until <= val && val <= eras[i].since) {
		                return eras[i].abbr;
		            }
		        }

		        return '';
		    }

		    function getEraYear() {
		        var i,
		            l,
		            dir,
		            val,
		            eras = this.localeData().eras();
		        for (i = 0, l = eras.length; i < l; ++i) {
		            dir = eras[i].since <= eras[i].until ? +1 : -1;

		            // truncate time
		            val = this.clone().startOf('day').valueOf();

		            if (
		                (eras[i].since <= val && val <= eras[i].until) ||
		                (eras[i].until <= val && val <= eras[i].since)
		            ) {
		                return (
		                    (this.year() - hooks(eras[i].since).year()) * dir +
		                    eras[i].offset
		                );
		            }
		        }

		        return this.year();
		    }

		    function erasNameRegex(isStrict) {
		        if (!hasOwnProp(this, '_erasNameRegex')) {
		            computeErasParse.call(this);
		        }
		        return isStrict ? this._erasNameRegex : this._erasRegex;
		    }

		    function erasAbbrRegex(isStrict) {
		        if (!hasOwnProp(this, '_erasAbbrRegex')) {
		            computeErasParse.call(this);
		        }
		        return isStrict ? this._erasAbbrRegex : this._erasRegex;
		    }

		    function erasNarrowRegex(isStrict) {
		        if (!hasOwnProp(this, '_erasNarrowRegex')) {
		            computeErasParse.call(this);
		        }
		        return isStrict ? this._erasNarrowRegex : this._erasRegex;
		    }

		    function matchEraAbbr(isStrict, locale) {
		        return locale.erasAbbrRegex(isStrict);
		    }

		    function matchEraName(isStrict, locale) {
		        return locale.erasNameRegex(isStrict);
		    }

		    function matchEraNarrow(isStrict, locale) {
		        return locale.erasNarrowRegex(isStrict);
		    }

		    function matchEraYearOrdinal(isStrict, locale) {
		        return locale._eraYearOrdinalRegex || matchUnsigned;
		    }

		    function computeErasParse() {
		        var abbrPieces = [],
		            namePieces = [],
		            narrowPieces = [],
		            mixedPieces = [],
		            i,
		            l,
		            eras = this.eras();

		        for (i = 0, l = eras.length; i < l; ++i) {
		            namePieces.push(regexEscape(eras[i].name));
		            abbrPieces.push(regexEscape(eras[i].abbr));
		            narrowPieces.push(regexEscape(eras[i].narrow));

		            mixedPieces.push(regexEscape(eras[i].name));
		            mixedPieces.push(regexEscape(eras[i].abbr));
		            mixedPieces.push(regexEscape(eras[i].narrow));
		        }

		        this._erasRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
		        this._erasNameRegex = new RegExp('^(' + namePieces.join('|') + ')', 'i');
		        this._erasAbbrRegex = new RegExp('^(' + abbrPieces.join('|') + ')', 'i');
		        this._erasNarrowRegex = new RegExp(
		            '^(' + narrowPieces.join('|') + ')',
		            'i'
		        );
		    }

		    // FORMATTING

		    addFormatToken(0, ['gg', 2], 0, function () {
		        return this.weekYear() % 100;
		    });

		    addFormatToken(0, ['GG', 2], 0, function () {
		        return this.isoWeekYear() % 100;
		    });

		    function addWeekYearFormatToken(token, getter) {
		        addFormatToken(0, [token, token.length], 0, getter);
		    }

		    addWeekYearFormatToken('gggg', 'weekYear');
		    addWeekYearFormatToken('ggggg', 'weekYear');
		    addWeekYearFormatToken('GGGG', 'isoWeekYear');
		    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

		    // ALIASES

		    addUnitAlias('weekYear', 'gg');
		    addUnitAlias('isoWeekYear', 'GG');

		    // PRIORITY

		    addUnitPriority('weekYear', 1);
		    addUnitPriority('isoWeekYear', 1);

		    // PARSING

		    addRegexToken('G', matchSigned);
		    addRegexToken('g', matchSigned);
		    addRegexToken('GG', match1to2, match2);
		    addRegexToken('gg', match1to2, match2);
		    addRegexToken('GGGG', match1to4, match4);
		    addRegexToken('gggg', match1to4, match4);
		    addRegexToken('GGGGG', match1to6, match6);
		    addRegexToken('ggggg', match1to6, match6);

		    addWeekParseToken(
		        ['gggg', 'ggggg', 'GGGG', 'GGGGG'],
		        function (input, week, config, token) {
		            week[token.substr(0, 2)] = toInt(input);
		        }
		    );

		    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
		        week[token] = hooks.parseTwoDigitYear(input);
		    });

		    // MOMENTS

		    function getSetWeekYear(input) {
		        return getSetWeekYearHelper.call(
		            this,
		            input,
		            this.week(),
		            this.weekday(),
		            this.localeData()._week.dow,
		            this.localeData()._week.doy
		        );
		    }

		    function getSetISOWeekYear(input) {
		        return getSetWeekYearHelper.call(
		            this,
		            input,
		            this.isoWeek(),
		            this.isoWeekday(),
		            1,
		            4
		        );
		    }

		    function getISOWeeksInYear() {
		        return weeksInYear(this.year(), 1, 4);
		    }

		    function getISOWeeksInISOWeekYear() {
		        return weeksInYear(this.isoWeekYear(), 1, 4);
		    }

		    function getWeeksInYear() {
		        var weekInfo = this.localeData()._week;
		        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
		    }

		    function getWeeksInWeekYear() {
		        var weekInfo = this.localeData()._week;
		        return weeksInYear(this.weekYear(), weekInfo.dow, weekInfo.doy);
		    }

		    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
		        var weeksTarget;
		        if (input == null) {
		            return weekOfYear(this, dow, doy).year;
		        } else {
		            weeksTarget = weeksInYear(input, dow, doy);
		            if (week > weeksTarget) {
		                week = weeksTarget;
		            }
		            return setWeekAll.call(this, input, week, weekday, dow, doy);
		        }
		    }

		    function setWeekAll(weekYear, week, weekday, dow, doy) {
		        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
		            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

		        this.year(date.getUTCFullYear());
		        this.month(date.getUTCMonth());
		        this.date(date.getUTCDate());
		        return this;
		    }

		    // FORMATTING

		    addFormatToken('Q', 0, 'Qo', 'quarter');

		    // ALIASES

		    addUnitAlias('quarter', 'Q');

		    // PRIORITY

		    addUnitPriority('quarter', 7);

		    // PARSING

		    addRegexToken('Q', match1);
		    addParseToken('Q', function (input, array) {
		        array[MONTH] = (toInt(input) - 1) * 3;
		    });

		    // MOMENTS

		    function getSetQuarter(input) {
		        return input == null
		            ? Math.ceil((this.month() + 1) / 3)
		            : this.month((input - 1) * 3 + (this.month() % 3));
		    }

		    // FORMATTING

		    addFormatToken('D', ['DD', 2], 'Do', 'date');

		    // ALIASES

		    addUnitAlias('date', 'D');

		    // PRIORITY
		    addUnitPriority('date', 9);

		    // PARSING

		    addRegexToken('D', match1to2);
		    addRegexToken('DD', match1to2, match2);
		    addRegexToken('Do', function (isStrict, locale) {
		        // TODO: Remove "ordinalParse" fallback in next major release.
		        return isStrict
		            ? locale._dayOfMonthOrdinalParse || locale._ordinalParse
		            : locale._dayOfMonthOrdinalParseLenient;
		    });

		    addParseToken(['D', 'DD'], DATE);
		    addParseToken('Do', function (input, array) {
		        array[DATE] = toInt(input.match(match1to2)[0]);
		    });

		    // MOMENTS

		    var getSetDayOfMonth = makeGetSet('Date', true);

		    // FORMATTING

		    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

		    // ALIASES

		    addUnitAlias('dayOfYear', 'DDD');

		    // PRIORITY
		    addUnitPriority('dayOfYear', 4);

		    // PARSING

		    addRegexToken('DDD', match1to3);
		    addRegexToken('DDDD', match3);
		    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
		        config._dayOfYear = toInt(input);
		    });

		    // HELPERS

		    // MOMENTS

		    function getSetDayOfYear(input) {
		        var dayOfYear =
		            Math.round(
		                (this.clone().startOf('day') - this.clone().startOf('year')) / 864e5
		            ) + 1;
		        return input == null ? dayOfYear : this.add(input - dayOfYear, 'd');
		    }

		    // FORMATTING

		    addFormatToken('m', ['mm', 2], 0, 'minute');

		    // ALIASES

		    addUnitAlias('minute', 'm');

		    // PRIORITY

		    addUnitPriority('minute', 14);

		    // PARSING

		    addRegexToken('m', match1to2);
		    addRegexToken('mm', match1to2, match2);
		    addParseToken(['m', 'mm'], MINUTE);

		    // MOMENTS

		    var getSetMinute = makeGetSet('Minutes', false);

		    // FORMATTING

		    addFormatToken('s', ['ss', 2], 0, 'second');

		    // ALIASES

		    addUnitAlias('second', 's');

		    // PRIORITY

		    addUnitPriority('second', 15);

		    // PARSING

		    addRegexToken('s', match1to2);
		    addRegexToken('ss', match1to2, match2);
		    addParseToken(['s', 'ss'], SECOND);

		    // MOMENTS

		    var getSetSecond = makeGetSet('Seconds', false);

		    // FORMATTING

		    addFormatToken('S', 0, 0, function () {
		        return ~~(this.millisecond() / 100);
		    });

		    addFormatToken(0, ['SS', 2], 0, function () {
		        return ~~(this.millisecond() / 10);
		    });

		    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
		    addFormatToken(0, ['SSSS', 4], 0, function () {
		        return this.millisecond() * 10;
		    });
		    addFormatToken(0, ['SSSSS', 5], 0, function () {
		        return this.millisecond() * 100;
		    });
		    addFormatToken(0, ['SSSSSS', 6], 0, function () {
		        return this.millisecond() * 1000;
		    });
		    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
		        return this.millisecond() * 10000;
		    });
		    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
		        return this.millisecond() * 100000;
		    });
		    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
		        return this.millisecond() * 1000000;
		    });

		    // ALIASES

		    addUnitAlias('millisecond', 'ms');

		    // PRIORITY

		    addUnitPriority('millisecond', 16);

		    // PARSING

		    addRegexToken('S', match1to3, match1);
		    addRegexToken('SS', match1to3, match2);
		    addRegexToken('SSS', match1to3, match3);

		    var token, getSetMillisecond;
		    for (token = 'SSSS'; token.length <= 9; token += 'S') {
		        addRegexToken(token, matchUnsigned);
		    }

		    function parseMs(input, array) {
		        array[MILLISECOND] = toInt(('0.' + input) * 1000);
		    }

		    for (token = 'S'; token.length <= 9; token += 'S') {
		        addParseToken(token, parseMs);
		    }

		    getSetMillisecond = makeGetSet('Milliseconds', false);

		    // FORMATTING

		    addFormatToken('z', 0, 0, 'zoneAbbr');
		    addFormatToken('zz', 0, 0, 'zoneName');

		    // MOMENTS

		    function getZoneAbbr() {
		        return this._isUTC ? 'UTC' : '';
		    }

		    function getZoneName() {
		        return this._isUTC ? 'Coordinated Universal Time' : '';
		    }

		    var proto = Moment.prototype;

		    proto.add = add;
		    proto.calendar = calendar$1;
		    proto.clone = clone;
		    proto.diff = diff;
		    proto.endOf = endOf;
		    proto.format = format;
		    proto.from = from;
		    proto.fromNow = fromNow;
		    proto.to = to;
		    proto.toNow = toNow;
		    proto.get = stringGet;
		    proto.invalidAt = invalidAt;
		    proto.isAfter = isAfter;
		    proto.isBefore = isBefore;
		    proto.isBetween = isBetween;
		    proto.isSame = isSame;
		    proto.isSameOrAfter = isSameOrAfter;
		    proto.isSameOrBefore = isSameOrBefore;
		    proto.isValid = isValid$2;
		    proto.lang = lang;
		    proto.locale = locale;
		    proto.localeData = localeData;
		    proto.max = prototypeMax;
		    proto.min = prototypeMin;
		    proto.parsingFlags = parsingFlags;
		    proto.set = stringSet;
		    proto.startOf = startOf;
		    proto.subtract = subtract;
		    proto.toArray = toArray;
		    proto.toObject = toObject;
		    proto.toDate = toDate;
		    proto.toISOString = toISOString;
		    proto.inspect = inspect;
		    if (typeof Symbol !== 'undefined' && Symbol.for != null) {
		        proto[Symbol.for('nodejs.util.inspect.custom')] = function () {
		            return 'Moment<' + this.format() + '>';
		        };
		    }
		    proto.toJSON = toJSON;
		    proto.toString = toString;
		    proto.unix = unix;
		    proto.valueOf = valueOf;
		    proto.creationData = creationData;
		    proto.eraName = getEraName;
		    proto.eraNarrow = getEraNarrow;
		    proto.eraAbbr = getEraAbbr;
		    proto.eraYear = getEraYear;
		    proto.year = getSetYear;
		    proto.isLeapYear = getIsLeapYear;
		    proto.weekYear = getSetWeekYear;
		    proto.isoWeekYear = getSetISOWeekYear;
		    proto.quarter = proto.quarters = getSetQuarter;
		    proto.month = getSetMonth;
		    proto.daysInMonth = getDaysInMonth;
		    proto.week = proto.weeks = getSetWeek;
		    proto.isoWeek = proto.isoWeeks = getSetISOWeek;
		    proto.weeksInYear = getWeeksInYear;
		    proto.weeksInWeekYear = getWeeksInWeekYear;
		    proto.isoWeeksInYear = getISOWeeksInYear;
		    proto.isoWeeksInISOWeekYear = getISOWeeksInISOWeekYear;
		    proto.date = getSetDayOfMonth;
		    proto.day = proto.days = getSetDayOfWeek;
		    proto.weekday = getSetLocaleDayOfWeek;
		    proto.isoWeekday = getSetISODayOfWeek;
		    proto.dayOfYear = getSetDayOfYear;
		    proto.hour = proto.hours = getSetHour;
		    proto.minute = proto.minutes = getSetMinute;
		    proto.second = proto.seconds = getSetSecond;
		    proto.millisecond = proto.milliseconds = getSetMillisecond;
		    proto.utcOffset = getSetOffset;
		    proto.utc = setOffsetToUTC;
		    proto.local = setOffsetToLocal;
		    proto.parseZone = setOffsetToParsedOffset;
		    proto.hasAlignedHourOffset = hasAlignedHourOffset;
		    proto.isDST = isDaylightSavingTime;
		    proto.isLocal = isLocal;
		    proto.isUtcOffset = isUtcOffset;
		    proto.isUtc = isUtc;
		    proto.isUTC = isUtc;
		    proto.zoneAbbr = getZoneAbbr;
		    proto.zoneName = getZoneName;
		    proto.dates = deprecate(
		        'dates accessor is deprecated. Use date instead.',
		        getSetDayOfMonth
		    );
		    proto.months = deprecate(
		        'months accessor is deprecated. Use month instead',
		        getSetMonth
		    );
		    proto.years = deprecate(
		        'years accessor is deprecated. Use year instead',
		        getSetYear
		    );
		    proto.zone = deprecate(
		        'moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/',
		        getSetZone
		    );
		    proto.isDSTShifted = deprecate(
		        'isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information',
		        isDaylightSavingTimeShifted
		    );

		    function createUnix(input) {
		        return createLocal(input * 1000);
		    }

		    function createInZone() {
		        return createLocal.apply(null, arguments).parseZone();
		    }

		    function preParsePostFormat(string) {
		        return string;
		    }

		    var proto$1 = Locale.prototype;

		    proto$1.calendar = calendar;
		    proto$1.longDateFormat = longDateFormat;
		    proto$1.invalidDate = invalidDate;
		    proto$1.ordinal = ordinal;
		    proto$1.preparse = preParsePostFormat;
		    proto$1.postformat = preParsePostFormat;
		    proto$1.relativeTime = relativeTime;
		    proto$1.pastFuture = pastFuture;
		    proto$1.set = set;
		    proto$1.eras = localeEras;
		    proto$1.erasParse = localeErasParse;
		    proto$1.erasConvertYear = localeErasConvertYear;
		    proto$1.erasAbbrRegex = erasAbbrRegex;
		    proto$1.erasNameRegex = erasNameRegex;
		    proto$1.erasNarrowRegex = erasNarrowRegex;

		    proto$1.months = localeMonths;
		    proto$1.monthsShort = localeMonthsShort;
		    proto$1.monthsParse = localeMonthsParse;
		    proto$1.monthsRegex = monthsRegex;
		    proto$1.monthsShortRegex = monthsShortRegex;
		    proto$1.week = localeWeek;
		    proto$1.firstDayOfYear = localeFirstDayOfYear;
		    proto$1.firstDayOfWeek = localeFirstDayOfWeek;

		    proto$1.weekdays = localeWeekdays;
		    proto$1.weekdaysMin = localeWeekdaysMin;
		    proto$1.weekdaysShort = localeWeekdaysShort;
		    proto$1.weekdaysParse = localeWeekdaysParse;

		    proto$1.weekdaysRegex = weekdaysRegex;
		    proto$1.weekdaysShortRegex = weekdaysShortRegex;
		    proto$1.weekdaysMinRegex = weekdaysMinRegex;

		    proto$1.isPM = localeIsPM;
		    proto$1.meridiem = localeMeridiem;

		    function get$1(format, index, field, setter) {
		        var locale = getLocale(),
		            utc = createUTC().set(setter, index);
		        return locale[field](utc, format);
		    }

		    function listMonthsImpl(format, index, field) {
		        if (isNumber(format)) {
		            index = format;
		            format = undefined;
		        }

		        format = format || '';

		        if (index != null) {
		            return get$1(format, index, field, 'month');
		        }

		        var i,
		            out = [];
		        for (i = 0; i < 12; i++) {
		            out[i] = get$1(format, i, field, 'month');
		        }
		        return out;
		    }

		    // ()
		    // (5)
		    // (fmt, 5)
		    // (fmt)
		    // (true)
		    // (true, 5)
		    // (true, fmt, 5)
		    // (true, fmt)
		    function listWeekdaysImpl(localeSorted, format, index, field) {
		        if (typeof localeSorted === 'boolean') {
		            if (isNumber(format)) {
		                index = format;
		                format = undefined;
		            }

		            format = format || '';
		        } else {
		            format = localeSorted;
		            index = format;
		            localeSorted = false;

		            if (isNumber(format)) {
		                index = format;
		                format = undefined;
		            }

		            format = format || '';
		        }

		        var locale = getLocale(),
		            shift = localeSorted ? locale._week.dow : 0,
		            i,
		            out = [];

		        if (index != null) {
		            return get$1(format, (index + shift) % 7, field, 'day');
		        }

		        for (i = 0; i < 7; i++) {
		            out[i] = get$1(format, (i + shift) % 7, field, 'day');
		        }
		        return out;
		    }

		    function listMonths(format, index) {
		        return listMonthsImpl(format, index, 'months');
		    }

		    function listMonthsShort(format, index) {
		        return listMonthsImpl(format, index, 'monthsShort');
		    }

		    function listWeekdays(localeSorted, format, index) {
		        return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
		    }

		    function listWeekdaysShort(localeSorted, format, index) {
		        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
		    }

		    function listWeekdaysMin(localeSorted, format, index) {
		        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
		    }

		    getSetGlobalLocale('en', {
		        eras: [
		            {
		                since: '0001-01-01',
		                until: +Infinity,
		                offset: 1,
		                name: 'Anno Domini',
		                narrow: 'AD',
		                abbr: 'AD',
		            },
		            {
		                since: '0000-12-31',
		                until: -Infinity,
		                offset: 1,
		                name: 'Before Christ',
		                narrow: 'BC',
		                abbr: 'BC',
		            },
		        ],
		        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
		        ordinal: function (number) {
		            var b = number % 10,
		                output =
		                    toInt((number % 100) / 10) === 1
		                        ? 'th'
		                        : b === 1
		                        ? 'st'
		                        : b === 2
		                        ? 'nd'
		                        : b === 3
		                        ? 'rd'
		                        : 'th';
		            return number + output;
		        },
		    });

		    // Side effect imports

		    hooks.lang = deprecate(
		        'moment.lang is deprecated. Use moment.locale instead.',
		        getSetGlobalLocale
		    );
		    hooks.langData = deprecate(
		        'moment.langData is deprecated. Use moment.localeData instead.',
		        getLocale
		    );

		    var mathAbs = Math.abs;

		    function abs() {
		        var data = this._data;

		        this._milliseconds = mathAbs(this._milliseconds);
		        this._days = mathAbs(this._days);
		        this._months = mathAbs(this._months);

		        data.milliseconds = mathAbs(data.milliseconds);
		        data.seconds = mathAbs(data.seconds);
		        data.minutes = mathAbs(data.minutes);
		        data.hours = mathAbs(data.hours);
		        data.months = mathAbs(data.months);
		        data.years = mathAbs(data.years);

		        return this;
		    }

		    function addSubtract$1(duration, input, value, direction) {
		        var other = createDuration(input, value);

		        duration._milliseconds += direction * other._milliseconds;
		        duration._days += direction * other._days;
		        duration._months += direction * other._months;

		        return duration._bubble();
		    }

		    // supports only 2.0-style add(1, 's') or add(duration)
		    function add$1(input, value) {
		        return addSubtract$1(this, input, value, 1);
		    }

		    // supports only 2.0-style subtract(1, 's') or subtract(duration)
		    function subtract$1(input, value) {
		        return addSubtract$1(this, input, value, -1);
		    }

		    function absCeil(number) {
		        if (number < 0) {
		            return Math.floor(number);
		        } else {
		            return Math.ceil(number);
		        }
		    }

		    function bubble() {
		        var milliseconds = this._milliseconds,
		            days = this._days,
		            months = this._months,
		            data = this._data,
		            seconds,
		            minutes,
		            hours,
		            years,
		            monthsFromDays;

		        // if we have a mix of positive and negative values, bubble down first
		        // check: https://github.com/moment/moment/issues/2166
		        if (
		            !(
		                (milliseconds >= 0 && days >= 0 && months >= 0) ||
		                (milliseconds <= 0 && days <= 0 && months <= 0)
		            )
		        ) {
		            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
		            days = 0;
		            months = 0;
		        }

		        // The following code bubbles up values, see the tests for
		        // examples of what that means.
		        data.milliseconds = milliseconds % 1000;

		        seconds = absFloor(milliseconds / 1000);
		        data.seconds = seconds % 60;

		        minutes = absFloor(seconds / 60);
		        data.minutes = minutes % 60;

		        hours = absFloor(minutes / 60);
		        data.hours = hours % 24;

		        days += absFloor(hours / 24);

		        // convert days to months
		        monthsFromDays = absFloor(daysToMonths(days));
		        months += monthsFromDays;
		        days -= absCeil(monthsToDays(monthsFromDays));

		        // 12 months -> 1 year
		        years = absFloor(months / 12);
		        months %= 12;

		        data.days = days;
		        data.months = months;
		        data.years = years;

		        return this;
		    }

		    function daysToMonths(days) {
		        // 400 years have 146097 days (taking into account leap year rules)
		        // 400 years have 12 months === 4800
		        return (days * 4800) / 146097;
		    }

		    function monthsToDays(months) {
		        // the reverse of daysToMonths
		        return (months * 146097) / 4800;
		    }

		    function as(units) {
		        if (!this.isValid()) {
		            return NaN;
		        }
		        var days,
		            months,
		            milliseconds = this._milliseconds;

		        units = normalizeUnits(units);

		        if (units === 'month' || units === 'quarter' || units === 'year') {
		            days = this._days + milliseconds / 864e5;
		            months = this._months + daysToMonths(days);
		            switch (units) {
		                case 'month':
		                    return months;
		                case 'quarter':
		                    return months / 3;
		                case 'year':
		                    return months / 12;
		            }
		        } else {
		            // handle milliseconds separately because of floating point math errors (issue #1867)
		            days = this._days + Math.round(monthsToDays(this._months));
		            switch (units) {
		                case 'week':
		                    return days / 7 + milliseconds / 6048e5;
		                case 'day':
		                    return days + milliseconds / 864e5;
		                case 'hour':
		                    return days * 24 + milliseconds / 36e5;
		                case 'minute':
		                    return days * 1440 + milliseconds / 6e4;
		                case 'second':
		                    return days * 86400 + milliseconds / 1000;
		                // Math.floor prevents floating point math errors here
		                case 'millisecond':
		                    return Math.floor(days * 864e5) + milliseconds;
		                default:
		                    throw new Error('Unknown unit ' + units);
		            }
		        }
		    }

		    // TODO: Use this.as('ms')?
		    function valueOf$1() {
		        if (!this.isValid()) {
		            return NaN;
		        }
		        return (
		            this._milliseconds +
		            this._days * 864e5 +
		            (this._months % 12) * 2592e6 +
		            toInt(this._months / 12) * 31536e6
		        );
		    }

		    function makeAs(alias) {
		        return function () {
		            return this.as(alias);
		        };
		    }

		    var asMilliseconds = makeAs('ms'),
		        asSeconds = makeAs('s'),
		        asMinutes = makeAs('m'),
		        asHours = makeAs('h'),
		        asDays = makeAs('d'),
		        asWeeks = makeAs('w'),
		        asMonths = makeAs('M'),
		        asQuarters = makeAs('Q'),
		        asYears = makeAs('y');

		    function clone$1() {
		        return createDuration(this);
		    }

		    function get$2(units) {
		        units = normalizeUnits(units);
		        return this.isValid() ? this[units + 's']() : NaN;
		    }

		    function makeGetter(name) {
		        return function () {
		            return this.isValid() ? this._data[name] : NaN;
		        };
		    }

		    var milliseconds = makeGetter('milliseconds'),
		        seconds = makeGetter('seconds'),
		        minutes = makeGetter('minutes'),
		        hours = makeGetter('hours'),
		        days = makeGetter('days'),
		        months = makeGetter('months'),
		        years = makeGetter('years');

		    function weeks() {
		        return absFloor(this.days() / 7);
		    }

		    var round = Math.round,
		        thresholds = {
		            ss: 44, // a few seconds to seconds
		            s: 45, // seconds to minute
		            m: 45, // minutes to hour
		            h: 22, // hours to day
		            d: 26, // days to month/week
		            w: null, // weeks to month
		            M: 11, // months to year
		        };

		    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
		    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
		        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
		    }

		    function relativeTime$1(posNegDuration, withoutSuffix, thresholds, locale) {
		        var duration = createDuration(posNegDuration).abs(),
		            seconds = round(duration.as('s')),
		            minutes = round(duration.as('m')),
		            hours = round(duration.as('h')),
		            days = round(duration.as('d')),
		            months = round(duration.as('M')),
		            weeks = round(duration.as('w')),
		            years = round(duration.as('y')),
		            a =
		                (seconds <= thresholds.ss && ['s', seconds]) ||
		                (seconds < thresholds.s && ['ss', seconds]) ||
		                (minutes <= 1 && ['m']) ||
		                (minutes < thresholds.m && ['mm', minutes]) ||
		                (hours <= 1 && ['h']) ||
		                (hours < thresholds.h && ['hh', hours]) ||
		                (days <= 1 && ['d']) ||
		                (days < thresholds.d && ['dd', days]);

		        if (thresholds.w != null) {
		            a =
		                a ||
		                (weeks <= 1 && ['w']) ||
		                (weeks < thresholds.w && ['ww', weeks]);
		        }
		        a = a ||
		            (months <= 1 && ['M']) ||
		            (months < thresholds.M && ['MM', months]) ||
		            (years <= 1 && ['y']) || ['yy', years];

		        a[2] = withoutSuffix;
		        a[3] = +posNegDuration > 0;
		        a[4] = locale;
		        return substituteTimeAgo.apply(null, a);
		    }

		    // This function allows you to set the rounding function for relative time strings
		    function getSetRelativeTimeRounding(roundingFunction) {
		        if (roundingFunction === undefined) {
		            return round;
		        }
		        if (typeof roundingFunction === 'function') {
		            round = roundingFunction;
		            return true;
		        }
		        return false;
		    }

		    // This function allows you to set a threshold for relative time strings
		    function getSetRelativeTimeThreshold(threshold, limit) {
		        if (thresholds[threshold] === undefined) {
		            return false;
		        }
		        if (limit === undefined) {
		            return thresholds[threshold];
		        }
		        thresholds[threshold] = limit;
		        if (threshold === 's') {
		            thresholds.ss = limit - 1;
		        }
		        return true;
		    }

		    function humanize(argWithSuffix, argThresholds) {
		        if (!this.isValid()) {
		            return this.localeData().invalidDate();
		        }

		        var withSuffix = false,
		            th = thresholds,
		            locale,
		            output;

		        if (typeof argWithSuffix === 'object') {
		            argThresholds = argWithSuffix;
		            argWithSuffix = false;
		        }
		        if (typeof argWithSuffix === 'boolean') {
		            withSuffix = argWithSuffix;
		        }
		        if (typeof argThresholds === 'object') {
		            th = Object.assign({}, thresholds, argThresholds);
		            if (argThresholds.s != null && argThresholds.ss == null) {
		                th.ss = argThresholds.s - 1;
		            }
		        }

		        locale = this.localeData();
		        output = relativeTime$1(this, !withSuffix, th, locale);

		        if (withSuffix) {
		            output = locale.pastFuture(+this, output);
		        }

		        return locale.postformat(output);
		    }

		    var abs$1 = Math.abs;

		    function sign(x) {
		        return (x > 0) - (x < 0) || +x;
		    }

		    function toISOString$1() {
		        // for ISO strings we do not use the normal bubbling rules:
		        //  * milliseconds bubble up until they become hours
		        //  * days do not bubble at all
		        //  * months bubble up until they become years
		        // This is because there is no context-free conversion between hours and days
		        // (think of clock changes)
		        // and also not between days and months (28-31 days per month)
		        if (!this.isValid()) {
		            return this.localeData().invalidDate();
		        }

		        var seconds = abs$1(this._milliseconds) / 1000,
		            days = abs$1(this._days),
		            months = abs$1(this._months),
		            minutes,
		            hours,
		            years,
		            s,
		            total = this.asSeconds(),
		            totalSign,
		            ymSign,
		            daysSign,
		            hmsSign;

		        if (!total) {
		            // this is the same as C#'s (Noda) and python (isodate)...
		            // but not other JS (goog.date)
		            return 'P0D';
		        }

		        // 3600 seconds -> 60 minutes -> 1 hour
		        minutes = absFloor(seconds / 60);
		        hours = absFloor(minutes / 60);
		        seconds %= 60;
		        minutes %= 60;

		        // 12 months -> 1 year
		        years = absFloor(months / 12);
		        months %= 12;

		        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
		        s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '';

		        totalSign = total < 0 ? '-' : '';
		        ymSign = sign(this._months) !== sign(total) ? '-' : '';
		        daysSign = sign(this._days) !== sign(total) ? '-' : '';
		        hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';

		        return (
		            totalSign +
		            'P' +
		            (years ? ymSign + years + 'Y' : '') +
		            (months ? ymSign + months + 'M' : '') +
		            (days ? daysSign + days + 'D' : '') +
		            (hours || minutes || seconds ? 'T' : '') +
		            (hours ? hmsSign + hours + 'H' : '') +
		            (minutes ? hmsSign + minutes + 'M' : '') +
		            (seconds ? hmsSign + s + 'S' : '')
		        );
		    }

		    var proto$2 = Duration.prototype;

		    proto$2.isValid = isValid$1;
		    proto$2.abs = abs;
		    proto$2.add = add$1;
		    proto$2.subtract = subtract$1;
		    proto$2.as = as;
		    proto$2.asMilliseconds = asMilliseconds;
		    proto$2.asSeconds = asSeconds;
		    proto$2.asMinutes = asMinutes;
		    proto$2.asHours = asHours;
		    proto$2.asDays = asDays;
		    proto$2.asWeeks = asWeeks;
		    proto$2.asMonths = asMonths;
		    proto$2.asQuarters = asQuarters;
		    proto$2.asYears = asYears;
		    proto$2.valueOf = valueOf$1;
		    proto$2._bubble = bubble;
		    proto$2.clone = clone$1;
		    proto$2.get = get$2;
		    proto$2.milliseconds = milliseconds;
		    proto$2.seconds = seconds;
		    proto$2.minutes = minutes;
		    proto$2.hours = hours;
		    proto$2.days = days;
		    proto$2.weeks = weeks;
		    proto$2.months = months;
		    proto$2.years = years;
		    proto$2.humanize = humanize;
		    proto$2.toISOString = toISOString$1;
		    proto$2.toString = toISOString$1;
		    proto$2.toJSON = toISOString$1;
		    proto$2.locale = locale;
		    proto$2.localeData = localeData;

		    proto$2.toIsoString = deprecate(
		        'toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)',
		        toISOString$1
		    );
		    proto$2.lang = lang;

		    // FORMATTING

		    addFormatToken('X', 0, 0, 'unix');
		    addFormatToken('x', 0, 0, 'valueOf');

		    // PARSING

		    addRegexToken('x', matchSigned);
		    addRegexToken('X', matchTimestamp);
		    addParseToken('X', function (input, array, config) {
		        config._d = new Date(parseFloat(input) * 1000);
		    });
		    addParseToken('x', function (input, array, config) {
		        config._d = new Date(toInt(input));
		    });

		    //! moment.js

		    hooks.version = '2.29.3';

		    setHookCallback(createLocal);

		    hooks.fn = proto;
		    hooks.min = min;
		    hooks.max = max;
		    hooks.now = now;
		    hooks.utc = createUTC;
		    hooks.unix = createUnix;
		    hooks.months = listMonths;
		    hooks.isDate = isDate;
		    hooks.locale = getSetGlobalLocale;
		    hooks.invalid = createInvalid;
		    hooks.duration = createDuration;
		    hooks.isMoment = isMoment;
		    hooks.weekdays = listWeekdays;
		    hooks.parseZone = createInZone;
		    hooks.localeData = getLocale;
		    hooks.isDuration = isDuration;
		    hooks.monthsShort = listMonthsShort;
		    hooks.weekdaysMin = listWeekdaysMin;
		    hooks.defineLocale = defineLocale;
		    hooks.updateLocale = updateLocale;
		    hooks.locales = listLocales;
		    hooks.weekdaysShort = listWeekdaysShort;
		    hooks.normalizeUnits = normalizeUnits;
		    hooks.relativeTimeRounding = getSetRelativeTimeRounding;
		    hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
		    hooks.calendarFormat = getCalendarFormat;
		    hooks.prototype = proto;

		    // currently HTML5 input type only supports 24-hour formats
		    hooks.HTML5_FMT = {
		        DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm', // <input type="datetime-local" />
		        DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss', // <input type="datetime-local" step="1" />
		        DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS', // <input type="datetime-local" step="0.001" />
		        DATE: 'YYYY-MM-DD', // <input type="date" />
		        TIME: 'HH:mm', // <input type="time" />
		        TIME_SECONDS: 'HH:mm:ss', // <input type="time" step="1" />
		        TIME_MS: 'HH:mm:ss.SSS', // <input type="time" step="0.001" />
		        WEEK: 'GGGG-[W]WW', // <input type="week" />
		        MONTH: 'YYYY-MM', // <input type="month" />
		    };

		    return hooks;

		})));
	} (moment$1));

	(function (module, exports) {
	(function (global, factory) {
		   typeof commonjsRequire === 'function' ? factory(moment$1.exports) :
		   factory(global.moment);
		}(commonjsGlobal, (function (moment) {
		    //! moment.js locale configuration

		    var symbolMap = {
		            1: '۱',
		            2: '۲',
		            3: '۳',
		            4: '۴',
		            5: '۵',
		            6: '۶',
		            7: '۷',
		            8: '۸',
		            9: '۹',
		            0: '۰',
		        },
		        numberMap = {
		            '۱': '1',
		            '۲': '2',
		            '۳': '3',
		            '۴': '4',
		            '۵': '5',
		            '۶': '6',
		            '۷': '7',
		            '۸': '8',
		            '۹': '9',
		            '۰': '0',
		        };

		    var fa = moment.defineLocale('fa', {
		        months: 'ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر'.split(
		            '_'
		        ),
		        monthsShort:
		            'ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر'.split(
		                '_'
		            ),
		        weekdays:
		            'یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_جمعه_شنبه'.split(
		                '_'
		            ),
		        weekdaysShort:
		            'یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_جمعه_شنبه'.split(
		                '_'
		            ),
		        weekdaysMin: 'ی_د_س_چ_پ_ج_ش'.split('_'),
		        weekdaysParseExact: true,
		        longDateFormat: {
		            LT: 'HH:mm',
		            LTS: 'HH:mm:ss',
		            L: 'DD/MM/YYYY',
		            LL: 'D MMMM YYYY',
		            LLL: 'D MMMM YYYY HH:mm',
		            LLLL: 'dddd, D MMMM YYYY HH:mm',
		        },
		        meridiemParse: /قبل از ظهر|بعد از ظهر/,
		        isPM: function (input) {
		            return /بعد از ظهر/.test(input);
		        },
		        meridiem: function (hour, minute, isLower) {
		            if (hour < 12) {
		                return 'قبل از ظهر';
		            } else {
		                return 'بعد از ظهر';
		            }
		        },
		        calendar: {
		            sameDay: '[امروز ساعت] LT',
		            nextDay: '[فردا ساعت] LT',
		            nextWeek: 'dddd [ساعت] LT',
		            lastDay: '[دیروز ساعت] LT',
		            lastWeek: 'dddd [پیش] [ساعت] LT',
		            sameElse: 'L',
		        },
		        relativeTime: {
		            future: 'در %s',
		            past: '%s پیش',
		            s: 'چند ثانیه',
		            ss: '%d ثانیه',
		            m: 'یک دقیقه',
		            mm: '%d دقیقه',
		            h: 'یک ساعت',
		            hh: '%d ساعت',
		            d: 'یک روز',
		            dd: '%d روز',
		            M: 'یک ماه',
		            MM: '%d ماه',
		            y: 'یک سال',
		            yy: '%d سال',
		        },
		        preparse: function (string) {
		            return string
		                .replace(/[۰-۹]/g, function (match) {
		                    return numberMap[match];
		                })
		                .replace(/،/g, ',');
		        },
		        postformat: function (string) {
		            return string
		                .replace(/\d/g, function (match) {
		                    return symbolMap[match];
		                })
		                .replace(/,/g, '،');
		        },
		        dayOfMonthOrdinalParse: /\d{1,2}م/,
		        ordinal: '%dم',
		        week: {
		            dow: 6, // Saturday is the first day of the week.
		            doy: 12, // The week that contains Jan 12th is the first week of the year.
		        },
		    });

		    return fa;

		})));
	} ());

	var jalaliMoment = jMoment;

	var moment = moment$1.exports;


	/************************************
	 Constants
	 ************************************/

	var formattingTokens = /(\[[^\[]*\])|(\\)?j(Mo|MM?M?M?|Do|DDDo|DD?D?D?|w[o|w]?|YYYYY|YYYY|YY|gg(ggg?)?|)|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|SS?S?|X|zz?|ZZ?|.)/g
	    , localFormattingTokens = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g
	    , parseTokenOneOrTwoDigits = /\d\d?/
	    , parseTokenOneToThreeDigits = /\d{1,3}/
	    , parseTokenThreeDigits = /\d{3}/
	    , parseTokenFourDigits = /\d{1,4}/
	    , parseTokenSixDigits = /[+\-]?\d{1,6}/
	    , parseTokenWord = /[0-9]*["a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i
	    , parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/i
	    , parseTokenT = /T/i
	    , parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/

	    , unitAliases = {
	        jm: "jmonth"
	        , jmonths: "jmonth"
	        , jy: "jyear"
	        , jyears: "jyear"
	    }

	    , formatFunctions = {}

	    , ordinalizeTokens = "DDD w M D".split(" ")
	    , paddedTokens = "M D w".split(" ");

	var CalendarSystems = {
	    Jalali: 1,
	    Gregorian: 2,
	};
	var formatTokenFunctions = {
	    jM: function () {
	        return this.jMonth() + 1;
	    },
	    jMMM: function (format) {
	        return this.localeData().jMonthsShort(this, format);
	    },
	    jMMMM: function (format) {
	        return this.localeData().jMonths(this, format);
	    },
	    jD: function () {
	        return this.jDate();
	    },
	    jDDD: function () {
	        return this.jDayOfYear();
	    },
	    jw: function () {
	        return this.jWeek();
	    },
	    jYY: function () {
	        return leftZeroFill(this.jYear() % 100, 2);
	    },
	    jYYYY: function () {
	        return leftZeroFill(this.jYear(), 4);
	    },
	    jYYYYY: function () {
	        return leftZeroFill(this.jYear(), 5);
	    },
	    jgg: function () {
	        return leftZeroFill(this.jWeekYear() % 100, 2);
	    },
	    jgggg: function () {
	        return this.jWeekYear();
	    },
	    jggggg: function () {
	        return leftZeroFill(this.jWeekYear(), 5);
	    }
	};

	function padToken(func, count) {
	    return function (a) {
	        return leftZeroFill(func.call(this, a), count);
	    };
	}
	function ordinalizeToken(func, period) {
	    return function (a) {
	        return this.localeData().ordinal(func.call(this, a), period);
	    };
	}

	(function () {
	    var i;
	    while (ordinalizeTokens.length) {
	        i = ordinalizeTokens.pop();
	        formatTokenFunctions["j" + i + "o"] = ordinalizeToken(formatTokenFunctions["j" + i], i);
	    }
	    while (paddedTokens.length) {
	        i = paddedTokens.pop();
	        formatTokenFunctions["j" + i + i] = padToken(formatTokenFunctions["j" + i], 2);
	    }
	    formatTokenFunctions.jDDDD = padToken(formatTokenFunctions.jDDD, 3);
	}());

	/************************************
	 Helpers
	 ************************************/

	function extend(a, b) {
	    var key;
	    for (key in b)
	        if (b.hasOwnProperty(key)){
	            a[key] = b[key];
	        }
	    return a;
	}

	/**
	 * return a string which length is as much as you need
	 * @param {number} number input
	 * @param {number} targetLength expected length
	 * @example leftZeroFill(5,2) => 05
	 **/
	function leftZeroFill(number, targetLength) {
	    var output = number + "";
	    while (output.length < targetLength){
	        output = "0" + output;
	    }
	    return output;
	}

	/**
	 * determine object is array or not
	 * @param input
	 **/
	function isArray(input) {
	    return Object.prototype.toString.call(input) === "[object Array]";
	}

	/**
	 * Changes any moment Gregorian format to Jalali system format
	 * @param {string} format
	 * @example toJalaliFormat("YYYY/MMM/DD") => "jYYYY/jMMM/jDD"
	 **/
	function toJalaliFormat(format) {
	    for (var i = 0; i < format.length; i++) {
	        if(!i || (format[i-1] !== "j" && format[i-1] !== format[i])) {
	            if (format[i] === "Y" || format[i] === "M" || format[i] === "D" || format[i] === "g") {
	                format = format.slice(0, i) + "j" + format.slice(i);
	            }
	        }
	    }
	    return format;
	}

	/**
	 * Changes any moment Gregorian units to Jalali system units
	 * @param {string} units
	 * @example toJalaliUnit("YYYY/MMM/DD") => "jYYYY/jMMM/jDD"
	 **/
	function toJalaliUnit(units) {
	    switch (units) {
	        case "week" : return "jWeek";
	        case "year" : return "jYear";
	        case "month" : return "jMonth";
	        case "months" : return "jMonths";
	        case "monthName" : return "jMonthsShort";
	        case "monthsShort" : return "jMonthsShort";
	    }
	    return units;
	}

	/**
	 * normalize units to be comparable
	 * @param {string} units
	 **/
	function normalizeUnits(units, momentObj) {
	    if (isJalali(momentObj)) {
	        units = toJalaliUnit(units);
	    }
	     if (units) {
	        var lowered = units.toLowerCase();
	        if (lowered.startsWith('j')) units = unitAliases[lowered] || lowered;
	        // TODO : add unit test
	        if (units === "jday") units = "day";
	        else if (units === "jd") units = "d";
	    }
	    return units;
	}

	/**
	 * set a gregorian date to moment object
	 * @param {string} momentInstance
	 * @param {string} year in gregorian system
	 * @param {string} month in gregorian system
	 * @param {string} day in gregorian system
	 **/
	function setDate(momentInstance, year, month, day) {
	    var d = momentInstance._d;
	    if (momentInstance._isUTC) {
	        /*eslint-disable new-cap*/
	        momentInstance._d = new Date(Date.UTC(year, month, day,
	            d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds()));
	        /*eslint-enable new-cap*/
	    } else {
	        momentInstance._d = new Date(year, month, day,
	            d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
	    }
	}

	function objectCreate(parent) {
	    function F() {}
	    F.prototype = parent;
	    return new F();
	}

	function getPrototypeOf(object) {
	    if (Object.getPrototypeOf){
	        return Object.getPrototypeOf(object);
	    }
	    else if ("".__proto__){
	        return object.__proto__;
	    }
	    else {
	        return object.constructor.prototype;
	    }
	}

	/************************************
	 Languages
	 ************************************/
	extend(getPrototypeOf(moment.localeData()),
	    { _jMonths: [ "Farvardin"
	        , "Ordibehesht"
	        , "Khordaad"
	        , "Tir"
	        , "Mordaad"
	        , "Shahrivar"
	        , "Mehr"
	        , "Aabaan"
	        , "Aazar"
	        , "Dey"
	        , "Bahman"
	        , "Esfand"
	    ]
	        , jMonths: function (m) {
	            if (m) {
	                return this._jMonths[m.jMonth()];
	            } else {
	                return this._jMonths;
	            }
	    }

	        , _jMonthsShort:  [ "Far"
	        , "Ord"
	        , "Kho"
	        , "Tir"
	        , "Amo"
	        , "Sha"
	        , "Meh"
	        , "Aab"
	        , "Aaz"
	        , "Dey"
	        , "Bah"
	        , "Esf"
	    ]
	        , jMonthsShort: function (m) {
	        if (m) {
	            return this._jMonthsShort[m.jMonth()];
	        } else {
	            return this._jMonthsShort;
	        }
	    }

	        , jMonthsParse: function (monthName) {
	        var i
	            , mom
	            , regex;
	        if (!this._jMonthsParse){
	            this._jMonthsParse = [];
	        }
	        for (i = 0; i < 12; i += 1) {
	            // Make the regex if we don"t have it already.
	            if (!this._jMonthsParse[i]) {
	                mom = jMoment([2000, (2 + i) % 12, 25]);
	                regex = "^" + this.jMonths(mom, "") + "|^" + this.jMonthsShort(mom, "");
	                this._jMonthsParse[i] = new RegExp(regex.replace(".", ""), "i");
	            }
	            // Test the regex.
	            if (this._jMonthsParse[i].test(monthName)){
	                return i;
	            }
	        }
	    }
	    }
	);

	/************************************
	 Formatting
	 ************************************/

	function makeFormatFunction(format) {
	    var array = format.match(formattingTokens)
	        , length = array.length
	        , i;

	    for (i = 0; i < length; i += 1){
	        if (formatTokenFunctions[array[i]]){
	            array[i] = formatTokenFunctions[array[i]];
	        }
	    }
	    return function (mom) {
	        var output = "";
	        for (i = 0; i < length; i += 1){
	            output += array[i] instanceof Function ? "[" + array[i].call(mom, format) + "]" : array[i];
	        }
	        return output;
	    };
	}

	/************************************
	 Parsing
	 ************************************/

	function getParseRegexForToken(token, config) {
	    switch (token) {
	        case "jDDDD":
	            return parseTokenThreeDigits;
	        case "jYYYY":
	            return parseTokenFourDigits;
	        case "jYYYYY":
	            return parseTokenSixDigits;
	        case "jDDD":
	            return parseTokenOneToThreeDigits;
	        case "jMMM":
	        case "jMMMM":
	            return parseTokenWord;
	        case "jMM":
	        case "jDD":
	        case "jYY":
	        case "jM":
	        case "jD":
	            return parseTokenOneOrTwoDigits;
	        case "DDDD":
	            return parseTokenThreeDigits;
	        case "YYYY":
	            return parseTokenFourDigits;
	        case "YYYYY":
	            return parseTokenSixDigits;
	        case "S":
	        case "SS":
	        case "SSS":
	        case "DDD":
	            return parseTokenOneToThreeDigits;
	        case "MMM":
	        case "MMMM":
	        case "dd":
	        case "ddd":
	        case "dddd":
	            return parseTokenWord;
	        case "a":
	        case "A":
	            return moment.localeData(config._l)._meridiemParse;
	        case "X":
	            return parseTokenTimestampMs;
	        case "Z":
	        case "ZZ":
	            return parseTokenTimezone;
	        case "T":
	            return parseTokenT;
	        case "MM":
	        case "DD":
	        case "YY":
	        case "HH":
	        case "hh":
	        case "mm":
	        case "ss":
	        case "M":
	        case "D":
	        case "d":
	        case "H":
	        case "h":
	        case "m":
	        case "s":
	            return parseTokenOneOrTwoDigits;
	        default:
	            return new RegExp(token.replace("\\", ""));
	    }
	}
	function isNull(variable) {
	    return variable === null || variable === undefined;
	}
	function addTimeToArrayFromToken(token, input, config) {
	    var a
	        , datePartArray = config._a;

	    switch (token) {
	        case "jM":
	        case "jMM":
	            datePartArray[1] = isNull(input)? 0 : ~~input - 1;
	            break;
	        case "jMMM":
	        case "jMMMM":
	            a = moment.localeData(config._l).jMonthsParse(input);
	            if (!isNull(a)){
	                datePartArray[1] = a;
	            }
	            else {
	                config._isValid = false;
	            }
	            break;
	        case "jD":
	        case "jDD":
	        case "jDDD":
	        case "jDDDD":
	            if (!isNull(input)){
	                datePartArray[2] = ~~input;
	            }
	            break;
	        case "jYY":
	            datePartArray[0] = ~~input + (~~input > 47 ? 1300 : 1400);
	            break;
	        case "jYYYY":
	        case "jYYYYY":
	            datePartArray[0] = ~~input;
	    }
	    if (isNull(input)) {
	        config._isValid = false;
	    }
	}

	function dateFromArray(config) {
	    var g
	        , j
	        , jy = config._a[0]
	        , jm = config._a[1]
	        , jd = config._a[2];

	    if (isNull(jy) && isNull(jm) && isNull(jd)){
	        return;
	    }
	    jy = !isNull(jy) ? jy : 0;
	    jm = !isNull(jm) ? jm : 0;
	    jd = !isNull(jd) ? jd : 1;
	    if (jd < 1 || jd > jMoment.jDaysInMonth(jy, jm) || jm < 0 || jm > 11){
	        config._isValid = false;
	    }
	    g = toGregorian(jy, jm, jd);
	    j = toJalali(g.gy, g.gm, g.gd);
	    config._jDiff = 0;
	    if (~~j.jy !== jy){
	        config._jDiff += 1;
	    }
	    if (~~j.jm !== jm){
	        config._jDiff += 1;
	    }
	    if (~~j.jd !== jd){
	        config._jDiff += 1;
	    }
	    return [g.gy, g.gm, g.gd];
	}

	function makeDateFromStringAndFormat(config) {
	    var tokens = config._f.match(formattingTokens)
	        , string = config._i + ""
	        , len = tokens.length
	        , i
	        , token
	        , parsedInput;

	    config._a = [];

	    for (i = 0; i < len; i += 1) {
	        token = tokens[i];
	        parsedInput = (getParseRegexForToken(token, config).exec(string) || [])[0];
	        if (parsedInput){
	            string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
	        }
	        if (formatTokenFunctions[token]){
	            addTimeToArrayFromToken(token, parsedInput, config);
	        }
	    }
	    if (string){
	        config._il = string;
	    }
	    return dateFromArray(config);
	}

	function makeDateFromStringAndArray(config, utc) {
	    var len = config._f.length
	        , i
	        , format
	        , tempMoment
	        , bestMoment
	        , currentScore
	        , scoreToBeat;

	    if (len === 0) {
	        return makeMoment(new Date(NaN));
	    }

	    for (i = 0; i < len; i += 1) {
	        format = config._f[i];
	        currentScore = 0;
	        tempMoment = makeMoment(config._i, format, config._l, config._strict, utc);

	        if (!tempMoment.isValid()){
	            continue;
	        }

	        // currentScore = compareArrays(tempMoment._a, tempMoment.toArray())
	        currentScore += tempMoment._jDiff;
	        if (tempMoment._il){
	            currentScore += tempMoment._il.length;
	        }
	        if (isNull(scoreToBeat) || currentScore < scoreToBeat) {
	            scoreToBeat = currentScore;
	            bestMoment = tempMoment;
	        }
	    }

	    return bestMoment;
	}

	function removeParsedTokens(config) {
	    var string = config._i + ""
	        , input = ""
	        , format = ""
	        , array = config._f.match(formattingTokens)
	        , len = array.length
	        , i
	        , match
	        , parsed;

	    for (i = 0; i < len; i += 1) {
	        match = array[i];
	        parsed = (getParseRegexForToken(match, config).exec(string) || [])[0];
	        if (parsed){
	            string = string.slice(string.indexOf(parsed) + parsed.length);
	        }
	        if (!(formatTokenFunctions[match] instanceof Function)) {
	            format += match;
	            if (parsed){
	                input += parsed;
	            }
	        }
	    }
	    config._i = input;
	    config._f = format;
	}

	/************************************
	 Week of Year
	 ************************************/

	function jWeekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
	    var end = firstDayOfWeekOfYear - firstDayOfWeek
	        , daysToDayOfWeek = firstDayOfWeekOfYear - mom.day()
	        , adjustedMoment;

	    if (daysToDayOfWeek > end) {
	        daysToDayOfWeek -= 7;
	    }
	    if (daysToDayOfWeek < end - 7) {
	        daysToDayOfWeek += 7;
	    }
	    adjustedMoment = jMoment(mom).add(daysToDayOfWeek, "d");
	    return  { week: Math.ceil(adjustedMoment.jDayOfYear() / 7)
	        , year: adjustedMoment.jYear()
	    };
	}

	/************************************
	 Top Level Functions
	 ************************************/
	function isJalali (momentObj) {
	    return momentObj &&
	        (momentObj.calSystem === CalendarSystems.Jalali) ||
	        (moment.justUseJalali && momentObj.calSystem !== CalendarSystems.Gregorian);
	}
	function isInputJalali(format, momentObj, input) {
	    return (moment.justUseJalali || (momentObj && momentObj.calSystem === CalendarSystems.Jalali))
	}
	function makeMoment(input, format, lang, strict, utc) {
	    if (typeof lang === "boolean") {
	        utc = utc || strict;
	        strict = lang;
	        lang = undefined;
	    }
	    if (moment.ISO_8601 === format) {
	        format = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
	    }
	    const inputIsJalali = isInputJalali(format, this);
	    // var itsJalaliDate = (isJalali(this));
	    if(input && (typeof input === "string") && !format && inputIsJalali && !moment.useGregorianParser) {
	        input = input.replace(/\//g,"-");
	        if(/\d{4}\-\d{2}\-\d{2}/.test(input)) {
	            format = "jYYYY-jMM-jDD";
	        } else if (/\d{4}\-\d{2}\-\d{1}/.test(input)) {
	            format = "jYYYY-jMM-jD";
	        } else if (/\d{4}\-\d{1}\-\d{1}/.test(input)) {
	            format = "jYYYY-jM-jD";
	        } else if (/\d{4}\-\d{1}\-\d{2}/.test(input)) {
	            format = "jYYYY-jM-jDD";
	        } else if (/\d{4}\-W\d{2}\-\d{2}/.test(input)) {
	            format = "jYYYY-jW-jDD";
	        } else if (/\d{4}\-\d{3}/.test(input)) {
	            format = "jYYYY-jDDD";
	        } else if (/\d{8}/.test(input)) {
	            format = "jYYYYjMMjDD";
	        } else if (/\d{4}W\d{2}\d{1}/.test(input)) {
	            format = "jYYYYjWWjD";
	        } else if (/\d{4}W\d{2}/.test(input)) {
	            format = "jYYYYjWW";
	        } else if (/\d{4}\d{3}/.test(input)) {
	            format = "jYYYYjDDD";
	        }
	    }
	    if (format && inputIsJalali){
	        format = toJalaliFormat(format);
	    }
	    if (format && typeof format === "string"){
	        format = fixFormat(format, moment);
	    }

	    var config =
	        { _i: input
	            , _f: format
	            , _l: lang
	            , _strict: strict
	            , _isUTC: utc
	        }
	        , date
	        , m
	        , jm
	        , origInput = input
	        , origFormat = format;
	    if (format) {
	        if (isArray(format)) {
	            return makeDateFromStringAndArray(config, utc);
	        } else {
	            date = makeDateFromStringAndFormat(config);
	            removeParsedTokens(config);
	            if (date) {
	                format = "YYYY-MM-DD-" + config._f;
	                input = leftZeroFill(date[0], 4) + "-"
	                    + leftZeroFill(date[1] + 1, 2) + "-"
	                    + leftZeroFill(date[2], 2) + "-"
	                    + config._i;
	            }
	        }
	    }
	    if (utc){
	        m = moment.utc(input, format, lang, strict);
	    }
	    else {
	        m = moment(input, format, lang, strict);
	    }
	    if (config._isValid === false || (input && input._isAMomentObject && !input._isValid)){
	        m._isValid = false;
	    }
	    m._jDiff = config._jDiff || 0;
	    jm = objectCreate(jMoment.fn);
	    extend(jm, m);
	    if (strict && jm.isValid()) {
	        jm._isValid = jm.format(origFormat) === origInput;
	    }
	    if (input && input.calSystem) {
	        jm.calSystem = input.calSystem;
	    }
	    return jm;
	}

	function jMoment(input, format, lang, strict) {
	    return makeMoment(input, format, lang, strict, false);
	}

	extend(jMoment, moment);
	jMoment.fn = objectCreate(moment.fn);

	jMoment.utc = function (input, format, lang, strict) {
	    return makeMoment(input, format, lang, strict, true);
	};

	jMoment.unix = function (input) {
	    return makeMoment(input * 1000);
	};

	/************************************
	 jMoment Prototype
	 ************************************/

	function fixFormat(format, _moment) {
	    var i = 5;
	    var replace = function (input) {
	        return _moment.localeData().longDateFormat(input) || input;
	    };
	    while (i > 0 && localFormattingTokens.test(format)) {
	        i -= 1;
	        format = format.replace(localFormattingTokens, replace);
	    }
	    return format;
	}

	jMoment.fn.format = function (format) {
		format = format || jMoment.defaultFormat;
	    if (format) {
	        if (isJalali(this)) {
	            format = toJalaliFormat(format);
	        }
	        format = fixFormat(format, this);

	        if (!formatFunctions[format]) {
	            formatFunctions[format] = makeFormatFunction(format);
	        }
	        format = formatFunctions[format](this);
	    }
	    var formatted = moment.fn.format.call(this, format);
	    return formatted;
	};

	jMoment.fn.year = function (input) {
	    if (isJalali(this)) return jMoment.fn.jYear.call(this,input);
	    else return moment.fn.year.call(this, input);
	};
	jMoment.fn.jYear = function (input) {
	    var lastDay
	        , j
	        , g;
	    if (typeof input === "number") {
	        j = getJalaliOf(this);
	        lastDay = Math.min(j.jd, jMoment.jDaysInMonth(input, j.jm));
	        g = toGregorian(input, j.jm, lastDay);
	        setDate(this, g.gy, g.gm, g.gd);
	        moment.updateOffset(this);
	        return this;
	    } else {
	        return getJalaliOf(this).jy;
	    }
	};

	jMoment.fn.month = function (input) {
	    if (isJalali(this)) return jMoment.fn.jMonth.call(this,input);
	    else return moment.fn.month.call(this, input);
	};
	jMoment.fn.jMonth = function (input) {
	    var lastDay
	        , j
	        , g;
	    if (!isNull(input)) {
	        if (typeof input === "string") {
	            input = this.localeData().jMonthsParse(input);
	            if (typeof input !== "number"){
	                return this;
	            }
	        }
	        j = getJalaliOf(this);
	        lastDay = Math.min(j.jd, jMoment.jDaysInMonth(j.jy, input));
	        this.jYear(j.jy + div(input, 12));
	        input = mod(input, 12);
	        if (input < 0) {
	            input += 12;
	            this.jYear(this.jYear() - 1);
	        }
	        g = toGregorian(this.jYear(), input, lastDay);
	        setDate(this, g.gy, g.gm, g.gd);
	        moment.updateOffset(this);
	        return this;
	    } else {
	        return getJalaliOf(this).jm;
	    }
	};

	jMoment.fn.date = function (input) {
	    if (isJalali(this)) return jMoment.fn.jDate.call(this,input);
	    else return moment.fn.date.call(this, input);
	};
	function getJalaliOf (momentObj) {
	    var d = momentObj._d;
	    if (momentObj._isUTC) {
	        return toJalali(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
	    } else {
	        return toJalali(d.getFullYear(), d.getMonth(), d.getDate());
	    }
	}
	jMoment.fn.jDate = function (input) {
	    var j
	        , g;
	    if (typeof input === "number") {
	        j = getJalaliOf(this);
	        g = toGregorian(j.jy, j.jm, input);
	        setDate(this, g.gy, g.gm, g.gd);
	        moment.updateOffset(this);
	        return this;
	    } else {
	        return getJalaliOf(this).jd;
	    }
	};

	jMoment.fn.jDay = function (input) {
	    if (typeof input === "number") {
	        return moment.fn.day.call(this, input - 1);
	    } else {
	        return (moment.fn.day.call(this) + 1) % 7;
	    }
	};
	jMoment.fn.diff = function (input, unitOfTime, asFloat) {
	    //code taken and adjusted for jalali calendar from original moment diff module https://github.com/moment/moment/blob/develop/src/lib/moment/diff.js
	    if (!isJalali(this))
	        return moment.fn.diff.call(this, input, unitOfTime, asFloat);

	    var output;
	    switch (unitOfTime) {
	        case "year":
	            output = monthDiff(this, input) / 12;
	            break;
	        case "month":
	            output = monthDiff(this, input);
	            break;
	        case "quarter":
	            output = monthDiff(this, input) / 3;
	            break;
	        default:
	            output = moment.fn.diff.call(this, input, unitOfTime, asFloat);
	    }

	    return asFloat ? output : (output < 0 ? Math.ceil(output) || 0 : Math.floor(output));

	    function monthDiff(a, b) {
	        if (a.date() < b.date()) {
	            // end-of-month calculations work correct when the start month has more
	            // days than the end month.
	            return -monthDiff(b, a);
	        }
	        // difference in months
	        var wholeMonthDiff = (b.jYear() - a.jYear()) * 12 + (b.jMonth() - a.jMonth()),
	            // b is in (anchor - 1 month, anchor + 1 month)
	            anchor = a.clone().add(wholeMonthDiff, "months"),
	            anchor2,
	            adjust;

	        if (b - anchor < 0) {
	            anchor2 = a.clone().add(wholeMonthDiff - 1, "months");
	            // linear across the month
	            adjust = (b - anchor) / (anchor - anchor2);
	        } else {
	            anchor2 = a.clone().add(wholeMonthDiff + 1, "months");
	            // linear across the month
	            adjust = (b - anchor) / (anchor2 - anchor);
	        }

	        //check for negative zero, return zero if negative zero
	        return -(wholeMonthDiff + adjust) || 0;
	    }
	};

	jMoment.fn.dayOfYear = function (input) {
	    if (isJalali(this)) return jMoment.fn.jDayOfYear.call(this,input);
	    else return moment.fn.dayOfYear.call(this, input);
	};
	jMoment.fn.jDayOfYear = function (input) {
	    var dayOfYear = Math.round((jMoment(this).startOf("day") - jMoment(this).startOf("jYear")) / 864e5) + 1;
	    return isNull(input) ? dayOfYear : this.add(input - dayOfYear, "d");
	};

	jMoment.fn.week = function (input) {
	    if (isJalali(this)) return jMoment.fn.jWeek.call(this,input);
	    else return moment.fn.week.call(this, input);
	};
	jMoment.fn.jWeek = function (input) {
	    var week = jWeekOfYear(this, 6, 12).week;
	    return isNull(input) ? week : this.add((input - week) * 7, "d");
	};

	jMoment.fn.weekYear = function (input) {
	    if (isJalali(this)) return jMoment.fn.jWeekYear.call(this,input);
	    else return moment.fn.weekYear.call(this, input);
	};
	jMoment.fn.jWeekYear = function (input) {
	    var year = jWeekOfYear(this, 6, 12).year;
	    return isNull(input) ? year : this.add(input - year, "jyear");
	};

	jMoment.fn.add = function (val, units) {
	    var temp;
	    if (!isNull(units) && !isNaN(+units)) {
	        temp = val;
	        val = units;
	        units = temp;
	    }
	    units = normalizeUnits(units, this);
	    if (units === 'jweek' || units==='isoweek') { units = 'week'; }
	    if (units === "jyear") {
	        this.jYear(this.jYear() + val);
	    } else if (units === "jmonth") {
	        this.jMonth(this.jMonth() + val);
	    } else {
	        moment.fn.add.call(this, val, units);
	    }
	    return this;
	};

	jMoment.fn.subtract = function (val, units) {
	    var temp;
	    if (!isNull(units) && !isNaN(+units)) {
	        temp = val;
	        val = units;
	        units = temp;
	    }
	    units = normalizeUnits(units, this);
	    if (units === "jyear") {
	        this.jYear(this.jYear() - val);
	    } else if (units === "jmonth") {
	        this.jMonth(this.jMonth() - val);
	    } else {
	        moment.fn.subtract.call(this, val, units);
	    }
	    return this;
	};

	jMoment.fn.startOf = function (units) {
	    var nunit = normalizeUnits(units, this);
	    if( nunit === "jweek"){
	        return this.startOf("day").subtract(this.jDay() , "day");
	    }
	    if (nunit === "jyear") {
	        this.jMonth(0);
	        nunit = "jmonth";
	    }
	    if (nunit === "jmonth") {
	        this.jDate(1);
	        nunit = "day";
	    }
	    if (nunit === "day") {
	        this.hours(0);
	        this.minutes(0);
	        this.seconds(0);
	        this.milliseconds(0);
	        return this;
	    } else {
	        return moment.fn.startOf.call(this, units);
	    }
	};

	jMoment.fn.endOf = function (units) {
	    units = normalizeUnits(units, this);
	    if (units === undefined || units === "milisecond") {
	        return this;
	    }
	    return this.startOf(units).add(1, units).subtract(1, "ms");
	};

	jMoment.fn.isSame = function (other, units) {
	    units = normalizeUnits(units, this);
	    if (units === "jyear" || units === "jmonth") {
	        return moment.fn.isSame.call(this.clone().startOf(units), other.clone().startOf(units));
	    }
	    return moment.fn.isSame.call(this, other, units);
	};

	jMoment.fn.isBefore = function (other, units) {
	    units = normalizeUnits(units, this);
	    if (units === "jyear" || units === "jmonth") {
	        return moment.fn.isBefore.call(this.clone().startOf(units), other.clone().startOf(units));
	    }
	    return moment.fn.isBefore.call(this, other, units);
	};

	jMoment.fn.isAfter = function (other, units) {
	    units = normalizeUnits(units, this);
	    if (units === "jyear" || units === "jmonth") {
	        return moment.fn.isAfter.call(this.clone().startOf(units), other.clone().startOf(units));
	    }
	    return moment.fn.isAfter.call(this, other, units);
	};

	jMoment.fn.clone = function () {
	    return jMoment(this);
	};

	jMoment.fn.doAsJalali = function () {
	    this.calSystem = CalendarSystems.Jalali;
	    return this;
	};
	jMoment.fn.doAsGregorian = function () {
	    this.calSystem = CalendarSystems.Gregorian;
	    return this;
	};

	jMoment.fn.jYears = jMoment.fn.jYear;
	jMoment.fn.jMonths = jMoment.fn.jMonth;
	jMoment.fn.jDates = jMoment.fn.jDate;
	jMoment.fn.jWeeks = jMoment.fn.jWeek;

	jMoment.fn.daysInMonth = function() {
	    if (isJalali(this)) {
	        return this.jDaysInMonth();
	    }
	    return moment.fn.daysInMonth.call(this);
	};
	jMoment.fn.jDaysInMonth = function () {
	    var month = this.jMonth();
	    var year = this.jYear();
	    if (month < 6) {
	        return 31;
	    } else if (month < 11) {
	        return 30;
	    } else if (jMoment.jIsLeapYear(year)) {
	        return 30;
	    } else {
	        return 29;
	    }
	};

	jMoment.fn.isLeapYear = function() {
	    if (isJalali(this)) {
	        return this.jIsLeapYear();
	    }
	    return moment.fn.isLeapYear.call(this);
	};
	jMoment.fn.jIsLeapYear = function () {
	    var year = this.jYear();
	    return isLeapJalaliYear(year);
	};
	jMoment.fn.locale = function(locale) {
	    if (locale && moment.changeCalendarSystemByItsLocale) {
	        if (locale === "fa") {
	            this.doAsJalali();
	        } else {
	            this.doAsGregorian();
	        }
	    }
	    return moment.fn.locale.call(this, locale);
	};
	/************************************
	 jMoment Statics
	 ************************************/
	jMoment.locale = function(locale, options) {
	    if (locale && moment.changeCalendarSystemByItsLocale) {
	        if (locale === "fa") {
	            this.useJalaliSystemPrimarily(options);
	        } else {
	            this.useJalaliSystemSecondary();
	        }
	    }
	    return moment.locale.call(this, locale);
	};

	jMoment.from = function(date, locale, format) {
	    var lastLocale = jMoment.locale();
	    jMoment.locale(locale);
	    var m = jMoment(date, format);
	    m.locale(lastLocale);
	    jMoment.locale(lastLocale);
	    return m;
	};

	jMoment.bindCalendarSystemAndLocale = function () {
	    moment.changeCalendarSystemByItsLocale = true;
	};
	jMoment.unBindCalendarSystemAndLocale = function () {
	    moment.changeCalendarSystemByItsLocale = false;
	};

	jMoment.useJalaliSystemPrimarily = function (options) {
	    moment.justUseJalali = true;
	    var useGregorianParser = false;
	    if (options) {
	        useGregorianParser = options.useGregorianParser;
	    }
	    moment.useGregorianParser = useGregorianParser;
	};
	jMoment.useJalaliSystemSecondary = function () {
	    moment.justUseJalali = false;
	};

	jMoment.jDaysInMonth = function (year, month) {
	    year += div(month, 12);
	    month = mod(month, 12);
	    if (month < 0) {
	        month += 12;
	        year -= 1;
	    }
	    if (month < 6) {
	        return 31;
	    } else if (month < 11) {
	        return 30;
	    } else if (jMoment.jIsLeapYear(year)) {
	        return 30;
	    } else {
	        return 29;
	    }
	};

	jMoment.jIsLeapYear = isLeapJalaliYear;

	moment.updateLocale("fa", {
	        months: ("ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر").split("_")
	        , monthsShort: ("ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر").split("_")
	        , weekdays: ("یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_جمعه_شنبه").split("_")
	        , weekdaysShort: ("یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_جمعه_شنبه").split("_")
	        , weekdaysMin: "ی_د_س_چ_پ_ج_ش".split("_")
	        , longDateFormat:
	            { LT: "HH:mm"
	                , L: "jYYYY/jMM/jDD"
	                , LL: "jD jMMMM jYYYY"
	                , LLL: "jD jMMMM jYYYY LT"
	                , LLLL: "dddd، jD jMMMM jYYYY LT"
	            }
	        , calendar:
	            { sameDay: "[امروز ساعت] LT"
	                , nextDay: "[فردا ساعت] LT"
	                , nextWeek: "dddd [ساعت] LT"
	                , lastDay: "[دیروز ساعت] LT"
	                , lastWeek: "dddd [ی پیش ساعت] LT"
	                , sameElse: "L"
	            }
	        , relativeTime:
	            { future: "در %s"
	                , past: "%s پیش"
	                , s: "چند ثانیه"
	                , m: "1 دقیقه"
	                , mm: "%d دقیقه"
	                , h: "1 ساعت"
	                , hh: "%d ساعت"
	                , d: "1 روز"
	                , dd: "%d روز"
	                , M: "1 ماه"
	                , MM: "%d ماه"
	                , y: "1 سال"
	                , yy: "%d سال"
	            }
	        , ordinal: "%dم",
	        preparse: function (string) {
	            return string;
	        },
	        postformat: function (string) {
	            return string;
	        }
	        , week:
	            { dow: 6 // Saturday is the first day of the week.
	                , doy: 12 // The week that contains Jan 1st is the first week of the year.
	            }
	        , meridiem: function (hour) {
	            return hour < 12 ? "ق.ظ" : "ب.ظ";
	        }
	        , jMonths: ("فروردین_اردیبهشت_خرداد_تیر_مرداد_شهریور_مهر_آبان_آذر_دی_بهمن_اسفند").split("_")
	        , jMonthsShort: "فروردین_اردیبهشت_خرداد_تیر_مرداد_شهریور_مهر_آبان_آذر_دی_بهمن_اسفند".split("_")
	    });
	jMoment.bindCalendarSystemAndLocale();
	moment.locale("en");

	jMoment.jConvert =  { toJalali: toJalali
	    , toGregorian: toGregorian
	};

	/************************************
	 Jalali Conversion
	 ************************************/

	function toJalali(gy, gm, gd) {
	    var j = convertToJalali(gy, gm + 1, gd);
	    j.jm -= 1;
	    return j;
	}

	function toGregorian(jy, jm, jd) {
	    var g = convertToGregorian(jy, jm + 1, jd);
	    g.gm -= 1;
	    return g;
	}

	/*
	 Utility helper functions.
	 */

	function div(a, b) {
	    return ~~(a / b);
	}

	function mod(a, b) {
	    return a - ~~(a / b) * b;
	}

	/*
	 Converts a Gregorian date to Jalali.
	 */
	function convertToJalali(gy, gm, gd) {
	    if (Object.prototype.toString.call(gy) === "[object Date]") {
	        gd = gy.getDate();
	        gm = gy.getMonth() + 1;
	        gy = gy.getFullYear();
	    }
	    return d2j(g2d(gy, gm, gd));
	}

	/*
	 Converts a Jalali date to Gregorian.
	 */
	function convertToGregorian(jy, jm, jd) {
	    return d2g(j2d(jy, jm, jd));
	}

	/*
	 Is this a leap year or not?
	 */
	function isLeapJalaliYear(jy) {
	    return jalCal(jy).leap === 0;
	}

	/*
	 This function determines if the Jalali (Persian) year is
	 leap (366-day long) or is the common year (365 days), and
	 finds the day in March (Gregorian calendar) of the first
	 day of the Jalali year (jy).
	 @param jy Jalali calendar year (-61 to 3177)
	 @return
	 leap: number of years since the last leap year (0 to 4)
	 gy: Gregorian year of the beginning of Jalali year
	 march: the March day of Farvardin the 1st (1st day of jy)
	 @see: http://www.astro.uni.torun.pl/~kb/Papers/EMP/PersianC-EMP.htm
	 @see: http://www.fourmilab.ch/documents/calendar/
	 */
	function jalCal(jy) {
	    // Jalali years starting the 33-year rule.
	    var breaks =  [ -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210
	        , 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178
	    ]
	        , bl = breaks.length
	        , gy = jy + 621
	        , leapJ = -14
	        , jp = breaks[0]
	        , jm
	        , jump
	        , leap
	        , leapG
	        , march
	        , n
	        , i;

	    if (jy < jp || jy >= breaks[bl - 1])
	        throw new Error("Invalid Jalali year " + jy);

	    // Find the limiting years for the Jalali year jy.
	    for (i = 1; i < bl; i += 1) {
	        jm = breaks[i];
	        jump = jm - jp;
	        if (jy < jm)
	            break;
	        leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
	        jp = jm;
	    }
	    n = jy - jp;

	    // Find the number of leap years from AD 621 to the beginning
	    // of the current Jalali year in the Persian calendar.
	    leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
	    if (mod(jump, 33) === 4 && jump - n === 4)
	        leapJ += 1;

	    // And the same in the Gregorian calendar (until the year gy).
	    leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;

	    // Determine the Gregorian date of Farvardin the 1st.
	    march = 20 + leapJ - leapG;

	    // Find how many years have passed since the last leap year.
	    if (jump - n < 6)
	        n = n - jump + div(jump + 4, 33) * 33;
	    leap = mod(mod(n + 1, 33) - 1, 4);
	    if (leap === -1) {
	        leap = 4;
	    }

	    return  { leap: leap
	        , gy: gy
	        , march: march
	    };
	}

	/*
	 Converts a date of the Jalali calendar to the Julian Day number.
	 @param jy Jalali year (1 to 3100)
	 @param jm Jalali month (1 to 12)
	 @param jd Jalali day (1 to 29/31)
	 @return Julian Day number
	 */
	function j2d(jy, jm, jd) {
	    var r = jalCal(jy);
	    return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
	}

	/*
	 Converts the Julian Day number to a date in the Jalali calendar.
	 @param jdn Julian Day number
	 @return
	 jy: Jalali year (1 to 3100)
	 jm: Jalali month (1 to 12)
	 jd: Jalali day (1 to 29/31)
	 */
	function d2j(jdn) {
	    var gy = d2g(jdn).gy // Calculate Gregorian year (gy).
	        , jy = gy - 621
	        , r = jalCal(jy)
	        , jdn1f = g2d(gy, 3, r.march)
	        , jd
	        , jm
	        , k;

	    // Find number of days that passed since 1 Farvardin.
	    k = jdn - jdn1f;
	    if (k >= 0) {
	        if (k <= 185) {
	            // The first 6 months.
	            jm = 1 + div(k, 31);
	            jd = mod(k, 31) + 1;
	            return  { jy: jy
	                , jm: jm
	                , jd: jd
	            };
	        } else {
	            // The remaining months.
	            k -= 186;
	        }
	    } else {
	        // Previous Jalali year.
	        jy -= 1;
	        k += 179;
	        if (r.leap === 1)
	            k += 1;
	    }
	    jm = 7 + div(k, 30);
	    jd = mod(k, 30) + 1;
	    return  { jy: jy
	        , jm: jm
	        , jd: jd
	    };
	}

	/*
	 Calculates the Julian Day number from Gregorian or Julian
	 calendar dates. This integer number corresponds to the noon of
	 the date (i.e. 12 hours of Universal Time).
	 The procedure was tested to be good since 1 March, -100100 (of both
	 calendars) up to a few million years into the future.
	 @param gy Calendar year (years BC numbered 0, -1, -2, ...)
	 @param gm Calendar month (1 to 12)
	 @param gd Calendar day of the month (1 to 28/29/30/31)
	 @return Julian Day number
	 */
	function g2d(gy, gm, gd) {
	    var d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4)
	        + div(153 * mod(gm + 9, 12) + 2, 5)
	        + gd - 34840408;
	    d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
	    return d;
	}

	/*
	 Calculates Gregorian and Julian calendar dates from the Julian Day number
	 (jdn) for the period since jdn=-34839655 (i.e. the year -100100 of both
	 calendars) to some millions years ahead of the present.
	 @param jdn Julian Day number
	 @return
	 gy: Calendar year (years BC numbered 0, -1, -2, ...)
	 gm: Calendar month (1 to 12)
	 gd: Calendar day of the month M (1 to 28/29/30/31)
	 */
	function d2g(jdn) {
	    var j
	        , i
	        , gd
	        , gm
	        , gy;
	    j = 4 * jdn + 139361631;
	    j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
	    i = div(mod(j, 1461), 4) * 5 + 308;
	    gd = div(mod(i, 153), 5) + 1;
	    gm = mod(div(i, 153), 12) + 1;
	    gy = div(j, 1461) - 100100 + div(8 - gm, 6);
	    return  { gy: gy
	        , gm: gm
	        , gd: gd
	    };
	}

	// https://blog.openreplay.com/the-ultimate-guide-to-getting-started-with-the-rollup-js-javascript-bundler

	const YEAR = 'year';
	const MONTH = 'month';
	const DAY = 'day';
	const HOUR = 'hour';
	const MINUTE = 'minute';
	const SECOND = 'second';
	const MILLISECOND = 'millisecond';

	const month_names = {
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
	    fa: [
	        'فروردین',
	        'اردیبهشت',
	        'خرداد',
	        'تیر',
	        'مرداد',
	        'شهریور',
	        'مهر',
	        'آبان',
	        'اذر',
	        'دی',
	        'بهمن',
	        'اسفند'
	    ]
	};

	class date_utils {

	    constructor(options) {
	        let default_options = {
	            is_jalali: false,
	            language: 'en'
	        };
	        this.options = Object.assign({}, default_options, options);
	    }
	    
	    parse(date, date_separator = '-', time_separator = /[.:]/) {
	        if (date instanceof Date) {
	            return date;
	        }
	        if (typeof date === 'string') {
	            let date_parts, time_parts;
	            const parts = date.split(' ');

	            date_parts = parts[0]
	                .split(date_separator)
	                .map((val) => parseInt(val, 10));
	            time_parts = parts[1] && parts[1].split(time_separator);

	            // month is 0 indexed
	            date_parts[1] = date_parts[1] - 1;

	            let vals = date_parts;

	            if (time_parts && time_parts.length) {
	                if (time_parts.length == 4) {
	                    time_parts[3] = '0.' + time_parts[3];
	                    time_parts[3] = parseFloat(time_parts[3]) * 1000;
	                }
	                vals = vals.concat(time_parts);
	            }

	            return new Date(...vals);
	        }
	    }

	    to_string(date, with_time = false) {
	        if (!(date instanceof Date)) {
	            throw new TypeError('Invalid argument type');
	        }
	        const vals = this.get_date_values(date).map((val, i) => {
	            if (i === 1) {
	                // add 1 for month
	                val = val + 1;
	            }

	            if (i === 6) {
	                return padStart(val + '', 3, '0');
	            }

	            return padStart(val + '', 2, '0');
	        });
	        const date_string = `${vals[0]}-${vals[1]}-${vals[2]}`;
	        const time_string = `${vals[3]}:${vals[4]}:${vals[5]}.${vals[6]}`;

	        return date_string + (with_time ? ' ' + time_string : '');
	    }

	    format(date, format_string = 'YYYY-MM-DD HH:mm:ss.SSS') {
	        const values = this.get_date_values(date).map((d) => padStart(d, 2, 0));
	        let format_map = {
	            YYYY: values[0],
	            MM: padStart(+values[1] + 1, 2, 0),
	            DD: values[2],
	            HH: values[3],
	            mm: values[4],
	            ss: values[5],
	            SSS: values[6],
	            D: values[2],
	            MMMM: month_names[this.options.language][+values[1]],
	            MMM: month_names[this.options.language][+values[1]],
	        };

	        if (this.options.is_jalali) {
	            let m = padStart(+values[1] + 1, 2, 0);
	            let inDate = values[0] + '-' + m + '-' + values[2];

	            let jalali = jalaliMoment.from(inDate, 'en', 'YYYY-MM-DD').locale('fa');
	            let jYear = jalali.format('jYYYY');
	            let jMonth = jalali.format('jMM');
	            let jDay = jalali.format('jDD');
	            let jdateNum = jMonth - 1;
	            format_map = {
	                YYYY: jYear,
	                MM: jMonth,
	                DD: jDay,
	                HH: values[3],
	                mm: values[4],
	                ss: values[5],
	                SSS: values[6],
	                D: jDay,
	                MMMM: month_names[this.options.language][jdateNum],
	                MMM: month_names[this.options.language][jdateNum]
	            };
	        }

	        let str = format_string;
	        const formatted_values = [];

	        Object.keys(format_map)
	            .sort((a, b) => b.length - a.length) // big string first
	            .forEach((key) => {
	                if (str.includes(key)) {
	                    str = str.replace(key, `$${formatted_values.length}`);
	                    formatted_values.push(format_map[key]);
	                }
	            });

	        formatted_values.forEach((value, i) => {
	            str = str.replace(`$${i}`, value);
	        });

	        return str;
	    }

	    diff(date_a, date_b, scale = DAY) {
	        let milliseconds, seconds, hours, minutes, days, months, years;

	        milliseconds = date_a - date_b;
	        seconds = milliseconds / 1000;
	        minutes = seconds / 60;
	        hours = minutes / 60;
	        days = hours / 24;
	        months = days / 30;
	        years = months / 12;

	        if (!scale.endsWith('s')) {
	            scale += 's';
	        }

	        return Math.floor(
	            {
	                milliseconds,
	                seconds,
	                minutes,
	                hours,
	                days,
	                months,
	                years,
	            }[scale]
	        );
	    }

	    today() {
	        const vals = this.get_date_values(new Date()).slice(0, 3);
	        return new Date(...vals);
	    }

	    now() {
	        return new Date();
	    }

	    add(date, qty, scale) {
	        qty = parseInt(qty, 10);
	        const vals = [
	            date.getFullYear() + (scale === YEAR ? qty : 0),
	            date.getMonth() + (scale === MONTH ? qty : 0),
	            date.getDate() + (scale === DAY ? qty : 0),
	            date.getHours() + (scale === HOUR ? qty : 0),
	            date.getMinutes() + (scale === MINUTE ? qty : 0),
	            date.getSeconds() + (scale === SECOND ? qty : 0),
	            date.getMilliseconds() + (scale === MILLISECOND ? qty : 0),
	        ];
	        return new Date(...vals);
	    }

	    start_of(date, scale) {
	        const scores = {
	            [YEAR]: 6,
	            [MONTH]: 5,
	            [DAY]: 4,
	            [HOUR]: 3,
	            [MINUTE]: 2,
	            [SECOND]: 1,
	            [MILLISECOND]: 0,
	        };

	        function should_reset(_scale) {
	            const max_score = scores[scale];
	            return scores[_scale] <= max_score;
	        }

	        const vals = [
	            date.getFullYear(),
	            should_reset(YEAR) ? 0 : date.getMonth(),
	            should_reset(MONTH) ? 1 : date.getDate(),
	            should_reset(DAY) ? 0 : date.getHours(),
	            should_reset(HOUR) ? 0 : date.getMinutes(),
	            should_reset(MINUTE) ? 0 : date.getSeconds(),
	            should_reset(SECOND) ? 0 : date.getMilliseconds(),
	        ];

	        return new Date(...vals);
	    }

	    clone(date) {
	        return new Date(...this.get_date_values(date));
	    }

	    get_date_values(date) {
	        return [
	            date.getFullYear(),
	            date.getMonth(),
	            date.getDate(),
	            date.getHours(),
	            date.getMinutes(),
	            date.getSeconds(),
	            date.getMilliseconds(),
	        ];
	    }

	    get_days_in_month(date) {
	        let no_of_days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	        const month = date.getMonth();

	        if (this.options.is_jalali) {
	            no_of_days = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
	            if (month !== 12) {
	                return no_of_days[month];
	            }
	        }
	        
	        if (month !== 1) {
	            return no_of_days[month];
	        }

	        // Feb
	        const year = date.getFullYear();
	        if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
	            return 29;
	        }
	        return 28;
	    }
	}
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
	function padStart(str, targetLength, padString) {
	    str = str + '';
	    targetLength = targetLength >> 0;
	    padString = String(typeof padString !== 'undefined' ? padString : ' ');
	    if (str.length > targetLength) {
	        return String(str);
	    } else {
	        targetLength = targetLength - str.length;
	        if (targetLength > padString.length) {
	            padString += padString.repeat(targetLength / padString.length);
	        }
	        return padString.slice(0, targetLength) + String(str);
	    }
	}

	function $(expr, con) {
	    return typeof expr === 'string'
	        ? (con || document).querySelector(expr)
	        : expr || null;
	}

	function createSVG(tag, attrs) {
	    const elem = document.createElementNS('http://www.w3.org/2000/svg', tag);
	    for (let attr in attrs) {
	        if (attr === 'append_to') {
	            const parent = attrs.append_to;
	            parent.appendChild(elem);
	        } else if (attr === 'innerHTML') {
	            elem.innerHTML = attrs.innerHTML;
	        } else {
	            elem.setAttribute(attr, attrs[attr]);
	        }
	    }
	    return elem;
	}

	function animateSVG(svgElement, attr, from, to) {
	    const animatedSvgElement = getAnimationElement(svgElement, attr, from, to);

	    if (animatedSvgElement === svgElement) {
	        // triggered 2nd time programmatically
	        // trigger artificial click event
	        const event = document.createEvent('HTMLEvents');
	        event.initEvent('click', true, true);
	        event.eventName = 'click';
	        animatedSvgElement.dispatchEvent(event);
	    }
	}

	function getAnimationElement(
	    svgElement,
	    attr,
	    from,
	    to,
	    dur = '0.4s',
	    begin = '0.1s'
	) {
	    const animEl = svgElement.querySelector('animate');
	    if (animEl) {
	        $.attr(animEl, {
	            attributeName: attr,
	            from,
	            to,
	            dur,
	            begin: 'click + ' + begin, // artificial click
	        });
	        return svgElement;
	    }

	    const animateElement = createSVG('animate', {
	        attributeName: attr,
	        from,
	        to,
	        dur,
	        begin,
	        calcMode: 'spline',
	        values: from + ';' + to,
	        keyTimes: '0; 1',
	        keySplines: cubic_bezier('ease-out'),
	    });
	    svgElement.appendChild(animateElement);

	    return svgElement;
	}

	function cubic_bezier(name) {
	    return {
	        ease: '.25 .1 .25 1',
	        linear: '0 0 1 1',
	        'ease-in': '.42 0 1 1',
	        'ease-out': '0 0 .58 1',
	        'ease-in-out': '.42 0 .58 1',
	    }[name];
	}

	$.on = (element, event, selector, callback) => {
	    if (!callback) {
	        callback = selector;
	        $.bind(element, event, callback);
	    } else {
	        $.delegate(element, event, selector, callback);
	    }
	};

	$.off = (element, event, handler) => {
	    element.removeEventListener(event, handler);
	};

	$.bind = (element, event, callback) => {
	    event.split(/\s+/).forEach(function (event) {
	        element.addEventListener(event, callback);
	    });
	};

	$.delegate = (element, event, selector, callback) => {
	    element.addEventListener(event, function (e) {
	        const delegatedTarget = e.target.closest(selector);
	        if (delegatedTarget) {
	            e.delegatedTarget = delegatedTarget;
	            callback.call(this, e, delegatedTarget);
	        }
	    });
	};

	$.closest = (selector, element) => {
	    if (!element) return null;

	    if (element.matches(selector)) {
	        return element;
	    }

	    return $.closest(selector, element.parentNode);
	};

	$.attr = (element, attr, value) => {
	    if (!value && typeof attr === 'string') {
	        return element.getAttribute(attr);
	    }

	    if (typeof attr === 'object') {
	        for (let key in attr) {
	            $.attr(element, key, attr[key]);
	        }
	        return;
	    }

	    element.setAttribute(attr, value);
	};

	class Bar {
	    constructor(gantt, task) {
	        this.set_defaults(gantt, task);
	        this.date_utils = new date_utils(gantt.options);
	        this.prepare();
	        this.draw();
	        this.bind();
	    }

	    set_defaults(gantt, task) {
	        this.action_completed = false;
	        this.gantt = gantt;
	        this.task = task;
	    }

	    prepare() {
	        this.prepare_values();
	        this.prepare_helpers();
	    }

	    prepare_values() {
	        this.invalid = this.task.invalid;
	        this.height = this.gantt.options.bar_height;
	        this.x = this.compute_x();
	        this.y = this.compute_y();
	        this.corner_radius = this.gantt.options.bar_corner_radius;
	        this.duration =
	            this.date_utils.diff(this.task._end, this.task._start, 'hour') /
	            this.gantt.options.step;
	        this.width = this.gantt.options.column_width * this.duration;
	        this.progress_width =
	            this.gantt.options.column_width *
	                this.duration *
	                (this.task.progress / 100) || 0;
	        this.group = createSVG('g', {
	            class: 'bar-wrapper ' + (this.task.custom_class || ''),
	            'data-id': this.task.id,
	        });
	        this.bar_group = createSVG('g', {
	            class: 'bar-group',
	            append_to: this.group,
	        });
	        this.handle_group = createSVG('g', {
	            class: 'handle-group',
	            append_to: this.group,
	        });
	    }

	    prepare_helpers() {
	        SVGElement.prototype.getX = function () {
	            return +this.getAttribute('x');
	        };
	        SVGElement.prototype.getY = function () {
	            return +this.getAttribute('y');
	        };
	        SVGElement.prototype.getWidth = function () {
	            return +this.getAttribute('width');
	        };
	        SVGElement.prototype.getHeight = function () {
	            return +this.getAttribute('height');
	        };
	        SVGElement.prototype.getEndX = function () {
	            return this.getX() + this.getWidth();
	        };
	    }

	    draw() {
	        this.draw_bar();
	        this.draw_progress_bar();
	        this.draw_label();
	        this.draw_resize_handles();
	    }

	    draw_bar() {
	        this.$bar = createSVG('rect', {
	            x: this.x,
	            y: this.y,
	            width: this.width,
	            height: this.height,
	            rx: this.corner_radius,
	            ry: this.corner_radius,
	            class: 'bar',
	            append_to: this.bar_group,
	        });

	        animateSVG(this.$bar, 'width', 0, this.width);

	        if (this.invalid) {
	            this.$bar.classList.add('bar-invalid');
	        }
	    }

	    draw_progress_bar() {
	        if (this.invalid) return;
	        this.$bar_progress = createSVG('rect', {
	            x: this.x,
	            y: this.y,
	            width: this.progress_width,
	            height: this.height,
	            rx: this.corner_radius,
	            ry: this.corner_radius,
	            class: 'bar-progress',
	            append_to: this.bar_group,
	        });

	        animateSVG(this.$bar_progress, 'width', 0, this.progress_width);
	    }

	    draw_label() {
	        createSVG('text', {
	            x: this.x + this.width / 2,
	            y: this.y + this.height / 2,
	            innerHTML: this.task.name,
	            class: 'bar-label',
	            append_to: this.bar_group,
	        });
	        // labels get BBox in the next tick
	        requestAnimationFrame(() => this.update_label_position());
	    }

	    draw_resize_handles() {
	        if (this.invalid) return;

	        const bar = this.$bar;
	        const handle_width = 8;

	        createSVG('rect', {
	            x: bar.getX() + bar.getWidth() - 9,
	            y: bar.getY() + 1,
	            width: handle_width,
	            height: this.height - 2,
	            rx: this.corner_radius,
	            ry: this.corner_radius,
	            class: 'handle right',
	            append_to: this.handle_group,
	        });

	        createSVG('rect', {
	            x: bar.getX() + 1,
	            y: bar.getY() + 1,
	            width: handle_width,
	            height: this.height - 2,
	            rx: this.corner_radius,
	            ry: this.corner_radius,
	            class: 'handle left',
	            append_to: this.handle_group,
	        });

	        if (this.task.progress && this.task.progress < 100) {
	            this.$handle_progress = createSVG('polygon', {
	                points: this.get_progress_polygon_points().join(','),
	                class: 'handle progress',
	                append_to: this.handle_group,
	            });
	        }
	    }

	    get_progress_polygon_points() {
	        const bar_progress = this.$bar_progress;
	        return [
	            bar_progress.getEndX() - 5,
	            bar_progress.getY() + bar_progress.getHeight(),
	            bar_progress.getEndX() + 5,
	            bar_progress.getY() + bar_progress.getHeight(),
	            bar_progress.getEndX(),
	            bar_progress.getY() + bar_progress.getHeight() - 8.66,
	        ];
	    }

	    bind() {
	        if (this.invalid) return;
	        this.setup_click_event();
	    }

	    setup_click_event() {
	        $.on(this.group, 'focus ' + this.gantt.options.popup_trigger, (e) => {
	            if (this.action_completed) {
	                // just finished a move action, wait for a few seconds
	                return;
	            }

	            this.show_popup();
	            this.gantt.unselect_all();
	            this.group.classList.add('active');
	        });

	        $.on(this.group, 'dblclick', (e) => {
	            if (this.action_completed) {
	                // just finished a move action, wait for a few seconds
	                return;
	            }

	            this.gantt.trigger_event('click', [this.task]);
	        });
	    }

	    show_popup() {
	        if (this.gantt.bar_being_dragged) return;

	        const start_date = this.date_utils.format(
	            this.task._start,
	            'MMM D',
	            this.gantt.options.language
	        );
	        const end_date = this.date_utils.format(
	            this.date_utils.add(this.task._end, -1, 'second'),
	            'MMM D',
	            this.gantt.options.language
	        );
	        const subtitle = start_date + ' - ' + end_date;

	        this.gantt.show_popup({
	            target_element: this.$bar,
	            title: this.task.name,
	            subtitle: subtitle,
	            task: this.task,
	        });
	    }

	    update_bar_position({ x = null, width = null }) {
	        const bar = this.$bar;
	        if (x) {
	            // get all x values of parent task
	            const xs = this.task.dependencies.map((dep) => {
	                return this.gantt.get_bar(dep).$bar.getX();
	            });
	            // child task must not go before parent
	            const valid_x = xs.reduce((prev, curr) => {
	                return x >= curr;
	            }, x);
	            if (!valid_x) {
	                width = null;
	                return;
	            }
	            this.update_attr(bar, 'x', x);
	        }
	        if (width && width >= this.gantt.options.column_width) {
	            this.update_attr(bar, 'width', width);
	        }
	        this.update_label_position();
	        this.update_handle_position();
	        this.update_progressbar_position();
	        this.update_arrow_position();
	    }

	    date_changed() {
	        let changed = false;
	        const { new_start_date, new_end_date } = this.compute_start_end_date();

	        if (Number(this.task._start) !== Number(new_start_date)) {
	            changed = true;
	            this.task._start = new_start_date;
	        }

	        if (Number(this.task._end) !== Number(new_end_date)) {
	            changed = true;
	            this.task._end = new_end_date;
	        }

	        if (!changed) return;

	        this.gantt.trigger_event('date_change', [
	            this.task,
	            new_start_date,
	            this.date_utils.add(new_end_date, -1, 'second'),
	        ]);
	    }

	    progress_changed() {
	        const new_progress = this.compute_progress();
	        this.task.progress = new_progress;
	        this.gantt.trigger_event('progress_change', [this.task, new_progress]);
	    }

	    set_action_completed() {
	        this.action_completed = true;
	        setTimeout(() => (this.action_completed = false), 1000);
	    }

	    compute_start_end_date() {
	        const bar = this.$bar;
	        const x_in_units = bar.getX() / this.gantt.options.column_width;
	        const new_start_date = this.date_utils.add(
	            this.gantt.gantt_start,
	            x_in_units * this.gantt.options.step,
	            'hour'
	        );
	        const width_in_units = bar.getWidth() / this.gantt.options.column_width;
	        const new_end_date = this.date_utils.add(
	            new_start_date,
	            width_in_units * this.gantt.options.step,
	            'hour'
	        );

	        return { new_start_date, new_end_date };
	    }

	    compute_progress() {
	        const progress =
	            (this.$bar_progress.getWidth() / this.$bar.getWidth()) * 100;
	        return parseInt(progress, 10);
	    }

	    compute_x() {
	        const { step, column_width } = this.gantt.options;
	        const task_start = this.task._start;
	        const gantt_start = this.gantt.gantt_start;

	        const diff = this.date_utils.diff(task_start, gantt_start, 'hour');
	        let x = (diff / step) * column_width;

	        if (this.gantt.view_is('Month')) {
	            const diff = this.date_utils.diff(task_start, gantt_start, 'day');
	            x = (diff * column_width) / 30;
	        }
	        return x;
	    }

	    compute_y() {
	        return (
	            this.gantt.options.header_height +
	            this.gantt.options.padding +
	            this.task._index * (this.height + this.gantt.options.padding)
	        );
	    }

	    get_snap_position(dx) {
	        let odx = dx,
	            rem,
	            position;

	        if (this.gantt.view_is('Week')) {
	            rem = dx % (this.gantt.options.column_width / 7);
	            position =
	                odx -
	                rem +
	                (rem < this.gantt.options.column_width / 14
	                    ? 0
	                    : this.gantt.options.column_width / 7);
	        } else if (this.gantt.view_is('Month')) {
	            rem = dx % (this.gantt.options.column_width / 30);
	            position =
	                odx -
	                rem +
	                (rem < this.gantt.options.column_width / 60
	                    ? 0
	                    : this.gantt.options.column_width / 30);
	        } else {
	            rem = dx % this.gantt.options.column_width;
	            position =
	                odx -
	                rem +
	                (rem < this.gantt.options.column_width / 2
	                    ? 0
	                    : this.gantt.options.column_width);
	        }
	        return position;
	    }

	    update_attr(element, attr, value) {
	        value = +value;
	        if (!isNaN(value)) {
	            element.setAttribute(attr, value);
	        }
	        return element;
	    }

	    update_progressbar_position() {
	        this.$bar_progress.setAttribute('x', this.$bar.getX());
	        this.$bar_progress.setAttribute(
	            'width',
	            this.$bar.getWidth() * (this.task.progress / 100)
	        );
	    }

	    update_label_position() {
	        const bar = this.$bar,
	            label = this.group.querySelector('.bar-label');

	        if (label.getBBox().width > bar.getWidth()) {
	            label.classList.add('big');
	            label.setAttribute('x', bar.getX() + bar.getWidth() + 5);
	        } else {
	            label.classList.remove('big');
	            label.setAttribute('x', bar.getX() + bar.getWidth() / 2);
	        }
	    }

	    update_handle_position() {
	        const bar = this.$bar;
	        this.handle_group
	            .querySelector('.handle.left')
	            .setAttribute('x', bar.getX() + 1);
	        this.handle_group
	            .querySelector('.handle.right')
	            .setAttribute('x', bar.getEndX() - 9);
	        const handle = this.group.querySelector('.handle.progress');
	        handle &&
	            handle.setAttribute('points', this.get_progress_polygon_points());
	    }

	    update_arrow_position() {
	        this.arrows = this.arrows || [];
	        for (let arrow of this.arrows) {
	            arrow.update();
	        }
	    }
	}

	class Arrow {
	    constructor(gantt, from_task, to_task) {
	        this.gantt = gantt;
	        this.from_task = from_task;
	        this.to_task = to_task;

	        this.calculate_path();
	        this.draw();
	    }

	    calculate_path() {
	        let start_x =
	            this.from_task.$bar.getX() + this.from_task.$bar.getWidth() / 2;

	        const condition = () =>
	            this.to_task.$bar.getX() < start_x + this.gantt.options.padding &&
	            start_x > this.from_task.$bar.getX() + this.gantt.options.padding;

	        while (condition()) {
	            start_x -= 10;
	        }

	        const start_y =
	            this.gantt.options.header_height +
	            this.gantt.options.bar_height +
	            (this.gantt.options.padding + this.gantt.options.bar_height) *
	                this.from_task.task._index +
	            this.gantt.options.padding;

	        const end_x = this.to_task.$bar.getX() - this.gantt.options.padding / 2;
	        const end_y =
	            this.gantt.options.header_height +
	            this.gantt.options.bar_height / 2 +
	            (this.gantt.options.padding + this.gantt.options.bar_height) *
	                this.to_task.task._index +
	            this.gantt.options.padding;

	        const from_is_below_to =
	            this.from_task.task._index > this.to_task.task._index;
	        const curve = this.gantt.options.arrow_curve;
	        const clockwise = from_is_below_to ? 1 : 0;
	        const curve_y = from_is_below_to ? -curve : curve;
	        const offset = from_is_below_to
	            ? end_y + this.gantt.options.arrow_curve
	            : end_y - this.gantt.options.arrow_curve;

	        this.path = `
            M ${start_x} ${start_y}
            V ${offset}
            a ${curve} ${curve} 0 0 ${clockwise} ${curve} ${curve_y}
            L ${end_x} ${end_y}
            m -5 -5
            l 5 5
            l -5 5`;

	        if (
	            this.to_task.$bar.getX() <
	            this.from_task.$bar.getX() + this.gantt.options.padding
	        ) {
	            const down_1 = this.gantt.options.padding / 2 - curve;
	            const down_2 =
	                this.to_task.$bar.getY() +
	                this.to_task.$bar.getHeight() / 2 -
	                curve_y;
	            const left = this.to_task.$bar.getX() - this.gantt.options.padding;

	            this.path = `
                M ${start_x} ${start_y}
                v ${down_1}
                a ${curve} ${curve} 0 0 1 -${curve} ${curve}
                H ${left}
                a ${curve} ${curve} 0 0 ${clockwise} -${curve} ${curve_y}
                V ${down_2}
                a ${curve} ${curve} 0 0 ${clockwise} ${curve} ${curve_y}
                L ${end_x} ${end_y}
                m -5 -5
                l 5 5
                l -5 5`;
	        }
	    }

	    draw() {
	        this.element = createSVG('path', {
	            d: this.path,
	            'data-from': this.from_task.task.id,
	            'data-to': this.to_task.task.id,
	        });
	    }

	    update() {
	        this.calculate_path();
	        this.element.setAttribute('d', this.path);
	    }
	}

	class Popup {
	    constructor(parent, custom_html) {
	        this.parent = parent;
	        this.custom_html = custom_html;
	        this.make();
	    }

	    make() {
	        this.parent.innerHTML = `
            <div class="title"></div>
            <div class="subtitle"></div>
            <div class="pointer"></div>
        `;

	        this.hide();

	        this.title = this.parent.querySelector('.title');
	        this.subtitle = this.parent.querySelector('.subtitle');
	        this.pointer = this.parent.querySelector('.pointer');
	    }

	    show(options) {
	        if (!options.target_element) {
	            throw new Error('target_element is required to show popup');
	        }
	        if (!options.position) {
	            options.position = 'left';
	        }
	        const target_element = options.target_element;

	        if (this.custom_html) {
	            let html = this.custom_html(options.task);
	            html += '<div class="pointer"></div>';
	            this.parent.innerHTML = html;
	            this.pointer = this.parent.querySelector('.pointer');
	        } else {
	            // set data
	            this.title.innerHTML = options.title;
	            this.subtitle.innerHTML = options.subtitle;
	            this.parent.style.width = this.parent.clientWidth + 'px';
	        }

	        // set position
	        let position_meta;
	        if (target_element instanceof HTMLElement) {
	            position_meta = target_element.getBoundingClientRect();
	        } else if (target_element instanceof SVGElement) {
	            position_meta = options.target_element.getBBox();
	        }

	        if (options.position === 'left') {
	            this.parent.style.left =
	                position_meta.x + (position_meta.width + 10) + 'px';
	            this.parent.style.top = position_meta.y + 'px';

	            this.pointer.style.transform = 'rotateZ(90deg)';
	            this.pointer.style.left = '-7px';
	            this.pointer.style.top = '2px';
	        }

	        // show
	        this.parent.style.opacity = 1;
	    }

	    hide() {
	        this.parent.style.opacity = 0;
	        this.parent.style.left = 0;
	    }
	}

	const VIEW_MODE = {
	    QUARTER_DAY: 'Quarter Day',
	    HALF_DAY: 'Half Day',
	    DAY: 'Day',
	    WEEK: 'Week',
	    MONTH: 'Month',
	    YEAR: 'Year',
	};

	class Gantt {
	    constructor(wrapper, tasks, options) {
	        this.date_utils = new date_utils(options);
	        this.setup_wrapper(wrapper);
	        this.setup_options(options);
	        this.setup_tasks(tasks);
	        // initialize with default view mode
	        this.change_view_mode();
	        this.bind_events();
	    }

	    setup_wrapper(element) {
	        let svg_element, wrapper_element;

	        // CSS Selector is passed
	        if (typeof element === 'string') {
	            element = document.querySelector(element);
	        }

	        // get the SVGElement
	        if (element instanceof HTMLElement) {
	            wrapper_element = element;
	            svg_element = element.querySelector('svg');
	        } else if (element instanceof SVGElement) {
	            svg_element = element;
	        } else {
	            throw new TypeError(
	                'Frappé Gantt only supports usage of a string CSS selector,' +
	                    " HTML DOM element or SVG DOM element for the 'element' parameter"
	            );
	        }

	        // svg element
	        if (!svg_element) {
	            // create it
	            this.$svg = createSVG('svg', {
	                append_to: wrapper_element,
	                class: 'gantt',
	            });
	        } else {
	            this.$svg = svg_element;
	            this.$svg.classList.add('gantt');
	        }

	        // wrapper element
	        this.$container = document.createElement('div');
	        this.$container.classList.add('gantt-container');

	        const parent_element = this.$svg.parentElement;
	        parent_element.appendChild(this.$container);
	        this.$container.appendChild(this.$svg);

	        // popup wrapper
	        this.popup_wrapper = document.createElement('div');
	        this.popup_wrapper.classList.add('popup-wrapper');
	        this.$container.appendChild(this.popup_wrapper);
	    }

	    setup_options(options) {
	        const default_options = {
	            header_height: 50,
	            column_width: 30,
	            step: 24,
	            view_modes: [...Object.values(VIEW_MODE)],
	            bar_height: 20,
	            bar_corner_radius: 3,
	            arrow_curve: 5,
	            padding: 18,
	            view_mode: 'Day',
	            date_format: 'YYYY-MM-DD',
	            popup_trigger: 'click',
	            language: 'en',
	            is_jalali: false
	        };
	        this.options = Object.assign({}, default_options, options);
	    }

	    setup_tasks(tasks) {
	        // prepare tasks
	        this.tasks = tasks.map((task, i) => {
	            // convert to Date objects
	            task._start = this.date_utils.parse(task.start);
	            task._end = this.date_utils.parse(task.end);

	            // make task invalid if duration too large
	            if (this.date_utils.diff(task._end, task._start, 'year') > 10) {
	                task.end = null;
	            }

	            // cache index
	            task._index = i;

	            // invalid dates
	            if (!task.start && !task.end) {
	                const today = this.date_utils.today();
	                task._start = today;
	                task._end = this.date_utils.add(today, 2, 'day');
	            }

	            if (!task.start && task.end) {
	                task._start = this.date_utils.add(task._end, -2, 'day');
	            }

	            if (task.start && !task.end) {
	                task._end = this.date_utils.add(task._start, 2, 'day');
	            }

	            // if hours is not set, assume the last day is full day
	            // e.g: 2018-09-09 becomes 2018-09-09 23:59:59
	            const task_end_values = this.date_utils.get_date_values(task._end);
	            if (task_end_values.slice(3).every((d) => d === 0)) {
	                task._end = this.date_utils.add(task._end, 24, 'hour');
	            }

	            // invalid flag
	            if (!task.start || !task.end) {
	                task.invalid = true;
	            }

	            // dependencies
	            if (typeof task.dependencies === 'string' || !task.dependencies) {
	                let deps = [];
	                if (task.dependencies) {
	                    deps = task.dependencies
	                        .split(',')
	                        .map((d) => d.trim())
	                        .filter((d) => d);
	                }
	                task.dependencies = deps;
	            }

	            // uids
	            if (!task.id) {
	                task.id = generate_id(task);
	            }

	            return task;
	        });

	        this.setup_dependencies();
	    }

	    setup_dependencies() {
	        this.dependency_map = {};
	        for (let t of this.tasks) {
	            for (let d of t.dependencies) {
	                this.dependency_map[d] = this.dependency_map[d] || [];
	                this.dependency_map[d].push(t.id);
	            }
	        }
	    }

	    refresh(tasks) {
	        this.setup_tasks(tasks);
	        this.change_view_mode();
	    }

	    change_view_mode(mode = this.options.view_mode) {
	        this.update_view_scale(mode);
	        this.setup_dates();
	        this.render();
	        // fire viewmode_change event
	        this.trigger_event('view_change', [mode]);
	    }

	    update_view_scale(view_mode) {
	        this.options.view_mode = view_mode;

	        if (view_mode === VIEW_MODE.DAY) {
	            this.options.step = 24;
	            this.options.column_width = 38;
	        } else if (view_mode === VIEW_MODE.HALF_DAY) {
	            this.options.step = 24 / 2;
	            this.options.column_width = 38;
	        } else if (view_mode === VIEW_MODE.QUARTER_DAY) {
	            this.options.step = 24 / 4;
	            this.options.column_width = 38;
	        } else if (view_mode === VIEW_MODE.WEEK) {
	            this.options.step = 24 * 7;
	            this.options.column_width = 140;
	        } else if (view_mode === VIEW_MODE.MONTH) {
	            this.options.step = 24 * 30;
	            this.options.column_width = 120;
	        } else if (view_mode === VIEW_MODE.YEAR) {
	            this.options.step = 24 * 365;
	            this.options.column_width = 120;
	        }
	    }

	    setup_dates() {
	        this.setup_gantt_dates();
	        this.setup_date_values();
	    }

	    setup_gantt_dates() {
	        this.gantt_start = this.gantt_end = null;

	        for (let task of this.tasks) {
	            // set global start and end date
	            if (!this.gantt_start || task._start < this.gantt_start) {
	                this.gantt_start = task._start;
	            }
	            if (!this.gantt_end || task._end > this.gantt_end) {
	                this.gantt_end = task._end;
	            }
	        }

	        this.gantt_start = this.date_utils.start_of(this.gantt_start, 'day');
	        this.gantt_end = this.date_utils.start_of(this.gantt_end, 'day');

	        // add date padding on both sides
	        if (this.view_is([VIEW_MODE.QUARTER_DAY, VIEW_MODE.HALF_DAY])) {
	            this.gantt_start = this.date_utils.add(this.gantt_start, -7, 'day');
	            this.gantt_end = this.date_utils.add(this.gantt_end, 7, 'day');
	        } else if (this.view_is(VIEW_MODE.MONTH)) {
	            this.gantt_start = this.date_utils.start_of(this.gantt_start, 'year');
	            this.gantt_end = this.date_utils.add(this.gantt_end, 1, 'year');
	        } else if (this.view_is(VIEW_MODE.YEAR)) {
	            this.gantt_start = this.date_utils.add(this.gantt_start, -2, 'year');
	            this.gantt_end = this.date_utils.add(this.gantt_end, 2, 'year');
	        } else {
	            this.gantt_start = this.date_utils.add(this.gantt_start, -1, 'month');
	            this.gantt_end = this.date_utils.add(this.gantt_end, 1, 'month');
	        }
	    }

	    setup_date_values() {
	        this.dates = [];
	        let cur_date = null;

	        while (cur_date === null || cur_date < this.gantt_end) {
	            if (!cur_date) {
	                cur_date = this.date_utils.clone(this.gantt_start);
	            } else {
	                if (this.view_is(VIEW_MODE.YEAR)) {
	                    cur_date = this.date_utils.add(cur_date, 1, 'year');
	                } else if (this.view_is(VIEW_MODE.MONTH)) {
	                    cur_date = this.date_utils.add(cur_date, 1, 'month');
	                } else {
	                    cur_date = this.date_utils.add(
	                        cur_date,
	                        this.options.step,
	                        'hour'
	                    );
	                }
	            }
	            this.dates.push(cur_date);
	        }
	    }

	    bind_events() {
	        this.bind_grid_click();
	        this.bind_bar_events();
	    }

	    render() {
	        this.clear();
	        this.setup_layers();
	        this.make_grid();
	        this.make_dates();
	        this.make_bars();
	        this.make_arrows();
	        this.map_arrows_on_bars();
	        this.set_width();
	        this.set_scroll_position();
	    }

	    setup_layers() {
	        this.layers = {};
	        const layers = ['grid', 'date', 'arrow', 'progress', 'bar', 'details'];
	        // make group layers
	        for (let layer of layers) {
	            this.layers[layer] = createSVG('g', {
	                class: layer,
	                append_to: this.$svg,
	            });
	        }
	    }

	    make_grid() {
	        this.make_grid_background();
	        this.make_grid_rows();
	        this.make_grid_header();
	        this.make_grid_ticks();
	        this.make_grid_highlights();
	    }

	    make_grid_background() {
	        const grid_width = this.dates.length * this.options.column_width;
	        const grid_height =
	            this.options.header_height +
	            this.options.padding +
	            (this.options.bar_height + this.options.padding) *
	                this.tasks.length;

	        createSVG('rect', {
	            x: 0,
	            y: 0,
	            width: grid_width,
	            height: grid_height,
	            class: 'grid-background',
	            append_to: this.layers.grid,
	        });

	        $.attr(this.$svg, {
	            height: grid_height + this.options.padding + 100,
	            width: '100%',
	        });
	    }

	    make_grid_rows() {
	        const rows_layer = createSVG('g', { append_to: this.layers.grid });
	        const lines_layer = createSVG('g', { append_to: this.layers.grid });

	        const row_width = this.dates.length * this.options.column_width;
	        const row_height = this.options.bar_height + this.options.padding;

	        let row_y = this.options.header_height + this.options.padding / 2;

	        for (let task of this.tasks) {
	            createSVG('rect', {
	                x: 0,
	                y: row_y,
	                width: row_width,
	                height: row_height,
	                class: 'grid-row',
	                append_to: rows_layer,
	            });

	            createSVG('line', {
	                x1: 0,
	                y1: row_y + row_height,
	                x2: row_width,
	                y2: row_y + row_height,
	                class: 'row-line',
	                append_to: lines_layer,
	            });

	            row_y += this.options.bar_height + this.options.padding;
	        }
	    }

	    make_grid_header() {
	        const header_width = this.dates.length * this.options.column_width;
	        const header_height = this.options.header_height + 10;
	        createSVG('rect', {
	            x: 0,
	            y: 0,
	            width: header_width,
	            height: header_height,
	            class: 'grid-header',
	            append_to: this.layers.grid,
	        });
	    }

	    make_grid_ticks() {
	        let tick_x = 0;
	        let tick_y = this.options.header_height + this.options.padding / 2;
	        let tick_height =
	            (this.options.bar_height + this.options.padding) *
	            this.tasks.length;

	        for (let date of this.dates) {
	            let tick_class = 'tick';
	            // thick tick for monday
	            if (this.view_is(VIEW_MODE.DAY) && date.getDate() === 1) {
	                tick_class += ' thick';
	            }
	            // thick tick for first week
	            if (
	                this.view_is(VIEW_MODE.WEEK) &&
	                date.getDate() >= 1 &&
	                date.getDate() < 8
	            ) {
	                tick_class += ' thick';
	            }
	            // thick ticks for quarters
	            if (
	                this.view_is(VIEW_MODE.MONTH) &&
	                (date.getMonth() + 1) % 3 === 0
	            ) {
	                tick_class += ' thick';
	            }

	            createSVG('path', {
	                d: `M ${tick_x} ${tick_y} v ${tick_height}`,
	                class: tick_class,
	                append_to: this.layers.grid,
	            });

	            if (this.view_is(VIEW_MODE.MONTH)) {
	                tick_x +=
	                    (this.date_utils.get_days_in_month(date) *
	                        this.options.column_width) /
	                    30;
	            } else {
	                tick_x += this.options.column_width;
	            }
	        }
	    }

	    make_grid_highlights() {
	        // highlight today's date
	        if (this.view_is(VIEW_MODE.DAY)) {
	            const x =
	                (this.date_utils.diff(this.date_utils.today(), this.gantt_start, 'hour') /
	                    this.options.step) *
	                this.options.column_width;
	            const y = 0;

	            const width = this.options.column_width;
	            const height =
	                (this.options.bar_height + this.options.padding) *
	                    this.tasks.length +
	                this.options.header_height +
	                this.options.padding / 2;

	            createSVG('rect', {
	                x,
	                y,
	                width,
	                height,
	                class: 'today-highlight',
	                append_to: this.layers.grid,
	            });
	        }
	    }

	    make_dates() {
	        for (let date of this.get_dates_to_draw()) {
	            createSVG('text', {
	                x: date.lower_x,
	                y: date.lower_y,
	                innerHTML: date.lower_text,
	                class: 'lower-text',
	                append_to: this.layers.date,
	            });

	            if (date.upper_text) {
	                const $upper_text = createSVG('text', {
	                    x: date.upper_x,
	                    y: date.upper_y,
	                    innerHTML: date.upper_text,
	                    class: 'upper-text',
	                    append_to: this.layers.date,
	                });

	                // remove out-of-bound dates
	                if (
	                    $upper_text.getBBox().x2 > this.layers.grid.getBBox().width
	                ) {
	                    $upper_text.remove();
	                }
	            }
	        }
	    }

	    get_dates_to_draw() {
	        let last_date = null;
	        const dates = this.dates.map((date, i) => {
	            const d = this.get_date_info(date, last_date, i);
	            last_date = date;
	            return d;
	        });
	        return dates;
	    }

	    get_date_info(date, last_date, i) {
	        if (!last_date) {
	            last_date = this.date_utils.add(date, 1, 'year');
	        }
	        const date_text = {
	            'Quarter Day_lower': this.date_utils.format(
	                date,
	                'HH',
	                this.options.language
	            ),
	            'Half Day_lower': this.date_utils.format(
	                date,
	                'HH',
	                this.options.language
	            ),
	            Day_lower:
	                date.getDate() !== last_date.getDate()
	                    ? this.date_utils.format(date, 'D', this.options.language)
	                    : '',
	            Week_lower:
	                date.getMonth() !== last_date.getMonth()
	                    ? this.date_utils.format(date, 'D MMM', this.options.language)
	                    : this.date_utils.format(date, 'D', this.options.language),
	            Month_lower: this.date_utils.format(date, 'MMMM', this.options.language),
	            Year_lower: this.date_utils.format(date, 'YYYY', this.options.language),
	            'Quarter Day_upper':
	                date.getDate() !== last_date.getDate()
	                    ? this.date_utils.format(date, 'D MMM', this.options.language)
	                    : '',
	            'Half Day_upper':
	                date.getDate() !== last_date.getDate()
	                    ? date.getMonth() !== last_date.getMonth()
	                        ? this.date_utils.format(
	                              date,
	                              'D MMM',
	                              this.options.language
	                          )
	                        : this.date_utils.format(date, 'D', this.options.language)
	                    : '',
	            Day_upper:
	                date.getMonth() !== last_date.getMonth()
	                    ? this.date_utils.format(date, 'MMMM', this.options.language)
	                    : '',
	            Week_upper:
	                date.getMonth() !== last_date.getMonth()
	                    ? this.date_utils.format(date, 'MMMM', this.options.language)
	                    : '',
	            Month_upper:
	                date.getFullYear() !== last_date.getFullYear()
	                    ? this.date_utils.format(date, 'YYYY', this.options.language)
	                    : '',
	            Year_upper:
	                date.getFullYear() !== last_date.getFullYear()
	                    ? this.date_utils.format(date, 'YYYY', this.options.language)
	                    : '',
	        };

	        const base_pos = {
	            x: i * this.options.column_width,
	            lower_y: this.options.header_height,
	            upper_y: this.options.header_height - 25,
	        };

	        const x_pos = {
	            'Quarter Day_lower': (this.options.column_width * 4) / 2,
	            'Quarter Day_upper': 0,
	            'Half Day_lower': (this.options.column_width * 2) / 2,
	            'Half Day_upper': 0,
	            Day_lower: this.options.column_width / 2,
	            Day_upper: (this.options.column_width * 30) / 2,
	            Week_lower: 0,
	            Week_upper: (this.options.column_width * 4) / 2,
	            Month_lower: this.options.column_width / 2,
	            Month_upper: (this.options.column_width * 12) / 2,
	            Year_lower: this.options.column_width / 2,
	            Year_upper: (this.options.column_width * 30) / 2,
	        };

	        return {
	            upper_text: date_text[`${this.options.view_mode}_upper`],
	            lower_text: date_text[`${this.options.view_mode}_lower`],
	            upper_x: base_pos.x + x_pos[`${this.options.view_mode}_upper`],
	            upper_y: base_pos.upper_y,
	            lower_x: base_pos.x + x_pos[`${this.options.view_mode}_lower`],
	            lower_y: base_pos.lower_y,
	        };
	    }

	    make_bars() {
	        this.bars = this.tasks.map((task) => {
	            const bar = new Bar(this, task);
	            this.layers.bar.appendChild(bar.group);
	            return bar;
	        });
	    }

	    make_arrows() {
	        this.arrows = [];
	        for (let task of this.tasks) {
	            let arrows = [];
	            arrows = task.dependencies
	                .map((task_id) => {
	                    const dependency = this.get_task(task_id);
	                    if (!dependency) return;
	                    const arrow = new Arrow(
	                        this,
	                        this.bars[dependency._index], // from_task
	                        this.bars[task._index] // to_task
	                    );
	                    this.layers.arrow.appendChild(arrow.element);
	                    return arrow;
	                })
	                .filter(Boolean); // filter falsy values
	            this.arrows = this.arrows.concat(arrows);
	        }
	    }

	    map_arrows_on_bars() {
	        for (let bar of this.bars) {
	            bar.arrows = this.arrows.filter((arrow) => {
	                return (
	                    arrow.from_task.task.id === bar.task.id ||
	                    arrow.to_task.task.id === bar.task.id
	                );
	            });
	        }
	    }

	    set_width() {
	        const cur_width = this.$svg.getBoundingClientRect().width;
	        const actual_width = this.$svg
	            .querySelector('.grid .grid-row')
	            .getAttribute('width');
	        if (cur_width < actual_width) {
	            this.$svg.setAttribute('width', actual_width);
	        }
	    }

	    set_scroll_position() {
	        const parent_element = this.$svg.parentElement;
	        if (!parent_element) return;

	        const hours_before_first_task = this.date_utils.diff(
	            this.get_oldest_starting_date(),
	            this.gantt_start,
	            'hour'
	        );

	        const scroll_pos =
	            (hours_before_first_task / this.options.step) *
	                this.options.column_width -
	            this.options.column_width;

	        parent_element.scrollLeft = scroll_pos;
	    }

	    bind_grid_click() {
	        $.on(
	            this.$svg,
	            this.options.popup_trigger,
	            '.grid-row, .grid-header',
	            () => {
	                this.unselect_all();
	                this.hide_popup();
	            }
	        );
	    }

	    bind_bar_events() {
	        let is_dragging = false;
	        let x_on_start = 0;
	        let y_on_start = 0;
	        let is_resizing_left = false;
	        let is_resizing_right = false;
	        let parent_bar_id = null;
	        let bars = []; // instanceof Bar
	        this.bar_being_dragged = null;

	        function action_in_progress() {
	            return is_dragging || is_resizing_left || is_resizing_right;
	        }

	        $.on(this.$svg, 'mousedown', '.bar-wrapper, .handle', (e, element) => {
	            const bar_wrapper = $.closest('.bar-wrapper', element);

	            if (element.classList.contains('left')) {
	                is_resizing_left = true;
	            } else if (element.classList.contains('right')) {
	                is_resizing_right = true;
	            } else if (element.classList.contains('bar-wrapper')) {
	                is_dragging = true;
	            }

	            bar_wrapper.classList.add('active');

	            x_on_start = e.offsetX;
	            y_on_start = e.offsetY;

	            parent_bar_id = bar_wrapper.getAttribute('data-id');
	            const ids = [
	                parent_bar_id,
	                ...this.get_all_dependent_tasks(parent_bar_id),
	            ];
	            bars = ids.map((id) => this.get_bar(id));

	            this.bar_being_dragged = parent_bar_id;

	            bars.forEach((bar) => {
	                const $bar = bar.$bar;
	                $bar.ox = $bar.getX();
	                $bar.oy = $bar.getY();
	                $bar.owidth = $bar.getWidth();
	                $bar.finaldx = 0;
	            });
	        });

	        $.on(this.$svg, 'mousemove', (e) => {
	            if (!action_in_progress()) return;
	            const dx = e.offsetX - x_on_start;
	            e.offsetY - y_on_start;

	            bars.forEach((bar) => {
	                const $bar = bar.$bar;
	                $bar.finaldx = this.get_snap_position(dx);
	                this.hide_popup();
	                if (is_resizing_left) {
	                    if (parent_bar_id === bar.task.id) {
	                        bar.update_bar_position({
	                            x: $bar.ox + $bar.finaldx,
	                            width: $bar.owidth - $bar.finaldx,
	                        });
	                    } else {
	                        bar.update_bar_position({
	                            x: $bar.ox + $bar.finaldx,
	                        });
	                    }
	                } else if (is_resizing_right) {
	                    if (parent_bar_id === bar.task.id) {
	                        bar.update_bar_position({
	                            width: $bar.owidth + $bar.finaldx,
	                        });
	                    }
	                } else if (is_dragging) {
	                    bar.update_bar_position({ x: $bar.ox + $bar.finaldx });
	                }
	            });
	        });

	        document.addEventListener('mouseup', (e) => {
	            if (is_dragging || is_resizing_left || is_resizing_right) {
	                bars.forEach((bar) => bar.group.classList.remove('active'));
	            }

	            is_dragging = false;
	            is_resizing_left = false;
	            is_resizing_right = false;
	        });

	        $.on(this.$svg, 'mouseup', (e) => {
	            this.bar_being_dragged = null;
	            bars.forEach((bar) => {
	                const $bar = bar.$bar;
	                if (!$bar.finaldx) return;
	                bar.date_changed();
	                bar.set_action_completed();
	            });
	        });

	        this.bind_bar_progress();
	    }

	    bind_bar_progress() {
	        let x_on_start = 0;
	        let y_on_start = 0;
	        let is_resizing = null;
	        let bar = null;
	        let $bar_progress = null;
	        let $bar = null;

	        $.on(this.$svg, 'mousedown', '.handle.progress', (e, handle) => {
	            is_resizing = true;
	            x_on_start = e.offsetX;
	            y_on_start = e.offsetY;

	            const $bar_wrapper = $.closest('.bar-wrapper', handle);
	            const id = $bar_wrapper.getAttribute('data-id');
	            bar = this.get_bar(id);

	            $bar_progress = bar.$bar_progress;
	            $bar = bar.$bar;

	            $bar_progress.finaldx = 0;
	            $bar_progress.owidth = $bar_progress.getWidth();
	            $bar_progress.min_dx = -$bar_progress.getWidth();
	            $bar_progress.max_dx = $bar.getWidth() - $bar_progress.getWidth();
	        });

	        $.on(this.$svg, 'mousemove', (e) => {
	            if (!is_resizing) return;
	            let dx = e.offsetX - x_on_start;
	            e.offsetY - y_on_start;

	            if (dx > $bar_progress.max_dx) {
	                dx = $bar_progress.max_dx;
	            }
	            if (dx < $bar_progress.min_dx) {
	                dx = $bar_progress.min_dx;
	            }

	            const $handle = bar.$handle_progress;
	            $.attr($bar_progress, 'width', $bar_progress.owidth + dx);
	            $.attr($handle, 'points', bar.get_progress_polygon_points());
	            $bar_progress.finaldx = dx;
	        });

	        $.on(this.$svg, 'mouseup', () => {
	            is_resizing = false;
	            if (!($bar_progress && $bar_progress.finaldx)) return;
	            bar.progress_changed();
	            bar.set_action_completed();
	        });
	    }

	    get_all_dependent_tasks(task_id) {
	        let out = [];
	        let to_process = [task_id];
	        while (to_process.length) {
	            const deps = to_process.reduce((acc, curr) => {
	                acc = acc.concat(this.dependency_map[curr]);
	                return acc;
	            }, []);

	            out = out.concat(deps);
	            to_process = deps.filter((d) => !to_process.includes(d));
	        }

	        return out.filter(Boolean);
	    }

	    get_snap_position(dx) {
	        let odx = dx,
	            rem,
	            position;

	        if (this.view_is(VIEW_MODE.WEEK)) {
	            rem = dx % (this.options.column_width / 7);
	            position =
	                odx -
	                rem +
	                (rem < this.options.column_width / 14
	                    ? 0
	                    : this.options.column_width / 7);
	        } else if (this.view_is(VIEW_MODE.MONTH)) {
	            rem = dx % (this.options.column_width / 30);
	            position =
	                odx -
	                rem +
	                (rem < this.options.column_width / 60
	                    ? 0
	                    : this.options.column_width / 30);
	        } else {
	            rem = dx % this.options.column_width;
	            position =
	                odx -
	                rem +
	                (rem < this.options.column_width / 2
	                    ? 0
	                    : this.options.column_width);
	        }
	        return position;
	    }

	    unselect_all() {
	        [...this.$svg.querySelectorAll('.bar-wrapper')].forEach((el) => {
	            el.classList.remove('active');
	        });
	    }

	    view_is(modes) {
	        if (typeof modes === 'string') {
	            return this.options.view_mode === modes;
	        }

	        if (Array.isArray(modes)) {
	            return modes.some((mode) => this.options.view_mode === mode);
	        }

	        return false;
	    }

	    get_task(id) {
	        return this.tasks.find((task) => {
	            return task.id === id;
	        });
	    }

	    get_bar(id) {
	        return this.bars.find((bar) => {
	            return bar.task.id === id;
	        });
	    }

	    show_popup(options) {
	        if (!this.popup) {
	            this.popup = new Popup(
	                this.popup_wrapper,
	                this.options.custom_popup_html
	            );
	        }
	        this.popup.show(options);
	    }

	    hide_popup() {
	        this.popup && this.popup.hide();
	    }

	    trigger_event(event, args) {
	        if (this.options['on_' + event]) {
	            this.options['on_' + event].apply(null, args);
	        }
	    }

	    /**
	     * Gets the oldest starting date from the list of tasks
	     *
	     * @returns Date
	     * @memberof Gantt
	     */
	    get_oldest_starting_date() {
	        return this.tasks
	            .map((task) => task._start)
	            .reduce((prev_date, cur_date) =>
	                cur_date <= prev_date ? cur_date : prev_date
	            );
	    }

	    /**
	     * Clear all elements from the parent svg element
	     *
	     * @memberof Gantt
	     */
	    clear() {
	        this.$svg.innerHTML = '';
	    }
	}

	// module.exports = Gantt;

	Gantt.VIEW_MODE = VIEW_MODE;

	function generate_id(task) {
	    return task.name + '_' + Math.random().toString(36).slice(2, 12);
	}

	return Gantt;

})();
//# sourceMappingURL=frappe-gantt.js.map
