import { createSVG } from './svg_utils';

export default class Arrow {
    constructor(scheduler, from_task, to_task) {
        this.scheduler = scheduler;
        this.from_task = from_task;
        this.to_task = to_task;

        this.calculate_path();
        this.draw();
    }

    calculate_path() {
        let start_x =
            this.from_task.$bar.getX() + this.from_task.$bar.getWidth() / 2;

        const condition = () =>
            this.to_task.$bar.getX() < start_x + this.scheduler.options.padding &&
            start_x > this.from_task.$bar.getX() + this.scheduler.options.padding;

        while (condition()) {
            start_x -= 10;
        }

        const start_y =
            this.from_task.$bar.getY() + this.scheduler.options.bar_height;

        const end_x = this.to_task.$bar.getX() - this.scheduler.options.padding / 2;
        const end_y =
            this.to_task.$bar.getY() + this.scheduler.options.bar_height / 2;
        // ======= TODO Da capire come gestirlo
        //             this.scheduler.options.header_height +
        //             this.scheduler.options.bar_height +
        //             (this.scheduler.options.padding + this.scheduler.options.bar_height) *
        //             this.from_task.task._index +
        //             this.scheduler.options.padding;

        //         const end_x = this.to_task.$bar.getX() - this.scheduler.options.padding / 2;
        //         const end_y =
        //             this.scheduler.options.header_height +
        //             this.scheduler.options.bar_height / 2 +
        //             (this.scheduler.options.padding + this.scheduler.options.bar_height) *
        //             this.to_task.task._index +
        //             this.scheduler.options.padding;
        // >>>>>>> 5ec8c1cf7d6f126a89a5e5db096915fb66cda0a4

        const from_is_below_to =
            this.from_task.$bar.getY() > this.to_task.$bar.getY();
        const curve = this.scheduler.options.arrow_curve;
        const clockwise = from_is_below_to ? 1 : 0;
        const curve_y = from_is_below_to ? -curve : curve;
        const offset = from_is_below_to
            ? end_y + this.scheduler.options.arrow_curve
            : end_y - this.scheduler.options.arrow_curve;

        this.path = `
            M ${start_x} ${start_y}
            V ${offset}
            a ${curve} ${curve} 0 0 ${clockwise} ${curve} ${curve_y}
            L ${end_x} ${end_y}
            m -5 -5
            l 5 5
            l -5 5`;

        if (
            this.to_task.$bar.getX() <
            this.from_task.$bar.getX() + this.scheduler.options.padding
        ) {
            const down_1 = this.scheduler.options.padding / 2 - curve;
            const down_2 =
                this.to_task.$bar.getY() +
                this.to_task.$bar.getHeight() / 2 -
                curve_y;
            const left = this.to_task.$bar.getX() - this.scheduler.options.padding;

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
            'data-from': this.from_task.task.id,
            'data-to': this.to_task.task.id,
        });
    }

    update() {
        this.calculate_path();
        this.element.setAttribute('d', this.path);
    }
}
