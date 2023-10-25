var Scheduler = (function () {
    'use strict';

    const YEAR = 'year';
    const MONTH = 'month';
    const DAY = 'day';
    const HOUR = 'hour';
    const MINUTE = 'minute';
    const SECOND = 'second';
    const MILLISECOND = 'millisecond';

    var date_utils = {
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
                month: 'long'
            });
            const month_name = dateTimeFormat.format(date);
            const month_name_capitalized =
                month_name.charAt(0).toUpperCase() + month_name.slice(1);

            const values = this.get_date_values(date).map(d => padStart(d, 2, 0));
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
                MMM: month_name_capitalized,
            };

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
                }[scale]
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
        constructor(scheduler, task) {
            this.set_defaults(scheduler, task);
            this.prepare();
            this.draw();
            this.bind();
        }

        set_defaults(scheduler, task) {
            this.action_completed = false;
            this.scheduler = scheduler;
            this.task = task;
        }

        prepare() {
            this.prepare_values();
            this.prepare_helpers();
        }

        prepare_values() {
            this.invalid = this.task.invalid;
            this.height = this.scheduler.options.bar_height;
            this.handle_width = 8;
            this.x = this.compute_x();
            this.y = this.compute_y();
            this.corner_radius = this.scheduler.options.bar_corner_radius;
            this.duration =
                date_utils.diff(this.task._end, this.task._start, 'hour') /
                this.scheduler.options.step;
            this.width = this.scheduler.options.column_width * this.duration;
            this.progress_width =
                this.scheduler.options.column_width *
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
            const handle_width = this.handle_width;

            createSVG('rect', {
                x: bar.getX() + bar.getWidth() - handle_width - 1,
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
            $.on(this.group, 'mouseover', '.bar-wrapper', (e) => {
                this.show_popup();
            });

            $.on(this.group, 'mouseleave', '.bar-wrapper', (e) => {
                if (e.relatedTarget != null &&
                    (e.relatedTarget.classList.contains('pointer') ||
                        e.relatedTarget.classList.contains('title'))) return;
                this.scheduler.hide_popup();
            });

            $.on(this.group, 'click', (e) => {
                if (this.action_completed) return;

                this.scheduler.unselect_all();
                this.group.classList.add('active');
            });

            $.on(this.group, 'dblclick', (e) => {
                if (this.action_completed) {
                    // just finished a move action, wait for a few seconds
                    return;
                }

                this.scheduler.trigger_event('task_dblclick', [this.task]);
            });
        }

        show_popup() {
            const start_date = date_utils.format(
                this.task._start,
                'MMM D',
                this.scheduler.options.language
            );
            const end_date = date_utils.format(
                date_utils.add(this.task._end, -1, 'second'),
                'MMM D',
                this.scheduler.options.language
            );
            const subtitle = start_date + ' - ' + end_date;

            this.scheduler.show_popup({
                target_element: this.$bar,
                title: this.task.name,
                subtitle: subtitle,
                task: this.task
            });
        }

        update_bar_position({ x = null, width = null, y = null }) {
            const bar = this.$bar;
            if (x) {
                // get all x values of parent task
                const xs = this.task.dependencies.map((dep) => {
                    return this.scheduler.get_bar(dep).$bar.getX();
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
            if (width && width >= this.handle_width * 2 + 3) {
                this.update_attr(bar, 'width', width);
            }
            if (y) {
                this.update_attr(bar, 'y', y);
            }
            this.update_label_position();
            this.update_progressbar_position();
            this.update_handle_position();
            this.update_arrow_position();
        }

        position_changed() {
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

            const new_index = this.compute_index();
            const new_row = this.scheduler.options.rows[new_index];
            if (this.task._index !== new_index) {
                changed = true;
                this.task._index = new_index;
                this.task.row = new_row;
            }

            if (!changed) return;

            this.scheduler.trigger_event('position_change', [
                this.task,
                new_row,
                new_start_date,
                date_utils.add(new_end_date, -1, 'second'),
            ]);
        }

        progress_changed() {
            const new_progress = this.compute_progress();
            this.task.progress = new_progress;
            this.scheduler.trigger_event('progress_change', [this.task, new_progress]);
        }

        set_action_completed() {
            this.action_completed = true;
            setTimeout(() => (this.action_completed = false), 200);
        }

        compute_start_end_date() {
            const bar = this.$bar;
            const x_in_units = bar.getX() / this.scheduler.options.column_width;
            const new_start_date = date_utils.add(
                this.scheduler.scheduler_start,
                x_in_units * this.scheduler.options.step,
                'hour'
            );
            const width_in_units = bar.getWidth() / this.scheduler.options.column_width;
            const new_end_date = date_utils.add(
                new_start_date,
                width_in_units * this.scheduler.options.step,
                'hour'
            );

            return { new_start_date, new_end_date };
        }

        compute_index() {
            const bar = this.$bar;
            const row_height = this.scheduler.options.bar_height + this.scheduler.options.padding;
            const new_index = (bar.getY() - this.scheduler.options.header_height) / row_height;
            return Math.ceil(new_index) - 1;
        }

        compute_progress() {
            const progress =
                (this.$bar_progress.getWidth() / this.$bar.getWidth()) * 100;
            return parseInt(progress, 10);
        }

        compute_x() {
            const { step, column_width } = this.scheduler.options;
            const task_start = this.task._start;
            const scheduler_start = this.scheduler.scheduler_start;

            const diff = date_utils.diff(task_start, scheduler_start, 'hour');
            let x = (diff / step) * column_width;

            if (this.scheduler.view_is('Month')) {
                const diff = date_utils.diff(task_start, scheduler_start, 'day');
                x = (diff * column_width) / 30;
            }
            return x;
        }

        compute_y() {
            return (
                this.scheduler.options.header_height +
                this.scheduler.options.padding +
                this.task._index * (this.height + this.scheduler.options.padding)
            );
        }

        get_snap_position(dx) {
            let odx = dx,
                rem,
                position;

            if (this.scheduler.view_is('Week')) {
                rem = dx % (this.scheduler.options.column_width / 7);
                position =
                    odx -
                    rem +
                    (rem < this.scheduler.options.column_width / 14
                        ? 0
                        : this.scheduler.options.column_width / 7);
            } else if (this.scheduler.view_is('Month')) {
                rem = dx % (this.scheduler.options.column_width / 30);
                position =
                    odx -
                    rem +
                    (rem < this.scheduler.options.column_width / 60
                        ? 0
                        : this.scheduler.options.column_width / 30);
            } else {
                rem = dx % this.scheduler.options.column_width;
                position =
                    odx -
                    rem +
                    (rem < this.scheduler.options.column_width / 2
                        ? 0
                        : this.scheduler.options.column_width);
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
            if (this.invalid) return;
            this.$bar_progress.setAttribute('x', this.$bar.getX());
            this.$bar_progress.setAttribute('y', this.$bar.getY());
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
            label.setAttribute('y', bar.getY() + bar.getHeight() / 2);
        }

        update_handle_position() {
            if (this.invalid) return;
            const bar = this.$bar;
            this.handle_group
                .querySelector('.handle.left')
                .setAttribute('x', bar.getX() + 1);
            this.handle_group
                .querySelector('.handle.left')
                .setAttribute('y', bar.getY() + 1);
            this.handle_group
                .querySelector('.handle.right')
                .setAttribute('x', bar.getEndX() - this.handle_width - 1);
            this.handle_group
                .querySelector('.handle.right')
                .setAttribute('y', bar.getY() + 1);
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
        constructor(scheduler, from_task, to_task) {
            this.scheduler = scheduler;
            this.from_task = from_task;
            this.to_task = to_task;

            this.calculate_path();
            this.draw();
        }

        calculate_path() {
            let start_x =
                this.from_task.$bar.getX() + this.from_task.$bar.getWidth() / 2;

            const condition = () =>
                this.to_task.$bar.getX() < start_x + this.scheduler.options.padding &&
                start_x > this.from_task.$bar.getX() + this.scheduler.options.padding;

            while (condition()) {
                start_x -= 10;
            }

            const start_y =
                this.from_task.$bar.getY() + this.scheduler.options.bar_height;

            const end_x = this.to_task.$bar.getX() - this.scheduler.options.padding / 2;
            const end_y =
                this.to_task.$bar.getY() + this.scheduler.options.bar_height / 2;
            // ======= TODO Da capire come gestirlo
            //             this.scheduler.options.header_height +
            //             this.scheduler.options.bar_height +
            //             (this.scheduler.options.padding + this.scheduler.options.bar_height) *
            //             this.from_task.task._index +
            //             this.scheduler.options.padding;

            //         const end_x = this.to_task.$bar.getX() - this.scheduler.options.padding / 2;
            //         const end_y =
            //             this.scheduler.options.header_height +
            //             this.scheduler.options.bar_height / 2 +
            //             (this.scheduler.options.padding + this.scheduler.options.bar_height) *
            //             this.to_task.task._index +
            //             this.scheduler.options.padding;
            // >>>>>>> 5ec8c1cf7d6f126a89a5e5db096915fb66cda0a4

            const from_is_below_to =
                this.from_task.$bar.getY() > this.to_task.$bar.getY();
            const curve = this.scheduler.options.arrow_curve;
            const clockwise = from_is_below_to ? 1 : 0;
            const curve_y = from_is_below_to ? -curve : curve;
            const offset = from_is_below_to
                ? end_y + this.scheduler.options.arrow_curve
                : end_y - this.scheduler.options.arrow_curve;

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
                this.from_task.$bar.getX() + this.scheduler.options.padding
            ) {
                const down_1 = this.scheduler.options.padding / 2 - curve;
                const down_2 =
                    this.to_task.$bar.getY() +
                    this.to_task.$bar.getHeight() / 2 -
                    curve_y;
                const left = this.to_task.$bar.getX() - this.scheduler.options.padding;

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
            this.is_showing = false;
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
            if (this.is_showing) return;
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
            this.is_showing = true;
        }

        hide() {
            this.parent.style.opacity = 0;
            this.parent.style.left = 0;
            this.is_showing = false;
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

    class Scheduler {
        constructor(wrapper, tasks, cells, options) {
            this.setup_options(options);
            this.setup_wrapper(wrapper);
            this.setup_cells(cells);
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
                    'Scheduler only supports usage of a string CSS selector,' +
                    " HTML DOM element or SVG DOM element for the 'element' parameter"
                );
            }

            // TODO da capire se da cambiare
            // svg element
            if (!svg_element) {
                // create it
                this.$svg = createSVG('svg', {
                    append_to: wrapper_element,
                    class: 'scheduler',
                    id: 'schedulerSvg'
                });
                this.$column_svg = createSVG('svg', {
                    append_to: wrapper_element,
                    class: 'scheduler',
                    id: 'columnSvg'
                });
            } else {
                this.$svg = svg_element;
                this.$svg.classList.add('scheduler');
                this.$column_svg = svg_element;
                this.$column_svg.classList.add('scheduler');
            }

            // TODO da rivedere questo giro di wrapper
            // wrapper element
            this.$container = document.createElement('div');
            this.$container.classList.add('scheduler-grid-container');
            this.$column_container = document.createElement('div');
            this.$column_container.classList.add('scheduler-columns-container');

            this.$container_parent = document.createElement('div');
            this.$container_parent.classList.add('scheduler-container');
            this.$container_parent.style.height = this.options.container_height + 'px';
            this.$container_parent.appendChild(this.$column_container);
            this.$container_parent.appendChild(this.$container);

            const parent_element = this.$svg.parentElement;
            parent_element.appendChild(this.$container_parent);
            this.$column_container.appendChild(this.$column_svg);
            this.$container.appendChild(this.$svg);

            // popup wrapper
            this.popup_wrapper = document.createElement('div');
            this.popup_wrapper.classList.add('popup-wrapper');
            this.$container.appendChild(this.popup_wrapper);

            $.on(this.popup_wrapper, 'mouseleave', '.popup-wrapper', (e) => {
                this.hide_popup();
            });
        }

        setup_options(options) {
            const default_options = {
                container_height: 300,
                header_height: 50,
                column_width: 30,
                fixed_column_width: 120,
                step: 24,
                date_start: null,
                date_end: null,
                view_modes: [...Object.values(VIEW_MODE)],
                bar_height: 20,
                bar_corner_radius: 3,
                arrow_curve: 5,
                padding: 18,
                view_mode: 'Day',
                date_format: 'YYYY-MM-DD',
                custom_popup_html: null,
                language: 'en',
                moveable: false,
                fixed_columns: [],
                rows: [],
            };
            this.options = Object.assign({}, default_options, options);

            if (this.options.date_start)
                this.options.date_start = date_utils.parse(this.options.date_start);
            if (this.options.date_end)
                this.options.date_end = date_utils.parse(this.options.date_end);
        }

        setup_cells(cells) {
            this.cells = cells.filter(t => t.row && t.column);
        }

        setup_tasks(tasks) {
            // prepare tasks
            this.tasks = tasks.filter(t => t.row).map((task, i) => {
                // convert to Date objects
                task._start = date_utils.parse(task.start);
                task._end = date_utils.parse(task.end);

                // make task invalid if duration too large
                if (date_utils.diff(task._end, task._start, 'year') > 10) {
                    task.end = null;
                }

                // cache index
                task._index = this.options.rows.indexOf(task.row);
                if (task._index === -1) task._index = 0;

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
            }).filter(t => (
                (!this.options.date_start || t._start >= this.options.date_start) &&
                (!this.options.date_end || t._end <= this.options.date_end))
            );

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

        refresh(tasks, cells = this.cells, options = this.options) {
            this.setup_options(options);
            this.setup_cells(cells);
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
            this.setup_scheduler_dates();
            this.setup_date_values();
        }

        setup_scheduler_dates() {
            this.scheduler_start = this.options.date_start;
            this.scheduler_end = this.options.date_end;

            if (!this.scheduler_start || !this.scheduler_end)
                for (let task of this.tasks) {
                    // set global start and end date
                    if (!this.scheduler_start || task._start < this.scheduler_start) {
                        this.scheduler_start = task._start;
                    }
                    if (!this.scheduler_end || task._end > this.scheduler_end) {
                        this.scheduler_end = task._end;
                    }
                }

            this.scheduler_start = date_utils.start_of(this.scheduler_start, 'day');
            this.scheduler_end = date_utils.start_of(this.scheduler_end, 'day');

            // add date padding on both sides
            if (!this.options.date_start) {
                if (this.view_is([VIEW_MODE.HOUR, VIEW_MODE.QUARTER_DAY, VIEW_MODE.HALF_DAY])) {
                    this.scheduler_start = date_utils.add(this.scheduler_start, -7, 'day');
                } else if (this.view_is(VIEW_MODE.MONTH)) {
                    this.scheduler_start = date_utils.start_of(this.scheduler_start, 'year');
                } else if (this.view_is(VIEW_MODE.YEAR)) {
                    this.scheduler_start = date_utils.add(this.scheduler_start, -2, 'year');
                } else {
                    this.scheduler_start = date_utils.add(this.scheduler_start, -1, 'month');
                }
            }

            if (!this.options.date_end) {
                if (this.view_is([VIEW_MODE.HOUR, VIEW_MODE.QUARTER_DAY, VIEW_MODE.HALF_DAY])) {
                    this.scheduler_end = date_utils.add(this.scheduler_end, 7, 'day');
                } else if (this.view_is(VIEW_MODE.MONTH)) {
                    this.scheduler_end = date_utils.add(this.scheduler_end, 1, 'year');
                } else if (this.view_is(VIEW_MODE.YEAR)) {
                    this.scheduler_end = date_utils.add(this.scheduler_end, 2, 'year');
                } else {
                    this.scheduler_end = date_utils.add(this.scheduler_end, 1, 'month');
                }
            }
        }

        setup_date_values() {
            this.dates = [];
            let cur_date = null;

            while (cur_date === null || cur_date < this.scheduler_end) {
                if (!cur_date) {
                    cur_date = date_utils.clone(this.scheduler_start);
                } else {
                    if (this.view_is(VIEW_MODE.YEAR)) {
                        cur_date = date_utils.add(cur_date, 1, 'year');
                    } else if (this.view_is(VIEW_MODE.MONTH)) {
                        cur_date = date_utils.add(cur_date, 1, 'month');
                    } else {
                        cur_date = date_utils.add(
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
            this.bind_grid_events();
            this.bind_cell_events();
            this.bind_bar_events();
        }

        render() {
            this.clear();
            this.setup_layers();
            this.make_fixed_columns();
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
            this.fixed_col_layers = {};
            const layers = ['grid', 'arrow', 'progress', 'bar', 'details', 'date'];
            const fixed_col_layers = ['grid', 'cell', 'header'];
            // make group layers
            for (let layer of layers) {
                this.layers[layer] = createSVG('g', {
                    class: layer,
                    append_to: this.$svg,
                });
            }
            for (let layer of fixed_col_layers) {
                this.fixed_col_layers[layer] = createSVG('g', {
                    class: layer,
                    append_to: this.$column_svg
                });
            }
        }

        // TODO refactor with single functions?
        make_fixed_columns() {
            // make_grid_background
            const column_grid_width = this.options.fixed_columns.length * this.options.fixed_column_width;
            const grid_height =
                this.options.header_height +
                this.options.padding +
                (this.options.bar_height + this.options.padding) *
                this.options.rows.length;

            createSVG('rect', {
                x: 0,
                y: 0,
                width: column_grid_width,
                height: grid_height,
                class: 'grid-background',
                append_to: this.fixed_col_layers.grid
            });
            $.attr(this.$column_svg, {
                height: grid_height + 30,
                width: column_grid_width,
            });

            // make_grid_rows // praticamente è identica, cambia solo il layer e la width
            const rows_layer = createSVG('g', { append_to: this.fixed_col_layers.grid });
            const lines_layer = createSVG('g', { append_to: this.fixed_col_layers.grid });

            const row_width = this.options.fixed_columns.length * this.options.fixed_column_width;
            const row_height = this.options.bar_height + this.options.padding;

            let row_y = this.options.header_height + this.options.padding / 2;

            for (let row of this.options.rows) {
                createSVG('rect', {
                    x: 0,
                    y: row_y,
                    width: row_width,
                    height: row_height,
                    class: 'grid-row',
                    'data-id': row,
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

            // make_grid_header
            const header_width = this.options.fixed_columns.length * this.options.fixed_column_width;
            const header_height = this.options.header_height + 10;
            createSVG('rect', {
                x: 0,
                y: 0,
                width: header_width,
                height: header_height,
                class: 'grid-header',
                append_to: this.fixed_col_layers.header
            });

            // make_grid_ticks
            let tick_x = this.options.fixed_column_width;
            let tick_y = this.options.header_height + this.options.padding / 2;
            let tick_height =
                (this.options.bar_height + this.options.padding) *
                this.options.rows.length;
            for (let _ of this.options.fixed_columns) {
                createSVG('path', {
                    d: `M ${tick_x} ${tick_y} v ${tick_height}`,
                    class: 'tick thick',
                    append_to: this.fixed_col_layers.grid,
                });

                tick_x += this.options.fixed_column_width;
            }

            // make_dates -> header
            const pos_y = this.options.header_height;
            let pos_x = this.options.fixed_column_width / 2;
            for (let column of this.options.fixed_columns) {
                createSVG('text', {
                    x: pos_x,
                    y: pos_y,
                    innerHTML: column,
                    class: 'lower-text',
                    append_to: this.fixed_col_layers.header
                });
                pos_x += (pos_x * 2);
            }

            // make_bars
            this.make_cells();
        }

        make_cells() {
            const row_height = this.options.bar_height + this.options.padding;

            for (let r = 0; r < this.options.rows.length; r++) {
                for (let c = 0; c < this.options.fixed_columns.length; c++) {
                    const cell_wrapper = createSVG('g', {
                        class: 'cell-wrapper',
                        'data-row-id': this.options.rows[r],
                        'data-col-id': this.options.fixed_columns[c],
                        append_to: this.fixed_col_layers.cell,
                    });

                    createSVG('rect', {
                        x: c * this.options.fixed_column_width,
                        y: this.options.header_height + this.options.padding / 2 + (row_height) * r,
                        width: this.options.fixed_column_width,
                        height: row_height,
                        append_to: cell_wrapper,
                    });

                    const cell = this.cells.find(t => t.row === this.options.rows[r] && t.column === this.options.fixed_columns[c]);
                    if (cell) {
                        createSVG('text', {
                            x: this.options.fixed_column_width / 2 + c * this.options.fixed_column_width,
                            y: 15 + this.options.header_height + this.options.padding + r * row_height,
                            innerHTML: ((String(cell.value).slice(0, 25)) + (String(cell.value).length > 25 ? "..." : "")),
                            class: 'lower-text',
                            append_to: cell_wrapper
                        });
                    }
                }
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
                this.options.rows.length;

            createSVG('rect', {
                x: 0,
                y: 0,
                width: grid_width,
                height: grid_height,
                class: 'grid-background',
                append_to: this.layers.grid,
            });

            $.attr(this.$svg, {
                height: grid_height,
                width: '100%',
            });
        }

        make_grid_rows() {
            const rows_layer = createSVG('g', { append_to: this.layers.grid });
            const lines_layer = createSVG('g', { append_to: this.layers.grid });

            const row_width = this.dates.length * this.options.column_width;
            const row_height = this.options.bar_height + this.options.padding;

            let row_y = this.options.header_height + this.options.padding / 2;

            for (let row of this.options.rows) {
                createSVG('rect', {
                    x: 0,
                    y: row_y,
                    width: row_width,
                    height: row_height,
                    class: 'grid-row',
                    'data-id': row,
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
                append_to: this.layers.date,
            });
        }

        make_grid_ticks() {
            let tick_x = 0;
            let tick_y = this.options.header_height + this.options.padding / 2;
            let tick_height =
                (this.options.bar_height + this.options.padding) *
                this.options.rows.length;

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

        make_grid_highlights() {
            // highlight today's date
            if (this.view_is(VIEW_MODE.DAY)) {
                const x =
                    (date_utils.diff(date_utils.today(), this.scheduler_start, 'hour') /
                        this.options.step) *
                    this.options.column_width;
                const y = 0;

                const width = this.options.column_width;
                const height =
                    (this.options.bar_height + this.options.padding) *
                    this.options.rows.length +
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
            let last_date_info = null;
            const dates = this.dates.map((date) => {
                const d = this.get_date_info(date, last_date_info);
                last_date_info = d;
                return d;
            });
            return dates;
        }

        get_date_info(date, last_date_info) {
            let last_date = null;
            if (last_date_info) {
                last_date = last_date_info.date;
            } else {
                last_date = date_utils.add(date, 1, 'year');
            }
            const date_text = {
                Hour_lower: date_utils.format(
                    date,
                    'HH',
                    this.options.language
                ),
                'Quarter Day_lower': date_utils.format(
                    date,
                    'HH',
                    this.options.language
                ),
                'Half Day_lower': date_utils.format(
                    date,
                    'HH',
                    this.options.language
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
                        ? date_utils.format(date, 'D MMM', this.options.language)
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
                                this.options.language
                            )
                            : date_utils.format(date, 'D', this.options.language)
                        : '',
                Day_upper:
                    date.getMonth() !== last_date.getMonth()
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

            let column_width = this.options.column_width;
            if (this.view_is(VIEW_MODE.MONTH)) {
                column_width =
                    (date_utils.get_days_in_month(date) * column_width) / 30;
            }

            const base_pos = {
                x: last_date_info
                    ? last_date_info.base_pos_x + last_date_info.column_width
                    : 0,
                lower_y: this.options.header_height,
                upper_y: this.options.header_height - 25,
            };

            const x_pos = {
                Hour_lower: 0,
                Hour_upper: column_width * 24 / 2,
                'Quarter Day_lower': (column_width * 4) / 2,
                'Quarter Day_upper': 0,
                'Half Day_lower': (column_width * 2) / 2,
                'Half Day_upper': 0,
                Day_lower: column_width / 2,
                Day_upper: (column_width * 30) / 2,
                Week_lower: 0,
                Week_upper: (column_width * 4) / 2,
                Month_lower: column_width / 2,
                Month_upper: (column_width * 12) / 2,
                Year_lower: column_width / 2,
                Year_upper: (column_width * 30) / 2,
            };

            return {
                date,
                column_width,
                base_pos_x: base_pos.x,
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
                            this.get_bar(dependency.id), // from_task
                            this.get_bar(task.id) // to_task
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

            const hours_before_first_task = date_utils.diff(
                this.get_oldest_starting_date(),
                this.scheduler_start,
                'hour'
            );

            const scroll_pos =
                (hours_before_first_task / this.options.step) *
                this.options.column_width -
                this.options.column_width;

            parent_element.scrollLeft = scroll_pos;
        }

        bind_grid_events() {
            $.on(this.$svg, 'click', '.grid-row, .grid-header', () => {
                this.unselect_all();
                this.hide_popup();
            });

            $.on(this.$svg, 'dblclick', '.grid-row', (e) => {
                const data_id = e.target.getAttribute('data-id');
                this.trigger_event('grid_dblclick', [data_id]);
            });

            $.on(this.$container, 'scroll', e => {
                this.$column_container.scrollTop = e.currentTarget.scrollTop;
                this.layers.date.setAttribute('transform', 'translate(0,' + e.currentTarget.scrollTop + ')');
                this.fixed_col_layers.header.setAttribute('transform', 'translate(0,' + e.currentTarget.scrollTop + ')');
            });
        }

        bind_cell_events() {
            $.on(this.$column_svg, 'dblclick', '.cell-wrapper', (e) => {
                const cell_wrapper = $.closest('.cell-wrapper', e.target);
                const data_row_id = cell_wrapper.getAttribute('data-row-id');
                const data_col_id = cell_wrapper.getAttribute('data-col-id');
                this.trigger_event('cell_dblclick', [data_row_id, data_col_id]);
            });
        }

        bind_bar_events() {
            let is_dragging = false;
            let x_on_start = 0;
            let y_on_start = 0;
            let is_resizing_left = false;
            let is_resizing_right = false;
            let parent_bar_id = null;
            let bars = []; // instanceof Bars, the dragged bar and its children
            const min_y = this.options.header_height;
            const max_y =
                this.options.header_height +
                this.options.rows.length *
                (this.options.bar_height + this.options.padding);
            this.bar_being_dragged = null; // instanceof dragged bar

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
                bars = ids.map((id) => {
                    const bar = this.get_bar(id);
                    if (parent_bar_id === id) {
                        this.bar_being_dragged = bar;
                    }
                    const $bar = bar.$bar;
                    $bar.ox = $bar.getX();
                    $bar.oy = $bar.getY();
                    $bar.owidth = $bar.getWidth();
                    $bar.finaldx = 0;
                    $bar.finaldy = 0;
                    return bar;
                });
            });

            $.on(this.$svg, 'mousemove', (e) => {
                if (!action_in_progress()) return;
                const dx = e.offsetX - x_on_start;
                let dy = e.offsetY - y_on_start;

                this.hide_popup();

                // update the dragged bar
                const bar_being_dragged = this.bar_being_dragged;
                bar_being_dragged.$bar.finaldx = this.get_snap_x_position(dx);
                if (is_resizing_left) {
                    bar_being_dragged.update_bar_position({
                        x:
                            bar_being_dragged.$bar.ox +
                            bar_being_dragged.$bar.finaldx,
                        width:
                            bar_being_dragged.$bar.owidth -
                            bar_being_dragged.$bar.finaldx,
                    });
                } else if (is_resizing_right) {
                    bar_being_dragged.update_bar_position({
                        width:
                            bar_being_dragged.$bar.owidth +
                            bar_being_dragged.$bar.finaldx,
                    });
                } else if (is_dragging) {
                    if (!this.options.moveable) {
                        bar_being_dragged.update_bar_position({
                            x:
                                bar_being_dragged.$bar.ox +
                                bar_being_dragged.$bar.finaldx
                        });
                    }
                    else {
                        // TODO improve max_y and get_snap_y_position
                        const y = bar_being_dragged.$bar.oy + dy;
                        if (y < min_y) {
                            dy = min_y - bar_being_dragged.$bar.oy;
                        } else if (y > max_y) {
                            dy = max_y - bar_being_dragged.$bar.oy;
                        }
                        bar_being_dragged.$bar.finaldy = this.get_snap_y_position(dy);
                        bar_being_dragged.update_bar_position({
                            x:
                                bar_being_dragged.$bar.ox +
                                bar_being_dragged.$bar.finaldx,
                            y: this.options.moveable ?
                                bar_being_dragged.$bar.oy +
                                bar_being_dragged.$bar.finaldy
                                : null,
                        });
                    }
                }

                // update children
                bars.forEach((bar) => {
                    if (bar.task.id === parent_bar_id) {
                        return;
                    }
                    const $bar = bar.$bar;
                    $bar.finaldx = this.get_snap_x_position(dx);
                    this.hide_popup();
                    if (is_resizing_left) {
                        bar.update_bar_position({
                            x: $bar.ox + $bar.finaldx,
                        });
                    } else if (is_dragging) {
                        bar.update_bar_position({
                            x: $bar.ox + $bar.finaldx,
                        });
                    }
                });
            });

            $.on(this.$svg, 'mouseup', (e) => {
                if (is_dragging || is_resizing_left || is_resizing_right) {
                    bars.forEach((bar) => {
                        bar.group.classList.remove('active');

                        const $bar = bar.$bar;
                        if ($bar.finaldx || $bar.finaldy) {
                            bar.position_changed();
                            bar.set_action_completed();
                        }
                    });
                }

                this.bar_being_dragged = null;
                is_dragging = false;
                is_resizing_left = false;
                is_resizing_right = false;
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

        get_snap_x_position(dx) {
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

        get_snap_y_position(dy) {
            let ody = dy,
                rem,
                position;
            const row_height = this.options.bar_height + this.options.padding;
            rem = ody % row_height;
            position =
                ody -
                rem +
                (rem < row_height / 2
                    ? 0
                    : row_height);
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
         * @memberof Scheduler
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
         * @memberof Scheduler
         */
        clear() {
            this.$svg.innerHTML = '';
        }
    }

    Scheduler.VIEW_MODE = VIEW_MODE;

    function generate_id(task) {
        return task.name + '_' + Math.random().toString(36).slice(2, 12);
    }

    return Scheduler;

})();
//# sourceMappingURL=horsa-scheduler.js.map
