
<div align="center">
    <img src="https://github.com/horsa-way/scheduler/assets/11760847/a961ea22-d3c6-49e3-8c5f-357d64dacc2d" height="128">
    <h2>Horsa Scheduler</h2>
    <p align="center">
        <p>A lightweight and interactive svg scheduler library for web applications</p>
        <a>
            <b>View the demo »</b>
        </a>
    </p>
</div>

<p align="center">
    <img src="https://github.com/horsa-way/scheduler/assets/11760847/8c8ac467-6549-4112-950f-95500d377d43">
</p>

### Install
```
npm install horsa-scheduler
```

### Usage
TO EDIT
Include it in your HTML:
```
<script src="horsa-scheduler.min.js"></script>
<link rel="stylesheet" href="horsa-scheduler.css">
```

And start hacking:
```js
var tasks = [
  {
    id: 'Task 1',
    name: 'Redesign website',
    start: '2016-12-28',
    end: '2016-12-31',
    progress: 20,
    dependencies: 'Task 2, Task 3',
    custom_class: 'bar-milestone' // optional
  },
  ...
]
var gantt = new Gantt("#gantt", tasks);
```

You can also pass various options to the Gantt constructor:
```js
var gantt = new Gantt("#gantt", tasks, {
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
    custom_popup_html: null
});
```

### Contributing
If you want to contribute enhancements or fixes:

1. Clone this repo.
2. `cd` into project directory
3. Install Yarn by typing `npm install --global yarn` in your terminal
4. `yarn`
5. `yarn run dev`
6. Open `index.html` in your browser, make your code changes and test them.

### Publishing
Every times a new version will be pushed, Github Actions will publish it in npm repository.

License: MIT

------------------
Project maintained by [horsa way](https://github.com/horsa-way)
