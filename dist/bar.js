import dateUtils from './dateUtils';
import { $, animateSVG, createSVG } from './svgUtils';
export default class Bar {
    constructor(gantt, task) {
        this.prepareHelpers = () => {
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
        this.updateAttr = (element, attr, value) => {
            const numValue = Number(value);
            if (!Number.isNaN(numValue)) {
                element.setAttribute(attr, String(value));
            }
            return element;
        };
        this.setDefaults(gantt, task);
        this.prepare();
        this.draw();
        this.bind();
    }
    setDefaults(gantt, task) {
        this.actionCompleted = false;
        this.gantt = gantt;
        this.task = task;
    }
    prepare() {
        this.prepareValues();
        this.prepareHelpers();
    }
    prepareValues() {
        this.invalid = this.task.invalid;
        this.height = this.gantt.options.barHeight;
        this.x = this.computeX();
        this.y = this.computeY();
        this.cornerRadius = this.gantt.options.barCornerRadius;
        this.duration = dateUtils.diff(this.task.endResolved, this.task.startResolved, 'hour')
            / this.gantt.options.step;
        this.width = this.gantt.options.columnWidth * this.duration;
        this.progressWidth = this.gantt.options.columnWidth
            * this.duration
            * (this.task.progress / 100) || 0;
        this.group = createSVG('g', {
            class: `bar-wrapper ${this.task.customClass || ''}`,
            'data-id': this.task.id,
        });
        this.barGroup = createSVG('g', {
            class: 'bar-group',
            append_to: this.group,
        });
        this.handleGroup = createSVG('g', {
            class: 'handle-group',
            append_to: this.group,
        });
        if (this.task.hasPlanned) {
            this.plannedX = this.computeX(true);
            this.plannedY = this.computeY();
            this.plannedDuration = dateUtils.diff(this.task.plannedEndResolved, this.task.plannedStartResolved, 'hour')
                / this.gantt.options.step;
            this.plannedWidth = this.gantt.options.columnWidth * this.plannedDuration;
            this.plannedHandleGroup = createSVG('g', {
                class: 'handle-group',
                append_to: this.group,
            });
        }
    }
    draw() {
        this.drawBar();
        this.drawProgressBar();
        if (this.task.hasPlanned)
            this.drawPlannedBar();
        this.drawLabel();
        this.drawResizeHandles();
    }
    drawBar() {
        this.$bar = createSVG('rect', {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            rx: this.cornerRadius,
            ry: this.cornerRadius,
            class: 'bar bar-actual',
            append_to: this.barGroup,
        });
        if (this.task.color) {
            this.$bar.style.fill = this.task.color;
        }
        animateSVG(this.$bar, 'width', 0, this.width);
        if (this.invalid) {
            this.$bar.classList.add('bar-invalid');
        }
    }
    drawPlannedBar() {
        this.$plannedBar = createSVG('rect', {
            x: this.plannedX,
            y: this.plannedY,
            width: this.plannedWidth,
            height: this.height,
            rx: this.cornerRadius,
            ry: this.cornerRadius,
            class: 'bar planned',
            append_to: this.barGroup,
        });
        this.$plannedBar.style.fillOpacity = '0';
        this.$plannedBar.style.strokeOpacity = '1';
        this.$plannedBar.style.stroke = this.task.plannedColor || this.task.color;
        this.$plannedBar.style.strokeDasharray = '2,2';
        this.$plannedBar.style.strokeLinejoin = 'round';
        this.$plannedBar.style.strokeWidth = '2px';
        animateSVG(this.$plannedBar, 'width', 0, this.plannedWidth);
        if (this.invalid) {
            this.$plannedBar.classList.add('bar-invalid');
        }
    }
    drawProgressBar() {
        if (this.invalid)
            return;
        this.$barProgress = createSVG('rect', {
            x: this.x,
            y: this.y,
            width: this.progressWidth,
            height: this.height,
            rx: this.cornerRadius,
            ry: this.cornerRadius,
            class: 'bar-progress',
            append_to: this.barGroup,
        });
        if (this.task.progressColor)
            this.$barProgress.style.fill = this.task.progressColor;
        animateSVG(this.$barProgress, 'width', 0, this.progressWidth);
    }
    drawLabel() {
        const text = createSVG('text', {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2,
            innerHTML: this.task.name,
            class: 'bar-label',
            append_to: this.barGroup,
        });
        if (this.task.labelColor)
            text.style.fill = this.task.labelColor;
        // labels get BBox in the next tick
        requestAnimationFrame(() => this.updateLabelPosition());
    }
    drawResizeHandles() {
        if (this.invalid)
            return;
        const bar = this.$bar;
        const handleWidth = 8;
        createSVG('rect', {
            x: bar.getX() + bar.getWidth() - 9,
            y: bar.getY() + 1,
            width: handleWidth,
            height: this.height - 2,
            rx: this.cornerRadius,
            ry: this.cornerRadius,
            class: 'handle right',
            append_to: this.handleGroup,
        });
        createSVG('rect', {
            x: bar.getX() + 1,
            y: bar.getY() + 1,
            width: handleWidth,
            height: this.height - 2,
            rx: this.cornerRadius,
            ry: this.cornerRadius,
            class: 'handle left',
            append_to: this.handleGroup,
        });
        if (this.task.hasPlanned) {
            const plannedBar = this.$plannedBar;
            createSVG('rect', {
                x: plannedBar.getX() + plannedBar.getWidth() - 9,
                y: plannedBar.getY() + 1,
                width: handleWidth,
                height: this.height - 2,
                rx: this.cornerRadius,
                ry: this.cornerRadius,
                class: 'handle right planned',
                append_to: this.plannedHandleGroup,
            });
            createSVG('rect', {
                x: plannedBar.getX() + 1,
                y: plannedBar.getY() + 1,
                width: handleWidth,
                height: this.height - 2,
                rx: this.cornerRadius,
                ry: this.cornerRadius,
                class: 'handle left planned',
                append_to: this.plannedHandleGroup,
            });
        }
        if (this.task.progress && this.task.progress < 100) {
            this.$handleProgress = createSVG('polygon', {
                points: this.getProgressPolygonPoints()
                    .join(','),
                class: 'handle progress',
                append_to: this.handleGroup,
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
        this.setupClickEvent();
        this.setupHoverEvent();
    }
    setupClickEvent() {
        $.on(this.group, `focus ${this.gantt.options.popupTrigger}`, () => {
            if (this.actionCompleted) {
                // just finished a move action, wait for a few seconds
                return;
            }
            this.showPopup();
            this.gantt.unselectAll();
            this.group.classList.add('active');
        });
        $.on(this.group, 'dblclick', () => {
            if (this.actionCompleted) {
                // just finished a move action, wait for a few seconds
                return;
            }
            this.gantt.triggerEvent('Click', [this.task]);
        });
    }
    showPopup() {
        if (this.gantt.barBeingDragged)
            return;
        const startDate = dateUtils.format(this.task.startResolved, 'MMM D', this.gantt.options.language);
        const endDate = dateUtils.format(dateUtils.add(this.task.endResolved, -1, 'second'), 'MMM D', this.gantt.options.language);
        const subtitle = `${startDate} - ${endDate}`;
        this.gantt.showPopup({
            // @ts-ignore
            targetElement: this.$bar,
            title: this.task.name,
            subtitle,
            task: this.task,
        });
    }
    updateBarPosition({ x = null, width = null, planned = false, }) {
        const bar = this.$bar;
        const plannedBar = this.$plannedBar;
        if (x) {
            if (!planned) {
                // get all x values of parent task
                const xs = this.task.dependencies.map((dep) => this.gantt.getBar(dep)
                    .$bar
                    .getX());
                // child task must not go before parent
                // @ts-ignore
                const validX = xs.reduce((_prev, curr) => x >= curr, x);
                if (!validX) {
                    // eslint-disable-next-line no-param-reassign
                    width = null;
                    return;
                }
            }
            this.updateAttr(planned ? plannedBar : bar, 'x', x);
        }
        if (width && width >= this.gantt.options.columnWidth) {
            this.updateAttr(planned ? plannedBar : bar, 'width', width);
        }
        this.updateLabelPosition();
        this.updateHandlePosition();
        this.updateProgressbarPosition();
        this.updateArrowPosition();
    }
    dateChanged() {
        {
            let changed = false;
            const { newStartDate, newEndDate, } = this.computeStartEndDate();
            if (Number(this.task.startResolved) !== Number(newStartDate)) {
                changed = true;
                this.task.startResolved = newStartDate;
            }
            if (Number(this.task.endResolved) !== Number(newEndDate)) {
                changed = true;
                this.task.endResolved = newEndDate;
            }
            if (changed) {
                this.gantt.triggerEvent('DateChange', [
                    this.task,
                    newStartDate,
                    dateUtils.add(newEndDate, -1, 'second'),
                    false,
                ]);
            }
        }
        if (this.task.hasPlanned) {
            let changed = false;
            const { newStartDate, newEndDate, } = this.computeStartEndDate(true);
            if (Number(this.task.plannedStartResolved) !== Number(newStartDate)) {
                changed = true;
                this.task.plannedStartResolved = newStartDate;
            }
            if (changed) {
                this.gantt.triggerEvent('DateChange', [
                    this.task,
                    newStartDate,
                    dateUtils.add(newEndDate, -1, 'second'),
                    true,
                ]);
            }
        }
    }
    progressChanged() {
        const newProgress = this.computeProgress();
        this.task.progress = newProgress;
        this.gantt.triggerEvent('ProgressChange', [this.task, newProgress]);
    }
    setActionCompleted() {
        this.actionCompleted = true;
        setTimeout(() => {
            this.actionCompleted = false;
        }, 1000);
    }
    computeStartEndDate(planned = false) {
        const bar = planned ? this.$plannedBar : this.$bar;
        const xInUnits = Math.round(bar.getX() / this.gantt.options.columnWidth);
        const newStartDate = dateUtils.add(this.gantt.ganttStart, xInUnits * this.gantt.options.step, 'hour');
        const widthInUnits = bar.getWidth() / this.gantt.options.columnWidth;
        const newEndDate = dateUtils.add(newStartDate, widthInUnits * this.gantt.options.step, 'hour');
        return {
            newStartDate,
            newEndDate,
        };
    }
    computeProgress() {
        const progress = (this.$barProgress.getWidth() / this.$bar.getWidth()) * 100;
        return parseInt(String(progress), 10);
    }
    computeX(planned = false) {
        const { step, columnWidth, } = this.gantt.options;
        const taskStart = planned ? this.task.plannedStartResolved : this.task.startResolved;
        const { ganttStart } = this.gantt;
        let diff = dateUtils.diff(taskStart, ganttStart, 'hour');
        let x = (diff / step) * columnWidth;
        if (this.gantt.viewIs('Month')) {
            diff = dateUtils.diff(taskStart, ganttStart, 'day');
            x = (diff * columnWidth) / 30;
        }
        return x;
    }
    computeY() {
        return (this.gantt.options.headerHeight
            + this.gantt.options.padding
            + this.task.indexResolved * (this.height + this.gantt.options.padding));
    }
    getSnapPosition(dx) {
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
    updateProgressbarPosition() {
        this.$barProgress.setAttribute('x', String(this.$bar.getX()));
        this.$barProgress.setAttribute('width', String(this.$bar.getWidth() * (this.task.progress / 100)));
    }
    updateLabelPosition() {
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
    updateHandlePosition() {
        const bar = this.$bar;
        const plannedBar = this.$plannedBar;
        if (this.task.hasPlanned) {
            this.plannedHandleGroup
                .querySelector('.handle.left')
                .setAttribute('x', String(plannedBar.getX() + 1));
            this.plannedHandleGroup
                .querySelector('.handle.right')
                .setAttribute('x', String(plannedBar.getEndX() - 9));
        }
        this.handleGroup
            .querySelector('.handle.left')
            .setAttribute('x', String(bar.getX() + 1));
        this.handleGroup
            .querySelector('.handle.right')
            .setAttribute('x', String(bar.getEndX() - 9));
        const handle = this.group.querySelector('.handle.progress');
        if (handle) {
            handle.setAttribute('points', this.getProgressPolygonPoints()
                .join(','));
        }
    }
    updateArrowPosition() {
        this.arrows = this.arrows || [];
        this.arrows.forEach((arrow) => {
            arrow.update();
        });
    }
    setupHoverEvent() {
        $.on(this.task.gridRow, 'mousemove', () => {
            // Mouse is not hovering over any elements.
            this.setHover(false, false);
        });
        $.on(this.group, 'mousemove', (e) => {
            let mainHover = false;
            let plannedHover = false;
            const bar = this.$bar;
            if (e.buttons % 2 === 1) {
                this.setHover(false, false);
                return;
            }
            if (e.offsetX >= bar.getX() && e.offsetX <= bar.getEndX()) {
                mainHover = true;
                // if (e.offsetX <= this.computeX() + this.progressWidth) {
                //   progressHover = true;
                // }
            }
            if (this.task.hasPlanned) {
                const plannedBar = this.$plannedBar;
                if (e.offsetX >= plannedBar.getX() && e.offsetX <= plannedBar.getEndX()) {
                    plannedHover = true;
                }
            }
            this.setHover(mainHover, plannedHover);
        });
    }
    setHover(main, planned) {
        if (main) {
            this.interactionTarget = 'main';
            this.handleGroup.classList.add('visible');
            if (this.plannedHandleGroup)
                this.plannedHandleGroup.classList.remove('visible');
        }
        else if (planned) {
            this.interactionTarget = 'planned';
            this.handleGroup.classList.remove('visible');
            if (this.plannedHandleGroup)
                this.plannedHandleGroup.classList.add('visible');
        }
        else {
            this.interactionTarget = null;
            this.handleGroup.classList.remove('visible');
            if (this.plannedHandleGroup)
                this.plannedHandleGroup.classList.remove('visible');
        }
    }
}
//# sourceMappingURL=bar.js.map