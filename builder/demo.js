const tasks = [
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
        dependencies: 'Task 5',
        progress: random(),
    },
    {
        start: daysSince(10),
        end: daysSince(12),
        name: 'Final client review',
        id: 'Task 7',
        progress: 0,
        important: true,
    },
    {
        start: daysSince(14),
        duration: '6d',
        name: 'Implement feedback',
        id: 'Task 8',
        progress: 0,
    },
];

const tasksSmall = [
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

const tasksBlank = [
    {
        start: daysSince(1),
        duration: '3d',
        name: 'Marketing Strategy Review',
        id: 'Task 1',
        important: true,
    },
    {
        start: daysSince(-2),
        end: daysSince(12),
        name: 'Mentor Sooriya',
        id: 'Task 0',
    },
    {
        start: daysSince(4),
        end: daysSince(5),
        name: 'Investors Meetup',
        id: 'Task 3',
    },
];

const HOLIDAYS = [
    { name: 'New Years Day', date: '2025-01-01' },
    { name: 'Republic Day', date: '2025-01-26' },
    { name: 'Maha Shivratri', date: '2025-02-23' },
    { name: 'Holi', date: '2025-03-11' },
    { name: 'Mahavir Jayanthi', date: '2025-04-07' },
    { name: 'Good Friday', date: '2025-04-10' },
    { name: 'May Day', date: '2025-05-01' },
    { name: 'Buddha Purnima', date: '2025-05-08' },
    { name: 'Krishna Janmastami', date: '2025-08-14' },
    { name: 'Independence Day', date: '2025-08-15' },
    { name: 'Ganesh Chaturthi', date: '2025-08-23' },
    { name: 'Id-Ul-Fitr', date: '2025-09-21' },
    { name: 'Vijaya Dashami', date: '2025-09-28' },
    { name: 'Mahatma Gandhi Jayanti', date: '2025-10-02' },
    { name: 'Diwali', date: '2025-10-17' },
    { name: 'Guru Nanak Jayanthi', date: '2025-11-02' },
    { name: 'Christmas', date: '2025-12-25' },
];

new Gantt('#central-demo', tasks, {
    scroll_to: daysSince(-7),
    infinite_padding: false,
});

const sideheader = new Gantt('#sideheader', tasksSmall, {
    scroll_to: daysSince(-20),
    view_mode_select: true,
    infinite_padding: false,
});

const popup = new Gantt('#popup', tasksBlank, {
    scroll_to: daysSince(-7),
    infinite_padding: false,
    container_height: 350,
    popup: (ctx) => {
        ctx.set_title(ctx.task.name);
        let title = ctx.get_title();
        title.style.border = '0.5px solid black';
        title.style.borderRadius = '1.5px';
        title.style.padding = '3px 5px ';
        title.style.backgroundColor = 'black';
        title.style.opacity = '0.85';
        title.style.color = 'white';
        title.style.width = 'fit-content';
        title.onclick = () => {
            let ans = prompt('New Title: ');
            if (ans) ctx.set_title(ans);
        };
        if (ctx.task.description) ctx.set_subtitle(ctx.task.description);
        else ctx.set_subtitle('');

        ctx.set_details(
            `<em>Duration</em>: ${ctx.task.actual_duration} days<br/><em>Dates</em>: ${ctx.task._start.toLocaleDateString('en-US')} - ${ctx.task._end.toLocaleDateString('en-US')}`,
        );
        let details = ctx.get_details();
        details.style.lineHeight = '1.75';
        details.style.margin = '10px 4px';
        if (!ctx.chart.options.readonly) {
            if (!ctx.chart.options.readonly_progress) {
                ctx.add_action('Set Color', (task, chart) => {
                    const bar = chart.bars.find(
                        ({ task: t }) => t.id === task.id,
                    ).$bar;
                    bar.style.fill = `hsla(${~~(360 * Math.random())}, 70%,  72%, 0.8)`;
                });
            }
        }
    },
});

const holidays = new Gantt('#holidays', tasks, {
    holidays: {
        'var(--g-weekend-highlight-color)': [],
        '#fffddb': HOLIDAYS,
    },
    ignore: ['weekend'],
    infinite_padding: false,
    container_height: 350,
    scroll_to: daysSince(-7),
});

SWITCHES = {
    'sideheader-form': {
        'toggle-today': 'Scroll to today: ',
        'toggle-view-mode': 'Change view mode: ',
    },
    'holiday-subform': {
        'toggle-weekends': ['Mark weekends: ', false],
        'ignore-weekends': 'Exclude weekends: ',
    },
};

for (let form of ['sideheader-form', 'holiday-form']) {
    let formNode = document.getElementById(form);
    let parent = formNode.parentElement;
    parent.appendChild(formNode);
}

for (let form in SWITCHES) {
    for (let id in SWITCHES[form]) {
        createSwitch(form, id, SWITCHES[form][id]);
    }
}

const UPDATES = [
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
                    '#fffddb': opts.holidays['#fffddb'],
                    'var(--g-weekend-highlight-color)': val ? 'weekend' : [],
                },
                ignore: [],
            }),
            'declare-holiday': (val, opts) => ({
                holidays: {
                    '#fffddb': [...HOLIDAYS, { date: val, name: 'Kay' }],
                    'var(--g-weekend-highlight-color)':
                        opts.holidays['var(--g-weekend-highlight-color)'],
                },
            }),
            'ignore-weekends': (val, opts) => ({
                ignore: [
                    opts.ignore.filter((k) => k !== 'weekend')[0],
                    ...(val ? ['weekend'] : []),
                ],
                holidays: { '#fffddb': opts.holidays['#fffddb'] },
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
];

for (let [chart, details, after] of UPDATES) {
    for (let id in details) {
        let el = document.getElementById(id);

        el.onchange = (e) => {
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
