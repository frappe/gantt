import dateUtils from './dateUtils';
import { $, createSVG } from './svgUtils';
import Bar from './bar';
import Arrow from './arrow';
import Popup from './popup';
// eslint-disable-next-line import/no-useless-path-segments
import '../src/gantt.scss';
const VIEW_MODE = {
    QUARTER_DAY: 'Quarter Day',
    HALF_DAY: 'Half Day',
    DAY: 'Day',
    WEEK: 'Week',
    MONTH: 'Month',
    YEAR: 'Year',
};
function generateId(task) {
    return (`${task.name}_${Math.random()
        .toString(36)
        .slice(2, 12)}`);
}
export default class Gantt {
    constructor(wrapper, tasks, options) {
        this.setupWrapper(wrapper);
        this.setupOptions(options);
        this.setupTasks(tasks);
        this.setSortKey((a, b) => a.id.localeCompare(b.id));
        // initialize with default view mode
        this.changeViewMode();
        this.bindEvents();
    }
    setupWrapper(elementReference) {
        let svgElement;
        let wrapperElement;
        let resolvedElementReference;
        // CSS Selector is passed
        if (typeof elementReference === 'string') {
            resolvedElementReference = document.querySelector(elementReference);
        }
        else {
            resolvedElementReference = elementReference;
        }
        // get the SVGElement
        if (resolvedElementReference instanceof HTMLElement) {
            wrapperElement = resolvedElementReference;
            svgElement = resolvedElementReference.querySelector('svg');
        }
        else if (resolvedElementReference instanceof SVGElement) {
            svgElement = resolvedElementReference;
        }
        else {
            throw new TypeError('Frappé Gantt only supports usage of a string CSS selector,'
                + ' HTML DOM element or SVG DOM element for the \'element\' parameter');
        }
        // svg element
        if (!svgElement) {
            // create it
            this.$svg = createSVG('svg', {
                append_to: wrapperElement,
                class: 'gantt',
            });
        }
        else {
            this.$svg = svgElement;
            this.$svg.classList.add('gantt');
        }
        // wrapper element
        this.$container = document.createElement('div');
        this.$container.classList.add('gantt-container');
        const { parentElement } = this.$svg;
        parentElement.appendChild(this.$container);
        this.$container.appendChild(this.$svg);
        // popup wrapper
        this.popupWrapper = document.createElement('div');
        this.popupWrapper.classList.add('popup-wrapper');
        this.$container.appendChild(this.popupWrapper);
    }
    setupOptions(options) {
        const defaultOptions = {
            headerHeight: 50,
            columnWidth: 30,
            step: 24,
            viewModes: [...Object.values(VIEW_MODE)],
            barHeight: 20,
            barCornerRadius: 3,
            arrowCurve: 5,
            padding: 18,
            viewMode: 'Day',
            dateFormat: 'YYYY-MM-DD',
            popupTrigger: 'click',
            customPopupHtml: null,
            language: 'en',
        };
        this.options = Object.assign(Object.assign({}, defaultOptions), options);
    }
    setupTasks(tasks) {
        // prepare tasks
        this.tasks = tasks.map((task, i) => {
            let dependencies;
            // dependencies
            if (typeof task.dependencies === 'string') {
                dependencies = task.dependencies
                    .split(',')
                    .map((d) => d.trim())
                    .filter((d) => d);
            }
            else if (dependencies) {
                dependencies = task.dependencies;
            }
            else {
                dependencies = [];
            }
            const resolvedTask = Object.assign(Object.assign({}, task), { startResolved: dateUtils.parse(task.start), endResolved: dateUtils.parse(task.end), hasPlanned: false, indexResolved: i, dependencies });
            // make task invalid if duration too large
            if (dateUtils.diff(resolvedTask.endResolved, resolvedTask.startResolved, 'year') > 10) {
                resolvedTask.end = null;
            }
            // cache index
            // invalid dates
            if (!resolvedTask.start && !resolvedTask.end) {
                const today = dateUtils.today();
                resolvedTask.startResolved = today;
                resolvedTask.endResolved = dateUtils.add(today, 2, 'day');
            }
            if (!resolvedTask.start && resolvedTask.end) {
                resolvedTask.startResolved = dateUtils.add(resolvedTask.endResolved, -2, 'day');
            }
            if (resolvedTask.start && !resolvedTask.end) {
                resolvedTask.endResolved = dateUtils.add(resolvedTask.startResolved, 2, 'day');
            }
            // if hours is not set, assume the last day is full day
            // e.g: 2018-09-09 becomes 2018-09-09 23:59:59
            const taskEndValues = dateUtils.getDateValues(resolvedTask.endResolved);
            if (taskEndValues.slice(3)
                .every((d) => d === 0)) {
                resolvedTask.endResolved = dateUtils.add(resolvedTask.endResolved, 24, 'hour');
            }
            // invalid flag
            if (!resolvedTask.start || !resolvedTask.end) {
                resolvedTask.invalid = true;
            }
            // uids
            if (!resolvedTask.id) {
                resolvedTask.id = generateId(resolvedTask);
            }
            // Planned start/finish.
            if (task.plannedStart || task.plannedEnd) {
                resolvedTask.hasPlanned = true;
                resolvedTask.plannedStartResolved = dateUtils.parse(task.plannedStart || task.start);
                resolvedTask.plannedEndResolved = dateUtils.parse(task.plannedEnd || task.end);
                // if hours is not set, assume the last day is full day
                // e.g: 2018-09-09 becomes 2018-09-09 23:59:59
                const plannedTaskEndValues = dateUtils.getDateValues(resolvedTask.plannedEndResolved);
                if (plannedTaskEndValues.slice(3)
                    .every((d) => d === 0)) {
                    resolvedTask.plannedEndResolved = dateUtils.add(resolvedTask.plannedEndResolved, 24, 'hour');
                }
            }
            return resolvedTask;
        });
        this.setupDependencies();
    }
    setupDependencies() {
        this.dependencyMap = {};
        this.tasks.forEach((t) => {
            t.dependencies.forEach((d) => {
                this.dependencyMap[d] = this.dependencyMap[d] || [];
                this.dependencyMap[d].push(t.id);
            });
        });
    }
    refresh(tasks) {
        this.setupTasks(tasks);
        this.changeViewMode();
    }
    changeViewMode(mode = this.options.viewMode) {
        this.updateViewScale(mode);
        this.setupDates();
        this.render();
        // fire viewmode_change event
        this.triggerEvent('ViewChange', [mode]);
    }
    updateViewScale(view_mode) {
        this.options.viewMode = view_mode;
        switch (view_mode) {
            case 'Quarter Day':
                this.options.step = 24 / 4;
                this.options.columnWidth = 38;
                break;
            case 'Half Day':
                this.options.step = 24 / 2;
                this.options.columnWidth = 38;
                break;
            case 'Day':
                this.options.step = 24;
                this.options.columnWidth = 38;
                break;
            case 'Week':
                this.options.step = 24 * 7;
                this.options.columnWidth = 140;
                break;
            case 'Month':
                this.options.step = 24 * 30;
                this.options.columnWidth = 120;
                break;
            case 'Year':
                this.options.step = 24 * 365;
                this.options.columnWidth = 120;
                break;
            default:
                // eslint-disable-next-line no-console
                console.error(`Unknown view mode used: ${view_mode}`);
        }
    }
    setupDates() {
        this.setupGanttDates();
        this.setupDateValues();
    }
    setupGanttDates() {
        this.ganttStart = null;
        this.ganttEnd = null;
        this.tasks.forEach((task) => {
            // set global start and end date
            if (!this.ganttStart || task.startResolved < this.ganttStart) {
                this.ganttStart = task.startResolved;
            }
            if (task.plannedStartResolved
                && (!this.ganttStart || task.plannedStartResolved > this.ganttStart)) {
                this.ganttStart = task.plannedStartResolved;
            }
            if (!this.ganttEnd || task.endResolved > this.ganttEnd) {
                this.ganttEnd = task.endResolved;
            }
            if (task.plannedEndResolved
                && (!this.ganttEnd || task.plannedEndResolved > this.ganttEnd)) {
                this.ganttEnd = task.plannedEndResolved;
            }
        });
        this.ganttStart = dateUtils.startOf(this.ganttStart, 'day');
        this.ganttEnd = dateUtils.startOf(this.ganttEnd, 'day');
        // add date padding on both sides
        if (this.viewIs([VIEW_MODE.QUARTER_DAY, VIEW_MODE.HALF_DAY])) {
            this.ganttStart = dateUtils.add(this.ganttStart, -7, 'day');
            this.ganttEnd = dateUtils.add(this.ganttEnd, 7, 'day');
        }
        else if (this.viewIs(VIEW_MODE.MONTH)) {
            this.ganttStart = dateUtils.startOf(this.ganttStart, 'year');
            this.ganttEnd = dateUtils.add(this.ganttEnd, 1, 'year');
        }
        else if (this.viewIs(VIEW_MODE.YEAR)) {
            this.ganttStart = dateUtils.add(this.ganttStart, -2, 'year');
            this.ganttEnd = dateUtils.add(this.ganttEnd, 2, 'year');
        }
        else {
            this.ganttStart = dateUtils.add(this.ganttStart, -1, 'month');
            this.ganttEnd = dateUtils.add(this.ganttEnd, 1, 'month');
        }
    }
    setupDateValues() {
        this.dates = [];
        let currentDate = null;
        while (currentDate === null || currentDate < this.ganttEnd) {
            if (!currentDate) {
                currentDate = dateUtils.clone(this.ganttStart);
            }
            else if (this.viewIs(VIEW_MODE.YEAR)) {
                currentDate = dateUtils.add(currentDate, 1, 'year');
            }
            else if (this.viewIs(VIEW_MODE.MONTH)) {
                currentDate = dateUtils.add(currentDate, 1, 'month');
            }
            else {
                currentDate = dateUtils.add(currentDate, this.options.step, 'hour');
            }
            this.dates.push(currentDate);
        }
    }
    bindEvents() {
        this.bindGridClick();
        this.bindBarEvents();
    }
    render() {
        this.clear();
        this.setupLayers();
        this.makeGrid();
        this.makeDates();
        this.makeBars();
        this.makeArrows();
        this.mapArrowsOnBars();
        this.setWidth();
        this.setScrollPosition();
    }
    setupLayers() {
        this.layers = {};
        const layers = ['grid', 'date', 'arrow', 'progress', 'bar', 'details'];
        // make group layers
        layers.forEach((layer) => {
            this.layers[layer] = createSVG('g', {
                class: layer,
                append_to: this.$svg,
            });
        });
    }
    makeGrid() {
        this.makeGridBackground();
        this.makeGridRows();
        this.makeGridHeader();
        this.makeGridTicks();
        this.makeGridHighlights();
    }
    makeGridBackground() {
        const gridWidth = this.dates.length * this.options.columnWidth;
        const gridHeight = this.options.headerHeight
            + this.options.padding
            + (this.options.barHeight + this.options.padding)
                * this.tasks.length;
        createSVG('rect', {
            x: 0,
            y: 0,
            width: gridWidth,
            height: gridHeight,
            class: 'grid-background',
            append_to: this.layers.grid,
        });
        $.attr(this.$svg, {
            height: gridHeight + this.options.padding + 100,
            width: '100%',
        });
    }
    makeGridRows() {
        const rowsLayer = createSVG('g', { append_to: this.layers.grid });
        const linesLayer = createSVG('g', { append_to: this.layers.grid });
        const rowWidth = this.dates.length * this.options.columnWidth;
        const rowHeight = this.options.barHeight + this.options.padding;
        let rowY = this.options.headerHeight + this.options.padding / 2;
        this.tasks.forEach((task) => {
            task.gridRow = createSVG('rect', {
                x: 0,
                y: rowY,
                width: rowWidth,
                height: rowHeight,
                class: 'grid-row',
                append_to: rowsLayer,
            });
            createSVG('line', {
                x1: 0,
                y1: rowY + rowHeight,
                x2: rowWidth,
                y2: rowY + rowHeight,
                class: 'row-line',
                append_to: linesLayer,
            });
            rowY += this.options.barHeight + this.options.padding;
        });
    }
    makeGridHeader() {
        const headerWidth = this.dates.length * this.options.columnWidth;
        const headerHeight = this.options.headerHeight + 10;
        createSVG('rect', {
            x: 0,
            y: 0,
            width: headerWidth,
            height: headerHeight,
            class: 'grid-header',
            append_to: this.layers.grid,
        });
    }
    makeGridTicks() {
        let tickX = 0;
        const tickY = this.options.headerHeight + this.options.padding / 2;
        const tickHeight = (this.options.barHeight + this.options.padding)
            * this.tasks.length;
        this.dates.forEach((date) => {
            let tickClass = 'tick';
            // thick tick for monday
            if (this.viewIs(VIEW_MODE.DAY) && date.getDate() === 1) {
                tickClass += ' thick';
            }
            // thick tick for first week
            if (this.viewIs(VIEW_MODE.WEEK)
                && date.getDate() >= 1
                && date.getDate() < 8) {
                tickClass += ' thick';
            }
            // thick ticks for quarters
            if (this.viewIs(VIEW_MODE.MONTH) && (date.getMonth() + 1) % 3 === 0) {
                tickClass += ' thick';
            }
            createSVG('path', {
                d: `M ${tickX} ${tickY} v ${tickHeight}`,
                class: tickClass,
                append_to: this.layers.grid,
            });
            if (this.viewIs(VIEW_MODE.MONTH)) {
                tickX
                    += (dateUtils.getDaysInMonth(date)
                        * this.options.columnWidth)
                        / 30;
            }
            else {
                tickX += this.options.columnWidth;
            }
        });
    }
    makeGridHighlights() {
        // highlight today's date
        if (this.viewIs(VIEW_MODE.DAY)) {
            const x = (dateUtils.diff(dateUtils.today(), this.ganttStart, 'hour')
                / this.options.step)
                * this.options.columnWidth;
            const y = 0;
            const width = this.options.columnWidth;
            const height = (this.options.barHeight + this.options.padding)
                * this.tasks.length
                + this.options.headerHeight
                + this.options.padding / 2;
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
    makeDates() {
        for (let i = 0; i < this.getDatesToDraw().length; i += 1) {
            const date = this.getDatesToDraw()[i];
            createSVG('text', {
                x: date.lower_x,
                y: date.lower_y,
                innerHTML: date.lower_text,
                class: 'lower-text',
                append_to: this.layers.date,
            });
            if (date.upper_text) {
                const $upperText = createSVG('text', {
                    x: date.upper_x,
                    y: date.upper_y,
                    innerHTML: date.upper_text,
                    class: 'upper-text',
                    append_to: this.layers.date,
                });
                // remove out-of-bound dates
                if ($upperText.getBBox().right > this.layers.grid.getBBox().width) {
                    $upperText.remove();
                }
            }
        }
    }
    getDatesToDraw() {
        let lastDate = null;
        return this.dates.map((date, i) => {
            const d = this.getDateInfo(date, lastDate, i);
            lastDate = date;
            return d;
        });
    }
    getDateInfo(date, lastDate, i) {
        if (!lastDate) {
            // eslint-disable-next-line no-param-reassign
            lastDate = dateUtils.add(date, 1, 'year');
        }
        const dateText = {
            'Quarter Day_lower': dateUtils.format(date, 'HH', this.options.language),
            'Half Day_lower': dateUtils.format(date, 'HH', this.options.language),
            Day_lower: date.getDate() !== lastDate.getDate()
                ? dateUtils.format(date, 'D', this.options.language)
                : '',
            Week_lower: date.getMonth() !== lastDate.getMonth()
                ? dateUtils.format(date, 'D MMM', this.options.language)
                : dateUtils.format(date, 'D', this.options.language),
            Month_lower: dateUtils.format(date, 'MMMM', this.options.language),
            Year_lower: dateUtils.format(date, 'YYYY', this.options.language),
            'Quarter Day_upper': date.getDate() !== lastDate.getDate()
                ? dateUtils.format(date, 'D MMM', this.options.language)
                : '',
            'Half Day_upper': 
            // eslint-disable-next-line no-nested-ternary
            date.getDate() !== lastDate.getDate()
                ? date.getMonth() !== lastDate.getMonth()
                    ? dateUtils.format(date, 'D MMM', this.options.language)
                    : dateUtils.format(date, 'D', this.options.language)
                : '',
            Day_upper: date.getMonth() !== lastDate.getMonth()
                ? dateUtils.format(date, 'MMMM', this.options.language)
                : '',
            Week_upper: date.getMonth() !== lastDate.getMonth()
                ? dateUtils.format(date, 'MMMM', this.options.language)
                : '',
            Month_upper: date.getFullYear() !== lastDate.getFullYear()
                ? dateUtils.format(date, 'YYYY', this.options.language)
                : '',
            Year_upper: date.getFullYear() !== lastDate.getFullYear()
                ? dateUtils.format(date, 'YYYY', this.options.language)
                : '',
        };
        const basePos = {
            x: i * this.options.columnWidth,
            lower_y: this.options.headerHeight,
            upper_y: this.options.headerHeight - 25,
        };
        const xPos = {
            'Quarter Day_lower': (this.options.columnWidth * 4) / 2,
            'Quarter Day_upper': 0,
            'Half Day_lower': (this.options.columnWidth * 2) / 2,
            'Half Day_upper': 0,
            Day_lower: this.options.columnWidth / 2,
            Day_upper: (this.options.columnWidth * 30) / 2,
            Week_lower: 0,
            Week_upper: (this.options.columnWidth * 4) / 2,
            Month_lower: this.options.columnWidth / 2,
            Month_upper: (this.options.columnWidth * 12) / 2,
            Year_lower: this.options.columnWidth / 2,
            Year_upper: (this.options.columnWidth * 30) / 2,
        };
        return {
            upper_text: dateText[`${this.options.viewMode}_upper`],
            lower_text: dateText[`${this.options.viewMode}_lower`],
            upper_x: basePos.x + xPos[`${this.options.viewMode}_upper`],
            upper_y: basePos.upper_y,
            lower_x: basePos.x + xPos[`${this.options.viewMode}_lower`],
            lower_y: basePos.lower_y,
        };
    }
    makeBars() {
        this.bars = this.tasks.map((task) => {
            const bar = new Bar(this, task);
            this.layers.bar.appendChild(bar.group);
            return bar;
        });
    }
    makeArrows() {
        this.arrows = [];
        this.tasks.forEach((task) => {
            const arrows = task.dependencies
                .map((task_id) => {
                const dependency = this.getTask(task_id);
                if (!dependency)
                    return null;
                const arrow = new Arrow(this, this.bars[dependency.indexResolved], // from_task
                this.bars[task.indexResolved]);
                this.layers.arrow.appendChild(arrow.element);
                return arrow;
            })
                .filter(Boolean); // filter falsy values
            this.arrows = this.arrows.concat(arrows);
        });
    }
    mapArrowsOnBars() {
        this.bars.forEach((bar) => {
            // eslint-disable-next-line no-param-reassign
            bar.arrows = this.arrows.filter((arrow) => (arrow.fromTask.task.id === bar.task.id
                || arrow.toTask.task.id === bar.task.id));
        });
    }
    setWidth() {
        const currentWidth = this.$svg.getBoundingClientRect().width;
        const actualWidth = this.$svg
            .querySelector('.grid .grid-row')
            .getAttribute('width');
        if (currentWidth < Number(actualWidth)) {
            this.$svg.setAttribute('width', actualWidth);
        }
    }
    setScrollPosition() {
        const { parentElement } = this.$svg;
        if (!parentElement)
            return;
        const hoursBeforeFirstTask = dateUtils.diff(this.getOldestStartingDate(), this.ganttStart, 'hour');
        parentElement.scrollLeft = (hoursBeforeFirstTask
            / this.options.step)
            * this.options.columnWidth
            - this.options.columnWidth;
    }
    bindGridClick() {
        $.on(this.$svg, this.options.popupTrigger, '.grid-row, .grid-header', () => {
            this.unselectAll();
            this.hidePopup();
        });
    }
    bindBarEvents() {
        let isDragging = false;
        let xOnStart = 0;
        let isResizingLeft = false;
        let isResizingRight = false;
        let parentBarId = null;
        let draggingPlanned = false;
        let bars = []; // instanceof Bar
        this.barBeingDragged = null;
        function actionInProgress() {
            return isDragging || isResizingLeft || isResizingRight;
        }
        // @ts-ignore Weird sorcery. I don't touch it and it keeps working.
        $.on(this.$svg, 'mousedown', '.bar, .bar-progress, .handle', (e, element) => {
            const barWrapper = $.closest('.bar-wrapper', element);
            if (element.classList.contains('left')) {
                isResizingLeft = true;
            }
            else if (element.classList.contains('right')) {
                isResizingRight = true;
            }
            else if (element.classList.contains('bar') || element.classList.contains('bar-progress')) {
                isDragging = true;
            }
            if (element.classList.contains('planned')) {
                draggingPlanned = true;
            }
            barWrapper.classList.add('active');
            xOnStart = e.offsetX;
            parentBarId = barWrapper.getAttribute('data-id');
            const ids = [
                parentBarId,
                ...this.getAllDependentTasks(parentBarId),
            ];
            bars = ids.map((id) => this.getBar(id));
            this.barBeingDragged = parentBarId;
            bars.forEach((bar) => {
                var _a;
                const $bar = draggingPlanned ? ((_a = bar.$plannedBar) !== null && _a !== void 0 ? _a : bar.$bar) : bar.$bar;
                $bar.ox = $bar.getX();
                $bar.oy = $bar.getY();
                $bar.owidth = $bar.getWidth();
                $bar.finaldx = 0;
            });
        });
        $.on(this.$svg, 'mousemove', (e) => {
            if (!actionInProgress())
                return;
            const dx = e.offsetX - xOnStart;
            bars.forEach((bar) => {
                var _a;
                const $bar = draggingPlanned ? ((_a = bar.$plannedBar) !== null && _a !== void 0 ? _a : bar.$bar) : bar.$bar;
                $bar.finaldx = this.getSnapPosition(dx);
                if (isResizingLeft) {
                    if (parentBarId === bar.task.id) {
                        bar.updateBarPosition({
                            x: $bar.ox + $bar.finaldx,
                            width: $bar.owidth - $bar.finaldx,
                            planned: draggingPlanned,
                        });
                    }
                    else {
                        bar.updateBarPosition({
                            x: $bar.ox + $bar.finaldx,
                            planned: draggingPlanned,
                        });
                    }
                }
                else if (isResizingRight) {
                    if (parentBarId === bar.task.id) {
                        bar.updateBarPosition({
                            width: $bar.owidth + $bar.finaldx,
                            planned: draggingPlanned,
                        });
                    }
                }
                else if (isDragging) {
                    bar.updateBarPosition({ x: $bar.ox + $bar.finaldx, planned: draggingPlanned });
                }
            });
        });
        document.addEventListener('mouseup', () => {
            if (isDragging || isResizingLeft || isResizingRight) {
                bars.forEach((bar) => bar.group.classList.remove('active'));
            }
            isDragging = false;
            isResizingLeft = false;
            isResizingRight = false;
            draggingPlanned = false;
        });
        $.on(this.$svg, 'mouseup', () => {
            this.barBeingDragged = null;
            bars.forEach((bar) => {
                const { $bar, task, $plannedBar } = bar;
                if (!$bar.finaldx && !(task.hasPlanned && $plannedBar.finaldx))
                    return;
                bar.dateChanged();
                bar.setActionCompleted();
            });
        });
        this.bindBarProgress();
    }
    bindBarProgress() {
        let xOnStart = 0;
        let isResizing = null;
        let bar = null;
        let $barProgress = null;
        let $bar = null;
        // @ts-ignore sorcery.
        $.on(this.$svg, 'mousedown', '.handle.progress', (e, handle) => {
            isResizing = true;
            xOnStart = e.offsetX;
            const $barWrapper = $.closest('.bar-wrapper', handle);
            const id = $barWrapper.getAttribute('data-id');
            bar = this.getBar(id);
            $barProgress = bar.$barProgress;
            $bar = bar.$bar;
            $barProgress.finaldx = 0;
            $barProgress.owidth = $barProgress.getWidth();
            $barProgress.min_dx = -$barProgress.getWidth();
            $barProgress.max_dx = $bar.getWidth() - $barProgress.getWidth();
        });
        $.on(this.$svg, 'mousemove', (e) => {
            if (!isResizing)
                return;
            let dx = e.offsetX - xOnStart;
            if (dx > $barProgress.max_dx) {
                dx = $barProgress.max_dx;
            }
            if (dx < $barProgress.min_dx) {
                dx = $barProgress.min_dx;
            }
            const $handle = bar.$handleProgress;
            $.attr($barProgress, 'width', $barProgress.owidth + dx);
            $.attr($handle, 'points', String(bar.getProgressPolygonPoints()));
            $barProgress.finaldx = dx;
        });
        $.on(this.$svg, 'mouseup', () => {
            isResizing = false;
            if (!($barProgress && $barProgress.finaldx))
                return;
            bar.progressChanged();
            bar.setActionCompleted();
        });
    }
    getAllDependentTasks(task_id) {
        let out = [];
        let toProcess = [task_id];
        while (toProcess.length) {
            const deps = toProcess.reduce((acc, curr) => acc.concat(this.dependencyMap[curr]), []);
            out = out.concat(deps);
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            toProcess = deps.filter((d) => !toProcess.includes(d));
        }
        return out.filter(Boolean);
    }
    getSnapPosition(dx) {
        const odx = dx;
        let rem;
        let position;
        if (this.viewIs(VIEW_MODE.WEEK)) {
            rem = dx % (this.options.columnWidth / 7);
            position = odx
                - rem
                + (rem < this.options.columnWidth / 14
                    ? 0
                    : this.options.columnWidth / 7);
        }
        else if (this.viewIs(VIEW_MODE.MONTH)) {
            rem = dx % (this.options.columnWidth / 30);
            position = odx
                - rem
                + (rem < this.options.columnWidth / 60
                    ? 0
                    : this.options.columnWidth / 30);
        }
        else {
            rem = dx % this.options.columnWidth;
            position = odx
                - rem
                + (rem < this.options.columnWidth / 2
                    ? 0
                    : this.options.columnWidth);
        }
        return position;
    }
    unselectAll() {
        Array.from(this.$svg.querySelectorAll('.bar-wrapper'))
            .forEach((el) => {
            el.classList.remove('active');
        });
    }
    viewIs(modes) {
        if (typeof modes === 'string') {
            return this.options.viewMode === modes;
        }
        if (Array.isArray(modes)) {
            return modes.some((mode) => this.options.viewMode === mode);
        }
        return false;
    }
    getTask(id) {
        return this.tasks.find((task) => task.id === id);
    }
    getBar(id) {
        return this.bars.find((bar) => bar.task.id === id);
    }
    showPopup(options) {
        if (!this.popup) {
            this.popup = new Popup(this.popupWrapper, this.options.customPopupHtml);
        }
        this.popup.show(options);
    }
    hidePopup() {
        if (this.popup)
            this.popup.hide();
    }
    triggerEvent(event, args) {
        var _a;
        // @ts-ignore
        (_a = this.options[`on${event}`]) === null || _a === void 0 ? void 0 : _a.apply(null, args);
    }
    /**
       * Gets the oldest starting date from the list of tasks
       *
       * @returns Date
       * @memberof Gantt
       */
    getOldestStartingDate() {
        return this.tasks
            .map((task) => task.startResolved)
            .reduce((prev_date, cur_date) => (cur_date <= prev_date ? cur_date : prev_date));
    }
    /**
       * Clear all elements from the parent svg element
       *
       * @memberof Gantt
       */
    clear() {
        this.$svg.innerHTML = '';
    }
    setSortKey(sortFn) {
        this.sortKey = sortFn !== null && sortFn !== void 0 ? sortFn : ((a, b) => a.id.localeCompare(b.id));
        this.sortTasks();
    }
    sortTasks() {
        const updatedTasks = this.tasks.sort(this.sortKey).map((task, newIndex) => {
            task.indexResolved = newIndex;
            return task;
        });
        this.refresh(updatedTasks);
    }
}
Gantt.VIEW_MODE = VIEW_MODE;
//# sourceMappingURL=index.js.map