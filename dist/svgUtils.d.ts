export declare function $(expr: string | Element, con?: Element): Element;
export declare namespace $ {
    var on: (element: Element, event: string, selector: string | EventListenerOrEventListenerObject, callback?: EventListenerOrEventListenerObject) => void;
    var off: (element: Element, event: string, handler: EventListenerOrEventListenerObject) => void;
    var bind: (element: Element, event: string, callback: EventListenerOrEventListenerObject) => void;
    var delegate: (element: Element, event: string, selector: string, callback: EventListenerOrEventListenerObject) => void;
    var closest: (selector: string, element: Element) => Element;
    var attr: (element: Element, attr: string | Record<string, string | number>, value?: string | number) => string;
}
export declare type CreateSVGAttrs = Record<string, string | number | Element> & {
    append_to?: Element;
};
export declare function createSVG(tag: string, attrs: CreateSVGAttrs): SVGElement;
export declare function animateSVG(svgElement: SVGElement, attr: string, from: number, to: number): void;
