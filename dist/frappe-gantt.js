var Gantt = (function () {
    'use strict';

    const YEAR = 'year';
    const MONTH = 'month';
    const DAY = 'day';
    const HOUR = 'hour';
    const MINUTE = 'minute';
    const SECOND = 'second';
    const MILLISECOND = 'millisecond';

    const SHORTENED = {
        January: 'Jan',
        February: 'Feb',
        March: 'Mar',
        April: 'Apr',
        May: 'May',
        June: 'Jun',
        July: 'Jul',
        August: 'Aug',
        September: 'Sep',
        October: 'Oct',
        November: 'Nov',
        December: 'Dec',
    };

    var date_utils = {
        parse_duration(duration) {
            const regex = /([0-9])+(y|m|d|h|min|s|ms)/gm;
            const matches = regex.exec(duration);

            if (matches !== null) {
                if (matches[2] === 'y') {
                    return { duration: parseInt(matches[1]), scale: `year` };
                } else if (matches[2] === 'm') {
                    return { duration: parseInt(matches[1]), scale: `month` };
                } else if (matches[2] === 'd') {
                    return { duration: parseInt(matches[1]), scale: `day` };
                } else if (matches[2] === 'h') {
                    return { duration: parseInt(matches[1]), scale: `hour` };
                } else if (matches[2] === 'min') {
                    return { duration: parseInt(matches[1]), scale: `minute` };
                } else if (matches[2] === 's') {
                    return { duration: parseInt(matches[1]), scale: `second` };
                } else if (matches[2] === 'ms') {
                    return { duration: parseInt(matches[1]), scale: `millisecond` };
                }
            }
        },
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
                date_parts[1] = date_parts[1] ? date_parts[1] - 1 : 0;

                let vals = date_parts;

                if (time_parts && time_parts.length) {
                    if (time_parts.length === 4) {
                        time_parts[3] = '0.' + time_parts[3];
                        time_parts[3] = parseFloat(time_parts[3]) * 1000;
                    }
                    vals = vals.concat(time_parts);
                }
                return new Date(...vals);
            }
        },

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
        },

        format(date, format_string = 'YYYY-MM-DD HH:mm:ss.SSS', lang = 'en') {
            const dateTimeFormat = new Intl.DateTimeFormat(lang, {
                month: 'long',
            });
            const month_name = dateTimeFormat.format(date);
            const month_name_capitalized =
                month_name.charAt(0).toUpperCase() + month_name.slice(1);

            const values = this.get_date_values(date).map((d) => padStart(d, 2, 0));
            const format_map = {
                YYYY: values[0],
                MM: padStart(+values[1] + 1, 2, 0),
                DD: values[2],
                HH: values[3],
                mm: values[4],
                ss: values[5],
                SSS: values[6],
                D: values[2],
                MMMM: month_name_capitalized,
                MMM: SHORTENED[month_name_capitalized],
            };

            let str = format_string;
            const formatted_values = [];

            Object.keys(format_map)
                .sort((a, b) => b.length - a.length) // big string first
                .forEach((key) => {
                    if (str.includes(key)) {
                        str = str.replaceAll(key, `$${formatted_values.length}`);
                        formatted_values.push(format_map[key]);
                    }
                });

            formatted_values.forEach((value, i) => {
                str = str.replaceAll(`$${i}`, value);
            });

            return str;
        },

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
                }[scale],
            );
        },

        today() {
            const vals = this.get_date_values(new Date()).slice(0, 3);
            return new Date(...vals);
        },

        now() {
            return new Date();
        },

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
        },

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
        },

        clone(date) {
            return new Date(...this.get_date_values(date));
        },

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
        },

        get_days_in_month(date) {
            const no_of_days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

            const month = date.getMonth();

            if (month !== 1) {
                return no_of_days[month];
            }

            // Feb
            const year = date.getFullYear();
            if ((year % 4 === 0 && year % 100 != 0) || year % 400 === 0) {
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
            } else if (attr === 'clipPath') {
                elem.setAttribute('clip-path', 'url(#' + attrs[attr] + ')');
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
        begin = '0.1s',
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
            this.image_size = this.height - 5;
            this.compute_x();
            this.compute_y();
            this.compute_duration();
            this.corner_radius = this.gantt.options.bar_corner_radius;
            this.width = this.gantt.options.column_width * this.duration;
            this.progress_width =
                this.gantt.options.column_width *
                    this.duration *
                    (this.task.progress / 100) || 0;
            this.group = createSVG('g', {
                class:
                    'bar-wrapper' +
                    (this.task.custom_class ? ' ' + this.task.custom_class : '') +
                    (this.task.important ? ' important' : ''),
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

        prepare_expected_progress_values() {
            this.compute_expected_progress();
            this.expected_progress_width =
                this.gantt.options.column_width *
                    this.duration *
                    (this.expected_progress / 100) || 0;
        }

        draw() {
            this.draw_bar();
            this.draw_progress_bar();
            if (this.gantt.options.show_expected_progress) {
                this.prepare_expected_progress_values();
                this.draw_expected_progress_bar();
            }
            this.draw_label();
            this.draw_resize_handles();

            if (this.task.thumbnail) {
                this.draw_thumbnail();
            }
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

        draw_expected_progress_bar() {
            if (this.invalid) return;
            this.$expected_bar_progress = createSVG('rect', {
                x: this.x,
                y: this.y,
                width: this.expected_progress_width,
                height: this.height,
                rx: this.corner_radius,
                ry: this.corner_radius,
                class: 'bar-expected-progress',
                append_to: this.bar_group,
            });

            animateSVG(
                this.$expected_bar_progress,
                'width',
                0,
                this.expected_progress_width,
            );
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
            const x =
                (date_utils.diff(this.task._start, this.gantt.gantt_start, 'hour') /
                    this.gantt.options.step) *
                this.gantt.options.column_width;

            let $date_highlight = document.createElement('div');
            $date_highlight.id = `${this.task.id}-highlight`;
            $date_highlight.classList.add('date-highlight');
            $date_highlight.style.height = this.height * 0.8 + 'px';
            $date_highlight.style.width = this.width + 'px';
            $date_highlight.style.top =
                this.gantt.options.header_height - 25 + 'px';
            $date_highlight.style.left = x + 'px';
            this.$date_highlight = $date_highlight;
            this.gantt.$lower_header.prepend($date_highlight);

            animateSVG(this.$bar_progress, 'width', 0, this.progress_width);
        }

        draw_label() {
            let x_coord = this.x + this.$bar.getWidth() / 2;

            if (this.task.thumbnail) {
                x_coord = this.x + this.image_size + 5;
            }

            createSVG('text', {
                x: x_coord,
                y: this.y + this.height / 2,
                innerHTML: this.task.name,
                class: 'bar-label',
                append_to: this.bar_group,
            });
            // labels get BBox in the next tick
            requestAnimationFrame(() => this.update_label_position());
        }
        draw_thumbnail() {
            let x_offset = 10,
                y_offset = 2;
            let defs, clipPath;

            defs = createSVG('defs', {
                append_to: this.bar_group,
            });

            createSVG('rect', {
                id: 'rect_' + this.task.id,
                x: this.x + x_offset,
                y: this.y + y_offset,
                width: this.image_size,
                height: this.image_size,
                rx: '15',
                class: 'img_mask',
                append_to: defs,
            });

            clipPath = createSVG('clipPath', {
                id: 'clip_' + this.task.id,
                append_to: defs,
            });

            createSVG('use', {
                href: '#rect_' + this.task.id,
                append_to: clipPath,
            });

            createSVG('image', {
                x: this.x + x_offset,
                y: this.y + y_offset,
                width: this.image_size,
                height: this.image_size,
                class: 'bar-img',
                href: this.task.thumbnail,
                clipPath: 'clip_' + this.task.id,
                append_to: this.bar_group,
            });
        }

        draw_resize_handles() {
            if (this.invalid || this.gantt.options.readonly) return;

            const bar = this.$bar;
            const handle_width = 8;

            createSVG('rect', {
                x: bar.getX() + bar.getWidth() + handle_width - 4,
                y: bar.getY() + 1,
                width: handle_width,
                height: this.height - 2,
                rx: this.corner_radius,
                ry: this.corner_radius,
                class: 'handle right',
                append_to: this.handle_group,
            });

            createSVG('rect', {
                x: bar.getX() - handle_width - 4,
                y: bar.getY() + 1,
                width: handle_width,
                height: this.height - 2,
                rx: this.corner_radius,
                ry: this.corner_radius,
                class: 'handle left',
                append_to: this.handle_group,
            });

            this.$handle_progress = createSVG('polygon', {
                points: this.get_progress_polygon_points().join(','),
                class: 'handle progress',
                append_to: this.handle_group,
            });
        }

        get_progress_polygon_points() {
            const bar_progress = this.$bar_progress;
            let icon_width = 10;
            let icon_height = 15;

            return [
                bar_progress.getEndX() - icon_width / 2,
                bar_progress.getY() + bar_progress.getHeight() / 2,

                bar_progress.getEndX(),
                bar_progress.getY() +
                    bar_progress.getHeight() / 2 -
                    icon_height / 2,

                bar_progress.getEndX() + icon_width / 2,
                bar_progress.getY() + bar_progress.getHeight() / 2,

                bar_progress.getEndX(),
                bar_progress.getY() +
                    bar_progress.getHeight() / 2 +
                    icon_height / 2,

                bar_progress.getEndX() - icon_width / 2,
                bar_progress.getY() + bar_progress.getHeight() / 2,
            ];
        }

        bind() {
            if (this.invalid) return;
            this.setup_click_event();
        }

        setup_click_event() {
            let task_id = this.task.id;
            $.on(this.group, 'mouseover', (e) => {
                this.gantt.trigger_event('hover', [
                    this.task,
                    e.screenX,
                    e.screenY,
                    e,
                ]);
            });

            let timeout;
            $.on(
                this.group,
                'mouseenter',
                (e) =>
                    (timeout = setTimeout(() => {
                        this.show_popup(e.offsetX);
                        document.querySelector(
                            `#${task_id}-highlight`,
                        ).style.display = 'block';
                    }, 200)),
            );

            $.on(this.group, 'mouseleave', () => {
                clearTimeout(timeout);
                this.gantt.popup?.hide?.();
                document.querySelector(`#${task_id}-highlight`).style.display =
                    'none';
            });

            $.on(this.group, this.gantt.options.popup_trigger, () => {
                this.gantt.trigger_event('click', [this.task]);
            });

            $.on(this.group, 'dblclick', (e) => {
                if (this.action_completed) {
                    // just finished a move action, wait for a few seconds
                    return;
                }

                this.gantt.trigger_event('double_click', [this.task]);
            });
        }

        show_popup(x) {
            if (this.gantt.bar_being_dragged) return;

            const start_date = date_utils.format(
                this.task._start,
                'MMM D',
                this.gantt.options.language,
            );
            const end_date = date_utils.format(
                date_utils.add(this.task._end, -1, 'second'),
                'MMM D',
                this.gantt.options.language,
            );
            const subtitle = `${start_date} -  ${end_date}<br/>Progress: ${this.task.progress}`;

            this.gantt.show_popup({
                x,
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
                const valid_x = xs.reduce((_, curr) => {
                    return x >= curr;
                }, x);
                if (!valid_x) {
                    width = null;
                    return;
                }
                this.update_attr(bar, 'x', x);
                this.$date_highlight.style.left = x + 'px';
            }
            if (width) {
                this.update_attr(bar, 'width', width);
                this.$date_highlight.style.width = width + 'px';
            }
            this.update_label_position();
            this.update_handle_position();
            if (this.gantt.options.show_expected_progress) {
                this.date_changed();
                this.compute_duration();
                this.update_expected_progressbar_position();
            }
            this.update_progressbar_position();
            this.update_arrow_position();
        }

        update_label_position_on_horizontal_scroll({ x, sx }) {
            const container = document.querySelector('.gantt-container');
            const label = this.group.querySelector('.bar-label');
            const img = this.group.querySelector('.bar-img') || '';
            const img_mask = this.bar_group.querySelector('.img_mask') || '';

            let barWidthLimit = this.$bar.getX() + this.$bar.getWidth();
            let newLabelX = label.getX() + x;
            let newImgX = (img && img.getX() + x) || 0;
            let imgWidth = (img && img.getBBox().width + 7) || 7;
            let labelEndX = newLabelX + label.getBBox().width + 7;
            let viewportCentral = sx + container.clientWidth / 2;

            if (label.classList.contains('big')) return;

            if (labelEndX < barWidthLimit && x > 0 && labelEndX < viewportCentral) {
                label.setAttribute('x', newLabelX);
                if (img) {
                    img.setAttribute('x', newImgX);
                    img_mask.setAttribute('x', newImgX);
                }
            } else if (
                newLabelX - imgWidth > this.$bar.getX() &&
                x < 0 &&
                labelEndX > viewportCentral
            ) {
                label.setAttribute('x', newLabelX);
                if (img) {
                    img.setAttribute('x', newImgX);
                    img_mask.setAttribute('x', newImgX);
                }
            }
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
                date_utils.add(new_end_date, -1, 'second'),
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
            const new_start_date = date_utils.add(
                this.gantt.gantt_start,
                x_in_units * this.gantt.options.step,
                'hour',
            );
            const width_in_units = bar.getWidth() / this.gantt.options.column_width;
            const new_end_date = date_utils.add(
                new_start_date,
                width_in_units * this.gantt.options.step,
                'hour',
            );

            return { new_start_date, new_end_date };
        }

        compute_progress() {
            const progress =
                (this.$bar_progress.getWidth() / this.$bar.getWidth()) * 100;
            return parseInt(progress, 10);
        }

        compute_expected_progress() {
            this.expected_progress =
                date_utils.diff(date_utils.today(), this.task._start, 'hour') /
                this.gantt.options.step;
            this.expected_progress =
                ((this.expected_progress < this.duration
                    ? this.expected_progress
                    : this.duration) *
                    100) /
                this.duration;
        }

        compute_x() {
            const { step, column_width } = this.gantt.options;
            const task_start = this.task._start;
            const gantt_start = this.gantt.gantt_start;

            const diff = date_utils.diff(task_start, gantt_start, 'hour');
            let x = (diff / step) * column_width;

            if (this.gantt.view_is('Month')) {
                const diff = date_utils.diff(task_start, gantt_start, 'day');
                x = (diff * column_width) / 30;
            }
            this.x = x;
        }

        compute_y() {
            this.y =
                this.gantt.options.header_height +
                this.gantt.options.padding +
                this.task._index * (this.height + this.gantt.options.padding);
        }

        compute_duration() {
            this.duration =
                date_utils.diff(this.task._end, this.task._start, 'hour') /
                this.gantt.options.step;
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

        update_expected_progressbar_position() {
            if (this.invalid) return;
            this.$expected_bar_progress.setAttribute('x', this.$bar.getX());
            this.compute_expected_progress();
            this.$expected_bar_progress.setAttribute(
                'width',
                this.gantt.options.column_width *
                    this.duration *
                    (this.expected_progress / 100) || 0,
            );
        }

        update_progressbar_position() {
            if (this.invalid || this.gantt.options.readonly) return;
            this.$bar_progress.setAttribute('x', this.$bar.getX());
            this.$bar_progress.setAttribute(
                'width',
                this.$bar.getWidth() * (this.task.progress / 100),
            );
        }

        update_label_position() {
            const img_mask = this.bar_group.querySelector('.img_mask') || '';
            const bar = this.$bar,
                label = this.group.querySelector('.bar-label'),
                img = this.group.querySelector('.bar-img');

            let padding = 5;
            let x_offset_label_img = this.image_size + 10;
            const labelWidth = label.getBBox().width;
            const barWidth = bar.getWidth();
            if (labelWidth > barWidth) {
                label.classList.add('big');
                if (img) {
                    img.setAttribute('x', bar.getX() + bar.getWidth() + padding);
                    img_mask.setAttribute(
                        'x',
                        bar.getX() + bar.getWidth() + padding,
                    );
                    label.setAttribute(
                        'x',
                        bar.getX() + bar.getWidth() + x_offset_label_img,
                    );
                } else {
                    label.setAttribute('x', bar.getX() + bar.getWidth() + padding);
                }
            } else {
                label.classList.remove('big');
                if (img) {
                    img.setAttribute('x', bar.getX() + padding);
                    img_mask.setAttribute('x', bar.getX() + padding);
                    label.setAttribute(
                        'x',
                        bar.getX() + barWidth / 2 + x_offset_label_img,
                    );
                } else {
                    label.setAttribute(
                        'x',
                        bar.getX() + barWidth / 2 - labelWidth / 2,
                    );
                }
            }
        }

        update_handle_position() {
            if (this.invalid || this.gantt.options.readonly) return;
            const bar = this.$bar;
            this.handle_group
                .querySelector('.handle.left')
                .setAttribute('x', bar.getX() - 12);
            this.handle_group
                .querySelector('.handle.right')
                .setAttribute('x', bar.getEndX() + 4);
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

            const end_x =
                this.to_task.$bar.getX() - this.gantt.options.padding / 2 - 7;
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
            }

            // set position
            let position_meta;
            if (target_element instanceof HTMLElement) {
                position_meta = target_element.getBoundingClientRect();
            } else if (target_element instanceof SVGElement) {
                position_meta = options.target_element.getBBox();
            }

            this.parent.style.left = options.x - this.parent.clientWidth / 2 + 'px';
            this.parent.style.top =
                position_meta.y + position_meta.height + 10 + 'px';

            this.pointer.style.left = this.parent.clientWidth / 2 + 'px';
            this.pointer.style.top = '-15px';

            // show
            this.parent.style.opacity = 1;
        }

        hide() {
            this.parent.style.opacity = 0;
            this.parent.style.left = 0;
        }
    }

    const VIEW_MODE = {
        HOUR: 'Hour',
        QUARTER_DAY: 'Quarter Day',
        HALF_DAY: 'Half Day',
        DAY: 'Day',
        WEEK: 'Week',
        MONTH: 'Month',
        YEAR: 'Year',
    };

    const VIEW_MODE_PADDING = {
        HOUR: ['7d', '7d'],
        QUARTER_DAY: ['7d', '7d'],
        HALF_DAY: ['7d', '7d'],
        DAY: ['1m', '1m'],
        WEEK: ['1m', '1m'],
        MONTH: ['1m', '1m'],
        YEAR: ['2y', '2y'],
    };

    const DEFAULT_OPTIONS = {
        header_height: 65,
        column_width: 30,
        step: 24,
        view_modes: [...Object.values(VIEW_MODE)],
        bar_height: 30,
        bar_corner_radius: 3,
        arrow_curve: 5,
        padding: 18,
        view_mode: 'Day',
        date_format: 'YYYY-MM-DD',
        popup_trigger: 'click',
        show_expected_progress: false,
        popup: null,
        language: 'en',
        readonly: false,
        highlight_weekend: true,
        scroll_to: 'start',
        lines: 'both',
        auto_move_label: true,
        today_button: true,
        view_mode_select: false,
    };

    class Gantt {
        constructor(wrapper, tasks, options) {
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
                        " HTML DOM element or SVG DOM element for the 'element' parameter",
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
            this.$popup_wrapper = document.createElement('div');
            this.$popup_wrapper.classList.add('popup-wrapper');
            this.$container.appendChild(this.$popup_wrapper);
        }

        setup_options(options) {
            this.options = { ...DEFAULT_OPTIONS, ...options };
            if (!options.view_mode_padding) options.view_mode_padding = {};
            for (let [key, value] of Object.entries(options.view_mode_padding)) {
                if (typeof value === 'string') {
                    // Configure for single value given
                    options.view_mode_padding[key] = [value, value];
                }
            }

            this.options.view_mode_padding = {
                ...VIEW_MODE_PADDING,
                ...options.view_mode_padding,
            };
        }

        setup_tasks(tasks) {
            // prepare tasks
            this.tasks = tasks.map((task, i) => {
                // convert to Date objects
                task._start = date_utils.parse(task.start);
                if (task.end === undefined && task.duration !== undefined) {
                    task.end = task._start;
                    let durations = task.duration.split(' ');

                    durations.forEach((tmpDuration) => {
                        let { duration, scale } =
                            date_utils.parse_duration(tmpDuration);
                        task.end = date_utils.add(task.end, duration, scale);
                    });
                }
                task._end = date_utils.parse(task.end);
                let diff = date_utils.diff(task._end, task._start, 'year');
                if (diff < 0) {
                    throw Error(
                        "start of task can't be after end of task: in task #, " +
                            (i + 1),
                    );
                }
                // make task invalid if duration too large
                if (date_utils.diff(task._end, task._start, 'year') > 10) {
                    task.end = null;
                }

                // cache index
                task._index = i;

                // invalid dates
                if (!task.start && !task.end) {
                    const today = date_utils.today();
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
                const task_end_values = date_utils.get_date_values(task._end);
                if (task_end_values.slice(3).every((d) => d === 0)) {
                    task._end = date_utils.add(task._end, 24, 'hour');
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
                            .map((d) => d.trim().replaceAll(' ', '_'))
                            .filter((d) => d);
                    }
                    task.dependencies = deps;
                }

                // uids
                if (!task.id) {
                    task.id = generate_id(task);
                } else if (typeof task.id === 'string') {
                    task.id = task.id.replaceAll(' ', '_');
                } else {
                    task.id = `${task.id}`;
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
            if (view_mode === VIEW_MODE.HOUR) {
                this.options.step = 24 / 24;
                this.options.column_width = 38;
            } else if (view_mode === VIEW_MODE.DAY) {
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
            let gantt_start, gantt_end;
            if (!this.gantt_start) gantt_start = new Date();
            else gantt_start = date_utils.start_of(this.gantt_start, 'day');
            if (!this.gantt_end) gantt_end = new Date();
            else gantt_end = date_utils.start_of(this.gantt_end, 'day');

            // add date padding on both sides
            let viewKey;
            for (let [key, value] of Object.entries(VIEW_MODE)) {
                if (value === this.options.view_mode) {
                    viewKey = key;
                }
            }
            const [padding_start, padding_end] = this.options.view_mode_padding[
                viewKey
            ].map(date_utils.parse_duration);
            gantt_start = date_utils.add(
                gantt_start,
                -padding_start.duration,
                padding_start.scale,
            );

            let format_string;
            if (this.view_is(VIEW_MODE.YEAR)) {
                format_string = 'YYYY';
            } else if (this.view_is(VIEW_MODE.MONTH)) {
                format_string = 'YYYY-MM';
            } else if (this.view_is(VIEW_MODE.DAY)) {
                format_string = 'YYYY-MM-DD';
            } else {
                format_string = 'YYYY-MM-DD HH';
            }
            this.gantt_start = date_utils.parse(
                date_utils.format(gantt_start, format_string),
            );
            this.gantt_start.setHours(0, 0, 0, 0);
            this.gantt_end = date_utils.add(
                gantt_end,
                padding_end.duration,
                padding_end.scale,
            );
        }

        setup_date_values() {
            this.dates = [];
            let cur_date = null;

            while (cur_date === null || cur_date < this.gantt_end) {
                if (!cur_date) {
                    cur_date = date_utils.clone(this.gantt_start);
                } else {
                    if (this.view_is(VIEW_MODE.YEAR)) {
                        cur_date = date_utils.add(cur_date, 1, 'year');
                    } else if (this.view_is(VIEW_MODE.MONTH)) {
                        cur_date = date_utils.add(cur_date, 1, 'month');
                    } else {
                        cur_date = date_utils.add(
                            cur_date,
                            this.options.step,
                            'hour',
                        );
                    }
                }
                this.dates.push(cur_date);
            }
        }

        bind_events() {
            if (this.options.readonly) return;
            this.bind_grid_click();
            this.bind_bar_events();
        }

        render() {
            this.clear();
            this.setup_layers();
            this.make_grid();
            this.make_dates();
            this.make_bars();
            this.make_grid_extras();
            this.make_arrows();
            this.map_arrows_on_bars();
            this.set_width();
            this.set_scroll_position(this.options.scroll_to);
        }

        setup_layers() {
            this.layers = {};
            const layers = ['grid', 'arrow', 'progress', 'bar', 'details'];
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
        }

        make_grid_extras() {
            this.make_grid_highlights();
            this.make_grid_ticks();
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
                append_to: this.$svg,
            });

            $.attr(this.$svg, {
                height: grid_height + this.options.padding + 100,
                width: '100%',
            });
        }

        make_grid_rows() {
            const rows_layer = createSVG('g', { append_to: this.layers.grid });

            const row_width = this.dates.length * this.options.column_width;
            const row_height = this.options.bar_height + this.options.padding;

            let row_y = this.options.header_height + this.options.padding / 2;

            for (let _ of this.tasks) {
                createSVG('rect', {
                    x: 0,
                    y: row_y,
                    width: row_width,
                    height: row_height,
                    class: 'grid-row',
                    append_to: rows_layer,
                });
                if (
                    this.options.lines === 'both' ||
                    this.options.lines === 'horizontal'
                ) ;

                row_y += this.options.bar_height + this.options.padding;
            }
        }

        make_grid_header() {
            document.querySelector('.grid-header');

            let $header = document.createElement('div');
            $header.style.height = this.options.header_height + 10 + 'px';
            $header.style.width =
                this.dates.length * this.options.column_width + 'px';
            $header.classList.add('grid-header');
            this.$header = $header;
            this.$container.appendChild($header);

            let $upper_header = document.createElement('div');
            $upper_header.classList.add('upper-header');
            this.$upper_header = $upper_header;
            this.$header.appendChild($upper_header);

            let $lower_header = document.createElement('div');
            $lower_header.classList.add('lower-header');
            this.$lower_header = $lower_header;
            this.$header.appendChild($lower_header);

            this.make_side_header();
        }

        make_side_header() {
            let $side_header = document.createElement('div');
            $side_header.classList.add('side-header');

            // Create view mode change select
            if (this.options.view_mode_select) {
                const $select = document.createElement('select');
                $select.classList.add('viewmode-select');

                const $el = document.createElement('option');
                $el.selected = true;
                $el.disabled = true;
                $el.textContent = 'Mode';
                $select.appendChild($el);

                for (const key in VIEW_MODE) {
                    const $option = document.createElement('option');
                    $option.value = VIEW_MODE[key];
                    $option.textContent = VIEW_MODE[key];
                    $select.appendChild($option);
                }
                // $select.value = this.options.view_mode
                $select.addEventListener(
                    'change',
                    function () {
                        this.change_view_mode($select.value);
                    }.bind(this),
                );
                $side_header.appendChild($select);
            }

            // Create today button
            if (this.options.today_button) {
                let $today_button = document.createElement('button');
                $today_button.classList.add('today-button');
                $today_button.textContent = 'Today';
                $today_button.onclick = this.scroll_today.bind(this);
                $side_header.appendChild($today_button);
            }

            this.$header.appendChild($side_header);
            const { left, y } = this.$header.getBoundingClientRect();
            const width = Math.min(
                this.$header.clientWidth,
                this.$container.clientWidth,
            );
            $side_header.style.left =
                left +
                this.$container.scrollLeft +
                width -
                $side_header.clientWidth +
                'px';
            $side_header.style.top = y + 10 + 'px';
        }

        make_grid_ticks() {
            if (!['both', 'vertical', 'horizontal'].includes(this.options.lines))
                return;
            let tick_x = 0;
            let tick_y = this.options.header_height + this.options.padding / 2;
            let tick_height =
                (this.options.bar_height + this.options.padding) *
                this.tasks.length;

            let $lines_layer = createSVG('g', {
                class: 'lines_layer',
                append_to: this.layers.grid,
            });

            let row_y = this.options.header_height + this.options.padding / 2;

            const row_width = this.dates.length * this.options.column_width;
            const row_height = this.options.bar_height + this.options.padding;
            if (this.options.lines !== 'vertical') {
                for (let _ of this.tasks) {
                    createSVG('line', {
                        x1: 0,
                        y1: row_y + row_height,
                        x2: row_width,
                        y2: row_y + row_height,
                        class: 'row-line',
                        append_to: $lines_layer,
                    });
                    row_y += row_height;
                }
            }
            if (this.options.lines === 'horizontal') return;
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
                if (this.view_is(VIEW_MODE.MONTH) && date.getMonth() % 3 === 0) {
                    tick_class += ' thick';
                }

                createSVG('path', {
                    d: `M ${tick_x} ${tick_y} v ${tick_height}`,
                    class: tick_class,
                    append_to: this.layers.grid,
                });

                if (this.view_is(VIEW_MODE.MONTH)) {
                    tick_x +=
                        (date_utils.get_days_in_month(date) *
                            this.options.column_width) /
                        30;
                } else {
                    tick_x += this.options.column_width;
                }
            }
        }

        highlightWeekends() {
            if (!this.view_is('Day') && !this.view_is('Half Day')) return;
            for (
                let d = new Date(this.gantt_start);
                d <= this.gantt_end;
                d.setDate(d.getDate() + 1)
            ) {
                if (d.getDay() === 0 || d.getDay() === 6) {
                    const x =
                        (date_utils.diff(d, this.gantt_start, 'hour') /
                            this.options.step) *
                        this.options.column_width;
                    const height =
                        (this.options.bar_height + this.options.padding) *
                        this.tasks.length;
                    createSVG('rect', {
                        x,
                        y: this.options.header_height + this.options.padding / 2,
                        width:
                            (this.view_is('Day') ? 1 : 2) *
                            this.options.column_width,
                        height,
                        class: 'holiday-highlight',
                        append_to: this.layers.grid,
                    });
                }
            }
        }

        //compute the horizontal x distance
        computeGridHighlightDimensions(view_mode) {
            let x = this.options.column_width / 2;

            if (this.view_is(VIEW_MODE.DAY)) {
                let today = date_utils.today();
                return {
                    x:
                        x +
                        (date_utils.diff(today, this.gantt_start, 'hour') /
                            this.options.step) *
                            this.options.column_width,
                    date: today,
                };
            }

            for (let date of this.dates) {
                const todayDate = new Date();
                const startDate = new Date(date);
                const endDate = new Date(date);
                switch (view_mode) {
                    case VIEW_MODE.WEEK:
                        endDate.setDate(date.getDate() + 7);
                        break;
                    case VIEW_MODE.MONTH:
                        endDate.setMonth(date.getMonth() + 1);
                        break;
                    case VIEW_MODE.YEAR:
                        endDate.setFullYear(date.getFullYear() + 1);
                        break;
                }
                if (todayDate >= startDate && todayDate <= endDate) {
                    return { x, date: startDate };
                } else {
                    x += this.options.column_width;
                }
            }
        }

        make_grid_highlights() {
            if (this.options.highlight_weekend) this.highlightWeekends();
            // highlight today's | week's | month's | year's
            if (
                this.view_is(VIEW_MODE.DAY) ||
                this.view_is(VIEW_MODE.WEEK) ||
                this.view_is(VIEW_MODE.MONTH) ||
                this.view_is(VIEW_MODE.YEAR)
            ) {
                // Used as we must find the _end_ of session if view is not Day
                const { x: left, date } = this.computeGridHighlightDimensions(
                    this.options.view_mode,
                );
                const top = this.options.header_height + this.options.padding / 2;
                const height =
                    (this.options.bar_height + this.options.padding) *
                    this.tasks.length;
                this.$current_highlight = this.create_el({
                    top,
                    left,
                    height,
                    classes: 'current-highlight',
                    append_to: this.$container,
                });
                let $today = document.getElementById(
                    date_utils.format(date).replaceAll(' ', '_'),
                );

                $today.classList.add('current-date-highlight');
                $today.style.top = +$today.style.top.slice(0, -2) - 4 + 'px';
                $today.style.left = +$today.style.left.slice(0, -2) - 8 + 'px';
            }
        }

        create_el({ left, top, width, height, id, classes, append_to }) {
            let $el = document.createElement('div');
            $el.classList.add(classes);
            $el.style.top = top + 'px';
            $el.style.left = left + 'px';
            if (id) $el.id = id;
            if (width) $el.style.width = height + 'px';
            if (height) $el.style.height = height + 'px';
            append_to.appendChild($el);
            return $el;
        }

        make_dates() {
            this.upper_texts_x = {};
            this.get_dates_to_draw().forEach((date, i) => {
                let $lower_text = this.create_el({
                    left: date.lower_x,
                    top: date.lower_y,
                    id: date.formatted_date,
                    classes: 'lower-text',
                    append_to: this.$lower_header,
                });
                $lower_text.innerText = date.lower_text;
                $lower_text.style.left =
                    +$lower_text.style.left.slice(0, -2) -
                    $lower_text.clientWidth / 2 +
                    'px';

                if (date.upper_text) {
                    this.upper_texts_x[date.upper_text] = date.upper_x;
                    let $upper_text = document.createElement('div');
                    $upper_text.classList.add('upper-text');
                    $upper_text.style.left = date.upper_x + 'px';
                    $upper_text.style.top = date.upper_y + 'px';
                    $upper_text.innerText = date.upper_text;
                    this.$upper_header.appendChild($upper_text);

                    // remove out-of-bound dates
                    if (date.upper_x > this.layers.grid.getBBox().width) {
                        $upper_text.remove();
                    }
                }
            });
        }

        get_dates_to_draw() {
            let last_date = null;
            const dates = this.dates.map((date, i) => {
                const d = this.get_date_info(date, last_date, i);
                last_date = d;
                return d;
            });
            return dates;
        }

        get_date_info(date, last_date_info) {
            let last_date = last_date_info
                ? last_date_info.date
                : date_utils.add(date, 1, 'day');
            const date_text = {
                Hour_lower: date_utils.format(date, 'HH', this.options.language),
                'Quarter Day_lower': date_utils.format(
                    date,
                    'HH',
                    this.options.language,
                ),
                'Half Day_lower': date_utils.format(
                    date,
                    'HH',
                    this.options.language,
                ),
                Day_lower:
                    date.getDate() !== last_date.getDate()
                        ? date_utils.format(date, 'D', this.options.language)
                        : '',
                Week_lower:
                    date.getMonth() !== last_date.getMonth()
                        ? date_utils.format(date, 'D MMM', this.options.language)
                        : date_utils.format(date, 'D', this.options.language),
                Month_lower: date_utils.format(date, 'MMMM', this.options.language),
                Year_lower: date_utils.format(date, 'YYYY', this.options.language),
                Hour_upper:
                    date.getDate() !== last_date.getDate()
                        ? date_utils.format(date, 'D MMMM', this.options.language)
                        : '',
                'Quarter Day_upper':
                    date.getDate() !== last_date.getDate()
                        ? date_utils.format(date, 'D MMM', this.options.language)
                        : '',
                'Half Day_upper':
                    date.getDate() !== last_date.getDate()
                        ? date.getMonth() !== last_date.getMonth()
                            ? date_utils.format(
                                  date,
                                  'D MMM',
                                  this.options.language,
                              )
                            : date_utils.format(date, 'D', this.options.language)
                        : '',
                Day_upper:
                    date.getMonth() !== last_date.getMonth() || !last_date_info
                        ? date_utils.format(date, 'MMMM', this.options.language)
                        : '',
                Week_upper:
                    date.getMonth() !== last_date.getMonth()
                        ? date_utils.format(date, 'MMMM', this.options.language)
                        : '',
                Month_upper:
                    date.getFullYear() !== last_date.getFullYear()
                        ? date_utils.format(date, 'YYYY', this.options.language)
                        : '',
                Year_upper:
                    date.getFullYear() !== last_date.getFullYear()
                        ? date_utils.format(date, 'YYYY', this.options.language)
                        : '',
            };
            let column_width = this.view_is(VIEW_MODE.MONTH)
                ? (date_utils.get_days_in_month(date) * this.options.column_width) /
                  30
                : this.options.column_width;
            const base_pos = {
                x: last_date_info
                    ? last_date_info.base_pos_x + last_date_info.column_width
                    : 0,
                lower_y: this.options.header_height - 20,
                upper_y: this.options.header_height - 50,
            };
            const x_pos = {
                Hour_lower: column_width / 2,
                Hour_upper: column_width * 12,
                'Quarter Day_lower': column_width / 2,
                'Quarter Day_upper': column_width * 2,
                'Half Day_lower': column_width / 2,
                'Half Day_upper': column_width,
                Day_lower: column_width / 2,
                Day_upper: column_width / 2,
                Week_lower: column_width / 2,
                Week_upper: (column_width * 4) / 2,
                Month_lower: column_width / 2,
                Month_upper: column_width / 2,
                Year_lower: column_width / 2,
                Year_upper: (column_width * 30) / 2,
            };
            return {
                date,
                formatted_date: date_utils.format(date).replaceAll(' ', '_'),
                column_width,
                base_pos_x: base_pos.x,
                upper_text: this.options.lower_text
                    ? this.options.upper_text(
                          date,
                          this.options.view_mode,
                          date_text[`${this.options.view_mode}_upper`],
                      )
                    : date_text[`${this.options.view_mode}_upper`],
                lower_text: this.options.lower_text
                    ? this.options.lower_text(
                          date,
                          this.options.view_mode,
                          date_text[`${this.options.view_mode}_lower`],
                      )
                    : date_text[`${this.options.view_mode}_lower`],
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
                            this.bars[task._index], // to_task
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
            const actual_width = this.$svg.querySelector('.grid .grid-row')
                ? this.$svg.querySelector('.grid .grid-row').getAttribute('width')
                : 0;
            if (cur_width < actual_width) {
                this.$svg.setAttribute('width', actual_width);
            }
        }

        set_scroll_position(date) {
            if (!date || date === 'start') {
                date = this.gantt_start;
            } else if (date === 'today') {
                return this.scroll_today();
            } else if (typeof date === 'string') {
                date = date_utils.parse(date);
            }

            const parent_element = this.$svg.parentElement;
            if (!parent_element) return;

            const hours_before_first_task =
                date_utils.diff(date, this.gantt_start, 'hour') + 24;

            const scroll_pos =
                (hours_before_first_task / this.options.step) *
                    this.options.column_width -
                this.options.column_width;
            parent_element.scrollTo({ left: scroll_pos, behavior: 'smooth' });
        }

        scroll_today() {
            this.set_scroll_position(new Date());
        }

        bind_grid_click() {
            $.on(
                this.$svg,
                this.options.popup_trigger,
                '.grid-row, .grid-header',
                () => {
                    this.unselect_all();
                    this.hide_popup();
                },
            );
        }

        bind_bar_events() {
            let is_dragging = false;
            let x_on_start = 0;
            let x_on_scroll_start = 0;
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
                bars.forEach((bar) => bar.group.classList.remove('active'));

                if (element.classList.contains('left')) {
                    is_resizing_left = true;
                } else if (element.classList.contains('right')) {
                    is_resizing_right = true;
                } else if (element.classList.contains('bar-wrapper')) {
                    is_dragging = true;
                }

                bar_wrapper.classList.add('active');
                this.popup.parent.classList.add('hidden');

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
            $.on(this.$container, 'scroll', (e) => {
                let elements = document.querySelectorAll('.bar-wrapper');
                let localBars = [];
                const ids = [];
                let dx;
                if (x_on_scroll_start) {
                    dx = e.currentTarget.scrollLeft - x_on_scroll_start;
                }

                const daysSinceStart =
                    ((e.currentTarget.scrollLeft / this.options.column_width) *
                        this.options.step) /
                    24;
                let format_str = 'D MMM';
                if (['Year', 'Month'].includes(this.options.view_mode))
                    format_str = 'YYYY';
                else if (['Day', 'Week'].includes(this.options.view_mode))
                    format_str = 'MMMM';
                else if (this.view_is('Half Day')) format_str = 'D';
                else if (this.view_is('Hour')) format_str = 'D MMMM';

                let currentUpper = date_utils.format(
                    date_utils.add(this.gantt_start, daysSinceStart, 'day'),
                    format_str,
                );
                const upperTexts = Array.from(
                    document.querySelectorAll('.upper-text'),
                );
                const $el = upperTexts.find(
                    (el) => el.textContent === currentUpper,
                );
                if ($el && !$el.classList.contains('current-upper')) {
                    const $current = document.querySelector('.current-upper');
                    if ($current) {
                        $current.classList.remove('current-upper');
                        $current.style.left =
                            this.upper_texts_x[$current.textContent] + 'px';
                        $current.style.top = this.options.header_height - 50 + 'px';
                    }

                    $el.classList.add('current-upper');
                    let dimensions = this.$svg.getBoundingClientRect();
                    $el.style.left =
                        dimensions.x + this.$container.scrollLeft + 10 + 'px';
                    $el.style.top =
                        dimensions.y + this.options.header_height - 50 + 'px';
                }

                Array.prototype.forEach.call(elements, function (el, i) {
                    ids.push(el.getAttribute('data-id'));
                });

                if (dx) {
                    localBars = ids.map((id) => this.get_bar(id));
                    if (this.options.auto_move_label) {
                        localBars.forEach((bar) => {
                            bar.update_label_position_on_horizontal_scroll({
                                x: dx,
                                sx: e.currentTarget.scrollLeft,
                            });
                        });
                    }
                }

                x_on_scroll_start = e.currentTarget.scrollLeft;
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
                    } else if (is_dragging && !this.options.readonly) {
                        bar.update_bar_position({ x: $bar.ox + $bar.finaldx });
                    }
                });
            });

            document.addEventListener('mouseup', (e) => {
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

                $bar_progress.finaldx = 0;
                bar.progress_changed();
                bar.set_action_completed();
                bar = null;
                $bar_progress = null;
                $bar = null;
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
            this.popup.parent.classList.remove('hidden');
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
            if (this.options.popup === false) return;
            if (!this.popup) {
                this.popup = new Popup(this.$popup_wrapper, this.options.popup);
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
            if (!this.tasks.length) return new Date();
            return this.tasks
                .map((task) => task._start)
                .reduce((prev_date, cur_date) =>
                    cur_date <= prev_date ? cur_date : prev_date,
                );
        }

        /**
         * Clear all elements from the parent svg element
         *
         * @memberof Gantt
         */
        clear() {
            this.$svg.innerHTML = '';
            this.$header?.remove?.();
            this.$current_highlight?.remove?.();
            this.popup?.hide?.();
        }
    }

    Gantt.VIEW_MODE = VIEW_MODE;

    function generate_id(task) {
        return task.name + '_' + Math.random().toString(36).slice(2, 12);
    }

    return Gantt;

})();
//# sourceMappingURL=frappe-gantt.js.map
