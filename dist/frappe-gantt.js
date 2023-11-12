var Gantt = (function () {
    'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    var YEAR = 'year';
    var MONTH = 'month';
    var DAY = 'day';
    var HOUR = 'hour';
    var MINUTE = 'minute';
    var SECOND = 'second';
    var MILLISECOND = 'millisecond';
    var date_utils = {
        parse: function (date, date_separator, time_separator) {
            if (date_separator === void 0) { date_separator = '-'; }
            if (time_separator === void 0) { time_separator = /[.:]/; }
            if (date instanceof Date) {
                return date;
            }
            if (typeof date === 'string') {
                var date_parts = void 0, time_parts = void 0;
                var parts = date.split(' ');
                date_parts = parts[0]
                    .split(date_separator)
                    .map(function (val) { return parseInt(val, 10); });
                time_parts = parts[1] && parts[1].split(time_separator);
                // month is 0 indexed
                date_parts[1] = date_parts[1] - 1;
                var vals = date_parts;
                if (time_parts && time_parts.length) {
                    if (time_parts.length == 4) {
                        time_parts[3] = '0.' + time_parts[3];
                        time_parts[3] = parseFloat(time_parts[3]) * 1000;
                    }
                    vals = vals.concat(time_parts);
                }
                // @ts-ignore
                return new (Date.bind.apply(Date, __spreadArray([void 0], vals, false)))();
            }
        },
        to_string: function (date, with_time) {
            if (with_time === void 0) { with_time = false; }
            if (!(date instanceof Date)) {
                throw new TypeError('Invalid argument type');
            }
            var vals = this.get_date_values(date).map(function (val, i) {
                if (i === 1) {
                    // add 1 for month
                    val = val + 1;
                }
                if (i === 6) {
                    return padStart(val + '', 3, '0');
                }
                return padStart(val + '', 2, '0');
            });
            var date_string = "".concat(vals[0], "-").concat(vals[1], "-").concat(vals[2]);
            var time_string = "".concat(vals[3], ":").concat(vals[4], ":").concat(vals[5], ".").concat(vals[6]);
            return date_string + (with_time ? ' ' + time_string : '');
        },
        format: function (date, format_string, lang) {
            if (format_string === void 0) { format_string = 'YYYY-MM-DD HH:mm:ss.SSS'; }
            if (lang === void 0) { lang = 'en'; }
            var dateTimeFormat = new Intl.DateTimeFormat(lang, {
                month: 'long'
            });
            var month_name = dateTimeFormat.format(date);
            var month_name_capitalized = month_name.charAt(0).toUpperCase() + month_name.slice(1);
            var values = this.get_date_values(date).map(function (d) { return padStart(d, 2, 0); });
            var format_map = {
                YYYY: values[0],
                MM: padStart(+values[1] + 1, 2, 0),
                DD: values[2],
                HH: values[3],
                mm: values[4],
                ss: values[5],
                SSS: values[6],
                D: values[2],
                MMMM: month_name_capitalized,
                MMM: month_name_capitalized,
            };
            var str = format_string;
            var formatted_values = [];
            Object.keys(format_map)
                .sort(function (a, b) { return b.length - a.length; }) // big string first
                .forEach(function (key) {
                if (str.includes(key)) {
                    str = str.replace(key, "$".concat(formatted_values.length));
                    formatted_values.push(format_map[key]);
                }
            });
            formatted_values.forEach(function (value, i) {
                str = str.replace("$".concat(i), value);
            });
            return str;
        },
        diff: function (date_a, date_b, scale) {
            if (scale === void 0) { scale = DAY; }
            var milliseconds, seconds, hours, minutes, days, months, years;
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
            return Math.floor({
                milliseconds: milliseconds,
                seconds: seconds,
                minutes: minutes,
                hours: hours,
                days: days,
                months: months,
                years: years,
            }[scale]);
        },
        today: function () {
            var vals = this.get_date_values(new Date()).slice(0, 3);
            // @ts-ignore
            return new (Date.bind.apply(Date, __spreadArray([void 0], vals, false)))();
        },
        now: function () {
            return new Date();
        },
        add: function (date, qty, scale) {
            qty = parseInt(qty, 10);
            var vals = [
                date.getFullYear() + (scale === YEAR ? qty : 0),
                date.getMonth() + (scale === MONTH ? qty : 0),
                date.getDate() + (scale === DAY ? qty : 0),
                date.getHours() + (scale === HOUR ? qty : 0),
                date.getMinutes() + (scale === MINUTE ? qty : 0),
                date.getSeconds() + (scale === SECOND ? qty : 0),
                date.getMilliseconds() + (scale === MILLISECOND ? qty : 0),
            ];
            // @ts-ignore
            return new (Date.bind.apply(Date, __spreadArray([void 0], vals, false)))();
        },
        start_of: function (date, scale) {
            var _a;
            var scores = (_a = {},
                _a[YEAR] = 6,
                _a[MONTH] = 5,
                _a[DAY] = 4,
                _a[HOUR] = 3,
                _a[MINUTE] = 2,
                _a[SECOND] = 1,
                _a[MILLISECOND] = 0,
                _a);
            function should_reset(_scale) {
                var max_score = scores[scale];
                return scores[_scale] <= max_score;
            }
            var vals = [
                date.getFullYear(),
                should_reset(YEAR) ? 0 : date.getMonth(),
                should_reset(MONTH) ? 1 : date.getDate(),
                should_reset(DAY) ? 0 : date.getHours(),
                should_reset(HOUR) ? 0 : date.getMinutes(),
                should_reset(MINUTE) ? 0 : date.getSeconds(),
                should_reset(SECOND) ? 0 : date.getMilliseconds(),
            ];
            // @ts-ignore
            return new (Date.bind.apply(Date, __spreadArray([void 0], vals, false)))();
        },
        clone: function (date) {
            // @ts-ignore
            return new (Date.bind.apply(Date, __spreadArray([void 0], this.get_date_values(date), false)))();
        },
        get_date_values: function (date) {
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
        get_days_in_month: function (date) {
            var no_of_days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            var month = date.getMonth();
            if (month !== 1) {
                return no_of_days[month];
            }
            // Feb
            var year = date.getFullYear();
            if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
                return 29;
            }
            return 28;
        },
    };
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
    function padStart(str, targetLength, padString) {
        str = str + '';
        targetLength = targetLength >> 0;
        padString = String(typeof padString !== 'undefined' ? padString : ' ');
        if (str.length > targetLength) {
            return String(str);
        }
        else {
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
        var svgElement = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (var attr in attrs) {
            if (attr === 'append_to') {
                var parent_1 = attrs.append_to;
                parent_1.appendChild(svgElement);
            }
            else if (attr === 'innerHTML') {
                svgElement.innerHTML = attrs.innerHTML;
            }
            else {
                svgElement.setAttribute(attr, attrs[attr]);
            }
        }
        return svgElement;
    }
    function animateSVG(svgElement, attr, from, to) {
        var animatedSvgElement = getAnimationElement(svgElement, attr, from, to);
        if (animatedSvgElement === svgElement) {
            // triggered 2nd time programmatically
            // trigger artificial click event
            var event_1 = new Event('click', {
                bubbles: true,
                cancelable: true,
            });
            animatedSvgElement.dispatchEvent(event_1);
        }
    }
    function getX(element) {
        return parseInt(element.getAttribute('x'));
    }
    function getY(element) {
        return parseInt(element.getAttribute('y'));
    }
    function getWidth(element) {
        return parseInt(element.getAttribute('width'));
    }
    function getHeight(element) {
        return parseInt(element.getAttribute('height'));
    }
    function getEndX(element) {
        return getX(element) + getWidth(element);
    }
    function getAnimationElement(svgElement, attr, from, to, dur, begin) {
        if (dur === void 0) { dur = '0.4s'; }
        if (begin === void 0) { begin = '0.1s'; }
        var animEl = svgElement.querySelector('animate');
        if (animEl) {
            $.attr(animEl, null, {
                attributeName: attr,
                from: from,
                to: to,
                dur: dur,
                begin: 'click + ' + begin, // artificial click
            });
            return svgElement;
        }
        var animateElement = createSVG('animate', {
            attributeName: attr,
            from: from,
            to: to,
            dur: dur,
            begin: begin,
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
    $.on = function (element, event, selector, callback) {
        if (!callback) {
            callback = selector;
            $.bind(element, event, callback);
        }
        else {
            $.delegate(element, event, selector, callback);
        }
    };
    $.off = function (element, event, handler) {
        element.removeEventListener(event, handler);
    };
    $.bind = function (element, event, callback) {
        event.split(/\s+/).forEach(function (event) {
            element.addEventListener(event, callback);
        });
    };
    $.delegate = function (element, event, selector, callback) {
        element.addEventListener(event, function (e) {
            var delegatedTarget = e.target.closest(selector);
            if (delegatedTarget) {
                e.delegatedTarget = delegatedTarget;
                callback.call(this, e, delegatedTarget);
            }
        });
    };
    $.closest = function (selector, element) {
        if (!element)
            return null;
        if (element.matches(selector)) {
            return element;
        }
        return $.closest(selector, element.parentNode);
    };
    $.attr = function (element, attr, value) {
        if (!value && typeof attr === 'string') {
            return element.getAttribute(attr);
        }
        if (typeof attr === 'object') {
            for (var key in attr) {
                $.attr(element, key, attr[key]);
            }
            return;
        }
        element.setAttribute(attr, value);
    };

    var VIEW_MODE;
    (function (VIEW_MODE) {
        VIEW_MODE["QUARTER_DAY"] = "Quarter Day";
        VIEW_MODE["HALF_DAY"] = "Half Day";
        VIEW_MODE["DAY"] = "Day";
        VIEW_MODE["WEEK"] = "Week";
        VIEW_MODE["MONTH"] = "Month";
        VIEW_MODE["YEAR"] = "Year";
    })(VIEW_MODE || (VIEW_MODE = {}));

    var Bar = /** @class */ (function () {
        function Bar(gantt, task) {
            this.set_defaults(gantt, task);
            this.prepare_values();
            this.draw();
            this.bind();
        }
        Bar.prototype.set_defaults = function (gantt, task) {
            this.action_completed = false;
            this.gantt = gantt;
            this.task = task;
        };
        Bar.prototype.prepare_values = function () {
            this.invalid = this.task.invalid;
            this.height = this.gantt.options.bar_height;
            this.x = this.compute_x();
            this.y = this.compute_y();
            this.corner_radius = this.gantt.options.bar_corner_radius;
            this.duration =
                date_utils.diff(this.task._end, this.task._start, 'hour') /
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
        };
        Bar.prototype.draw = function () {
            this.draw_bar();
            this.draw_progress_bar();
            this.draw_label();
            this.draw_resize_handles();
        };
        Bar.prototype.draw_bar = function () {
            this.bar = createSVG('rect', {
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height,
                rx: this.corner_radius,
                ry: this.corner_radius,
                class: 'bar',
                append_to: this.bar_group,
            });
            animateSVG(this.bar, 'width', 0, this.width);
            if (this.invalid) {
                this.bar.classList.add('bar-invalid');
            }
        };
        Bar.prototype.draw_progress_bar = function () {
            if (this.invalid)
                return;
            this.bar_progress = createSVG('rect', {
                x: this.x,
                y: this.y,
                width: this.progress_width,
                height: this.height,
                rx: this.corner_radius,
                ry: this.corner_radius,
                class: 'bar-progress',
                append_to: this.bar_group,
            });
            animateSVG(this.bar_progress, 'width', 0, this.progress_width);
        };
        Bar.prototype.draw_label = function () {
            var _this = this;
            createSVG('text', {
                x: this.x + this.width / 2,
                y: this.y + this.height / 2,
                innerHTML: this.task.name,
                class: 'bar-label',
                append_to: this.bar_group,
            });
            // labels get BBox in the next tick
            requestAnimationFrame(function () { return _this.update_label_position(); });
        };
        Bar.prototype.draw_resize_handles = function () {
            if (this.invalid)
                return;
            var bar = this.bar;
            var handle_width = 8;
            createSVG('rect', {
                x: getX(bar) + getWidth(bar) - 9,
                y: getY(bar) + 1,
                width: handle_width,
                height: this.height - 2,
                rx: this.corner_radius,
                ry: this.corner_radius,
                class: 'handle right',
                append_to: this.handle_group,
            });
            createSVG('rect', {
                x: getX(bar) + 1,
                y: getY(bar) + 1,
                width: handle_width,
                height: this.height - 2,
                rx: this.corner_radius,
                ry: this.corner_radius,
                class: 'handle left',
                append_to: this.handle_group,
            });
            if (this.task.progress && this.task.progress < 100) {
                this.handle_progress = createSVG('polygon', {
                    points: this.get_progress_polygon_points().join(','),
                    class: 'handle progress',
                    append_to: this.handle_group,
                });
            }
        };
        Bar.prototype.get_progress_polygon_points = function () {
            var bar_progress = this.bar_progress;
            return [
                getEndX(bar_progress) - 5,
                getY(bar_progress) + getHeight(bar_progress),
                getEndX(bar_progress) + 5,
                getY(bar_progress) + getHeight(bar_progress),
                getEndX(bar_progress),
                getY(bar_progress) + getHeight(bar_progress) - 8.66,
            ];
        };
        Bar.prototype.bind = function () {
            if (this.invalid)
                return;
            this.setup_click_event();
        };
        Bar.prototype.setup_click_event = function () {
            var _this = this;
            $.on(this.group, 'focus ' + this.gantt.options.popup_trigger, null, function () {
                if (_this.action_completed) {
                    // just finished a move action, wait for a few seconds
                    return;
                }
                _this.show_popup();
                _this.gantt.unselect_all();
                _this.group.classList.add('active');
            });
            $.on(this.group, 'dblclick', null, function () {
                if (_this.action_completed) {
                    // just finished a move action, wait for a few seconds
                    return;
                }
                _this.gantt.trigger_event('click', [_this.task]);
            });
        };
        Bar.prototype.show_popup = function () {
            if (this.gantt.bar_being_dragged)
                return;
            var start_date = date_utils.format(this.task._start, 'MMM D', this.gantt.options.language);
            var end_date = date_utils.format(date_utils.add(this.task._end, -1, 'second'), 'MMM D', this.gantt.options.language);
            var subtitle = start_date + ' - ' + end_date;
            this.gantt.show_popup({
                target_element: this.bar,
                title: this.task.name,
                subtitle: subtitle,
                task: this.task,
            });
        };
        Bar.prototype.update_bar_position = function (_a) {
            var _this = this;
            var _b = _a.x, x = _b === void 0 ? null : _b, _c = _a.width, width = _c === void 0 ? null : _c;
            var bar = this.bar;
            if (x) {
                if (!Array.isArray(this.task.dependencies))
                    return;
                // get all x values of parent task
                var xs = this.task.dependencies.map(function (dep) {
                    return getX(_this.gantt.get_bar(dep).bar);
                });
                // child task must not go before parent
                var valid_x = xs.reduce(function (prev, curr) {
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
        };
        Bar.prototype.date_changed = function () {
            var changed = false;
            var _a = this.compute_start_end_date(), new_start_date = _a.new_start_date, new_end_date = _a.new_end_date;
            if (Number(this.task._start) !== Number(new_start_date)) {
                changed = true;
                this.task._start = new_start_date;
            }
            if (Number(this.task._end) !== Number(new_end_date)) {
                changed = true;
                this.task._end = new_end_date;
            }
            if (!changed)
                return;
            this.gantt.trigger_event('date_change', [
                this.task,
                new_start_date,
                date_utils.add(new_end_date, -1, 'second'),
            ]);
        };
        Bar.prototype.progress_changed = function () {
            var new_progress = this.compute_progress();
            this.task.progress = new_progress;
            this.gantt.trigger_event('progress_change', [this.task, new_progress]);
        };
        Bar.prototype.set_action_completed = function () {
            var _this = this;
            this.action_completed = true;
            setTimeout(function () { return (_this.action_completed = false); }, 1000);
        };
        Bar.prototype.compute_start_end_date = function () {
            var bar = this.bar;
            var x_in_units = getX(bar) / this.gantt.options.column_width;
            var new_start_date = date_utils.add(this.gantt.gantt_start, x_in_units * this.gantt.options.step, 'hour');
            var width_in_units = getWidth(bar) / this.gantt.options.column_width;
            var new_end_date = date_utils.add(new_start_date, width_in_units * this.gantt.options.step, 'hour');
            return { new_start_date: new_start_date, new_end_date: new_end_date };
        };
        Bar.prototype.compute_progress = function () {
            return (getWidth(this.bar_progress) / getWidth(this.bar)) * 100;
        };
        Bar.prototype.compute_x = function () {
            var _a = this.gantt.options, step = _a.step, column_width = _a.column_width;
            var task_start = this.task._start;
            var gantt_start = this.gantt.gantt_start;
            var diff = date_utils.diff(task_start, gantt_start, 'hour');
            var x = (diff / step) * column_width;
            if (this.gantt.view_is(VIEW_MODE.MONTH)) {
                var diff_1 = date_utils.diff(task_start, gantt_start, 'day');
                x = (diff_1 * column_width) / 30;
            }
            return x;
        };
        Bar.prototype.compute_y = function () {
            return (this.gantt.options.header_height +
                this.gantt.options.padding +
                this.task._index * (this.height + this.gantt.options.padding));
        };
        Bar.prototype.get_snap_position = function (dx) {
            var odx = dx, rem, position;
            if (this.gantt.view_is(VIEW_MODE.WEEK)) {
                rem = dx % (this.gantt.options.column_width / 7);
                position =
                    odx -
                        rem +
                        (rem < this.gantt.options.column_width / 14
                            ? 0
                            : this.gantt.options.column_width / 7);
            }
            else if (this.gantt.view_is(VIEW_MODE.MONTH)) {
                rem = dx % (this.gantt.options.column_width / 30);
                position =
                    odx -
                        rem +
                        (rem < this.gantt.options.column_width / 60
                            ? 0
                            : this.gantt.options.column_width / 30);
            }
            else {
                rem = dx % this.gantt.options.column_width;
                position =
                    odx -
                        rem +
                        (rem < this.gantt.options.column_width / 2
                            ? 0
                            : this.gantt.options.column_width);
            }
            return position;
        };
        Bar.prototype.update_attr = function (element, attr, value) {
            if (value) {
                element.setAttribute(attr, value);
            }
            return element;
        };
        Bar.prototype.update_progressbar_position = function () {
            if (this.invalid)
                return;
            this.bar_progress.setAttribute('x', String(getX(this.bar)));
            this.bar_progress.setAttribute('width', String(getWidth(this.bar) * (this.task.progress / 100)));
        };
        Bar.prototype.update_label_position = function () {
            var bar = this.bar, label = this.group.querySelector('.bar-label');
            if (label.getBBox().width > getWidth(bar)) {
                label.classList.add('big');
                label.setAttribute('x', String(getX(bar) + getWidth(bar) + 5));
            }
            else {
                label.classList.remove('big');
                label.setAttribute('x', String(getX(bar) + getWidth(bar) / 2));
            }
        };
        Bar.prototype.update_handle_position = function () {
            if (this.invalid)
                return;
            var bar = this.bar;
            this.handle_group
                .querySelector('.handle.left')
                .setAttribute('x', String(getX(bar) + 1));
            this.handle_group
                .querySelector('.handle.right')
                .setAttribute('x', String(getEndX(bar) - 9));
            var handle = this.group.querySelector('.handle.progress');
            handle &&
                handle.setAttribute('points', this.get_progress_polygon_points().join(','));
        };
        Bar.prototype.update_arrow_position = function () {
            this.arrows = this.arrows || [];
            for (var _i = 0, _a = this.arrows; _i < _a.length; _i++) {
                var arrow = _a[_i];
                arrow.update();
            }
        };
        return Bar;
    }());

    var Arrow = /** @class */ (function () {
        function Arrow(gantt, from_bar, to_bar) {
            this.gantt = gantt;
            this.from_bar = from_bar;
            this.to_bar = to_bar;
            this.calculate_path();
            this.draw();
        }
        Arrow.prototype.calculate_path = function () {
            var _this = this;
            var start_x = getX(this.from_bar.bar) + getWidth(this.from_bar.bar) / 2;
            var condition = function () {
                return getX(_this.to_bar.bar) < start_x + _this.gantt.options.padding &&
                    start_x > getX(_this.from_bar.bar) + _this.gantt.options.padding;
            };
            while (condition()) {
                start_x -= 10;
            }
            var start_y = this.gantt.options.header_height +
                this.gantt.options.bar_height +
                (this.gantt.options.padding + this.gantt.options.bar_height) *
                    this.from_bar.task._index +
                this.gantt.options.padding;
            var end_x = getX(this.to_bar.bar) - this.gantt.options.padding / 2;
            var end_y = this.gantt.options.header_height +
                this.gantt.options.bar_height / 2 +
                (this.gantt.options.padding + this.gantt.options.bar_height) *
                    this.to_bar.task._index +
                this.gantt.options.padding;
            var from_is_below_to = this.from_bar.task._index > this.to_bar.task._index;
            var curve = this.gantt.options.arrow_curve;
            var clockwise = from_is_below_to ? 1 : 0;
            var curve_y = from_is_below_to ? -curve : curve;
            var offset = from_is_below_to
                ? end_y + this.gantt.options.arrow_curve
                : end_y - this.gantt.options.arrow_curve;
            this.path = "\n            M ".concat(start_x, " ").concat(start_y, "\n            V ").concat(offset, "\n            a ").concat(curve, " ").concat(curve, " 0 0 ").concat(clockwise, " ").concat(curve, " ").concat(curve_y, "\n            L ").concat(end_x, " ").concat(end_y, "\n            m -5 -5\n            l 5 5\n            l -5 5");
            if (getX(this.to_bar.bar) <
                getX(this.from_bar.bar) + this.gantt.options.padding) {
                var down_1 = this.gantt.options.padding / 2 - curve;
                var down_2 = getY(this.to_bar.bar) +
                    getHeight(this.to_bar.bar) / 2 -
                    curve_y;
                var left = getX(this.to_bar.bar) - this.gantt.options.padding;
                this.path = "\n                M ".concat(start_x, " ").concat(start_y, "\n                v ").concat(down_1, "\n                a ").concat(curve, " ").concat(curve, " 0 0 1 -").concat(curve, " ").concat(curve, "\n                H ").concat(left, "\n                a ").concat(curve, " ").concat(curve, " 0 0 ").concat(clockwise, " -").concat(curve, " ").concat(curve_y, "\n                V ").concat(down_2, "\n                a ").concat(curve, " ").concat(curve, " 0 0 ").concat(clockwise, " ").concat(curve, " ").concat(curve_y, "\n                L ").concat(end_x, " ").concat(end_y, "\n                m -5 -5\n                l 5 5\n                l -5 5");
            }
        };
        Arrow.prototype.draw = function () {
            this.element = createSVG('path', {
                d: this.path,
                'data-from': this.from_bar.task.id,
                'data-to': this.to_bar.task.id,
            });
        };
        Arrow.prototype.update = function () {
            this.calculate_path();
            this.element.setAttribute('d', this.path);
        };
        return Arrow;
    }());

    var Popup = /** @class */ (function () {
        function Popup(parent, custom_html) {
            this.parent = parent;
            this.custom_html = custom_html;
            this.make();
        }
        Popup.prototype.make = function () {
            this.parent.innerHTML = "\n            <div class=\"title\"></div>\n            <div class=\"subtitle\"></div>\n            <div class=\"pointer\"></div>\n        ";
            this.hide();
            this.title = this.parent.querySelector('.title');
            this.subtitle = this.parent.querySelector('.subtitle');
            this.pointer = this.parent.querySelector('.pointer');
        };
        Popup.prototype.show = function (options) {
            if (!options.target_element) {
                throw new Error('target_element is required to show popup');
            }
            if (!options.position) {
                options.position = 'left';
            }
            var target_element = options.target_element;
            if (this.custom_html) {
                var html = this.custom_html(options.task);
                html += '<div class="pointer"></div>';
                this.parent.innerHTML = html;
                this.pointer = this.parent.querySelector('.pointer');
            }
            else {
                // set data
                this.title.innerHTML = options.title;
                this.subtitle.innerHTML = options.subtitle;
                this.parent.style.width = this.parent.clientWidth + 'px';
            }
            // set position
            var position_meta;
            if (target_element instanceof HTMLElement) {
                position_meta = target_element.getBoundingClientRect();
            }
            else if (target_element instanceof SVGElement) {
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
            this.parent.style.opacity = '1';
        };
        Popup.prototype.hide = function () {
            this.parent.style.opacity = '0';
            this.parent.style.left = '0';
        };
        return Popup;
    }());

    var Gantt = /** @class */ (function () {
        function Gantt(wrapper, tasks, options) {
            this.bar_being_dragged = null;
            this.setup_tasks(tasks);
            this.setup_options(options);
            this.setup_wrapper(wrapper);
            // initialize with default view mode
            this.change_view_mode();
            this.bind_events();
        }
        Gantt.prototype.setup_wrapper = function (element) {
            var svg_element, wrapper_element;
            // CSS Selector is passed
            if (typeof element === 'string') {
                element = document.querySelector(element);
            }
            // get the SVGElement
            if (element instanceof HTMLElement) {
                wrapper_element = element;
                svg_element = element.querySelector('svg');
            }
            else if (element instanceof SVGElement) {
                svg_element = element;
            }
            else {
                throw new TypeError('Frappé Gantt only supports usage of a string CSS selector,' +
                    " HTML DOM element or SVG DOM element for the 'element' parameter");
            }
            // svg element
            if (!svg_element) {
                // create it
                this.svg = createSVG('svg', {
                    append_to: wrapper_element,
                    class: 'gantt',
                    height: this.options.height
                });
            }
            else {
                this.svg = svg_element;
                this.svg.classList.add('gantt');
            }
            // wrapper element
            this.container = document.createElement('div');
            this.container.classList.add('gantt-container');
            var parent_element = this.svg.parentElement;
            parent_element.appendChild(this.container);
            this.container.appendChild(this.svg);
            // popup wrapper
            this.popup_wrapper = document.createElement('div');
            this.popup_wrapper.classList.add('popup-wrapper');
            this.container.appendChild(this.popup_wrapper);
        };
        Gantt.prototype.setup_options = function (options) {
            var default_options = {
                arrow_curve: 5,
                bar_corner_radius: 3,
                bar_height: 20,
                column_width: 30,
                custom_popup_html: null,
                date_format: 'YYYY-MM-DD',
                header_height: 50,
                /* The height of the svg is the number of tasks multiplied by the row height, which is 38,
                plus the header_height plus 10 */
                height: this.tasks.length * 38 + 60,
                language: 'en',
                padding: 18,
                popup_trigger: 'click',
                step: 24,
                view_mode: 'Day',
                view_modes: __spreadArray([], Object.values(VIEW_MODE), true),
            };
            this.options = Object.assign({}, default_options, options);
        };
        Gantt.prototype.setup_tasks = function (tasks) {
            var _this = this;
            // prepare tasks
            this.tasks = tasks.map(function (task, i) {
                // convert to Date objects
                task._start = date_utils.parse(task.start);
                task._end = date_utils.parse(task.end);
                // make task invalid if duration too large
                if (date_utils.diff(task._end, task._start, 'year') > 10) {
                    task.end = null;
                }
                // cache index
                task._index = i;
                // invalid dates
                if (!task.start && !task.end) {
                    var today = date_utils.today();
                    task._start = today;
                    task._end = date_utils.add(today, 2, 'day');
                }
                if (!task.start && task.end) {
                    task._start = date_utils.add(task._end, -2, 'day');
                }
                if (task.start && !task.end) {
                    task._end = date_utils.add(task._start, 2, 'day');
                }
                // if hours is not set, assume the last day is full day
                // e.g: 2018-09-09 becomes 2018-09-09 23:59:59
                var task_end_values = date_utils.get_date_values(task._end);
                if (task_end_values.slice(3).every(function (d) { return d === 0; })) {
                    task._end = date_utils.add(task._end, 24, 'hour');
                }
                // invalid flag
                if (!task.start || !task.end) {
                    task.invalid = true;
                }
                // dependencies
                if (typeof task.dependencies === 'string') {
                    task.dependencies = task.dependencies
                        .split(',')
                        .map(function (d) { return d.trim(); })
                        .filter(function (d) { return d; });
                }
                // uids
                if (!task.id) {
                    task.id = _this.generate_id(task);
                }
                return task;
            });
            this.setup_dependencies();
        };
        Gantt.prototype.setup_dependencies = function () {
            this.dependency_map = {};
            for (var _i = 0, _a = this.tasks; _i < _a.length; _i++) {
                var task = _a[_i];
                if (task.dependencies === undefined)
                    continue;
                for (var _b = 0, _c = task.dependencies; _b < _c.length; _b++) {
                    var dependency = _c[_b];
                    this.dependency_map[dependency] = this.dependency_map[dependency] || [];
                    this.dependency_map[dependency].push(task.id);
                }
            }
        };
        Gantt.prototype.refresh = function (tasks) {
            this.setup_tasks(tasks);
            this.change_view_mode();
        };
        Gantt.prototype.change_view_mode = function (mode) {
            if (mode === void 0) { mode = this.options.view_mode; }
            this.update_view_scale(mode);
            this.setup_dates();
            this.render();
            // fire viewmode_change event
            this.trigger_event('view_change', [mode]);
        };
        Gantt.prototype.update_view_scale = function (view_mode) {
            this.options.view_mode = view_mode;
            if (view_mode === VIEW_MODE.DAY) {
                this.options.step = 24;
                this.options.column_width = 38;
            }
            else if (view_mode === VIEW_MODE.HALF_DAY) {
                this.options.step = 24 / 2;
                this.options.column_width = 38;
            }
            else if (view_mode === VIEW_MODE.QUARTER_DAY) {
                this.options.step = 24 / 4;
                this.options.column_width = 38;
            }
            else if (view_mode === VIEW_MODE.WEEK) {
                this.options.step = 24 * 7;
                this.options.column_width = 140;
            }
            else if (view_mode === VIEW_MODE.MONTH) {
                this.options.step = 24 * 30;
                this.options.column_width = 120;
            }
            else if (view_mode === VIEW_MODE.YEAR) {
                this.options.step = 24 * 365;
                this.options.column_width = 120;
            }
        };
        Gantt.prototype.setup_dates = function () {
            this.setup_gantt_dates();
            this.setup_date_values();
        };
        Gantt.prototype.setup_gantt_dates = function () {
            if (this.gantt_start !== undefined && this.gantt_end !== undefined)
                return;
            this.gantt_start = this.gantt_end = null;
            for (var _i = 0, _a = this.tasks; _i < _a.length; _i++) {
                var task = _a[_i];
                // set global start and end date
                if (!this.gantt_start || task._start < this.gantt_start) {
                    this.gantt_start = task._start;
                }
                if (!this.gantt_end || task._end > this.gantt_end) {
                    this.gantt_end = task._end;
                }
            }
            this.gantt_start = date_utils.start_of(this.gantt_start, 'day');
            this.gantt_end = date_utils.start_of(this.gantt_end, 'day');
            console.log("this.gantt_start: ".concat(this.gantt_start));
            console.log("this.gantt_end: ".concat(this.gantt_end));
            // add date padding on both sides
            if (this.view_is([VIEW_MODE.QUARTER_DAY, VIEW_MODE.HALF_DAY])) {
                this.gantt_start = date_utils.add(this.gantt_start, -7, 'day');
                this.gantt_end = date_utils.add(this.gantt_end, 7, 'day');
            }
            else if (this.view_is(VIEW_MODE.MONTH)) {
                this.gantt_start = date_utils.start_of(this.gantt_start, 'year');
                this.gantt_end = date_utils.add(this.gantt_end, 1, 'year');
            }
            else if (this.view_is(VIEW_MODE.YEAR)) {
                this.gantt_start = date_utils.add(this.gantt_start, -2, 'year');
                this.gantt_end = date_utils.add(this.gantt_end, 2, 'year');
            }
            else {
                this.gantt_start = date_utils.add(this.gantt_start, -1, 'month');
                this.gantt_end = date_utils.add(this.gantt_end, 1, 'month');
            }
        };
        Gantt.prototype.setup_date_values = function () {
            this.dates = [];
            var cur_date = null;
            while (cur_date === null || cur_date < this.gantt_end) {
                if (!cur_date) {
                    cur_date = date_utils.clone(this.gantt_start);
                }
                else {
                    if (this.view_is(VIEW_MODE.YEAR)) {
                        cur_date = date_utils.add(cur_date, 1, 'year');
                    }
                    else if (this.view_is(VIEW_MODE.MONTH)) {
                        cur_date = date_utils.add(cur_date, 1, 'month');
                    }
                    else {
                        cur_date = date_utils.add(cur_date, this.options.step, 'hour');
                    }
                }
                this.dates.push(cur_date);
            }
        };
        Gantt.prototype.bind_events = function () {
            this.bind_grid_click();
            this.bind_bar_events();
        };
        Gantt.prototype.render = function () {
            this.clear();
            this.setup_layers();
            this.make_grid();
            this.make_dates();
            this.make_bars();
            this.make_arrows();
            this.map_arrows_on_bars();
            this.set_width();
            this.set_scroll_position();
        };
        Gantt.prototype.setup_layers = function () {
            this.layers = {};
            var layers = ['grid', 'date', 'arrow', 'progress', 'bar', 'details'];
            // make group layers
            for (var _i = 0, layers_1 = layers; _i < layers_1.length; _i++) {
                var layer = layers_1[_i];
                this.layers[layer] = createSVG('g', {
                    class: layer,
                    append_to: this.svg,
                });
            }
        };
        Gantt.prototype.make_grid = function () {
            this.make_grid_background();
            this.make_grid_rows();
            this.make_grid_header();
            this.make_grid_ticks();
            this.make_grid_highlights();
        };
        Gantt.prototype.make_grid_background = function () {
            var grid_width = this.dates.length * this.options.column_width;
            var grid_height = this.options.header_height +
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
            $.attr(this.svg, null, {
                height: grid_height + this.options.padding + 100,
                width: '100%',
            });
        };
        Gantt.prototype.make_grid_rows = function () {
            var rows_layer = createSVG('g', { append_to: this.layers.grid });
            var lines_layer = createSVG('g', { append_to: this.layers.grid });
            var row_width = this.dates.length * this.options.column_width;
            var row_height = this.options.bar_height + this.options.padding;
            var row_y = this.options.header_height + this.options.padding / 2;
            for (var _i = 0, _a = this.tasks; _i < _a.length; _i++) {
                _a[_i];
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
        };
        Gantt.prototype.make_grid_header = function () {
            console.log("this.dates.length: ".concat(this.dates.length));
            console.log("this.options.column_width: ".concat(this.options.column_width));
            var header_width = this.dates.length * this.options.column_width;
            var header_height = this.options.header_height + 10;
            createSVG('rect', {
                x: 0,
                y: 0,
                width: header_width,
                height: header_height,
                class: 'grid-header',
                append_to: this.layers.grid,
            });
        };
        Gantt.prototype.make_grid_ticks = function () {
            var tick_x = 0;
            var tick_y = this.options.header_height + this.options.padding / 2;
            var tick_height = (this.options.bar_height + this.options.padding) *
                this.tasks.length;
            for (var _i = 0, _a = this.dates; _i < _a.length; _i++) {
                var date = _a[_i];
                var tick_class = 'tick';
                // thick tick for monday
                if (this.view_is(VIEW_MODE.DAY) && date.getDate() === 1) {
                    tick_class += ' thick';
                }
                // thick tick for first week
                if (this.view_is(VIEW_MODE.WEEK) &&
                    date.getDate() >= 1 &&
                    date.getDate() < 8) {
                    tick_class += ' thick';
                }
                // thick ticks for quarters
                if (this.view_is(VIEW_MODE.MONTH) && date.getMonth() % 3 === 0) {
                    tick_class += ' thick';
                }
                createSVG('path', {
                    d: "M ".concat(tick_x, " ").concat(tick_y, " v ").concat(tick_height),
                    class: tick_class,
                    append_to: this.layers.grid,
                });
                if (this.view_is(VIEW_MODE.MONTH)) {
                    tick_x +=
                        (date_utils.get_days_in_month(date) *
                            this.options.column_width) /
                            30;
                }
                else {
                    tick_x += this.options.column_width;
                }
            }
        };
        Gantt.prototype.make_grid_highlights = function () {
            // highlight today's date
            if (this.view_is(VIEW_MODE.DAY)) {
                var x = (date_utils.diff(date_utils.today(), this.gantt_start, 'hour') /
                    this.options.step) *
                    this.options.column_width;
                var y = 0;
                var width = this.options.column_width;
                var height = (this.options.bar_height + this.options.padding) *
                    this.tasks.length +
                    this.options.header_height +
                    this.options.padding / 2;
                createSVG('rect', {
                    x: x,
                    y: y,
                    width: width,
                    height: height,
                    class: 'today-highlight',
                    append_to: this.layers.grid,
                });
            }
        };
        Gantt.prototype.make_dates = function () {
            for (var _i = 0, _a = this.get_dates_to_draw(); _i < _a.length; _i++) {
                var date = _a[_i];
                createSVG('text', {
                    x: date.lower_x,
                    y: date.lower_y,
                    innerHTML: date.lower_text,
                    class: 'lower-text',
                    append_to: this.layers.date,
                });
                if (date.upper_text) {
                    var $upper_text = createSVG('text', {
                        x: date.upper_x,
                        y: date.upper_y,
                        innerHTML: date.upper_text,
                        class: 'upper-text',
                        append_to: this.layers.date,
                    });
                    // remove out-of-bound dates
                    if ($upper_text.getBBox().x > this.layers.grid.getBBox().width) {
                        $upper_text.remove();
                    }
                }
            }
        };
        Gantt.prototype.get_dates_to_draw = function () {
            var _this = this;
            var last_date = null;
            return this.dates.map(function (date, i) {
                var d = _this.get_date_info(date, last_date, i);
                last_date = date;
                return d;
            });
        };
        Gantt.prototype.get_date_info = function (date, last_date, i) {
            if (!last_date) {
                last_date = date_utils.add(date, 1, 'year');
            }
            var date_text = {
                'Quarter Day_lower': date_utils.format(date, 'HH', this.options.language),
                'Half Day_lower': date_utils.format(date, 'HH', this.options.language),
                Day_lower: date.getDate() !== last_date.getDate()
                    ? date_utils.format(date, 'D', this.options.language)
                    : '',
                Week_lower: date.getMonth() !== last_date.getMonth()
                    ? date_utils.format(date, 'D MMM', this.options.language)
                    : date_utils.format(date, 'D', this.options.language),
                Month_lower: date_utils.format(date, 'MMMM', this.options.language),
                Year_lower: date_utils.format(date, 'YYYY', this.options.language),
                'Quarter Day_upper': date.getDate() !== last_date.getDate()
                    ? date_utils.format(date, 'D MMM', this.options.language)
                    : '',
                'Half Day_upper': date.getDate() !== last_date.getDate()
                    ? date.getMonth() !== last_date.getMonth()
                        ? date_utils.format(date, 'D MMM', this.options.language)
                        : date_utils.format(date, 'D', this.options.language)
                    : '',
                Day_upper: date.getMonth() !== last_date.getMonth()
                    ? date_utils.format(date, 'MMMM', this.options.language)
                    : '',
                Week_upper: date.getMonth() !== last_date.getMonth()
                    ? date_utils.format(date, 'MMMM', this.options.language)
                    : '',
                Month_upper: date.getFullYear() !== last_date.getFullYear()
                    ? date_utils.format(date, 'YYYY', this.options.language)
                    : '',
                Year_upper: date.getFullYear() !== last_date.getFullYear()
                    ? date_utils.format(date, 'YYYY', this.options.language)
                    : '',
            };
            var base_pos = {
                x: i * this.options.column_width,
                lower_y: this.options.header_height,
                upper_y: this.options.header_height - 25,
            };
            var x_pos = {
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
                upper_text: date_text["".concat(this.options.view_mode, "_upper")],
                lower_text: date_text["".concat(this.options.view_mode, "_lower")],
                upper_x: base_pos.x + x_pos["".concat(this.options.view_mode, "_upper")],
                upper_y: base_pos.upper_y,
                lower_x: base_pos.x + x_pos["".concat(this.options.view_mode, "_lower")],
                lower_y: base_pos.lower_y,
            };
        };
        Gantt.prototype.make_bars = function () {
            var _this = this;
            this.bars = this.tasks.map(function (task) {
                var bar = new Bar(_this, task);
                _this.layers.bar.appendChild(bar.group);
                return bar;
            });
        };
        Gantt.prototype.make_arrows = function () {
            var _this = this;
            this.arrows = [];
            var _loop_1 = function (task) {
                var arrows = [];
                if (!Array.isArray(task.dependencies))
                    return "continue";
                arrows = task.dependencies
                    .map(function (task_id) {
                    var dependency = _this.get_task(task_id);
                    if (!dependency)
                        return;
                    var arrow = new Arrow(_this, _this.bars[dependency._index], // from_task
                    _this.bars[task._index] // to_task
                    );
                    _this.layers.arrow.appendChild(arrow.element);
                    return arrow;
                })
                    .filter(Boolean); // filter falsy values
                this_1.arrows = this_1.arrows.concat(arrows);
            };
            var this_1 = this;
            for (var _i = 0, _a = this.tasks; _i < _a.length; _i++) {
                var task = _a[_i];
                _loop_1(task);
            }
        };
        Gantt.prototype.map_arrows_on_bars = function () {
            var _loop_2 = function (bar) {
                bar.arrows = this_2.arrows.filter(function (arrow) {
                    return (arrow.from_bar.task.id === bar.task.id ||
                        arrow.to_bar.task.id === bar.task.id);
                });
            };
            var this_2 = this;
            for (var _i = 0, _a = this.bars; _i < _a.length; _i++) {
                var bar = _a[_i];
                _loop_2(bar);
            }
        };
        Gantt.prototype.set_width = function () {
            var cur_width = this.svg.getBoundingClientRect().width;
            var actual_width = parseInt(this.svg
                .querySelector('.grid .grid-row')
                .getAttribute('width'));
            if (cur_width < actual_width) {
                this.svg.setAttribute('width', String(actual_width));
            }
        };
        Gantt.prototype.set_scroll_position = function () {
            var parent_element = this.svg.parentElement;
            if (!parent_element)
                return;
            var hours_before_first_task = date_utils.diff(this.get_oldest_starting_date(), this.gantt_start, 'hour');
            parent_element.scrollLeft = (hours_before_first_task / this.options.step) *
                this.options.column_width -
                this.options.column_width;
        };
        Gantt.prototype.bind_grid_click = function () {
            var _this = this;
            $.on(this.svg, this.options.popup_trigger, '.grid-row, .grid-header', function () {
                _this.unselect_all();
                _this.hide_popup();
            });
        };
        Gantt.prototype.bind_bar_events = function () {
            var _this = this;
            var is_dragging = false;
            var x_on_start = 0;
            var y_on_start = 0;
            var is_resizing_left = false;
            var is_resizing_right = false;
            var parent_bar_id = null;
            var bars = []; // instanceof Bar
            function action_in_progress() {
                return is_dragging || is_resizing_left || is_resizing_right;
            }
            $.on(this.svg, 'mousedown', '.bar-wrapper, .handle', function (e, element) {
                var bar_wrapper = $.closest('.bar-wrapper', element);
                if (element.classList.contains('left')) {
                    is_resizing_left = true;
                }
                else if (element.classList.contains('right')) {
                    is_resizing_right = true;
                }
                else if (element.classList.contains('bar-wrapper')) {
                    is_dragging = true;
                }
                bar_wrapper.classList.add('active');
                x_on_start = e.offsetX;
                y_on_start = e.offsetY;
                parent_bar_id = bar_wrapper.getAttribute('data-id');
                var ids = __spreadArray([
                    parent_bar_id
                ], _this.get_all_dependent_tasks(parent_bar_id), true);
                bars = ids.map(function (id) { return _this.get_bar(id); });
                _this.bar_being_dragged = parent_bar_id;
                bars.forEach(function (bar) {
                    var $bar = bar.bar;
                    $bar.ox = getX(bar.bar);
                    $bar.oy = getY(bar.bar);
                    $bar.owidth = getWidth(bar.bar);
                    $bar.finaldx = 0;
                });
            });
            $.on(this.svg, 'mousemove', null, function (e) {
                if (!action_in_progress())
                    return;
                var dx = e.offsetX - x_on_start;
                e.offsetY - y_on_start;
                bars.forEach(function (bar) {
                    var $bar = bar.bar;
                    $bar.finaldx = _this.get_snap_position(dx);
                    _this.hide_popup();
                    if (is_resizing_left) {
                        if (parent_bar_id === bar.task.id) {
                            bar.update_bar_position({
                                x: $bar.ox + $bar.finaldx,
                                width: $bar.owidth - $bar.finaldx,
                            });
                        }
                        else {
                            bar.update_bar_position({
                                x: $bar.ox + $bar.finaldx,
                            });
                        }
                    }
                    else if (is_resizing_right) {
                        if (parent_bar_id === bar.task.id) {
                            bar.update_bar_position({
                                width: $bar.owidth + $bar.finaldx,
                            });
                        }
                    }
                    else if (is_dragging) {
                        bar.update_bar_position({ x: $bar.ox + $bar.finaldx });
                    }
                });
            });
            document.addEventListener('mouseup', function () {
                if (is_dragging || is_resizing_left || is_resizing_right) {
                    bars.forEach(function (bar) { return bar.group.classList.remove('active'); });
                }
                is_dragging = false;
                is_resizing_left = false;
                is_resizing_right = false;
            });
            $.on(this.svg, 'mouseup', null, function () {
                _this.bar_being_dragged = null;
                bars.forEach(function (bar) {
                    var $bar = bar.bar;
                    if (!$bar.finaldx)
                        return;
                    bar.date_changed();
                    bar.set_action_completed();
                });
            });
            this.bind_bar_progress();
        };
        Gantt.prototype.bind_bar_progress = function () {
            var _this = this;
            var x_on_start = 0;
            var y_on_start = 0;
            var is_resizing = null;
            var bar = null;
            var $bar_progress = null;
            var $bar = null;
            $.on(this.svg, 'mousedown', '.handle.progress', function (e, handle) {
                is_resizing = true;
                x_on_start = e.offsetX;
                y_on_start = e.offsetY;
                var $bar_wrapper = $.closest('.bar-wrapper', handle);
                var id = $bar_wrapper.getAttribute('data-id');
                bar = _this.get_bar(id);
                $bar_progress = bar.bar_progress;
                $bar = bar.bar;
                $bar_progress.finaldx = 0;
                $bar_progress.owidth = getWidth($bar_progress);
                $bar_progress.min_dx = getWidth($bar_progress);
                $bar_progress.max_dx = getWidth($bar) - getWidth($bar_progress);
            });
            $.on(this.svg, 'mousemove', null, function (e) {
                if (!is_resizing)
                    return;
                var dx = e.offsetX - x_on_start;
                e.offsetY - y_on_start;
                if (dx > $bar_progress.max_dx) {
                    dx = $bar_progress.max_dx;
                }
                if (dx < $bar_progress.min_dx) {
                    dx = $bar_progress.min_dx;
                }
                var $handle = bar.handle_progress;
                $.attr($bar_progress, 'width', $bar_progress.owidth + dx);
                $.attr($handle, 'points', bar.get_progress_polygon_points());
                $bar_progress.finaldx = dx;
            });
            $.on(this.svg, 'mouseup', null, function () {
                is_resizing = false;
                if (!($bar_progress && $bar_progress.finaldx))
                    return;
                bar.progress_changed();
                bar.set_action_completed();
            });
        };
        Gantt.prototype.get_all_dependent_tasks = function (task_id) {
            var _this = this;
            var out = [];
            var to_process = [task_id];
            while (to_process.length) {
                var deps = to_process.reduce(function (acc, curr) {
                    acc = acc.concat(_this.dependency_map[curr]);
                    return acc;
                }, []);
                out = out.concat(deps);
                to_process = deps.filter(function (d) { return !to_process.includes(d); });
            }
            return out.filter(Boolean);
        };
        Gantt.prototype.get_snap_position = function (dx) {
            var odx = dx, rem, position;
            if (this.view_is(VIEW_MODE.WEEK)) {
                rem = dx % (this.options.column_width / 7);
                position =
                    odx -
                        rem +
                        (rem < this.options.column_width / 14
                            ? 0
                            : this.options.column_width / 7);
            }
            else if (this.view_is(VIEW_MODE.MONTH)) {
                rem = dx % (this.options.column_width / 30);
                position =
                    odx -
                        rem +
                        (rem < this.options.column_width / 60
                            ? 0
                            : this.options.column_width / 30);
            }
            else {
                rem = dx % this.options.column_width;
                position =
                    odx -
                        rem +
                        (rem < this.options.column_width / 2
                            ? 0
                            : this.options.column_width);
            }
            return position;
        };
        Gantt.prototype.unselect_all = function () {
            // @ts-ignore
            __spreadArray([], this.svg.querySelectorAll('.bar-wrapper'), true).forEach(function (el) {
                el.classList.remove('active');
            });
        };
        Gantt.prototype.view_is = function (viewModes) {
            var _this = this;
            if (typeof viewModes === typeof VIEW_MODE) {
                return this.options.view_mode === viewModes;
            }
            if (Array.isArray(viewModes)) {
                return viewModes.some(function (viewMode) { return _this.options.view_mode === viewMode; });
            }
            return false;
        };
        Gantt.prototype.get_task = function (id) {
            return this.tasks.find(function (task) {
                return task.id === id;
            });
        };
        Gantt.prototype.get_bar = function (id) {
            return this.bars.find(function (bar) {
                return bar.task.id === id;
            });
        };
        Gantt.prototype.show_popup = function (options) {
            if (!this.popup) {
                this.popup = new Popup(this.popup_wrapper, this.options.custom_popup_html);
            }
            this.popup.show(options);
        };
        Gantt.prototype.hide_popup = function () {
            this.popup && this.popup.hide();
        };
        Gantt.prototype.trigger_event = function (event, args) {
            if (this.options['on_' + event]) {
                this.options['on_' + event].apply(null, args);
            }
        };
        /**
         * Gets the oldest starting date from the list of tasks
         *
         * @returns Date
         * @memberof Gantt
         */
        Gantt.prototype.get_oldest_starting_date = function () {
            return this.tasks
                .map(function (task) { return task._start; })
                .reduce(function (prev_date, cur_date) {
                return cur_date <= prev_date ? cur_date : prev_date;
            });
        };
        /**
         * Clear all elements from the parent svg element
         *
         * @memberof Gantt
         */
        Gantt.prototype.clear = function () {
            this.svg.innerHTML = '';
        };
        Gantt.prototype.generate_id = function (task) {
            return task.name + '_' + Math.random().toString(36).slice(2, 12);
        };
        return Gantt;
    }());

    return Gantt;

})();
//# sourceMappingURL=frappe-gantt.js.map
