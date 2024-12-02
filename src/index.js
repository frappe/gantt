import date_utils from './date_utils';
import { $, createSVG } from './svg_utils';

import Arrow from './arrow';
import Bar from './bar';
import Popup from './popup';

import { DEFAULT_OPTIONS, DEFAULT_VIEW_MODES } from './defaults';

import './gantt.css';

export default class Gantt {
    constructor(wrapper, tasks, options) {
        this.setup_wrapper(wrapper);
        this.setup_options(options);
        this.setup_tasks(tasks);
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
                'Frappe Gantt only supports usage of a string CSS selector,' +
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
        const custom_mode = this.options.custom_view_modes
            ? this.options.custom_view_modes.find(
                  (m) => m.name === this.config.view_mode.name,
              )
            : null;
        if (custom_mode) this.options = { ...this.options, custom_mode };

        this.config = {};
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
        if (typeof mode === 'string') {
            mode = this.options.view_modes.find((d) => d.name === mode);
        }
        this.config.view_mode = mode;
        this.update_view_scale(mode);
        this.setup_dates();
        this.render();
        this.trigger_event('view_change', [mode]);
    }

    update_view_scale(mode) {
        let { duration, scale } = date_utils.parse_duration(mode.step);
        this.config.step = duration;
        this.config.unit = scale;
        this.config.column_width =
            mode.column_width || this.options.column_width;
    }

    setup_dates() {
        this.setup_gantt_dates();
        this.setup_date_values();
    }

    setup_gantt_dates() {
        // set global start and end date
        let gantt_start, gantt_end;
        for (let task of this.tasks) {
            if (!gantt_start || task._start < gantt_start) {
                gantt_start = task._start;
            }
            if (!gantt_end || task._end > gantt_end) {
                gantt_end = task._end;
            }
        }

        gantt_start = date_utils.start_of(gantt_start, 'day');
        gantt_end = date_utils.start_of(gantt_end, 'day');

        // handle single value for padding
        if (typeof this.config.view_mode.padding === 'string')
            this.config.view_mode.padding = [
                this.config.view_mode.padding,
                this.config.view_mode.padding,
            ];

        let [padding_start, padding_end] = this.config.view_mode.padding.map(
            date_utils.parse_duration,
        );
        gantt_start = date_utils.add(
            gantt_start,
            -padding_start.duration,
            padding_start.scale,
        );

        let format_string =
            this.config.view_mode.format_string || 'YYYY-MM-DD HH';

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
        let cur_date = this.gantt_start;
        this.dates = [cur_date];

        while (cur_date < this.gantt_end) {
            cur_date = date_utils.add(
                cur_date,
                this.config.step,
                this.config.unit,
            );
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
        this.update_button_position();
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
        const grid_width = this.dates.length * this.config.column_width;
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

        const row_width = this.dates.length * this.config.column_width;
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
            // FIX
            if (
                this.options.lines === 'both' ||
                this.options.lines === 'horizontal'
            ) {
            }

            row_y += this.options.bar_height + this.options.padding;
        }
    }

    make_grid_header() {
        let $header = document.createElement('div');
        $header.style.height = this.options.header_height + 10 + 'px';
        $header.style.width =
            this.dates.length * this.config.column_width + 'px';
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

            for (const mode of this.options.view_modes) {
                const $option = document.createElement('option');
                $option.value = mode.name;
                $option.textContent = mode.name;
                $select.appendChild($option);
            }

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
            this.$today_button = $today_button;
        }

        this.$header.appendChild($side_header);
        this.$side_header = $side_header;

        window.addEventListener(
            'scroll',
            this.update_button_position.bind(this),
        );
        window.addEventListener(
            'resize',
            this.update_button_position.bind(this),
        );
    }

    update_button_position() {
        const containerRect = this.$container.getBoundingClientRect();
        const buttonRect = this.$side_header.getBoundingClientRect();
        const { left, y } = this.$header.getBoundingClientRect();

        // Check if the button is scrolled out of the container vertically

        if (
            buttonRect.top < containerRect.top ||
            buttonRect.bottom > containerRect.bottom
        ) {
            this.$side_header.style.position = 'absolute';
            this.$side_header.style.top = `${containerRect.scrollTop + buttonRect.top}px`;
        } else {
            this.$side_header.style.position = 'fixed';
            this.$side_header.style.top = y + 10 + 'px';
        }
        const width = Math.min(
            this.$header.clientWidth,
            this.$container.clientWidth,
        );

        this.$side_header.style.left =
            left +
            this.$container.scrollLeft +
            width -
            this.$side_header.clientWidth +
            'px';

        // Update the left value on page resize
        if (this.$today_button) {
            this.$today_button.style.left = `${containerRect.left + 20}px`;
        }
    }

    make_grid_ticks() {
        if (this.options.lines === 'none') return;
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

        const row_width = this.dates.length * this.config.column_width;
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
            if (
                this.config.view_mode.thick_line &&
                this.config.view_mode.thick_line(date)
            ) {
                tick_class += ' thick';
            }

            createSVG('path', {
                d: `M ${tick_x} ${tick_y} v ${tick_height}`,
                class: tick_class,
                append_to: this.layers.grid,
            });

            if (this.view_is('month')) {
                tick_x +=
                    (date_utils.get_days_in_month(date) *
                        this.config.column_width) /
                    30;
            } else if (this.view_is('year')) {
                tick_x +=
                    (date_utils.get_days_in_year(date) *
                        this.config.column_width) /
                    365;
            } else {
                tick_x += this.config.column_width;
            }
        }
    }

    highlightWeekends() {
        // FIX
        if (!this.view_is('Day') && !this.view_is('Half Day')) return;
        for (
            let d = new Date(this.gantt_start);
            d <= this.gantt_end;
            d.setDate(d.getDate() + 1)
        ) {
            if (d.getDay() === 0 || d.getDay() === 6) {
                const x =
                    (date_utils.diff(d, this.gantt_start, this.config.unit) /
                        this.config.step) *
                    this.config.column_width;
                const height =
                    (this.options.bar_height + this.options.padding) *
                    this.tasks.length;
                createSVG('rect', {
                    x,
                    y: this.options.header_height + this.options.padding / 2,
                    width:
                        (this.view_is('Day') ? 1 : 2) *
                        this.config.column_width,
                    height,
                    class: 'holiday-highlight',
                    append_to: this.layers.grid,
                });
            }
        }
    }

    /**
     * Compute the horizontal x-axis distance and associated date for the current date and view.
     *
     * @returns Object containing the x-axis distance and date of the current date, or null if the current date is out of the gantt range.
     */
    computeGridHighlightDimensions(view_mode) {
        const today = new Date();
        if (today < this.gantt_start || today > this.gantt_end) return null;
        let diff_in_units = date_utils.diff(
            today,
            this.gantt_start,
            this.config.unit,
        );
        return {
            x: (diff_in_units / this.config.step) * this.config.column_width,
            date: date_utils.format(today, this.config.view_mode.format_string),
        };
    }

    make_grid_highlights() {
        if (this.options.highlight_weekend) this.highlightWeekends();

        const highlightDimensions = this.computeGridHighlightDimensions(
            this.config.view_mode,
        );
        if (!highlightDimensions) return;
        const { x: left, date } = highlightDimensions;

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
        let $today = document.getElementById(date.replaceAll(' ', '_'));
        if ($today) {
            $today.classList.add('current-date-highlight');
            $today.style.top = +$today.style.top.slice(0, -2) - 4 + 'px';
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
                +$lower_text.style.left.slice(0, -2) + 'px';

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

        let column_width = this.config.column_width;

        const base_pos = {
            x: last_date_info
                ? last_date_info.base_pos_x + last_date_info.column_width
                : 0,
            lower_y: this.options.header_height - 20,
            upper_y: this.options.header_height - 50,
        };

        const upper_text = this.config.view_mode.upper_text;
        const lower_text = this.config.view_mode.lower_text;

        return {
            date,
            formatted_date: date_utils
                .format(date, this.config.view_mode.format_string)
                .replaceAll(' ', '_'),
            column_width: this.config.column_width,
            base_pos_x: base_pos.x,
            upper_text:
                typeof upper_text === 'string'
                    ? date_utils.format(date, upper_text, this.options.language)
                    : upper_text(date, last_date, this.options.language),
            lower_text:
                typeof lower_text === 'string'
                    ? date_utils.format(date, lower_text, this.options.language)
                    : lower_text(date, last_date, this.options.language),
            upper_x:
                base_pos.x +
                (column_width * this.config.view_mode.upper_text_frequency ||
                    1) /
                    2,
            upper_y: base_pos.upper_y,
            lower_x: base_pos.x + column_width / 2,
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
        const units_since_first_task = date_utils.diff(
            date,
            this.gantt_start,
            this.config.unit,
        );
        const scroll_pos =
            (units_since_first_task / this.config.step) *
                this.config.column_width -
            this.config.column_width;
        parent_element.scrollTo({ left: 400, behavior: 'smooth' });
    }

    scroll_today() {
        this.set_scroll_position(new Date());
    }

    bind_grid_click() {
        $.on(this.$svg, 'click', '.grid-row, .grid-header', () => {
            this.unselect_all();
            this.hide_popup();
        });
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

        this.$svg.onclick = (e) => {
            if (e.target.classList.contains('grid-row')) this.unselect_all();
        };

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
            if (this.popup) this.popup.parent.classList.add('hidden');

            if (this.popup) this.popup.parent.classList.add('hidden');

            x_on_start = e.offsetX || e.layerX;
            y_on_start = e.offsetY || e.layerY;

            parent_bar_id = bar_wrapper.getAttribute('data-id');
            let ids;
            if (this.options.move_dependencies) {
                ids = [
                    parent_bar_id,
                    ...this.get_all_dependent_tasks(parent_bar_id),
                ];
            } else {
                ids = [parent_bar_id];
            }
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
                ((e.currentTarget.scrollLeft / this.config.column_width) *
                    this.config.step) /
                24;
            let format_str = 'D MMM';
            if (['Year', 'Month'].includes(this.config.view_mode.name))
                format_str = 'YYYY';
            else if (['Day', 'Week'].includes(this.config.view_mode.name))
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
            const dx = (e.offsetX || e.layerX) - x_on_start;

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
                } else if (
                    is_dragging &&
                    !this.options.readonly &&
                    !this.options.dates_readonly
                ) {
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
            x_on_start = e.offsetX || e.layerX;
            y_on_start = e.offsetY || e.layerY;

            const $bar_wrapper = $.closest('.bar-wrapper', handle);
            const id = $bar_wrapper.getAttribute('data-id');
            bar = this.get_bar(id);

            $bar_progress = bar.$bar_progress;
            $bar = bar.$bar;

            $bar_progress.finaldx = 0;
            $bar_progress.owidth = $bar_progress.getWidth();
            $bar_progress.min_dx = -$bar_progress.owidth;
            $bar_progress.max_dx = $bar.getWidth() - $bar_progress.getWidth();
        });

        $.on(this.$svg, 'mousemove', (e) => {
            if (!is_resizing) return;
            let dx = (e.offsetX || e.layerX) - x_on_start;
            if (dx > $bar_progress.max_dx) {
                dx = $bar_progress.max_dx;
            }
            if (dx < $bar_progress.min_dx) {
                dx = $bar_progress.min_dx;
            }

            $bar_progress.setAttribute('width', $bar_progress.owidth + dx);
            $.attr(bar.$handle_progress, 'cx', $bar_progress.getEndX());

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
        let unit_length = 1;
        if (this.options.snap_by_day) {
            const { duration, scale } = date_utils.parse_duration(
                this.config.view_mode.step,
            );
            unit_length =
                duration *
                ({ hour: 1 / 24, week: 7, month: 30, year: 365 }[scale] || 1);
        }

        rem = dx % (this.config.column_width / unit_length);
        position =
            odx -
            rem +
            (rem < this.config.column_width / unit_length / 2
                ? 0
                : this.config.column_width / unit_length);

        return position;
    }

    unselect_all() {
        [...this.$svg.querySelectorAll('.bar-wrapper')].forEach((el) => {
            el.classList.remove('active');
        });
        if (this.popup) this.popup.parent.classList.remove('hidden');
    }

    view_is(modes) {
        if (typeof modes === 'string') {
            return this.config.view_mode.name === modes;
        }

        if (Array.isArray(modes)) {
            return modes.some(view_is);
        }

        return this.config.view_mode.name === modes.name;
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
            this.options['on_' + event].apply(this, args);
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

Gantt.VIEW_MODE = {
    HOUR: DEFAULT_VIEW_MODES[0],
    QUARTER_DAY: DEFAULT_VIEW_MODES[1],
    HALF_DAY: DEFAULT_VIEW_MODES[2],
    DAY: DEFAULT_VIEW_MODES[3],
    WEEK: DEFAULT_VIEW_MODES[4],
    MONTH: DEFAULT_VIEW_MODES[5],
    YEAR: DEFAULT_VIEW_MODES[6],
};

function generate_id(task) {
    return task.name + '_' + Math.random().toString(36).slice(2, 12);
}
