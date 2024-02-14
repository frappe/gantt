import date_utils from './date_utils';
import { $, createSVG } from './svg_utils';
import Bar from './bar';
import Arrow from './arrow';
import Popup from './popup';

import './scheduler.scss';

const VIEW_MODE = {
    HOUR: 'Hour',
    QUARTER_DAY: 'Quarter Day',
    HALF_DAY: 'Half Day',
    DAY: 'Day',
    WEEK: 'Week',
    MONTH: 'Month',
    YEAR: 'Year',
};

export default class Scheduler {
    constructor(wrapper, tasks, cells, options) {
        this.setup_options(options);
        this.setup_wrapper(wrapper);
        this.setup_cells(cells);
        this.setup_tasks(tasks);
        //array per le righe con id e altezza
        this.setup_rows(tasks);
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
            popup_position: 'left',
            custom_popup_html: null,
            language: 'en',
            resize_left: false,
            resize_right: false,
            drag_drop_x: false,
            drag_drop_y: false,
            fixed_columns: [],
            rows: [],
            overlap: true,
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

            task.resize_left = (task.resize_left != null) ? task.resize_left : this.options.resize_left;
            task.resize_right = (task.resize_right != null) ? task.resize_right : this.options.resize_right;
            task.drag_drop_x = (task.drag_drop_x != null) ? task.drag_drop_x : this.options.drag_drop_x;
            task.drag_drop_y = (task.drag_drop_y != null) ? task.drag_drop_y : this.options.drag_drop_y;

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
        const scroll_pos = this.$svg.parentElement.scrollLeft;
        const scroll_width = this.$svg.parentElement.scrollWidth;

        this.setup_options(options);
        this.setup_cells(cells);
        this.setup_tasks(tasks);
        this.change_view_mode();

        this.$svg.parentElement.scrollLeft = scroll_pos * (this.$svg.parentElement.scrollWidth / scroll_width);
    }

    setup_rows() {
        this.rows = [];
        this.options.rows.forEach(row_id => {
            let row = { id: row_id, height: 0, y: 0 };

            // TODO: Contare gli elementi che sono sovrapposti nella riga

            //mi prendo il numero di task con lo stesso id di riga
            let num_tasks = this.tasks.filter(task => {
                return task.row === row_id;
            }).length;
            num_tasks = num_tasks > 0 ? num_tasks : 1;

            row.height = (this.options.bar_height + this.options.padding) * num_tasks.length;
            this.rows.push(row);
        });
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
        this.scheduler_start = this.options.date_start
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
        this.move_overlapping_bars();
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

        let row_y = this.options.header_height + this.options.padding / 2;
        let i = 0;

        for (let row of this.options.rows) {

            const row_height = this.rows[i].height;
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

            row_y += row_height;
            i++;
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
        let last_y = this.options.header_height + this.options.padding / 2;
        for (let r = 0; r < this.options.rows.length; r++) {
            const row_height = this.rows[r].height;

            for (let c = 0; c < this.options.fixed_columns.length; c++) {
                const cell_wrapper = createSVG('g', {
                    class: 'cell-wrapper',
                    'data-row-id': this.options.rows[r],
                    'data-col-id': this.options.fixed_columns[c],
                    append_to: this.fixed_col_layers.cell,
                });

                createSVG('rect', {
                    x: c * this.options.fixed_column_width,
                    y: last_y,
                    // y: this.options.header_height + this.options.padding / 2 + (row_height) * r,
                    width: this.options.fixed_column_width,
                    height: row_height,
                    append_to: cell_wrapper,
                });

                const cell = this.cells.find(t => t.row === this.options.rows[r] && t.column === this.options.fixed_columns[c]);
                if (cell) {
                    createSVG('text', {
                        x: this.options.fixed_column_width / 2 + c * this.options.fixed_column_width,
                        y: 24 + last_y,
                        // y: 15 + this.options.header_height + this.options.padding + r * row_height,
                        innerHTML: ((String(cell.value).slice(0, 25)) + (String(cell.value).length > 25 ? "..." : "")),
                        class: 'lower-text',
                        append_to: cell_wrapper
                    });
                }
            }
            last_y += row_height;
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

        let row_y = this.options.header_height + this.options.padding / 2;
        let i = 0;

        for (let row of this.options.rows) {
            const row_height = this.rows[i].height;

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

            row_y += row_height;
            i++;
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
            //modifica per stamapare oltre la riga anche la data in cui ci si esegue il dbclick
            //se non c'è aggiungere il datetime nel file html

            const x_in_units = e.offsetX / this.options.column_width;
            const new_start_date = date_utils.add(
                this.scheduler_start,
                x_in_units * this.options.step,
                'hour');

            const datetime = new_start_date;

            this.trigger_event('grid_dblclick', [data_id, datetime]);
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
        var timer = null;
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

            is_resizing_left = is_resizing_left && this.bar_being_dragged.task.resize_left;
            is_resizing_right = is_resizing_right && this.bar_being_dragged.task.resize_right;
            is_dragging = is_dragging && (this.bar_being_dragged.task.drag_drop_x || this.bar_being_dragged.task.drag_drop_y);
        });

        $.on(this.$svg, 'mousemove', (e) => {
            if (!action_in_progress()) return;
            const dx = e.offsetX - x_on_start;
            let dy = e.offsetY - y_on_start;

            this.hide_popup();

            // update the dragged bar
            const bar_being_dragged = this.bar_being_dragged;
            if (is_resizing_left) {
                bar_being_dragged.$bar.finaldx = this.get_snap_x_position(dx);
                bar_being_dragged.update_bar_position({
                    x:
                        bar_being_dragged.$bar.ox +
                        bar_being_dragged.$bar.finaldx,
                    width:
                        bar_being_dragged.$bar.owidth -
                        bar_being_dragged.$bar.finaldx,
                });
            } else if (is_resizing_right) {
                bar_being_dragged.$bar.finaldx = this.get_snap_x_position(dx);
                bar_being_dragged.update_bar_position({
                    width:
                        bar_being_dragged.$bar.owidth +
                        bar_being_dragged.$bar.finaldx,
                });
            } else if (is_dragging) {
                if (bar_being_dragged.task.drag_drop_x) {

                    // this.moving_scroll_bar(e, timer);

                    bar_being_dragged.$bar.finaldx = this.get_snap_x_position(dx);
                    bar_being_dragged.update_bar_position({
                        x:
                            bar_being_dragged.$bar.ox +
                            bar_being_dragged.$bar.finaldx
                    });
                }
                if (bar_being_dragged.task.drag_drop_y) {
                    // TODO improve max_y and get_snap_y_position
                    const y = bar_being_dragged.$bar.oy + dy;
                    if (y < min_y) {
                        dy = min_y - bar_being_dragged.$bar.oy;
                    } else if (y > max_y) {
                        dy = max_y - bar_being_dragged.$bar.oy;
                    }
                    bar_being_dragged.$bar.finaldy = this.get_snap_y_position(dy);
                    bar_being_dragged.update_bar_position({
                        y:
                            bar_being_dragged.$bar.oy +
                            bar_being_dragged.$bar.finaldy
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
            if (action_in_progress()) {
                bars.forEach((bar) => {
                    bar.group.classList.remove('active');

                    const $bar = bar.$bar;
                    if ($bar.finaldx || $bar.finaldy) {
                        bar.position_changed();
                        bar.set_action_completed();

                        if (this.options.overlap) {
                            this.overlap(bar);
                        }
                        this.setup_rows();
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

    moving_scroll_bar(e, timer) {
        //Variabile che serve per aggiornare la scrollbar
        var scroll_bar = this.$svg.parentElement;
        //coordinate x e y del mouse sottraggo i punti da cui
        var viewportX = e.clientX - this.$container.offsetTop;
        var viewportY = e.clientY - this.$container.offsetLeft;
        //edges del container
        var edgeTop = this.$container.offsetTop;
        var edgeLeft = this.$container.offsetLeft;
        var edgeBottom = this.$container.offsetHeight;
        var edgeRight = this.$container.offsetWidth;
        //variabili per capire in quale punto ci si trova
        //CONTROLLA CON QUESTE IMPOSTAZIONi SEMBRA PRENDE LA TOP EDGE
        var isInLeftEdge = (viewportX < edgeLeft);
        var isInRightEdge = (viewportX > edgeRight);
        var isInTopEdge = (viewportY < edgeTop);
        var isInBottomEdge = (viewportY > edgeBottom);
        // If the mouse is not in the viewport edge, there's no need to calculate
        // anything else.
        if (!(isInLeftEdge || isInRightEdge || isInTopEdge || isInBottomEdge)) {
            clearTimeout(timer);
            return;
        }
        // Calculate the maximum scroll offset in each direction. Since you can only
        // scroll the overflow portion of the document, the maximum represents the
        // length of the document that is NOT in the viewport.
        //In questo caso i massimi sono larghezza e atezza del container
        var maxScrollX = this.$container.scrollWidth;
        var maxScrollY = this.$container.scrollHeight;
        // Get the current scroll position of the document.(container)
        var currentScrollX = this.$container.scrollLeft;
        var currentScrollY = this.$container.scrollTop;
        // As we examine the mousemove event, we want to adjust the window scroll in
        // immediate response to the event; but, we also want to continue adjusting
        // the window scroll if the user rests their mouse in the edge boundary. To
        // do this, we'll invoke the adjustment logic immediately. Then, we'll setup
        // a timer that continues to invoke the adjustment logic while the window can
        // still be scrolled in a particular direction.
        (function checkForWindowScroll() {

            clearTimeout(timer);

            if (adjustWindowScroll(currentScrollX, currentScrollY)) {

                timer = setTimeout(checkForWindowScroll, 30);

            }

        })();
        // Adjust the window scroll based on the user's mouse position. Returns True
        // or False depending on whether or not the window scroll was changed.
        function adjustWindowScroll(currentScrollX, currentScrollY) {
            // Determine if the window can be scrolled in any particular direction.
            var canScrollUp = (currentScrollY > 0);
            var canScrollDown = (currentScrollY < maxScrollY);
            var canScrollLeft = (currentScrollX > 0);
            var canScrollRight = (currentScrollX < maxScrollX);
            // Since we can potentially scroll in two directions at the same time,
            // let's keep track of the next scroll, starting with the current scroll.
            // Each of these values can then be adjusted independently in the logic
            // below.
            var nextScrollX = currentScrollX;
            var nextScrollY = currentScrollY;

            // As we examine the mouse position within the edge, we want to make the
            // incremental scroll changes more "intense" the closer that the user
            // gets the viewport edge. As such, we'll calculate the percentage that
            // the user has made it "through the edge" when calculating the delta.
            // Then, that use that percentage to back-off from the "max" step value.
            var maxStep = 50;

            // Should we scroll left?
            if (isInLeftEdge && canScrollLeft) {
                var intensity = ((edgeLeft - viewportX) / edgeLeft);
                nextScrollX = (nextScrollX - (maxStep * intensity));
                // Should we scroll right?
            } else if (isInRightEdge && canScrollRight) {
                var intensity = ((viewportX - edgeRight) / edgeLeft);
                nextScrollX = (nextScrollX + (maxStep * intensity));
            }

            // Should we scroll up?
            if (isInTopEdge && canScrollUp) {
                var intensity = ((edgeTop - viewportY) / edgeTop);
                nextScrollY = (nextScrollY - (maxStep * intensity));
                // Should we scroll down?
            } else if (isInBottomEdge && canScrollDown) {
                var intensity = ((viewportY - edgeBottom) / edgeTop);
                nextScrollY = (nextScrollY + (maxStep * intensity));
            }

            // Sanitize invalid maximums. An invalid scroll offset won't break the
            // subsequent .scrollTo() call; however, it will make it harder to
            // determine if the .scrollTo() method should have been called in the
            // first place.
            nextScrollX = Math.max(0, Math.min(maxScrollX, nextScrollX));
            nextScrollY = Math.max(0, Math.min(maxScrollY, nextScrollY));

            if (
                (nextScrollX !== currentScrollX) ||
                (nextScrollY !== currentScrollY)
            ) {
                scroll_bar.scrollLeft = nextScrollX;
                // scroll_bar.scrollTop = nextScrollY;
                return (true);
            } else {
                return (false);
            }
        }
    }

    recalculate_from_row(row_id) {
        // calcolare altezza
    }

    overlap(bar) {
        //PER ORA NON SERVE LA SOVRAPPOSIZIONE PER RICALCOLO TUTTE LE RIGHE
        // // Trova tutte le barre sovrapposte 
        const overlappingBars = this.bars.filter(otherBar =>
            // escludi la stessa barra
            otherBar !== bar &&
            // barre nella stessa riga
            otherBar.task.row === bar.task.row &&
            // verifica la sovrapposizione
            (bar.x < otherBar.x + otherBar.width && bar.x + bar.width > otherBar.x)
        );
        if (overlappingBars.length > 0) {
            console.log('Ho una sovrapposizione');
            this.render();
        }
        // console.log(overlappingBars);
        return;


        /*
        Param: Bar appena mossa 
        if sovrapposta(Bar) ? allora:
            start_row = riga da cui parto
            end_row = riga in cui arrivo
            // calcola la width
            recalculate_width(start_row)
            recalculate_width(end_row)

            // calcola la y
            if start_row sta prima di end_row ? allora:
                recalculate_y_from_row(start_row) -> anche delle relative barre
            else
                recalculate_y_from_row(end_row)

            Ricalcolare la riga da cui parti
            ingrandire la riga in cui arrivi
            Riposizionare la Bar correttamente nella riga
            Ricalcolare tutte le righe successive alla riga della Bar
            spostare le row_line
        */

        //Variabile per avere la y sempre aggiornata
        let updated_y = this.options.header_height + this.options.padding / 2;
        // Aggiorno tutte le righe
        const grid_rows = this.layers.grid.querySelectorAll('rect.grid-row');
        grid_rows.forEach((current_row) => {
            const row_id = current_row.getAttribute('data-id');
            // CAMBIARE L'ALTEZZA DI TUTTE LE RIGHE IN BASE ALLE BARRE
            const bars_in_row = this.bars.filter(bar => bar.task.row === row_id);
            let num_bars_in_row = bars_in_row.length;
            if (num_bars_in_row == 0) {
                num_bars_in_row = 1;
                updated_y = this.compute_grid_and_line_height(bar, current_row, num_bars_in_row, updated_y, row_id);
            } else {
                updated_y = this.compute_grid_and_line_height(bar, current_row, num_bars_in_row, updated_y, row_id);
            }
        });

        this.move_overlapping_bars();

    }

    move_overlapping_bars() {
        // Sposta le barre dopo aver spostato le righe e le linee
        this.bars.forEach((bar) => {
            const fixed_row = this.$column_container.querySelector('g.grid > g > rect[data-id=' + bar.task.row + ']');
            let new_y = parseInt(fixed_row.getAttribute('y')) + this.options.padding / 2;
            // Aggiorna la posizione della barra
            // Trova tutte le barre nella stessa riga 
            const bars_in_same_row = this.bars.filter(otherBar =>
                otherBar.task.row === bar.task.row
            );
            if (bars_in_same_row.length > 1) {
                for (let i = 0; i < bars_in_same_row.length; i++) {
                    bars_in_same_row[i].update_bar_position({ y: new_y });
                    new_y += bars_in_same_row[i].height + this.options.padding;
                }
            } else {
                bar.update_bar_position({ y: new_y });
            }
        });
    }

    compute_grid_and_line_height(bar, current_row, num_bars_in_row, updated_y, row_id) {

        //modifico l'altezza della riga
        const new_row_height = num_bars_in_row * (bar.height + this.options.padding);
        $.attr(current_row, 'height', new_row_height);
        //modifico l'altezza della riga fissa corrispondente
        const curr_fixed_row = this.$column_container.querySelector('g.grid > g > rect[data-id=' + row_id + ']');
        $.attr(curr_fixed_row, 'height', new_row_height);
        const current_row_y = current_row.getAttribute('y');
        //modifico la y delle righe
        $.attr(current_row, 'y', updated_y);
        $.attr(curr_fixed_row, 'y', updated_y);
        //modifico altezza e y della cell
        const curr_cell_rect = this.$column_container.querySelectorAll('g.cell > g.cell-wrapper[data-row-id = ' + row_id + '] > rect');
        const curr_cell_text = this.$column_container.querySelectorAll('g.cell > g.cell-wrapper[data-row-id = ' + row_id + '] > text');
        //loop in base a quante fixed columns sono presenti
        for (let i = 0; i < this.options.fixed_columns.length; i++) {
            $.attr(curr_cell_rect[i], 'height', new_row_height);
            $.attr(curr_cell_rect[i], 'y', updated_y);
            //modifico y del testo prima contollo che ci sia del testo altrimenti va in errore
            if (curr_cell_text.length != 0) {
                $.attr(curr_cell_text[i], 'y', 24 + updated_y);
            }
        }

        //LA Y DELLA PRIMA RIGA DEVO SCARTARLA PERCHè NON ESISTE LA LINE CORRISPONDENTE
        if (current_row_y != this.options.header_height + this.options.padding / 2) {
            const current_line = this.layers.grid.querySelector('line.row-line[y1="' + current_row_y + '"]');
            const fixed_line = this.$column_container.querySelector('line.row-line[y1="' + current_row_y + '"]');
            $.attr(current_line, 'y1', updated_y);
            $.attr(current_line, 'y2', updated_y);
            $.attr(fixed_line, 'y1', updated_y);
            $.attr(fixed_line, 'y2', updated_y);
        }
        return updated_y += new_row_height;
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
            let dy = e.offsetY - y_on_start;

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
        options.position = this.options.popup_position;
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
