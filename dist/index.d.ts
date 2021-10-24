import { Language } from './dateUtils';
import Bar from './bar';
import { PopupOptions } from './popup';
import './gantt.scss';
interface Task {
    id: string;
    name: string;
    start: string | Date;
    end: string | Date;
    progress: number;
    dependencies?: string | string[];
    customClass?: string;
}
export interface ResolvedTask extends Task {
    invalid?: boolean;
    indexResolved: number;
    endResolved: Date;
    dependencies: string[];
    startResolved: Date;
}
export declare type ViewMode = 'Quarter Day' | 'Half Day' | 'Day' | 'Week' | 'Month' | 'Year';
export interface Options {
    headerHeight?: number;
    columnWidth?: number;
    step?: number;
    viewModes?: ViewMode[];
    barHeight?: number;
    barCornerRadius?: number;
    arrowCurve?: number;
    padding?: number;
    viewMode?: ViewMode;
    dateFormat?: string;
    customPopupHtml?: string | null;
    popupTrigger: string;
    language: Language;
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
    private $svg;
    private $container;
    private popupWrapper;
    options: Options;
    private tasks;
    private dependencyMap;
    ganttStart: null | Date;
    private ganttEnd;
    private dates;
    bar_being_dragged?: string;
    private layers;
    private bars;
    private arrows;
    private popup;
    static VIEW_MODE: {
        QUARTER_DAY: 'Quarter Day';
        HALF_DAY: 'Half Day';
        DAY: 'Day';
        WEEK: 'Week';
        MONTH: 'Month';
        YEAR: 'Year';
    };
    constructor(wrapper: string | HTMLElement | SVGElement | unknown, tasks: Task[], options: Options);
    setup_wrapper(elementReference: string | HTMLElement | SVGElement | unknown): void;
    setup_options(options: Options): void;
    setup_tasks(tasks: Task[]): void;
    setupDependencies(): void;
    refresh(tasks: Task[]): void;
    change_view_mode(mode?: ViewMode): void;
    update_view_scale(view_mode: ViewMode): void;
    setup_dates(): void;
    setup_gantt_dates(): void;
    setup_date_values(): void;
    bind_events(): void;
    render(): void;
    setup_layers(): void;
    make_grid(): void;
    make_grid_background(): void;
    make_grid_rows(): void;
    make_grid_header(): void;
    make_grid_ticks(): void;
    make_grid_highlights(): void;
    make_dates(): void;
    get_dates_to_draw(): DateInfo[];
    get_date_info(date: Date, lastDate: Date, i: number): DateInfo;
    make_bars(): void;
    make_arrows(): void;
    map_arrows_on_bars(): void;
    set_width(): void;
    set_scroll_position(): void;
    bind_grid_click(): void;
    bind_bar_events(): void;
    bind_bar_progress(): void;
    get_all_dependent_tasks(task_id: string): string[];
    get_snap_position(dx: number): number;
    unselect_all(): void;
    view_is(modes: ViewMode | ViewMode[]): boolean;
    get_task(id: string): ResolvedTask;
    get_bar(id: string): Bar;
    show_popup(options: PopupOptions): void;
    hide_popup(): void;
    trigger_event(event: string, args: unknown): void;
    /**
       * Gets the oldest starting date from the list of tasks
       *
       * @returns Date
       * @memberof Gantt
       */
    get_oldest_starting_date(): Date;
    /**
       * Clear all elements from the parent svg element
       *
       * @memberof Gantt
       */
    clear(): void;
}
export {};
