import {VIEW_MODE} from "./enums/VIEW_MODES";

export default interface GanttOptions {
    bar_corner_radius: number;
    arrow_curve: number;
    custom_popup_html: HTMLElement;
    popup_trigger: Event;
    language: string;
    bar_height: number;
    padding: number;
    header_height: number;
    column_width: number;
    step: number;
    view_mode: VIEW_MODE;

}