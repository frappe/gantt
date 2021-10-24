import { ResolvedTask } from './index';
export interface PopupOptions {
    subtitle: string;
    task: ResolvedTask;
    title: string;
    position?: string;
    targetElement: SVGGraphicsElement;
}
export default class Popup {
    private parent;
    private readonly customHtml;
    private title;
    private subtitle;
    private pointer;
    constructor(parent: HTMLDivElement, custom_html: ((task: ResolvedTask) => string) | string);
    make(): void;
    show(options: PopupOptions): void;
    hide(): void;
}
