import dateUtils, { Language } from './dateUtils';
import { $, createSVG } from './svgUtils';
import Bar from './bar';
import Arrow from './arrow';
import Popup, { PopupOptions } from './popup';

// eslint-disable-next-line import/no-useless-path-segments
import '../src/gantt.scss';

interface Task {
  id: string,
  name: string,
  start: string | Date,
  end: string | Date,
  progress: number,
  dependencies?: string | string[],
  customClass?: string
}

export interface ResolvedTask extends Task {
  invalid?: boolean;
  indexResolved: number;
  endResolved: Date;
  dependencies: string[],
  startResolved: Date;
}

export type ViewMode = 'Quarter Day' | 'Half Day' | 'Day' | 'Week' | 'Month' | 'Year';

export interface Options {
  headerHeight?: number,
  columnWidth?: number,
  step?: number,
  viewModes?: ViewMode[],
  barHeight?: number,
  barCornerRadius?: number,
  arrowCurve?: number,
  padding?: number,
  viewMode?: ViewMode,
  dateFormat?: string,
  customPopupHtml?: string | null,
  popupTrigger: string,
  language: Language
}

const VIEW_MODE: {
  QUARTER_DAY: 'Quarter Day',
  HALF_DAY: 'Half Day',
  DAY: 'Day',
  WEEK: 'Week',
  MONTH: 'Month',
  YEAR: 'Year',
} = {
  QUARTER_DAY: 'Quarter Day',
  HALF_DAY: 'Half Day',
  DAY: 'Day',
  WEEK: 'Week',
  MONTH: 'Month',
  YEAR: 'Year',
};

function generateId(task: ResolvedTask): string {
  return (
    `${task.name
    }_${
      Math.random()
        .toString(36)
        .slice(2, 12)}`
  );
}

interface DateInfo {
  upper_y: string | number | Element;
  upper_x: string | number | Element;
  upper_text: string | number | Element;
  lower_text: string | number | Element;
  lower_y: string | number | Element;
  lower_x: string | number | Element;
}

export default class Gantt {
  private $svg: SVGElement;

  private $container: HTMLDivElement;

  private popupWrapper: HTMLDivElement;

  public options: Options;

  private tasks: ResolvedTask[];

  private dependencyMap: Record<string, string[]>;

  public ganttStart: null | Date;

  private ganttEnd: null | Date;

  private dates: Date[];

  public bar_being_dragged?: string;

  private layers: Record<string, SVGElement>;

  private bars: Bar[];

  private arrows: Arrow[];

  private popup: Popup;

  static VIEW_MODE: { QUARTER_DAY: 'Quarter Day'; HALF_DAY: 'Half Day'; DAY: 'Day'; WEEK: 'Week'; MONTH: 'Month'; YEAR: 'Year' };

  constructor(
    wrapper: string | HTMLElement | SVGElement | unknown,
    tasks: Task[],
    options: Options,
  ) {
    this.setup_wrapper(wrapper);
    this.setup_options(options);
    this.setup_tasks(tasks);
    // initialize with default view mode
    this.change_view_mode();
    this.bind_events();
  }

  setup_wrapper(elementReference: string | HTMLElement | SVGElement | unknown): void {
    let svgElement;
    let wrapperElement;

    let resolvedElementReference: HTMLElement | SVGElement | unknown;

    // CSS Selector is passed
    if (typeof elementReference === 'string') {
      resolvedElementReference = document.querySelector(elementReference);
    } else {
      resolvedElementReference = elementReference;
    }

    // get the SVGElement
    if (resolvedElementReference instanceof HTMLElement) {
      wrapperElement = resolvedElementReference;
      svgElement = resolvedElementReference.querySelector('svg');
    } else if (resolvedElementReference instanceof SVGElement) {
      svgElement = resolvedElementReference;
    } else {
      throw new TypeError(
        'Frappé Gantt only supports usage of a string CSS selector,'
                + ' HTML DOM element or SVG DOM element for the \'element\' parameter',
      );
    }

    // svg element
    if (!svgElement) {
      // create it
      this.$svg = createSVG('svg', {
        append_to: wrapperElement,
        class: 'gantt',
      });
    } else {
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

  setup_options(options: Options): void {
    const defaultOptions: Options = {
      headerHeight: 50,
      columnWidth: 30,
      step: 24,
      viewModes: [...Object.values(VIEW_MODE)] as ViewMode[],
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
    this.options = { ...defaultOptions, ...options };
  }

  setup_tasks(tasks: Task[]): void {
    // prepare tasks
    this.tasks = tasks.map((task, i): ResolvedTask => {
      let dependencies: string[] = [];

      // dependencies
      if (typeof task.dependencies === 'string') {
        dependencies = task.dependencies
          .split(',')
          .map((d) => d.trim())
          .filter((d) => d);
      } else if (dependencies) {
        dependencies = task.dependencies;
      }

      const resolvedTask: ResolvedTask = {
        ...task,
        startResolved: dateUtils.parse(task.start),
        endResolved: dateUtils.parse(task.end),
        indexResolved: i,
        dependencies,
      };

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
      const taskEndValues = dateUtils.get_date_values(resolvedTask.endResolved);
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

      return resolvedTask;
    });

    this.setupDependencies();
  }

  setupDependencies(): void {
    this.dependencyMap = {};
    this.tasks.forEach((t) => {
      t.dependencies.forEach((d) => {
        this.dependencyMap[d] = this.dependencyMap[d] || [];
        this.dependencyMap[d].push(t.id);
      });
    });
  }

  refresh(tasks: Task[]): void {
    this.setup_tasks(tasks);
    this.change_view_mode();
  }

  change_view_mode(mode: ViewMode = this.options.viewMode): void {
    this.update_view_scale(mode);
    this.setup_dates();
    this.render();
    // fire viewmode_change event
    this.trigger_event('view_change', [mode]);
  }

  update_view_scale(view_mode: ViewMode): void {
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

  setup_dates(): void {
    this.setup_gantt_dates();
    this.setup_date_values();
  }

  setup_gantt_dates(): void {
    this.ganttStart = null;
    this.ganttEnd = null;

    this.tasks.forEach((task) => {
      // set global start and end date
      if (!this.ganttStart || task.startResolved < this.ganttStart) {
        this.ganttStart = task.startResolved;
      }
      if (!this.ganttEnd || task.endResolved > this.ganttEnd) {
        this.ganttEnd = task.endResolved;
      }
    });

    this.ganttStart = dateUtils.start_of(this.ganttStart, 'day');
    this.ganttEnd = dateUtils.start_of(this.ganttEnd, 'day');

    // add date padding on both sides
    if (this.view_is([VIEW_MODE.QUARTER_DAY, VIEW_MODE.HALF_DAY])) {
      this.ganttStart = dateUtils.add(this.ganttStart, -7, 'day');
      this.ganttEnd = dateUtils.add(this.ganttEnd, 7, 'day');
    } else if (this.view_is(VIEW_MODE.MONTH)) {
      this.ganttStart = dateUtils.start_of(this.ganttStart, 'year');
      this.ganttEnd = dateUtils.add(this.ganttEnd, 1, 'year');
    } else if (this.view_is(VIEW_MODE.YEAR)) {
      this.ganttStart = dateUtils.add(this.ganttStart, -2, 'year');
      this.ganttEnd = dateUtils.add(this.ganttEnd, 2, 'year');
    } else {
      this.ganttStart = dateUtils.add(this.ganttStart, -1, 'month');
      this.ganttEnd = dateUtils.add(this.ganttEnd, 1, 'month');
    }
  }

  setup_date_values(): void {
    this.dates = [];
    let currentDate: Date | null = null;

    while (currentDate === null || currentDate < this.ganttEnd) {
      if (!currentDate) {
        currentDate = dateUtils.clone(this.ganttStart);
      } else if (this.view_is(VIEW_MODE.YEAR)) {
        currentDate = dateUtils.add(currentDate, 1, 'year');
      } else if (this.view_is(VIEW_MODE.MONTH)) {
        currentDate = dateUtils.add(currentDate, 1, 'month');
      } else {
        currentDate = dateUtils.add(
          currentDate,
          this.options.step,
          'hour',
        );
      }
      this.dates.push(currentDate);
    }
  }

  bind_events(): void {
    this.bind_grid_click();
    this.bind_bar_events();
  }

  render(): void {
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

  setup_layers(): void {
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

  make_grid(): void {
    this.make_grid_background();
    this.make_grid_rows();
    this.make_grid_header();
    this.make_grid_ticks();
    this.make_grid_highlights();
  }

  make_grid_background(): void {
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

  make_grid_rows(): void {
    const rowsLayer = createSVG('g', { append_to: this.layers.grid });
    const linesLayer = createSVG('g', { append_to: this.layers.grid });

    const rowWidth = this.dates.length * this.options.columnWidth;
    const rowHeight = this.options.barHeight + this.options.padding;

    let rowY = this.options.headerHeight + this.options.padding / 2;

    this.tasks.forEach(() => {
      createSVG('rect', {
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

  make_grid_header(): void {
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

  make_grid_ticks(): void {
    let tickX = 0;
    const tickY = this.options.headerHeight + this.options.padding / 2;
    const tickHeight = (this.options.barHeight + this.options.padding)
            * this.tasks.length;

    this.dates.forEach((date) => {
      let tickClass = 'tick';
      // thick tick for monday
      if (this.view_is(VIEW_MODE.DAY) && date.getDate() === 1) {
        tickClass += ' thick';
      }
      // thick tick for first week
      if (
        this.view_is(VIEW_MODE.WEEK)
                && date.getDate() >= 1
                && date.getDate() < 8
      ) {
        tickClass += ' thick';
      }
      // thick ticks for quarters
      if (this.view_is(VIEW_MODE.MONTH) && (date.getMonth() + 1) % 3 === 0) {
        tickClass += ' thick';
      }

      createSVG('path', {
        d: `M ${tickX} ${tickY} v ${tickHeight}`,
        class: tickClass,
        append_to: this.layers.grid,
      });

      if (this.view_is(VIEW_MODE.MONTH)) {
        tickX
                    += (dateUtils.get_days_in_month(date)
                    * this.options.columnWidth)
                    / 30;
      } else {
        tickX += this.options.columnWidth;
      }
    });
  }

  make_grid_highlights(): void {
    // highlight today's date
    if (this.view_is(VIEW_MODE.DAY)) {
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

  make_dates(): void {
    for (let i = 0; i < this.get_dates_to_draw().length; i += 1) {
      const date = this.get_dates_to_draw()[i];
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
        }) as SVGGraphicsElement;

        // remove out-of-bound dates
        if (
          $upperText.getBBox().right > (<SVGGraphicsElement> this.layers.grid).getBBox().width
        ) {
          $upperText.remove();
        }
      }
    }
  }

  get_dates_to_draw(): DateInfo[] {
    let lastDate: Date = null;
    return this.dates.map((date, i) => {
      const d = this.get_date_info(date, lastDate, i);
      lastDate = date;
      return d;
    });
  }

  get_date_info(date: Date, lastDate: Date, i: number): DateInfo {
    if (!lastDate) {
      // eslint-disable-next-line no-param-reassign
      lastDate = dateUtils.add(date, 1, 'year');
    }
    const dateText = {
      'Quarter Day_lower': dateUtils.format(
        date,
        'HH',
        this.options.language,
      ),
      'Half Day_lower': dateUtils.format(
        date,
        'HH',
        this.options.language,
      ),
      Day_lower:
                date.getDate() !== lastDate.getDate()
                  ? dateUtils.format(date, 'D', this.options.language)
                  : '',
      Week_lower:
                date.getMonth() !== lastDate.getMonth()
                  ? dateUtils.format(date, 'D MMM', this.options.language)
                  : dateUtils.format(date, 'D', this.options.language),
      Month_lower: dateUtils.format(date, 'MMMM', this.options.language),
      Year_lower: dateUtils.format(date, 'YYYY', this.options.language),
      'Quarter Day_upper':
                date.getDate() !== lastDate.getDate()
                  ? dateUtils.format(date, 'D MMM', this.options.language)
                  : '',
      'Half Day_upper':
      // eslint-disable-next-line no-nested-ternary
                date.getDate() !== lastDate.getDate()
                  ? date.getMonth() !== lastDate.getMonth()
                    ? dateUtils.format(date, 'D MMM', this.options.language)
                    : dateUtils.format(date, 'D', this.options.language)
                  : '',
      Day_upper:
                date.getMonth() !== lastDate.getMonth()
                  ? dateUtils.format(date, 'MMMM', this.options.language)
                  : '',
      Week_upper:
                date.getMonth() !== lastDate.getMonth()
                  ? dateUtils.format(date, 'MMMM', this.options.language)
                  : '',
      Month_upper:
                date.getFullYear() !== lastDate.getFullYear()
                  ? dateUtils.format(date, 'YYYY', this.options.language)
                  : '',
      Year_upper:
                date.getFullYear() !== lastDate.getFullYear()
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

  make_bars(): void {
    this.bars = this.tasks.map((task) => {
      const bar = new Bar(this, task);
      this.layers.bar.appendChild(bar.group);
      return bar;
    });
  }

  make_arrows(): void {
    this.arrows = [];
    this.tasks.forEach((task) => {
      const arrows = task.dependencies
        .map((task_id) => {
          const dependency = this.get_task(task_id);
          if (!dependency) return null;
          const arrow = new Arrow(
            this,
            this.bars[dependency.indexResolved], // from_task
            this.bars[task.indexResolved], // to_task
          );
          this.layers.arrow.appendChild(arrow.element);
          return arrow;
        })
        .filter(Boolean); // filter falsy values
      this.arrows = this.arrows.concat(arrows);
    });
  }

  map_arrows_on_bars(): void {
    this.bars.forEach((bar) => {
      // eslint-disable-next-line no-param-reassign
      bar.arrows = this.arrows.filter((arrow) => (
        arrow.fromTask.task.id === bar.task.id
                || arrow.toTask.task.id === bar.task.id
      ));
    });
  }

  set_width(): void {
    const currentWidth = this.$svg.getBoundingClientRect().width;
    const actualWidth = this.$svg
      .querySelector('.grid .grid-row')
      .getAttribute('width');
    if (currentWidth < Number(actualWidth)) {
      this.$svg.setAttribute('width', actualWidth);
    }
  }

  set_scroll_position(): void {
    const { parentElement } = this.$svg;
    if (!parentElement) return;

    const hoursBeforeFirstTask = dateUtils.diff(
      this.get_oldest_starting_date(),
      this.ganttStart,
      'hour',
    );

    parentElement.scrollLeft = (hoursBeforeFirstTask
        / this.options.step)
        * this.options.columnWidth
        - this.options.columnWidth;
  }

  bind_grid_click(): void {
    $.on(
      this.$svg,
      this.options.popupTrigger,
      '.grid-row, .grid-header',
      () => {
        this.unselect_all();
        this.hide_popup();
      },
    );
  }

  bind_bar_events(): void {
    let isDragging = false;
    let xOnStart = 0;
    let isResizingLeft = false;
    let isResizingRight = false;
    let parentBarId: string | Bar = null;
    let bars: Bar[] = []; // instanceof Bar
    this.bar_being_dragged = null;

    function actionInProgress(): boolean {
      return isDragging || isResizingLeft || isResizingRight;
    }

    // @ts-ignore Weird sorcery. I don't touch it and it keeps working.
    $.on(this.$svg, 'mousedown', '.bar-wrapper, .handle', (e, element) => {
      const barWrapper = $.closest('.bar-wrapper', element);

      if (element.classList.contains('left')) {
        isResizingLeft = true;
      } else if (element.classList.contains('right')) {
        isResizingRight = true;
      } else if (element.classList.contains('bar-wrapper')) {
        isDragging = true;
      }

      barWrapper.classList.add('active');

      xOnStart = e.offsetX;

      parentBarId = barWrapper.getAttribute('data-id');
      const ids = [
        parentBarId,
        ...this.get_all_dependent_tasks(parentBarId),
      ];
      bars = ids.map((id) => this.get_bar(id));

      this.bar_being_dragged = parentBarId;

      bars.forEach((bar) => {
        const { $bar } = bar;
        $bar.ox = $bar.getX();
        $bar.oy = $bar.getY();
        $bar.owidth = $bar.getWidth();
        $bar.finaldx = 0;
      });
    });

    $.on(this.$svg, 'mousemove', (e: MouseEvent) => {
      if (!actionInProgress()) return;
      const dx = e.offsetX - xOnStart;

      bars.forEach((bar) => {
        const { $bar } = bar;
        $bar.finaldx = this.get_snap_position(dx);

        if (isResizingLeft) {
          if (parentBarId === bar.task.id) {
            bar.update_bar_position({
              x: $bar.ox + $bar.finaldx,
              width: $bar.owidth - $bar.finaldx,
            });
          } else {
            bar.update_bar_position({
              x: $bar.ox + $bar.finaldx,
            });
          }
        } else if (isResizingRight) {
          if (parentBarId === bar.task.id) {
            bar.update_bar_position({
              width: $bar.owidth + $bar.finaldx,
            });
          }
        } else if (isDragging) {
          bar.update_bar_position({ x: $bar.ox + $bar.finaldx });
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
    });

    $.on(this.$svg, 'mouseup', () => {
      this.bar_being_dragged = null;
      bars.forEach((bar) => {
        const { $bar } = bar;
        if (!$bar.finaldx) return;
        bar.date_changed();
        bar.set_action_completed();
      });
    });

    this.bind_bar_progress();
  }

  bind_bar_progress(): void {
    let xOnStart = 0;
    let isResizing: boolean = null;
    let bar: Bar = null;
    let $barProgress: SVGElement = null;
    let $bar = null;

    // @ts-ignore sorcery.
    $.on(this.$svg, 'mousedown', '.handle.progress', (e, handle) => {
      isResizing = true;
      xOnStart = e.offsetX;

      const $barWrapper = $.closest('.bar-wrapper', handle);
      const id = $barWrapper.getAttribute('data-id');
      bar = this.get_bar(id);

      $barProgress = bar.$barProgress;
      $bar = bar.$bar;

      $barProgress.finaldx = 0;
      $barProgress.owidth = $barProgress.getWidth();
      $barProgress.min_dx = -$barProgress.getWidth();
      $barProgress.max_dx = $bar.getWidth() - $barProgress.getWidth();
    });

    $.on(this.$svg, 'mousemove', (e: MouseEvent) => {
      if (!isResizing) return;
      let dx = e.offsetX - xOnStart;

      if (dx > $barProgress.max_dx) {
        dx = $barProgress.max_dx;
      }
      if (dx < $barProgress.min_dx) {
        dx = $barProgress.min_dx;
      }

      const $handle = bar.$handleProgress;
      $.attr($barProgress, 'width', $barProgress.owidth + dx);
      $.attr($handle, 'points', String(bar.get_progress_polygon_points()));
      $barProgress.finaldx = dx;
    });

    $.on(this.$svg, 'mouseup', () => {
      isResizing = false;
      if (!($barProgress && $barProgress.finaldx)) return;
      bar.progress_changed();
      bar.set_action_completed();
    });
  }

  get_all_dependent_tasks(task_id: string): string[] {
    let out: string[] = [];
    let toProcess = [task_id];
    while (toProcess.length) {
      const deps = toProcess.reduce((acc, curr) => acc.concat(this.dependencyMap[curr]), []);
      out = out.concat(deps);
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      toProcess = deps.filter((d) => !toProcess.includes(d));
    }

    return out.filter(Boolean);
  }

  get_snap_position(dx: number): number {
    const odx = dx;
    let rem;
    let position;

    if (this.view_is(VIEW_MODE.WEEK)) {
      rem = dx % (this.options.columnWidth / 7);
      position = odx
                - rem
                + (rem < this.options.columnWidth / 14
                  ? 0
                  : this.options.columnWidth / 7);
    } else if (this.view_is(VIEW_MODE.MONTH)) {
      rem = dx % (this.options.columnWidth / 30);
      position = odx
                - rem
                + (rem < this.options.columnWidth / 60
                  ? 0
                  : this.options.columnWidth / 30);
    } else {
      rem = dx % this.options.columnWidth;
      position = odx
                - rem
                + (rem < this.options.columnWidth / 2
                  ? 0
                  : this.options.columnWidth);
    }
    return position;
  }

  unselect_all(): void {
    Array.from(this.$svg.querySelectorAll('.bar-wrapper')).forEach((el) => {
      el.classList.remove('active');
    });
  }

  view_is(modes: ViewMode | ViewMode[]): boolean {
    if (typeof modes === 'string') {
      return this.options.viewMode === modes;
    }

    if (Array.isArray(modes)) {
      return modes.some((mode) => this.options.viewMode === mode);
    }

    return false;
  }

  get_task(id: string): ResolvedTask {
    return this.tasks.find((task) => task.id === id);
  }

  get_bar(id: string): Bar {
    return this.bars.find((bar) => bar.task.id === id);
  }

  show_popup(options: PopupOptions): void {
    if (!this.popup) {
      this.popup = new Popup(
        this.popupWrapper,
        this.options.customPopupHtml,
      );
    }
    this.popup.show(options);
  }

  hide_popup(): void {
    if (this.popup) this.popup.hide();
  }

  trigger_event(event: string, args: unknown): void {
    // @ts-ignore
    this.options[`on_${event}`]?.apply(null, args);
  }

  /**
     * Gets the oldest starting date from the list of tasks
     *
     * @returns Date
     * @memberof Gantt
     */
  get_oldest_starting_date(): Date {
    return this.tasks
      .map((task) => task.startResolved)
      .reduce(
        (prev_date, cur_date) => (cur_date <= prev_date ? cur_date : prev_date),
      );
  }

  /**
     * Clear all elements from the parent svg element
     *
     * @memberof Gantt
     */
  clear(): void {
    this.$svg.innerHTML = '';
  }
}

Gantt.VIEW_MODE = VIEW_MODE;
