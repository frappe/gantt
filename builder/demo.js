let today = new Date();
today.setHours(0, 0, 0, 0);
today = today.valueOf();

function random(begin = 10, end = 90, multiple = 10) {
    let k;
    do {
        k = Math.floor(Math.random() * 100);
    } while (k < begin || k > end || k % multiple !== 0);
    return k;
}
const daysSince = (dx) => new Date(today + dx * 86400000);
const tasks = [
    {
        start: daysSince(-2),
        end: daysSince(2),
        name: 'Redesign website',
        id: 'Task 0',
        progress: random(),
    },
    {
        start: daysSince(3),
        duration: '6d',
        name: 'Write new content',
        id: 'Task 1',
        progress: random(),
        important: true,
        dependencies: 'Task 0',
    },
    {
        start: daysSince(4),
        duration: '2d',
        name: 'Apply new styles',
        id: 'Task 2',
        progress: random(),
    },
    {
        start: daysSince(-4),
        end: daysSince(0),
        name: 'Review',
        id: 'Task 3',
        progress: random(),
    },
];

const tasksSpread = [
    {
        start: daysSince(-30),
        end: daysSince(-10),
        name: 'Redesign website',
        id: 'Task 0',
        progress: random(),
    },
    {
        start: daysSince(-15),
        duration: '21d',
        name: 'Write new content',
        id: 'Task 1',
        progress: random(),
        important: true,
    },
    {
        start: daysSince(10),
        duration: '14d',
        name: 'Review',
        id: 'Task 3',
        progress: random(),
    },
    {
        start: daysSince(-3),
        duration: '4d',
        name: 'Publish',
        id: 'Task 4',
        progress: random(),
    },
];

let tasksMany = [
    {
        start: daysSince(-7),
        end: daysSince(-5),
        name: 'Initial brainstorming',
        id: 'Task 0',
        progress: random(),
    },
    {
        start: daysSince(-3),
        end: daysSince(1),
        name: 'Develop wireframe',
        id: 'Task 1',
        progress: random(),
        dependencies: 'Task 0',
    },
    {
        start: daysSince(-1),
        duration: '4d',
        name: 'Client meeting',
        id: 'Task 2',
        progress: random(),
        important: true,
    },
    {
        start: daysSince(1),
        duration: '7d',
        name: 'Create prototype',
        id: 'Task 3',
        dependencies: 'Task 2',
        progress: random(),
    },
    {
        start: daysSince(3),
        duration: '5d',
        name: 'Test design with users',
        dependencies: 'Task 2',
        id: 'Task 4',
        progress: random(),
        important: true,
    },
    {
        start: daysSince(5),
        end: daysSince(10),
        name: 'Write technical documentation',
        id: 'Task 5',
        progress: random(),
    },
    {
        start: daysSince(8),
        duration: '3d',
        name: 'Prepare demo',
        id: 'Task 6',
        progress: random(),
    },
    {
        start: daysSince(10),
        end: daysSince(12),
        name: 'Final client review',
        id: 'Task 7',
        progress: random(),
        important: true,
    },
    {
        start: daysSince(14),
        duration: '6d',
        name: 'Implement feedback',
        id: 'Task 8',
        progress: random(),
    },
    {
        start: daysSince(16),
        duration: '4d',
        name: 'Launch website',
        id: 'Task 9',
        progress: random(),
        important: true,
    },
];

const HOLIDAYS = [
    { name: 'Republic Day', date: '2024-01-26' },
    { name: 'Maha Shivratri', date: '2024-02-23' },
    { name: 'Holi', date: '2024-03-11' },
    { name: 'Mahavir Jayanthi', date: '2024-04-07' },
    { name: 'Good Friday', date: '2024-04-10' },
    { name: 'May Day', date: '2024-05-01' },
    { name: 'Buddha Purnima', date: '2024-05-08' },
    { name: 'Krishna Janmastami', date: '2024-08-14' },
    { name: 'Independence Day', date: '2024-08-15' },
    { name: 'Ganesh Chaturthi', date: '2024-08-23' },
    { name: 'Id-Ul-Fitr', date: '2024-09-21' },
    { name: 'Vijaya Dashami', date: '2024-09-28' },
    { name: 'Mahatma Gandhi Jayanti', date: '2024-10-02' },
    { name: 'Diwali', date: '2024-10-17' },
    { name: 'Guru Nanak Jayanthi', date: '2024-11-02' },
    { name: 'Christmas', date: '2024-12-25' },
];

const mutablity = new Gantt('#mutability', tasks, {
    holidays: null,
    scroll_to: daysSince(-7),
    infinite_padding: false,
});

const sideheader = new Gantt('#sideheader', tasks, {
    holidays: null,
    view_mode_select: true,
    scroll_to: null,
    infinite_padding: false,
});

const holidays = new Gantt('#holidays', tasksSpread, {
    holidays: {
        '#dcdce4': [],
        '#a3e635': HOLIDAYS,
    },
    ignore: ['weekend'],
    infinite_padding: false,
    scroll_to: daysSince(-7),
});

const styling = new Gantt('#styling', tasksMany, {
    holidays: null,
    arrow_curve: 6,
    column_width: 32,
    infinite_padding: true,
});

// Creates forms
SWITCHES = {
    'mutability-form': {
        'readonly-progress': 'Progress',
        'readonly-dates': 'Dates',
        'readonly-general': 'Editable',
    },
    'sideheader-form': {
        'toggle-today': 'Scroll to Today',
        'toggle-view-mode': 'Change View Mode',
    },
    'holidays-form': {
        'toggle-weekends': ['Mark weekends', false],
        'ignore-weekends': 'Exclude weekends',
    },
};

for (let form in SWITCHES) {
    for (let id in SWITCHES[form]) {
        createSwitch(form, id, SWITCHES[form][id]);
    }
}

// Manipulation

const UPDATES = [
    [
        mutablity,
        {
            'readonly-general': 'opp__readonly',
            'readonly-dates': 'opp__readonly_dates',
            'readonly-progress': 'opp__readonly_progress',
        },
        (id, val) => {
            if (id === 'readonly-general') {
                document.getElementById('readonly-dates').checked = !val;
                document.getElementById('readonly-progress').checked = !val;
            }
        },
    ],
    [
        sideheader,
        {
            'toggle-today': 'today_button',
            'toggle-view-mode': 'view_mode_select',
        },
    ],
    [
        holidays,
        {
            'toggle-weekends': (val, opts) => ({
                holidays: {
                    '#a3e635': opts.holidays['#a3e635'],
                    '#dcdce4': val ? 'weekend' : [],
                },
                ignore: [],
            }),
            'declare-holiday': (val, opts) => ({
                holidays: {
                    '#a3e635': [...HOLIDAYS, { date: val, name: 'Kay' }],
                    '#dcdce4': opts.holidays['#dcdce4'],
                },
            }),
            'ignore-weekends': (val, opts) => ({
                ignore: [
                    opts.ignore.filter((k) => k !== 'weekend')[0],
                    ...(val ? ['weekend'] : []),
                ],
                holidays: { '#a3e635': opts.holidays['#a3e635'] },
            }),
            'declare-ignore': (val, opts) => ({
                ignore: [
                    ...(opts.ignore.includes('weekend') ? ['weekend'] : []),
                    val,
                ],
            }),
        },
        (id, val) => {
            let el = document.getElementById(id);
            if (id === 'toggle-weekends' && val) {
                document.getElementById('ignore-weekends').checked = false;
            }
            if (id === 'ignore-weekends' && val) {
                document.getElementById('toggle-weekends').checked = false;
            }
        },
    ],
    [
        styling,
        {
            'arrow-curve': 'arrow_curve',
            'column-width': 'column_width',
        },
    ],
];

const BUTTONS = {
    'radius-s': { bar_corner_radius: 3 },
    'radius-m': { bar_corner_radius: 7 },
    'radius-l': { bar_corner_radius: 14 },
    'height-s': { bar_height: 20 },
    'height-m': { bar_height: 30 },
    'height-l': { bar_height: 45 },
    'curve-s': { arrow_curve: 2 },
    'curve-m': { bar_height: 5 },
    'curve-l': { bar_height: 10 },
    'width-s': { column_width: 25 },
    'width-m': { column_width: 32 },
    'width-l': { column_width: 50 },
    'padding-s': { padding: 18 },
    'padding-m': { padding: 30 },
    'padding-l': { padding: 45 },
};

for (let id in BUTTONS) {
    let el = document.getElementById(id);
    el.onclick = (e) => {
        e.preventDefault();
        styling.update_options(BUTTONS[id]);
        for (let k of document.querySelectorAll('.selected')) {
            if (k.id.startsWith(el.id.split('-')[0])) {
                k.classList.remove('selected');
            }
        }
        e.currentTarget.classList.add('selected');
    };
}

for (let [chart, details, after] of UPDATES) {
    for (let id in details) {
        let el = document.getElementById(id);

        el.onchange = (e) => {
            console.log('changed', e.currentTarget.id, e.currentTarget.value);
            let label = details[id];
            let val;
            if (e.currentTarget.type === 'checkbox') {
                if (typeof label === 'string') {
                    let opposite = label.slice(0, 5) === 'opp__';
                    if (opposite) label = label.slice(5);
                    val = opposite
                        ? !e.currentTarget.checked
                        : e.currentTarget.checked;
                } else if (typeof label === 'object') {
                    val = label[e.currentTarget.checked ? 1 : 2];
                    label = label[0];
                } else {
                    val =
                        e.currentTarget.type === 'checkbox'
                            ? e.currentTarget.checked
                            : e.currentTarget.value;
                }
            } else {
                val =
                    e.currentTarget.type === 'date'
                        ? e.currentTarget.value
                        : +e.currentTarget.value;
            }

            if (typeof label === 'function') {
                console.log('ha', label(val, chart.options));
                chart.update_options(label(val, chart.options));
            } else {
                chart.update_options({
                    [label]: val,
                });
            }
            after && after(id, val, chart);
        };
    }
}
