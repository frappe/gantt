import Gantt from '../src/index';

test('setup_tasks', () => {
    document.body.innerHTML = '<svg id="gantt"></svg>';

    const tasks = [
        {
            id: '1',
            name: 'Inputs are date-only form strings.',
            start: '2023-04-01',
            _start: new Date('2023-04-01 00:00'),
            end: '2023-04-02',
            _end: new Date('2023-04-03 00:00'),
            progress: 100,
        },
        {
            id: '2',
            name: 'Inputs are date-time form strings.',
            start: '2023-04-01 00:00',
            _start: new Date('2023-04-01 00:00'),
            end: '2023-04-02 00:00',
            _end: new Date('2023-04-02 00:00'),
            progress: 100,
        },
        {
            id: '3',
            name: 'Inputs are instances of Date generated from date-only form string.',
            start: new Date('2023-04-01'),
            _start: new Date('2023-04-01'),
            end: new Date('2023-04-02'),
            _end: new Date('2023-04-02'),
            progress: 100,
        },
        {
            id: '4',
            name: 'Inputs are instances of Date generated from date-time form string.',
            start: new Date('2023-04-01 00:00'),
            _start: new Date('2023-04-01 00:00'),
            end: new Date('2023-04-02 00:00'),
            _end: new Date('2023-04-02 00:00'),
            progress: 100,
        },
    ];

    const copiedTasks = tasks.map((task) => ({ ...task }));
    const tasks_processed = Gantt.setup_tasks(copiedTasks);

    expect(tasks_processed).toMatchObject(tasks);
});
