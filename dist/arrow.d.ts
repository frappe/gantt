import Gantt from './index';
import Bar from './bar';
export default class Arrow {
    private gantt;
    fromTask: Bar;
    toTask: Bar;
    private path;
    element: SVGElement;
    constructor(gantt: Gantt, from_task: Bar, to_task: Bar);
    calculatePath(): void;
    draw(): void;
    update(): void;
}
