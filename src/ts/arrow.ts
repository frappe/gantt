import {createSVG, getHeight, getWidth, getX, getY} from './svg_utils';
import Gantt from "./index";
import Bar from "./Bar";

export default class Arrow {
    public gantt : Gantt;
    public from_bar : any;
    public to_bar : Bar;
    private path: string;
    element: any;

    constructor(gantt : Gantt, from_bar: Bar, to_bar: Bar) {
        this.gantt = gantt;
        this.from_bar = from_bar;
        this.to_bar = to_bar;

        this.calculate_path();
        this.draw();
    }

    calculate_path() {
        let start_x =
            getX(this.from_bar.bar) + getWidth(this.from_bar.bar) / 2;

        const condition = () =>
            getX(this.to_bar.bar) < start_x + this.gantt.options.padding &&
            start_x > getX(this.from_bar.bar) + this.gantt.options.padding;

        while (condition()) {
            start_x -= 10;
        }

        const start_y =
            this.gantt.options.header_height +
            this.gantt.options.bar_height +
            (this.gantt.options.padding + this.gantt.options.bar_height) *
                this.from_bar.task._index +
            this.gantt.options.padding;

        const end_x = getX(this.to_bar.bar) - this.gantt.options.padding / 2;
        const end_y =
            this.gantt.options.header_height +
            this.gantt.options.bar_height / 2 +
            (this.gantt.options.padding + this.gantt.options.bar_height) *
                this.to_bar.task._index +
            this.gantt.options.padding;

        const from_is_below_to =
            this.from_bar.task._index > this.to_bar.task._index;
        const curve = this.gantt.options.arrow_curve;
        const clockwise = from_is_below_to ? 1 : 0;
        const curve_y = from_is_below_to ? -curve : curve;
        const offset = from_is_below_to
            ? end_y + this.gantt.options.arrow_curve
            : end_y - this.gantt.options.arrow_curve;

        this.path = `
            M ${start_x} ${start_y}
            V ${offset}
            a ${curve} ${curve} 0 0 ${clockwise} ${curve} ${curve_y}
            L ${end_x} ${end_y}
            m -5 -5
            l 5 5
            l -5 5`;

        if (
            getX(this.to_bar.bar) <
            getX(this.from_bar.bar) + this.gantt.options.padding
        ) {
            const down_1 = this.gantt.options.padding / 2 - curve;
            const down_2 =
                getY(this.to_bar.bar) +
                getHeight(this.to_bar.bar) / 2 -
                curve_y;
            const left = getX(this.to_bar.bar) - this.gantt.options.padding;

            this.path = `
                M ${start_x} ${start_y}
                v ${down_1}
                a ${curve} ${curve} 0 0 1 -${curve} ${curve}
                H ${left}
                a ${curve} ${curve} 0 0 ${clockwise} -${curve} ${curve_y}
                V ${down_2}
                a ${curve} ${curve} 0 0 ${clockwise} ${curve} ${curve_y}
                L ${end_x} ${end_y}
                m -5 -5
                l 5 5
                l -5 5`;
        }
    }

    draw() {
        this.element = createSVG('path', {
            d: this.path,
            'data-from': this.from_bar.task.id,
            'data-to': this.to_bar.task.id,
        });
    }

    update() {
        this.calculate_path();
        this.element.setAttribute('d', this.path);
    }
}
