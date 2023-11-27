
<div align="center">
    <img src="https://github.com/horsa-way/scheduler/assets/11760847/a961ea22-d3c6-49e3-8c5f-357d64dacc2d" height="128">
    <h2>Horsa Scheduler</h2>
    <p align="center">
        <p>A lightweight and interactive svg scheduler library for web applications</p>
        <!-- <a>
            <b>View the demo »</b>
        </a> -->
    </p>
</div>

<p align="center">
    <img src="https://github.com/horsa-way/scheduler/assets/11760847/8c8ac467-6549-4112-950f-95500d377d43">
</p>

### Install
Download from [GitHub releases](https://github.com/horsa-way/scheduler/releases/latest)

and include it in your HTML:
```
<script src="horsa-scheduler.min.js"></script>
<link rel="stylesheet" href="horsa-scheduler.min.css">
```

### Usage
Look the [HTML index](https://github.com/horsa-way/scheduler/blob/master/index.html) file for a complete example.

```js
var tasks = [
  {
    id: 'Task 1',
    name: 'Redesign website',
    start: '2016-12-28',
    end: '2016-12-31',
    progress: 20,
    dependencies: 'Task 2, Task 3',
    row: 'row_id_1', // row where put the task
    custom_class: 'bar-milestone' // optional
  },
  ...
]
var scheduler = new Scheduler("#scheduler", tasks);
```

You can also pass various options to the Scheduler constructor:
```js
var cells = [
    {
        row: 'row_id_1',
        column: 'name',
        value: 'name cell 1'
    },
    {
        row: 'row_id_1',
        column: 'description',
        value: 'description cell 1'
    },
]
var scheduler = new Scheduler("#scheduler", tasks, {
    header_height: 50,
    column_width: 30,
    step: 24,
    view_modes: ['Quarter Day', 'Half Day', 'Day', 'Week', 'Month'],
    bar_height: 20,
    bar_corner_radius: 3,
    arrow_curve: 5,
    padding: 18,
    view_mode: 'Day',
    date_format: 'YYYY-MM-DD',
    language: 'en', // or 'es', 'it', 'ru', 'ptBr', 'fr', 'tr', 'zh', 'de', 'hu'
    custom_popup_html: null,
    resize_left: true,
    resize_right: true,
    drag_drop_x: true,
    drag_drop_y: true,
    popup_position: ['left', 'bottom']
    date_start: 'YYYY-MM-DD',
    date_end: 'YYYY-MM-DD',
    rows: ['row_id_1', 'row_id_2', 'row_id_3'],
    fixed_columns: ['name', 'description'],
    on_task_dblclick: task => {
        console.log(task);
    },
    on_grid_dblclick: row_id => {
        console.log(row_id);
    },
    on_cell_dblclick: (row_id, col_id) => {
        console.log(row_id, col_id);
    },
    on_position_change: (task, row, start, end) => {
        console.log(task, row, start, end);
    },
    on_progress_change: (task, progress) => {
        console.log(task, progress);
    },
    on_view_change: (mode) => {
        console.log(mode);
    },
});
```

### Contributing
If you want to contribute enhancements or fixes:

1. Clone this repo.
2. `cd` into project directory
3. Install Yarn by typing `npm install --global yarn` in your terminal
4. `yarn`
5. `yarn start`
6. Open `index.html` in your browser, make your code changes and test them.

### Publishing
Every times a new version is pushed, Github Actions will create a release on github releases.

License: MIT

------------------
Project maintained by [horsa way](https://github.com/horsa-way)
