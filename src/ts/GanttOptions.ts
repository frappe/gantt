import {VIEW_MODE} from "./enums/VIEW_MODES";

export default interface GanttOptions {
    arrow_curve: number;
    bar_corner_radius: number;
    bar_height: number;
    column_width: number;
    custom_popup_html: HTMLElement;
    header_height: number;
    height: number;
    language: string;
    padding: number;
    popup_trigger: Event;
    step: number;
    view_mode: VIEW_MODE;
    width: number;
}