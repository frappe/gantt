import date_utils from './date_utils';
import { $, createSVG, animateSVG } from './svg_utils';

export default class Bar {
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

        if (this.task.resize_right)
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

        if (this.task.resize_left)
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
            if (!e.target.classList.contains('bar')) return;
            this.show_popup(e.offsetX);
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

    show_popup(x = 0, y = 0) {
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
            task: this.task,
            x: x,
            y: y,
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
        const barY = bar.getY();
        let sum_height = this.scheduler.options.header_height + this.scheduler.options.padding / 2;

        for (let i = 0; i < this.scheduler.rows.length; i++) {
            const row_start = sum_height;
            const row = this.scheduler.rows[i];
            sum_height += row.height;

            if (barY >= row_start && barY <= sum_height)
                return i;
        }
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
            (this.scheduler.options.padding / 2) +
            (this.scheduler.options.padding + this.scheduler.options.bar_height) * this.task._sub_level_index +
            this.scheduler.rows[this.task._index].y
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

        let handle = this.handle_group.querySelector('.handle.left');
        if (handle) {
            handle.setAttribute('x', bar.getX() + 1)
            handle.setAttribute('y', bar.getY() + 1)
        }
        handle = this.handle_group.querySelector('.handle.right');
        if (handle) {
            handle.setAttribute('x', bar.getEndX() - this.handle_width - 1)
            handle.setAttribute('y', bar.getY() + 1);
        }
        handle = this.group.querySelector('.handle.progress');
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

function isFunction(functionToCheck) {
    var getType = {};
    return (
        functionToCheck &&
        getType.toString.call(functionToCheck) === '[object Function]'
    );
}
