import assert from 'node:assert/strict';
import test from 'node:test';

import date_utils from '../src/date_utils.js';

const MONTH_VIEW_CONFIG = {
    column_width: 120,
    ignored_dates: [],
    ignored_function: null,
    step: 1,
    unit: 'month',
    view_mode: {
        step: '1m',
    },
};
const TASK_FIXTURE = [
    {
        id: 'same-end-1',
        name: 'Ends Mar 19 from Jul 31',
        start: '2025-07-31',
        end: '2026-03-19',
    },
    {
        id: 'same-end-2',
        name: 'Ends Mar 19 from Dec 23',
        start: '2024-12-23',
        end: '2026-03-19',
    },
    {
        id: 'same-end-3',
        name: 'Ends Mar 19 from Jan 31',
        start: '2025-01-31',
        end: '2026-03-19',
    },
    {
        id: 'same-end-4',
        name: 'Ends Mar 19 from Feb 28',
        start: '2025-02-28',
        end: '2026-03-19',
    },
    {
        id: 'same-end-5',
        name: 'Ends Mar 19 from Aug 31',
        start: '2025-08-31',
        end: '2026-03-19',
    },
    {
        id: 'same-end-6',
        name: 'Ends Mar 19 from Sep 30',
        start: '2025-09-30',
        end: '2026-03-19',
    },
    {
        id: 'same-end-7',
        name: 'Ends Mar 19 from Oct 31',
        start: '2025-10-31',
        end: '2026-03-19',
    },
    {
        id: 'leap-check',
        name: 'Ends Mar 19 from Feb 29',
        start: '2024-02-29',
        end: '2026-03-19',
    },
    {
        id: 'control-a',
        name: 'Control A',
        start: '2026-01-01',
        end: '2026-03-19',
    },
    {
        id: 'control-b',
        name: 'Control B',
        start: '2026-01-01',
        end: '2026-03-19',
    },
];

function loadTasks() {
    return TASK_FIXTURE.map((row, index) => {
        const task = {
            ...row,
            _index: index,
            dependencies: [],
        };

        task._start = date_utils.parse(task.start);
        task._end = date_utils.parse(task.end);

        if (
            date_utils
                .get_date_values(task._end)
                .slice(3)
                .every((value) => value === 0)
        ) {
            task._end = date_utils.add(task._end, 24, 'hour');
        }

        return task;
    });
}

function getMonthViewStart(tasks) {
    const start = tasks.reduce(
        (earliest, task) => (task._start < earliest ? task._start : earliest),
        tasks[0]._start,
    );

    return date_utils.add(date_utils.start_of(start, 'month'), -2, 'month');
}

function getMonthViewDateX(date, gantt_start) {
    const month_diff =
        (date.getFullYear() - gantt_start.getFullYear()) * 12 +
        (date.getMonth() - gantt_start.getMonth());
    const day_fraction =
        (date.getDate() -
            1 +
            date.getHours() / 24 +
            date.getMinutes() / 1440 +
            date.getSeconds() / 86400 +
            date.getMilliseconds() / 86400000) /
        date_utils.get_days_in_month(date);

    return (month_diff + day_fraction) * MONTH_VIEW_CONFIG.column_width;
}

function computeMonthViewX(task, gantt_start) {
    return getMonthViewDateX(task._start, gantt_start);
}

function computeMonthViewWidth(task, gantt_start) {
    return (
        getMonthViewDateX(task._end, gantt_start) -
        getMonthViewDateX(task._start, gantt_start)
    );
}

function getBarGeometry(task, gantt_start) {
    const x = computeMonthViewX(task, gantt_start);
    const width = computeMonthViewWidth(task, gantt_start);

    return {
        endX: x + width,
        width,
        x,
    };
}

test('Month view aligns tasks with the same end date to the same rendered edge', () => {
    const tasks = loadTasks();
    const gantt_start = getMonthViewStart(tasks);
    const geometries = tasks.map((task) => getBarGeometry(task, gantt_start));
    const expectedEndX = geometries[0].endX;

    for (const geometry of geometries) {
        assert.ok(
            Math.abs(geometry.endX - expectedEndX) < 1e-9,
            `expected ${geometry.endX} to match ${expectedEndX}`,
        );
    }
});

test('Month view keeps identical date ranges visually identical', () => {
    const tasks = loadTasks();
    const gantt_start = getMonthViewStart(tasks);
    const first = getBarGeometry(
        tasks.find((task) => task.id === 'control-a'),
        gantt_start,
    );
    const second = getBarGeometry(
        tasks.find((task) => task.id === 'control-b'),
        gantt_start,
    );

    assert.equal(first.x, second.x);
    assert.equal(first.width, second.width);
    assert.equal(first.endX, second.endX);
});

test('Month view keeps a March 19 end date within the March bucket', () => {
    const tasks = loadTasks();
    const gantt_start = getMonthViewStart(tasks);
    const endX = getBarGeometry(tasks[0], gantt_start).endX;
    const march_start = getMonthViewDateX(
        date_utils.parse('2026-03-01'),
        gantt_start,
    );
    const april_start = getMonthViewDateX(
        date_utils.parse('2026-04-01'),
        gantt_start,
    );

    assert.ok(
        endX > march_start,
        `expected ${endX} to be after ${march_start}`,
    );
    assert.ok(
        endX < april_start,
        `expected ${endX} to be before ${april_start}`,
    );
});
