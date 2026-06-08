import { createSVG } from './svg_utils';

const DEFAULT_DEPENDENCY_TYPE = 'finish-start';

const DEPENDENCY_TYPES = {
    'finish-start': {
        from: 'finish',
        to: 'start',
    },
    'finish-finish': {
        from: 'finish',
        to: 'finish',
    },
    'start-start': {
        from: 'start',
        to: 'start',
    },
    'start-finish': {
        from: 'start',
        to: 'finish',
    },
};

export default class Arrow {
    /**
     *        Supported types :
     *        - "finish-start"  : finish source   -> start dist
     *        - "finish-finish" : finish source   -> finish dist
     *        - "start-start"   : start source -> start dist
     *        - "start-finish"  : start source -> finish dist
     */
    constructor(gantt, from_task, to_task, dependencyType = DEFAULT_DEPENDENCY_TYPE) {
        this.gantt = gantt;
        this.from_task = from_task;
        this.to_task = to_task;
        this.dependencyType = this.normalize_dependency_type(dependencyType);

        this.calculate_path();
        this.draw();
    }

    normalize_dependency_type(type) {
        const normalized = `${type || DEFAULT_DEPENDENCY_TYPE}`.toLowerCase();

        if (DEPENDENCY_TYPES[normalized]) {
            return normalized;
        }

        return DEFAULT_DEPENDENCY_TYPE;
    }

    get_bar_port(task_bar, side) {
        const bar = task_bar.$bar;
        const x = side === 'start'
            ? bar.getX()
            : bar.getX() + bar.getWidth();

        const y = bar.getY() + bar.getHeight() / 2;

        return { x, y };
    }

    get_side_direction(side) {
        // if start, left side
        // if end, right side
        return side === 'start' ? -1 : 1;
    }

    remove_duplicate_points(points) {
        return points.filter((point, index) => {
            if (index === 0) return true;
            const previous = points[index - 1];
            return previous.x !== point.x || previous.y !== point.y;
        });
    }

    build_rounded_path(points, radius) {
        const cleanedPoints = this.remove_duplicate_points(points);

        if (cleanedPoints.length < 2) {
            return '';
        }

        if (!radius || radius <= 0 || cleanedPoints.length < 3) {
            const [first, ...rest] = cleanedPoints;
            return [
                `M ${first.x} ${first.y}`,
                ...rest.map((point) => `L ${point.x} ${point.y}`),
            ].join(' ');
        }

        let path = `M ${cleanedPoints[0].x} ${cleanedPoints[0].y}`;

        for (let i = 1; i < cleanedPoints.length - 1; i++) {
            const previous = cleanedPoints[i - 1];
            const current = cleanedPoints[i];
            const next = cleanedPoints[i + 1];

            const prevDx = current.x - previous.x;
            const prevDy = current.y - previous.y;
            const nextDx = next.x - current.x;
            const nextDy = next.y - current.y;

            const prevLength = Math.sqrt(prevDx * prevDx + prevDy * prevDy);
            const nextLength = Math.sqrt(nextDx * nextDx + nextDy * nextDy);

            if (prevLength === 0 || nextLength === 0) {
                continue;
            }

            const curveRadius = Math.min(radius, prevLength / 2, nextLength / 2);

            const before = {
                x: current.x - (prevDx / prevLength) * curveRadius,
                y: current.y - (prevDy / prevLength) * curveRadius,
            };

            const after = {
                x: current.x + (nextDx / nextLength) * curveRadius,
                y: current.y + (nextDy / nextLength) * curveRadius,
            };

            path += ` L ${before.x} ${before.y}`;
            path += ` Q ${current.x} ${current.y} ${after.x} ${after.y}`;
        }

        const last = cleanedPoints[cleanedPoints.length - 1];
        path += ` L ${last.x} ${last.y}`;

        return path;
    }

    build_arrow_head(end, toSide) {
        const size = 6;

        if (toSide === 'start') {
            return `
                M ${end.x - size} ${end.y - size}
                L ${end.x} ${end.y}
                L ${end.x - size} ${end.y + size}
            `;
        }

        return `
            M ${end.x + size} ${end.y - size}
            L ${end.x} ${end.y}
            L ${end.x + size} ${end.y + size}
        `;
    }

    calculate_path() {
        const dependency = DEPENDENCY_TYPES[this.dependencyType]
            || DEPENDENCY_TYPES[DEFAULT_DEPENDENCY_TYPE];

        const fromSide = dependency.from;
        const toSide = dependency.to;

        const start = this.get_bar_port(this.from_task, fromSide);
        const end = this.get_bar_port(this.to_task, toSide);

        const fromDirection = this.get_side_direction(fromSide);
        const toDirection = this.get_side_direction(toSide);

        const horizontalOffset = Math.max(
            14,
            this.gantt.options.padding || 0,
        );

        const startOffset = {
            x: start.x + fromDirection * horizontalOffset,
            y: start.y,
        };

        const endOffset = {
            x: end.x + toDirection * horizontalOffset,
            y: end.y,
        };

        const points = [
            start,

            startOffset,

            {
                x: startOffset.x,
                y: endOffset.y,
            },

            endOffset,
            end,
        ];

        const curve = Math.min(
            this.gantt.options.arrow_curve || 0,
            horizontalOffset / 2,
        );

        const linePath = this.build_rounded_path(points, curve);
        const arrowHead = this.build_arrow_head(end, toSide);

        this.path = `${linePath} ${arrowHead}`;
    }

    draw() {
        this.element = createSVG('path', {
            d: this.path,
            'data-from': this.from_task.task.id,
            'data-to': this.to_task.task.id,
            'data-type': this.dependencyType,
            class: `arrow arrow-${this.dependencyType}`,
            'stroke-width': '2',
            fill: 'none',
        });
    }

    update() {
        this.calculate_path();
        this.element.setAttribute('d', this.path);
    }
}
