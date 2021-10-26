import date_utils from './dateUtils';
import { $, createSVG, animateSVG } from './svgUtils';
export default class Bar {
    constructor(gantt, task) {
        this.prepare_helpers = () => {
            /* eslint-disable func-names */
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
            /* eslint-enable func-names */
        };
        this.update_attr = (element, attr, value) => {
            const numValue = Number(value);
            if (!Number.isNaN(numValue)) {
                element.setAttribute(attr, String(value));
            }
            return element;
        };
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
        this.height = this.gantt.options.barHeight;
        this.x = this.compute_x();
        this.y = this.compute_y();
        this.corner_radius = this.gantt.options.barCornerRadius;
        this.duration = date_utils.diff(this.task.endResolved, this.task.startResolved, 'hour')
            / this.gantt.options.step;
        this.width = this.gantt.options.columnWidth * this.duration;
        this.progress_width = this.gantt.options.columnWidth
            * this.duration
            * (this.task.progress / 100) || 0;
        this.group = createSVG('g', {
            class: `bar-wrapper ${this.task.customClass || ''}`,
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
        if (this.invalid)
            return;
        this.$barProgress = createSVG('rect', {
            x: this.x,
            y: this.y,
            width: this.progress_width,
            height: this.height,
            rx: this.corner_radius,
            ry: this.corner_radius,
            class: 'bar-progress',
            append_to: this.bar_group,
        });
        animateSVG(this.$barProgress, 'width', 0, this.progress_width);
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
        if (this.invalid)
            return;
        const bar = this.$bar;
        const handleWidth = 8;
        createSVG('rect', {
            x: bar.getX() + bar.getWidth() - 9,
            y: bar.getY() + 1,
            width: handleWidth,
            height: this.height - 2,
            rx: this.corner_radius,
            ry: this.corner_radius,
            class: 'handle right',
            append_to: this.handle_group,
        });
        createSVG('rect', {
            x: bar.getX() + 1,
            y: bar.getY() + 1,
            width: handleWidth,
            height: this.height - 2,
            rx: this.corner_radius,
            ry: this.corner_radius,
            class: 'handle left',
            append_to: this.handle_group,
        });
        if (this.task.progress && this.task.progress < 100) {
            this.$handleProgress = createSVG('polygon', {
                points: this.getProgressPolygonPoints().join(','),
                class: 'handle progress',
                append_to: this.handle_group,
            });
        }
    }
    getProgressPolygonPoints() {
        const barProgress = this.$barProgress;
        return [
            barProgress.getEndX() - 5,
            barProgress.getY() + barProgress.getHeight(),
            barProgress.getEndX() + 5,
            barProgress.getY() + barProgress.getHeight(),
            barProgress.getEndX(),
            barProgress.getY() + barProgress.getHeight() - 8.66,
        ];
    }
    bind() {
        if (this.invalid)
            return;
        this.setup_click_event();
    }
    setup_click_event() {
        $.on(this.group, `focus ${this.gantt.options.popupTrigger}`, () => {
            if (this.action_completed) {
                // just finished a move action, wait for a few seconds
                return;
            }
            this.show_popup();
            this.gantt.unselectAll();
            this.group.classList.add('active');
        });
        $.on(this.group, 'dblclick', () => {
            if (this.action_completed) {
                // just finished a move action, wait for a few seconds
                return;
            }
            this.gantt.triggerEvent('Click', [this.task]);
        });
    }
    show_popup() {
        if (this.gantt.bar_being_dragged)
            return;
        const startDate = date_utils.format(this.task.startResolved, 'MMM D', this.gantt.options.language);
        const endDate = date_utils.format(date_utils.add(this.task.endResolved, -1, 'second'), 'MMM D', this.gantt.options.language);
        const subtitle = `${startDate} - ${endDate}`;
        this.gantt.showPopup({
            // @ts-ignore
            targetElement: this.$bar,
            title: this.task.name,
            subtitle,
            task: this.task,
        });
    }
    update_bar_position({ x = null, width = null }) {
        const bar = this.$bar;
        if (x) {
            // get all x values of parent task
            const xs = this.task.dependencies.map((dep) => this.gantt.getBar(dep).$bar.getX());
            // child task must not go before parent
            // @ts-ignore
            const validX = xs.reduce((_prev, curr) => x >= curr, x);
            if (!validX) {
                // eslint-disable-next-line no-param-reassign
                width = null;
                return;
            }
            this.update_attr(bar, 'x', x);
        }
        if (width && width >= this.gantt.options.columnWidth) {
            this.update_attr(bar, 'width', width);
        }
        this.update_label_position();
        this.update_handle_position();
        this.update_progressbar_position();
        this.update_arrow_position();
    }
    date_changed() {
        let changed = false;
        const { newStartDate, newEndDate } = this.compute_start_end_date();
        if (Number(this.task.startResolved) !== Number(newStartDate)) {
            changed = true;
            this.task.startResolved = newStartDate;
        }
        if (Number(this.task.endResolved) !== Number(newEndDate)) {
            changed = true;
            this.task.endResolved = newEndDate;
        }
        if (!changed)
            return;
        this.gantt.triggerEvent('DateChange', [
            this.task,
            newStartDate,
            date_utils.add(newEndDate, -1, 'second'),
        ]);
    }
    progressChanged() {
        const newProgress = this.compute_progress();
        this.task.progress = newProgress;
        this.gantt.triggerEvent('ProgressChange', [this.task, newProgress]);
    }
    setActionCompleted() {
        this.action_completed = true;
        setTimeout(() => { this.action_completed = false; }, 1000);
    }
    compute_start_end_date() {
        const bar = this.$bar;
        const xInUnits = bar.getX() / this.gantt.options.columnWidth;
        const newStartDate = date_utils.add(this.gantt.ganttStart, xInUnits * this.gantt.options.step, 'hour');
        const widthInUnits = bar.getWidth() / this.gantt.options.columnWidth;
        const newEndDate = date_utils.add(newStartDate, widthInUnits * this.gantt.options.step, 'hour');
        return { newStartDate, newEndDate };
    }
    compute_progress() {
        const progress = (this.$barProgress.getWidth() / this.$bar.getWidth()) * 100;
        return parseInt(String(progress), 10);
    }
    compute_x() {
        const { step, columnWidth } = this.gantt.options;
        const taskStart = this.task.startResolved;
        const { ganttStart } = this.gantt;
        let diff = date_utils.diff(taskStart, ganttStart, 'hour');
        let x = (diff / step) * columnWidth;
        if (this.gantt.viewIs('Month')) {
            diff = date_utils.diff(taskStart, ganttStart, 'day');
            x = (diff * columnWidth) / 30;
        }
        return x;
    }
    compute_y() {
        return (this.gantt.options.headerHeight
            + this.gantt.options.padding
            + this.task.indexResolved * (this.height + this.gantt.options.padding));
    }
    get_snap_position(dx) {
        const odx = dx;
        let rem;
        let position;
        if (this.gantt.viewIs('Week')) {
            rem = dx % (this.gantt.options.columnWidth / 7);
            position = odx
                - rem
                + (rem < this.gantt.options.columnWidth / 14
                    ? 0
                    : this.gantt.options.columnWidth / 7);
        }
        else if (this.gantt.viewIs('Month')) {
            rem = dx % (this.gantt.options.columnWidth / 30);
            position = odx
                - rem
                + (rem < this.gantt.options.columnWidth / 60
                    ? 0
                    : this.gantt.options.columnWidth / 30);
        }
        else {
            rem = dx % this.gantt.options.columnWidth;
            position = odx
                - rem
                + (rem < this.gantt.options.columnWidth / 2
                    ? 0
                    : this.gantt.options.columnWidth);
        }
        return position;
    }
    update_progressbar_position() {
        this.$barProgress.setAttribute('x', String(this.$bar.getX()));
        this.$barProgress.setAttribute('width', String(this.$bar.getWidth() * (this.task.progress / 100)));
    }
    update_label_position() {
        const bar = this.$bar;
        const label = this.group.querySelector('.bar-label');
        if (label.getBBox().width > bar.getWidth()) {
            label.classList.add('big');
            label.setAttribute('x', String(bar.getX() + bar.getWidth() + 5));
        }
        else {
            label.classList.remove('big');
            label.setAttribute('x', String(bar.getX() + bar.getWidth() / 2));
        }
    }
    update_handle_position() {
        const bar = this.$bar;
        this.handle_group
            .querySelector('.handle.left')
            .setAttribute('x', String(bar.getX() + 1));
        this.handle_group
            .querySelector('.handle.right')
            .setAttribute('x', String(bar.getEndX() - 9));
        const handle = this.group.querySelector('.handle.progress');
        if (handle)
            handle.setAttribute('points', this.getProgressPolygonPoints().join(','));
    }
    update_arrow_position() {
        this.arrows = this.arrows || [];
        this.arrows.forEach((arrow) => {
            arrow.update();
        });
    }
}
/* eslint-disable @typescript-eslint/no-unused-vars */
// noinspection JSUnusedLocalSymbols
// @ts-ignore
function isFunction(functionToCheck) {
    const getType = {};
    return (functionToCheck
        && getType.toString.call(functionToCheck) === '[object Function]');
}
//# sourceMappingURL=bar.js.map