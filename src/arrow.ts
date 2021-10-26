import { createSVG } from './svgUtils';
import Gantt from './index';
import Bar from './bar';

export default class Arrow {
  private gantt: Gantt;

  fromTask: Bar;

  toTask: Bar;

  private path: string;

  element: SVGElement;

  constructor(gantt: Gantt, from_task: Bar, to_task: Bar) {
    this.gantt = gantt;
    this.fromTask = from_task;
    this.toTask = to_task;

    this.calculatePath();
    this.draw();
  }

  calculatePath(): void {
    let startX = this.fromTask.$bar.getX() + this.fromTask.$bar.getWidth() / 2;

    const condition = (): boolean => this.toTask.$bar.getX() < startX + this.gantt.options.padding
            && startX > this.fromTask.$bar.getX() + this.gantt.options.padding;

    while (condition()) {
      startX -= 10;
    }

    const startY = this.gantt.options.headerHeight
            + this.gantt.options.barHeight
            + (this.gantt.options.padding + this.gantt.options.barHeight)
                * this.fromTask.task.indexResolved
            + this.gantt.options.padding;

    const endX = this.toTask.$bar.getX() - this.gantt.options.padding / 2;
    const endY = this.gantt.options.headerHeight
            + this.gantt.options.barHeight / 2
            + (this.gantt.options.padding + this.gantt.options.barHeight)
                * this.toTask.task.indexResolved
            + this.gantt.options.padding;

    const fromIsBelowTo = this.fromTask.task.indexResolved > this.toTask.task.indexResolved;
    const curve = this.gantt.options.arrowCurve;
    const clockwise = fromIsBelowTo ? 1 : 0;
    const curveY = fromIsBelowTo ? -curve : curve;
    const offset = fromIsBelowTo
      ? endY + this.gantt.options.arrowCurve
      : endY - this.gantt.options.arrowCurve;

    this.path = `
            M ${startX} ${startY}
            V ${offset}
            a ${curve} ${curve} 0 0 ${clockwise} ${curve} ${curveY}
            L ${endX} ${endY}
            m -5 -5
            l 5 5
            l -5 5`;

    if (
      this.toTask.$bar.getX()
            < this.fromTask.$bar.getX() + this.gantt.options.padding
    ) {
      const down1 = this.gantt.options.padding / 2 - curve;
      const down2 = this.toTask.$bar.getY()
                + this.toTask.$bar.getHeight() / 2
                - curveY;
      const left = this.toTask.$bar.getX() - this.gantt.options.padding;

      this.path = `
                M ${startX} ${startY}
                v ${down1}
                a ${curve} ${curve} 0 0 1 -${curve} ${curve}
                H ${left}
                a ${curve} ${curve} 0 0 ${clockwise} -${curve} ${curveY}
                V ${down2}
                a ${curve} ${curve} 0 0 ${clockwise} ${curve} ${curveY}
                L ${endX} ${endY}
                m -5 -5
                l 5 5
                l -5 5`;
    }
  }

  draw(): void {
    this.element = createSVG('path', {
      d: this.path,
      'data-from': this.fromTask.task.id,
      'data-to': this.toTask.task.id,
    });
  }

  update(): void {
    this.calculatePath();
    this.element.setAttribute('d', this.path);
  }
}
