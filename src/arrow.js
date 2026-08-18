import { createSVG } from './svg_utils';

function rounded_ortho_path(points, radius) {
    const pts = [];
    for (const p of points) {
        const last = pts[pts.length - 1];
        if (last && last.x === p.x && last.y === p.y) continue;
        pts.push(p);
    }

    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
    if (pts.length === 2) {
        return `M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y}`;
    }
    if (radius <= 0) {
        return pts
            .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
            .join(' ');
    }

    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
        const prev = pts[i - 1];
        const curr = pts[i];
        const next = pts[i + 1];
        if (!next) {
            d += ` L ${curr.x} ${curr.y}`;
            break;
        }

        const in_len = Math.hypot(curr.x - prev.x, curr.y - prev.y);
        const out_len = Math.hypot(next.x - curr.x, next.y - curr.y);
        const r = Math.min(radius, in_len / 2, out_len / 2);
        if (r < 0.5) {
            d += ` L ${curr.x} ${curr.y}`;
            continue;
        }

        const in_dx = (curr.x - prev.x) / in_len;
        const in_dy = (curr.y - prev.y) / in_len;
        const out_dx = (next.x - curr.x) / out_len;
        const out_dy = (next.y - curr.y) / out_len;
        const cross = in_dx * out_dy - in_dy * out_dx;
        if (cross === 0) {
            d += ` L ${curr.x} ${curr.y}`;
            continue;
        }

        d += ` L ${curr.x - in_dx * r} ${curr.y - in_dy * r}`;
        d += ` A ${r} ${r} 0 0 ${cross > 0 ? 1 : 0} ${curr.x + out_dx * r} ${curr.y + out_dy * r}`;
    }
    return d;
}

export default class Arrow {
    constructor(gantt, from_task, to_task) {
        this.gantt = gantt;
        this.from_task = from_task;
        this.to_task = to_task;

        this.calculate_path();
        this.draw();
    }

    /**
     * Orthogonal finish-to-start routing with rounded elbows
     * (MS Project-style): start at the right edge of the predecessor,
     * end at the left edge of the successor.
     */
    calculate_path() {
        const options = this.gantt.options;
        const from_bar = this.from_task.$bar;
        const to_bar = this.to_task.$bar;
        const padding = options.padding;
        const bar_height = options.bar_height;
        const header_height = this.gantt.config.header_height;
        const from_index = this.from_task.task._index;
        const to_index = this.to_task.task._index;

        const start_x = from_bar.getX() + from_bar.getWidth();
        const start_y =
            header_height +
            bar_height / 2 +
            (padding + bar_height) * from_index +
            padding / 2;
        const end_x = to_bar.getX();
        const end_y =
            header_height +
            bar_height / 2 +
            (padding + bar_height) * to_index +
            padding / 2;

        const radius = Math.max(
            0,
            Number.isFinite(Number(options.arrow_curve))
                ? Number(options.arrow_curve)
                : 12,
        );
        const gap = Math.max(padding / 2, radius * 2 + 4, 10);
        const arrowhead = `
            m -5 -5
            l 5 5
            l -5 5`;

        let points;
        if (end_x >= start_x) {
            const stub = start_x + gap;
            if (stub < end_x) {
                points = [
                    { x: start_x, y: start_y },
                    { x: stub, y: start_y },
                    { x: stub, y: end_y },
                    { x: end_x, y: end_y },
                ];
            } else {
                points = [
                    { x: start_x, y: start_y },
                    { x: end_x, y: end_y },
                ];
            }
        } else {
            const stub = start_x + gap;
            const left = end_x - gap;
            const going_down = from_index < to_index;
            const mid_y = going_down
                ? Math.max(start_y, end_y) + bar_height / 2 + gap
                : Math.min(start_y, end_y) - bar_height / 2 - gap;

            points = [
                { x: start_x, y: start_y },
                { x: stub, y: start_y },
                { x: stub, y: mid_y },
                { x: left, y: mid_y },
                { x: left, y: end_y },
                { x: end_x, y: end_y },
            ];
        }

        this.path = `${rounded_ortho_path(points, radius)}${arrowhead}`;
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
